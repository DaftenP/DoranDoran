package com.tutor.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tutor.common.exception.RestApiException;
import com.tutor.common.exception.StatusCode;
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
import org.springframework.stereotype.Service;

import java.util.Optional;

import static org.springframework.ai.openai.api.OpenAiApi.*;
import static org.springframework.ai.openai.api.OpenAiApi.ChatCompletionRequest.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class AiTutorService {

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

    public TutorResponse init(Long role, Long situation) throws JsonProcessingException {
        // role, situation 맞는 문자열 가져오기
        Optional<TutorRole> tutorRole = tutorRoleRepository.findById(role);
        Optional<TutorSubject> tutorSubject = tutorSubjectRepository.findById(situation);
        if (tutorRole.isEmpty() || tutorSubject.isEmpty()) {
            throw new RestApiException(StatusCode.NO_SUCH_ELEMENT);
        }

        // 프롬프트 생성
        Prompt prompt = new Prompt(generatePrompt(tutorRole.get().getRoleName(), tutorSubject.get().getSubjectDetail()),
                OpenAiChatOptions.builder()
                        .withModel(ChatModel.GPT_4_O_MINI)
                        .withResponseFormat(new ResponseFormat(ResponseFormat.Type.JSON_SCHEMA, jsonSchema))
                        .build());

        ChatResponse response = this.openAiChatModel.call(prompt);

        AssistantMessage output = response.getResult().getOutput();

        TutorResponse tutorResponse = objectMapper.readValue(output.getContent(), TutorResponse.class);

        return tutorResponse;
    }

    private String generatePrompt(String r, String s) {
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
        sb.append("이상입니다. 당신부터 대화를 시작해주세요.\n");

        return sb.toString();
    }

    public String send() {
        log.info("send");
        return "send";
    }

    public String pronunciation() {
        log.info("pronunciation");
        return "pronunciation";
    }

    public String tts() {
        log.info("tts");
        return "tts";
    }
}
