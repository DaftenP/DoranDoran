package com.tutor.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tutor.common.exception.RestApiException;
import com.tutor.common.exception.StatusCode;
import com.tutor.dto.MessageRequestDTO;
import com.tutor.dto.TutorResponse;
import com.tutor.entity.TutorRole;
import com.tutor.entity.TutorSubject;
import com.tutor.repository.TutorRoleRepository;
import com.tutor.repository.TutorSubjectRepository;
import com.tutor.util.CustomPromptChatMemoryAdvisor;
import com.tutor.util.RedisChatMemory;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatOptions;
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

import static org.springframework.ai.openai.api.OpenAiApi.ChatCompletionRequest.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiTutorService {
    private static final int DEFAULT_CHAT_WINDOW_SIZE = 5;
    private final String ETRI_API_URL = "http://aiopen.etri.re.kr:8000/WiseASR/PronunciationKor";
    private static final String jsonSchema = """
            {
                "type": "object",
                "properties": {
                    "tutorResponse": { "type": "string" },
                    "translatedResponse": { "type": "string" },
                    "hint": { "type": "string" },
                    "translatedHint": { "type": "string" },
                    "isOver": { "type": "boolean" },
                    "correctness": { "type": "integer" }
                },
                "required": ["tutorResponse", "translatedResponse", "hint", "translatedHint", "isOver", "correctness"],
                "additionalProperties": false
            }
            """;

    // TODO: 프롬프트 수정 필요 (isOver 변경 이슈)
    private static final String SYSTEM_PROMPT = "다음 조건에 따라 대화를 진행해주세요.\n" +
            "1. 당신은 지금부터 한국어 회화 학습을 위한 선생님입니다.\n" +
            "2. 역할에 맞는 쉬운 수준의 한국어 상황극을 해주세요. \n" +
            "3. 대화 이력을 참고하여 다음으로 입력될 사용자의 대답의 적절성을 평가해주세요.\n" +
            "4. 만일 사용자가 대화에 관련없이 대답을 한다면 자연스럽게 넘어가주세요.\n" +
            "5. 대화 이력을 보고 사용자에게 이전과 유사한 질문이나 대화는 하지 마세요. \n" +
            "6. 사용자의 대답에 비속어 등 부적절한 내용이 포함된다면 적절성 점수를 0으로하고 isOver을 true로 해주세요.\n" +
            "7. 필요한 데이터는 다음과 같습니다.\n" +
            "gptResponse : 당신의 대답 (string)\n" +
            "translatedResponse : gptResponse에 대한 번역 (사용자 국가 언어에 알맞게 번역해주세요.) (string)\n" +
            "hint : 당신의 대답에 대한 적절한 사용자의 응답 예시 (string)\n" +
            "translatedHint : hint에 대한 번역 (사용자 국가 언어에 알맞게 번역해주세요.) (string)\n" +
            "correctness : 대화 이력에 대한 사용자의 대답의 적절성 점수 (0~5)\n" +
            "isOver : 대화 마침 여부 (boolean)\n" +
            "8. (가장 중요) 목표를 달성하면 무조건 isOver을 true로 하고 대화를 종료해주세요!!!\n" +
            "9. 당신이 대답을 할 때 다시 한 번 상황을 생각하고 목표 달성 여부를 확인해주세요. \n";

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
        Optional<TutorSubject> tutorSubject = tutorSubjectRepository.findById(situation);
        ;
        if (tutorRole.isEmpty() || tutorSubject.isEmpty()) {
            throw new RestApiException(StatusCode.NO_SUCH_ELEMENT);
        }

        if (messageRequest == null) {
            redisChatMemory.clear(messageRequest.getUserId());
        }

        /**
         * chatClient 생성
         * defaultSystem: 시스템 프롬프트
         * defaultAdvisors: 챗봇 메모리 (CustomPromptChatMemoryAdvisor 사용)
         */
        ChatClient chatClient = chatClientBuilder
                .defaultSystem(SYSTEM_PROMPT)
                .defaultAdvisors(new CustomPromptChatMemoryAdvisor(redisChatMemory, messageRequest.getUserId(), DEFAULT_CHAT_WINDOW_SIZE))
                .build();

        // Prompt 생성
        Prompt prompt = new Prompt(generatePrompt(tutorRole.get().getRoleName(), tutorSubject.get().getSubjectDetail(), locale, messageRequest.getMsg()), OpenAiChatOptions.builder().withResponseFormat(new ResponseFormat(ResponseFormat.Type.JSON_SCHEMA, jsonSchema)).build());

        TutorResponse tutorResponse = chatClient.prompt(prompt)
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
                throw new RestApiException(StatusCode.INTERNAL_SERVER_ERROR);
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

    private String generatePrompt(String r, String s, String l, String msg) {
        StringBuilder sb = new StringBuilder();
        sb.append("당신의 역할은 ").append(r).append("입니다.\n");
        sb.append("대화의 목표는 ").append(s).append("입니다.\n");
        sb.append("번역 언어는 ").append(l).append("입니다.\n");
        sb.append("사용자 메세지: ").append(msg).append("\n");
        return sb.toString();
    }
}
