package com.e102.quiz.dto;


import lombok.*;

import java.time.LocalDateTime;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class PlayLogResponseDTO {

    private LocalDateTime createdAt;

    private int gainXp;

    private int quizType;
}
