package com.example.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@AllArgsConstructor
@Builder
public class MyPageResponseDTO {
    String nickname;
    String email;
    int xp;
    int character;
    int avatar;
    int voice;
    int gem;
    int rank;
}
