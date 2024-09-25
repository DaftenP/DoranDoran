package com.e102.shop.item.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class SpecResponseDTO {

    private int id;

    private int price;

    private String name;

    private String imageURL;
    // 상품 이미지 URL
}
