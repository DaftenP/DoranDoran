package com.e102.quiz.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@Getter
@AllArgsConstructor
public class PlayLogResponseDTO {
    private LocalDateTime createdAt;
    private int gain_xp;
    private int quizType;
}
