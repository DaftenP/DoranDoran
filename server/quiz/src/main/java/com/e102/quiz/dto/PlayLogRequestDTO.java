package com.e102.quiz.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@AllArgsConstructor
public class PlayLogRequestDTO {
    int userId;
    int quizId;
}
