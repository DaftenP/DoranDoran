package com.e102.shop.item.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/")
public class ConnectionTestController {
    /**
     * 서버 확인 용 메소드
     * @return
     */
    @GetMapping("/healthz")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity
                .status(HttpStatus.OK) // 200 상태 코드 설정
                .build();
    }
}
