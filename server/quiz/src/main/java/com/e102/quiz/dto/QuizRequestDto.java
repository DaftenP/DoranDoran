package com.e102.quiz.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class QuizRequestDto {

    private int quizType;

    private String quizAnswer;

    private int quizCategory;

    private String quizQuestion;

    private List<QuizImageRequestDto> quizImages;
}
