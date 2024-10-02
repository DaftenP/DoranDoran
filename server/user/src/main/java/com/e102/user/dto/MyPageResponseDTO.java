package com.e102.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
@Builder
public class MyPageResponseDTO {
    String nickname;
    String email;
    int xp;
    int color;
    int equipment;
    int background;
    int gem;
    int dailyStatus;
    String status;
    LocalDate birthday;
    int pSize;
}
