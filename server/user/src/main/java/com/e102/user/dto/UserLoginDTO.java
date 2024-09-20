package com.e102.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor

/*
	"email": "asdf@naver.com",
	"password": "1q2w3e4r"
 */
public class UserLoginDTO {
    private String email;
    private String password;
}
