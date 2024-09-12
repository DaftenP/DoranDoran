package com.tutor.controller;

import lombok.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/")
public class TestController {

    // 서버 응답 확인용 메소드
    @GetMapping("/healthz")
    public HttpEntity<String> healthCheck() {
        return ResponseEntity
                .status(HttpStatus.OK) // 200 상태 코드 설정
                .build();
    }
}