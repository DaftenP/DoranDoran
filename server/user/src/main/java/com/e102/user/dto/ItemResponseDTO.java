package com.e102.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class ItemResponseDTO {
    int itemType;
    int itemId;
}
