package com.rank.dto;

import com.rank.entity.LeagueMember;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class LeagueInfoDTO {
    private Long leagueId;
    private LocalDateTime createdAt;
    private Long leagueRank;
    private Long leagueNum;
    private List<LeagueMemberDTO> leagueMembers;
}
