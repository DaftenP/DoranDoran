package com.e102.quiz.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Validated
public class QuizRequestDto {

    @Min(value = 1, message = "퀴즈 타입은 필수 속성입니다.")
    private int quizType;

    @NotNull(message = "정답은 필수 속성입니다.")
    private String quizAnswer;

    @Min(value = 1)
    private int quizCategory;

    @NotNull(message = "문제는 필수 속성입니다.")
    private String quizQuestion;

    private String quizVoiceUrl;

    private List<QuizImageRequestDto> quizImages;
}
