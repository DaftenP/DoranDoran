package com.scheduler.controller;

import com.scheduler.common.ResponseDto;
import com.scheduler.common.exception.StatusCode;
import com.scheduler.job.LeaderBoardBatch;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/scheduler")
@RequiredArgsConstructor
public class SchedulerController {
    private final LeaderBoardBatch leaderBoardBatch;

    @GetMapping("/league/settlement")
    public ResponseEntity<ResponseDto> leagueSettlement() {
        leaderBoardBatch.updateLeagueSettlement();
        return ResponseDto.response(StatusCode.SUCCESS, null);
    }

    @GetMapping("/leaderboard/update")
    public ResponseEntity<ResponseDto> updateLeaderBoard() {
        leaderBoardBatch.updateLeaderBoard();
        return ResponseDto.response(StatusCode.SUCCESS, null);
    }
}
