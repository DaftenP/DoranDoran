package com.e102.log.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class PlayLogRequestDTO {

    private int userId;

    private int quizId;

}
