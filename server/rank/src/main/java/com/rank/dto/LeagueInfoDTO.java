package com.rank.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeagueInfoDTO {
    private String leagueId;
    private LocalDateTime createdAt;
    private Integer leagueRank;
    private Integer leagueNum;
}
