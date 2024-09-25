package com.rank.util;

import org.springframework.stereotype.Component;

@Component
public class RedisKeyGenerator {
    // 특정 주간에 대한 랭킹 키를 반환하는 메서드 (0: 이번 주, 1: 지난 주)
    public String getLeaderboardKey(Long leaderboardType) {
        return leaderboardType == 0 ? "leaderboard:current" : "leaderboard:previous";
    }

    // 특정 주간에 대한 Hash 키를 반환하는 메서드
    public String getLeaderboardHashKey(Long leaderboardType) {
        return leaderboardType == 0 ? "leaderboard:current:hash" : "leaderboard:previous:hash";
    }

    // userId와 leaderboardType을 조합하여 Redis에서 고유 키로 사용
    public String getMemberKey(Long userId, Long leaderboardType) {
        return userId + ":" + leaderboardType;
    }
}
