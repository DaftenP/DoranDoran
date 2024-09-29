package com.scheduler.job;

import com.scheduler.repository.LeaderBoardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class LeaderBoardBatch {
    private LeaderBoardRepository leaderBoardRepository;
    private RedisTemplate<String, Object> redisTemplate;

    @Scheduled(fixedRateString = "${batch.schedule.fixed-rate}")
    public void updateLeaderBoard(){
        log.info("updateLeaderBoard start");
    }

}
