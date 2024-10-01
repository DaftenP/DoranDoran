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
    private static final String SYSTEM_PROMPT = "Follow these rules for the conversation:\n" +
            "1. Perform a Korean role-play according to your role.\n" +
            "2. Evaluate the user's response for naturalness based on the conversation flow.\n" +
            "3. Refer to previous conversation memory for a smooth continuation.\n" +
            "4. If the user's response contains inappropriate content (e.g., profanity), set 'correctness' to 0 and 'isOver' to true.\n" +
            "5. End the conversation and set 'isOver' to true if there are more than 5 previous conversation memories.\n" +
            "6. Respond only in Korean.\n" +
            "gptResponse: Your response (string)\n" +
            "correctness: Appropriateness score of the user's response (0~5)\n" +
            "isOver: Whether the conversation is over (boolean)\n";

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
        sb.append("Your role is ").append(r).append(".\n");
        sb.append("The goal of the conversation is ").append(s).append(".\n");
        sb.append("The translation language is ").append(l).append(".\n");
        sb.append("User message: ").append(msg).append("\n");
        return sb.toString();
    }
}
