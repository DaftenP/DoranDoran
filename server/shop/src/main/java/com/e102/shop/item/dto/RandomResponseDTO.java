package com.e102.shop.item.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import java.util.List;

@Getter
@AllArgsConstructor
@Builder
public class RandomResponseDTO {

    private final List<Integer> pool;

    private final int chosen;

    private final int price;

}
