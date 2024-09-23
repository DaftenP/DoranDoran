package com.rank.controller;

import com.rank.common.ResponseDto;
import com.rank.common.exception.StatusCode;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/rank")
@Slf4j
public class RankController {

    /**
     * 유저 랭킹 정보 조회
     * @param userId
     * @return LeagueInfoDTO
     */
    @GetMapping("/league/{userId}")
    public ResponseDto getUserLeagueInfo(@PathVariable Long userId) {
        log.info("league info api called");
        return new ResponseDto(StatusCode.SUCCESS, null);
    }

    /**
     * 지난 주 랭킹 조회
     * @param userId
     * @return List<LeaderBoardMemberDTO>, myRanking, myXP
     */
    @GetMapping("/last-week/{userId}")
    public ResponseDto getLastWeekLeaderBoard(@PathVariable Long userId) {
        log.info("last week leaderboard api called");
        return new ResponseDto(StatusCode.SUCCESS, null);
    }

    /**
     * 이번 주 랭킹 조회
     * @param userId
     * @return List<LeaderBoardMemberDTO>, myRanking, myXP
     */
    @GetMapping("/this-week/{userId}")
    public ResponseDto getThisWeekLeaderBoard(@PathVariable Long userId) {
        log.info("this week leaderboard api called");
        return new ResponseDto(StatusCode.SUCCESS, null);
    }

    /**
     * XP 업데이트
     * @param userId
     * @return null
     */
    @PatchMapping("/xp/{userId}")
    public ResponseDto updateXP(@PathVariable Long userId) {
        log.info("update xp api called");
        return new ResponseDto(StatusCode.SUCCESS, null);
    }

    /**
     * 유저 랭킹 정보 조회
     * @param userId
     * @return UserRankInfoDTO
     */
    @GetMapping("/info/{userId}")
    public ResponseDto getUserRankInfo(@PathVariable Long userId) {
        log.info("user rank info api called");
        return new ResponseDto(StatusCode.SUCCESS, null);
    }
}
