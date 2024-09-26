package com.e102.quiz.dto;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class QuizImageRequestDto {

    private String quizImageUrl;

    private String quizImageText;
}
