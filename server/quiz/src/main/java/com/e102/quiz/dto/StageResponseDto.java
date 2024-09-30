package com.e102.quiz.dto;

import lombok.*;

@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class StageResponseDto {

    private int id;

    private int order;

    private String stageName;

}