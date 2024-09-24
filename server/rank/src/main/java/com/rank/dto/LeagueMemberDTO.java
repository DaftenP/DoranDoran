package com.rank.dto;

import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeagueMemberDTO {
    private Long userId;
    private String userNickName;
    private Long userXP;
    private Long userRanking;
}
