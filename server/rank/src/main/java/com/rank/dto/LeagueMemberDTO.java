package com.rank.dto;

import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeagueMemberDTO {
    private Long userId;
    private Long userXP;
    private Long order;
}
