package com.rank.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class LeaderBoardMemberDTO extends LeagueMemberDTO{
    private Long userRank;
}
