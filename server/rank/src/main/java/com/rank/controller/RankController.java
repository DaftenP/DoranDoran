package com.rank.controller;

import com.rank.common.ResponseDto;
import com.rank.common.exception.StatusCode;
import com.rank.dto.LeagueInfoDTO;
import com.rank.service.RankService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/rank")
@RequiredArgsConstructor
@Slf4j
public class RankController {
    private final RankService rankService;

    /**
     * 유저 랭킹 정보 조회
     * @param userId
     * @return LeagueInfoDTO
     */
    @GetMapping("/league/{userId}")
    public ResponseDto getUserLeagueInfo(@PathVariable Long userId) {
        log.info("league info api called");

        if(userId == null) {
            return new ResponseDto(StatusCode.BAD_REQUEST, null);
        } else{
            Map<String, Object> userLeagueInfoResponseDTO = rankService.getUserLeagueInfo(userId);
            return new ResponseDto(StatusCode.SUCCESS, userLeagueInfoResponseDTO);
        }
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
    public ResponseDto updateXP(@PathVariable Long userId, @RequestParam Long xp) {
        log.info("update xp api called");

        if(userId == null || xp == null) {
            return new ResponseDto(StatusCode.BAD_REQUEST, null);
        } else{
            rankService.updateXP(userId, xp);
            return new ResponseDto(StatusCode.SUCCESS, null);
        }
    }

    /**
     * 유저 랭킹 정보 조회
     * @param userId
     * @return UserRankInfoDTO
     */
    @GetMapping("/info/{userId}")
    public ResponseDto getUserRankInfo(@PathVariable Long userId) {
        log.info("user rank info api called");

        if(userId == null) {
            return new ResponseDto(StatusCode.BAD_REQUEST, null);
        } else{
            Map<String, Object> userRankInfo = rankService.getUserRankInfo(userId);
            return new ResponseDto(StatusCode.SUCCESS, userRankInfo);
        }
    }

    /**
     * 리그 배치
     * @param userId
     * @return
     */
    @PostMapping("/placement/{userId}")
    public ResponseDto placement(@PathVariable Long userId) {
        log.info("placement api called");

        if(userId == null) {
            return new ResponseDto(StatusCode.BAD_REQUEST, null);
        } else{
            rankService.placement(userId);
            return new ResponseDto(StatusCode.SUCCESS, null);
        }
    }

    @GetMapping("/league/settlement/{userId}")
    public ResponseDto settlement(@PathVariable Long userId) {
        log.info("settlement api called");

        if(userId == null) {
            return new ResponseDto(StatusCode.BAD_REQUEST, null);
        } else{
            Map<String, Object> result = rankService.settlement(userId);
            return new ResponseDto(StatusCode.SUCCESS, result);
        }
    }
}
