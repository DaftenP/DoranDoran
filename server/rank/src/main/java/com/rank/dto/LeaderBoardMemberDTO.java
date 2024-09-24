package com.rank.dto;

import lombok.*;

@EqualsAndHashCode(callSuper = true)
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class LeaderBoardMemberDTO extends LeagueMemberDTO{
    private Long userRank;
}
