package com.example.jwt.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

//접근 권한 테스트
@RestController
public class AdminController {
    @GetMapping("/admin")
    public String adminP(){
        return "admin Controller";
    }
}
