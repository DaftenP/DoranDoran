package com.scheduler.controller;

import com.scheduler.common.ResponseDto;
import com.scheduler.common.exception.StatusCode;
import com.scheduler.job.LeaderBoardBatch;
import com.scheduler.service.LeaderBoardService.LeaderBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/scheduler")
@RequiredArgsConstructor
public class SchedulerController {
    private final LeaderBoardBatch leaderBoardBatch;
    private final LeaderBoardService leaderboardService;

    @GetMapping("/league/settlement")
    public ResponseEntity<ResponseDto> leagueSettlement() {
        leaderBoardBatch.updateLeagueSettlement();
        return ResponseDto.response(StatusCode.SUCCESS, null);
    }

    @GetMapping("/leaderboard/current-update")
    public ResponseEntity<ResponseDto> updateCurrentLeaderBoard() {
        leaderboardService.updateCurrentLeaderBoard();
        return ResponseDto.response(StatusCode.SUCCESS, null);
    }

    @GetMapping("/leaderboard/last-update")
    public ResponseEntity<ResponseDto> updateLastLeaderBoard() {
        leaderboardService.updateLastLeaderBoard();
        return ResponseDto.response(StatusCode.SUCCESS, null);
    }
}
