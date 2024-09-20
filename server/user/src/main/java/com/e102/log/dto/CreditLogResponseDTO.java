package com.e102.log.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@Builder
public class CreditLogResponseDTO {

    private int cid;

    private int changes;

    private int logTypes;

    private LocalDateTime createdAt;

}
