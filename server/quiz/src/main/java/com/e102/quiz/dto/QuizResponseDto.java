package com.e102.quiz.dto;

import lombok.*;

import java.util.List;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class QuizResponseDto {

    private int id;

    private int quizType;

    private int quizCategory;

    private String quizAnswer;

    private String quizQuestion;

    private List<String> quizImages;
}
