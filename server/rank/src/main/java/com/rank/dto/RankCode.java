package com.rank.dto;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum RankCode {
    BRONZE(1000L, "BRONZE"),
    SILVER(2000L, "SILVER"),
    GOLD(3000L, "GOLD"),
    PLATINUM(4000L, "PLATINUM"),
    DIAMOND(5000L, "DIAMOND");

    private final Long code;
    private final String rankName;

}
