package com.e102.shop.item.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class ItemResponseDTO {
    private final int type;
    // 1 : 색깔, 2 : 장비 3 : 백그라운드

    private final String name;
    //상점에 표시될 이름

    private final int price;
    // 통일된 가격

    private final String imageURL;
    // 상점 이미지 URL
}
