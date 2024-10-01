package com.rank.entity;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.util.UUID;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@RedisHash("LeaderBoardMember")
@Builder
public class LeaderBoardMember {
    @Id
    private String id;
    private Long leaderboardType; // 0: 이번 주, 1: 지난 주
    private Long userId;
    private Long gainXp;
    private Long userRank;
    private Long order;
}
