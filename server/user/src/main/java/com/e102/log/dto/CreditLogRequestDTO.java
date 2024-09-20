package com.e102.log.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class CreditLogRequestDTO {
    private int userId;

    private int changes;

    private int logTypes;
}
