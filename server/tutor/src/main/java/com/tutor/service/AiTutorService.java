package com.tutor.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tutor.common.exception.RestApiException;
import com.tutor.common.exception.StatusCode;
import com.tutor.dto.ChatRequestDTO;
import com.tutor.dto.TutorResponse;
import com.tutor.entity.TutorRole;
import com.tutor.entity.TutorSubject;
import com.tutor.repository.TutorRoleRepository;
import com.tutor.repository.TutorSubjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.ai.openai.OpenAiChatModel;
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

import static org.springframework.ai.openai.api.OpenAiApi.*;
import static org.springframework.ai.openai.api.OpenAiApi.ChatCompletionRequest.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiTutorService {
    private final String ETRI_API_URL = "http://aiopen.etri.re.kr:8000/WiseASR/PronunciationKor";

    @Value("${etri.api.key}")
    private String ETRI_API_KEY;

    private final OpenAiChatModel openAiChatModel;
    private final ObjectMapper objectMapper;
    private final TutorRoleRepository tutorRoleRepository;
    private final TutorSubjectRepository tutorSubjectRepository;
    private static final String jsonSchema = """
            {
                "type": "object",
                "properties": {
                    "tutorResponse": { "type": "string" },
                    "isOver": { "type": "boolean" },
                    "correctness": { "type": "integer" }
                },
                "required": ["tutorResponse", "isOver", "correctness"],
                "additionalProperties": false
            }
            """;

    private String generatePrompt(String r, String s, ChatRequestDTO chatRequestDTO) {
        StringBuilder sb = new StringBuilder();
        sb.append("당신은 지금부터 한국어 연습을 위한 대화 상대야.\n");
        sb.append("당신의 역할은 ").append(r).append("입니다.\n");
        sb.append("현재 상황은 ").append(s).append("입니다.\n");
        sb.append("다음 조건에 따라 대화를 진행해주세요.\n");
        sb.append("1. 대화를 자연스럽게 진행해주세요.\n");
        sb.append("2. 대화의 종료는 알아서 판단하여 해주세요.\n");
        sb.append("3. 필요한 데이터는 다음과 같습니다.\n");
        sb.append("gptResponse : 당신의 대답 (string)\n");
        sb.append("correctness : 적절성 점수 (0~5)\n");
        sb.append("isOver : 대화 마침 여부 (boolean)\n");
        sb.append("아래는 이전 대화 내용입니다. 이전 대화 내용이 없다면 당신부터 대화를 시작해주세요.\n");
        sb.append(chatRequestDTO.toString());
        return sb.toString();
    }

    public TutorResponse send(ChatRequestDTO chatRequestDTO, Long role, Long situation) {
        // role, situation 맞는 문자열 가져오기
        Optional<TutorRole> tutorRole = tutorRoleRepository.findById(role);
        Optional<TutorSubject> tutorSubject = tutorSubjectRepository.findById(situation);
        if (tutorRole.isEmpty() || tutorSubject.isEmpty()) {
            throw new RestApiException(StatusCode.NO_SUCH_ELEMENT);
        }

        // 프롬프트 생성
        Prompt prompt = new Prompt(generatePrompt(tutorRole.get().getRoleName(), tutorSubject.get().getSubjectDetail(), chatRequestDTO), OpenAiChatOptions
                .builder()
                .withModel(ChatModel.GPT_4_O_MINI)
                .withResponseFormat(new ResponseFormat(ResponseFormat.Type.JSON_SCHEMA, jsonSchema))
                .build());

        ChatResponse response = this.openAiChatModel.call(prompt);

        AssistantMessage output = response.getResult().getOutput();

        try {
            return objectMapper.readValue(output.getContent(), TutorResponse.class);
        } catch (JsonProcessingException e) {
            throw new RestApiException(StatusCode.JSON_PARSE_ERROR);
        }
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
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.postForEntity(ETRI_API_URL, httpEntity, String.class);
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
}
