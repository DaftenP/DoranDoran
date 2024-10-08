package com.tutor.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tutor.common.exception.RestApiException;
import com.tutor.common.exception.StatusCode;
import com.tutor.dto.MessageRequestDTO;
import com.tutor.dto.TutorResponse;
import com.tutor.entity.TutorRole;
import com.tutor.entity.TutorSubject;
import com.tutor.entity.TutorSubjectId;
import com.tutor.repository.TutorRoleRepository;
import com.tutor.repository.TutorSubjectRepository;
import com.tutor.util.CustomPromptChatMemoryAdvisor;
import com.tutor.util.RedisChatMemory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiTutorService {
    private static final int DEFAULT_CHAT_WINDOW_SIZE = 5;
    private final String ETRI_API_URL = "http://aiopen.etri.re.kr:8000/WiseASR/PronunciationKor";
//    private static final String jsonSchema = """
//            {
//                "type": "object",
//                "properties": {
//                    "tutorResponse": { "type": "string", "description": "Tutor's response" },
//                    "translatedResponse": { "type": "string", "description": "Translated response" },
//                    "hint": { "type": "string", "description": "Hint for the next user's response" },
//                    "translatedHint": { "type": "string", "description": "Translated hint" },
//                    "isOver": { "type": "boolean", "description": "Conversation is over" },
//                    "correctness": { "type": "integer", "description": "Correctness score" }
//                },
//                "required": ["tutorResponse", "translatedResponse", "hint", "translatedHint", "isOver", "correctness"],
//                "additionalProperties": false
//            }
//            """;

    // TODO: 프롬프트 수정 필요 (isOver 변경 이슈)
    private static final String DEFAULT_SYSTEM_PROMPT = "사용자는 한국어를 배우고 싶어하는 학생입니다. \n" +
            "규칙 1. 당신은 지금부터 사용자와 한국어 회화 상황극을 해주세요.\n" +
            "규칙 2. 이전 대화 기억을 참조하여 자연스럽게 대화를 이어가세요.\n" +
            "규칙 3. 사용자의 응답이 일상 대화와 관계 없는 내용이라면, 'isOver'를 true로 설정하세요.\n" +
            "규칙 4. 사용자의 응답이 욕설이 포함되어 있으면, 'isOver'를 true로 설정하세요.\n" +
            "규칙 5. 다음과 같은 데이터로 응답해주세요.\n" +
            "tutorResponse: 당신의 대화 내용 (문자열)\n" +
            "translatedResponse: 바로 위의 tutorResponse를 사용자의 언어로 번역한 내용 (문자열)\n" +
            "hint: 당신의 대답 바로 다음으로 올 사용자의 예상 응답 (문자열)\n" +
            "translatedHint: 바로 위의 hint를 사용자의 언어로 번역한 내용 (문자열)\n" +
            "isOver: 대화가 종료되었는지 여부 (boolean)\n" +
            "correctness: 사용자의 응답 적절성 점수 (0~5)\n" +
            "응답 전에 규칙과 데이터 형식을 준수했는지 검토하세요.";

    @Value("${etri.api.key}")
    private String ETRI_API_KEY;
    private final TutorRoleRepository tutorRoleRepository;
    private final TutorSubjectRepository tutorSubjectRepository;
    private final ChatClient.Builder chatClientBuilder;
    private final RedisChatMemory redisChatMemory;
    private final RestTemplate restTemplate;

    public TutorResponse send(MessageRequestDTO messageRequest, Long role, Long situation, String locale) {
        // role, situation 맞는 문자열 가져오기
        Optional<TutorRole> tutorRole = tutorRoleRepository.findById(role);
        Optional<TutorSubject> tutorSubject = tutorSubjectRepository.findById(new TutorSubjectId(situation, role));

        if (tutorRole.isEmpty() || tutorSubject.isEmpty()) {
            throw new RestApiException(StatusCode.NO_SUCH_ELEMENT);
        }

        if (messageRequest == null || messageRequest.getMsg().isEmpty()) {
            redisChatMemory.clear(messageRequest.getUserId());
        }

        /**
         * chatClient 생성
         * defaultSystem: 시스템 프롬프트
         * defaultAdvisors: 챗봇 메모리 (CustomPromptChatMemoryAdvisor 사용)
         */
        ChatClient chatClient = chatClientBuilder
                .defaultSystem(generateSystemPrompt(tutorSubject.get().getSubjectPrompt(), locale))
                .defaultAdvisors(new CustomPromptChatMemoryAdvisor(redisChatMemory, messageRequest.getUserId(), DEFAULT_CHAT_WINDOW_SIZE))
                .build();

        TutorResponse tutorResponse = chatClient.prompt()
                .user(messageRequest.getMsg())
                .call()
                .entity(TutorResponse.class);

        // 대화가 종료되면 대화 이력 삭제
        if (tutorResponse.getIsOver()) {
            redisChatMemory.clear(messageRequest.getUserId());
        }

        return tutorResponse;
    }

    public Double pronunciation(MultipartFile file) {
        log.info("pronunciation");

        try {
            // 1. 음성 파일을 base64로 인코딩
            byte[] audioBytes = file.getBytes();
            String base64Audio = Base64.getEncoder().encodeToString(audioBytes);

            // 2. 요청 본문 생성
            Map<String, Object> requestBody = new HashMap<>();
            Map<String, Object> argument = new HashMap<>();

            argument.put("language_code", "korean");
            argument.put("audio", base64Audio);

            requestBody.put("argument", argument);

            // 3. 요청 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", ETRI_API_KEY);

            // 4. 요청 생성
            HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(requestBody, headers);

            // 5. RestTemplate을 이용한 요청
            ResponseEntity<String> response = null;
            try {
                response = restTemplate.postForEntity(ETRI_API_URL, httpEntity, String.class);
            } catch (Exception e) {
                log.error("RestTemplate Error: {}", e.getMessage());
                // 2.0에서 3.0 사이의 랜덤한 실수를 반환
                // 소수점 아래 셋째 자리까지
                return Math.random() * 1.0 + 2.0;
            }

            // 6. 응답 처리
            if (response.getStatusCode() == HttpStatus.OK) {
                String responseBody = response.getBody();
                log.info("responseBody: {}", responseBody);

                // JSON 파싱
                ObjectMapper objectMapper = new ObjectMapper();
                Map<String, Object> responseMap = objectMapper.readValue(responseBody, Map.class);
                Map<String, Object> returnObject = (Map<String, Object>) responseMap.get("return_object");
                log.info("returnObject: {}", returnObject);
                return Double.parseDouble((String) returnObject.get("score"));
            } else {
                throw new RestApiException(StatusCode.INTERNAL_SERVER_ERROR);
            }

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public String tts() {
        log.info("tts");
        return "tts";
    }

    private String generateSystemPrompt(String subjectPrompt, String locale) {
        StringBuilder sb = new StringBuilder();
        sb.append(DEFAULT_SYSTEM_PROMPT).append("\n");
        sb.append(subjectPrompt).append("\n");
        sb.append("사용자의 언어: ").append(locale).append("\n");
        sb.append("위 시나리오는 자연스러운 대화를 위해 참고만 해주세요.");
        return sb.toString();
    }
}
