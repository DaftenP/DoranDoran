package com.e102.log.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class PlayLogResponseDTO {

    private LocalDateTime createdAt;

    private int gainXp;

    private int quizType;
}
