package com.rank.controller;

import com.rank.common.ResponseDto;
import com.rank.common.exception.StatusCode;
import com.rank.dto.LeaderBoardMemberDTO;
import com.rank.service.LeaderBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/leaderboard")
@RequiredArgsConstructor
public class LeaderBoardController {
    private final LeaderBoardService leaderboardService;

    /**
     * 리더보드 저장 (테스트용입니다.)
     * @param leaderBoardMembersDTO
     * @return ResponseDto
     */
    @PostMapping("/save")
    public ResponseDto saveLeaderboard(@RequestBody List<LeaderBoardMemberDTO> leaderBoardMembersDTO) {
        if (leaderBoardMembersDTO == null) {
            return new ResponseDto(StatusCode.BAD_REQUEST, null);
        } else {
            leaderboardService.saveLeaderBoardMember(leaderBoardMembersDTO);
            return new ResponseDto(StatusCode.SUCCESS, null);
        }
    }


    /**
     * 랭킹 정보 조회
     * @param type
     * @param userId
     * @return ResponseDto
     */
    @GetMapping
    public ResponseDto getRankingInfo(
            @RequestParam Long type,
            @RequestParam Long userId) {
        if (type == null || userId == null) {
            return new ResponseDto(StatusCode.BAD_REQUEST, null);
        } else {
            Map<String, Object> responseData = leaderboardService.getRankingInfo(type, userId);
            return new ResponseDto(StatusCode.SUCCESS, responseData);
        }
    }
}
