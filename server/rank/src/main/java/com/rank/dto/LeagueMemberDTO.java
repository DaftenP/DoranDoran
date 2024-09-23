package com.rank.dto;

import lombok.Data;

@Data
public class LeagueMemberDTO {
    private Long userId;
    private String userNickName;
    private Long userXP;
    private Long userRanking;
}
