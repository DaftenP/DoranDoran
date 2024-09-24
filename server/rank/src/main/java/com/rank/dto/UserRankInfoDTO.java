package com.rank.dto;

import lombok.*;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserRankInfoDTO {
    private Long userId;
    private Long rank;
    private Long leagueId;
}
