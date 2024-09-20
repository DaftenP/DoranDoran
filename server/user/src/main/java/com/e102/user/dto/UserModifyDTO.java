package com.e102.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class UserModifyDTO {
    String password;
    String nickname;
    String voice;
}
