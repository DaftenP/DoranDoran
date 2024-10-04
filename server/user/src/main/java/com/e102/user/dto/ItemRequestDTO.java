package com.e102.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class ItemRequestDTO {
    int userId;
    int itemType;
    int itemId;
    int price;
}
