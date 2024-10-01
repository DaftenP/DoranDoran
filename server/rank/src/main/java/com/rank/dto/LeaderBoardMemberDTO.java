package com.rank.dto;

import lombok.*;
import org.springframework.data.redis.core.RedisHash;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LeaderBoardMemberDTO {
    private Long leaderboardType; // 0: 이번 주, 1: 지난 주
    private Long userId;
    private Long gainXp;
    private Long userRank;
    private Long order;
}