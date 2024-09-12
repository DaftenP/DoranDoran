package com.tutor.controller;

import com.tutor.common.ResponseDto;
import com.tutor.common.exception.StatusCode;
import com.tutor.service.AiTutorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/api/v1/ai-tutor")
@RequiredArgsConstructor
public class AiTutorController {

    private final AiTutorService aiTutorService;

    @GetMapping("/init")
    public ResponseDto init() {
        log.info("init");
        String result = aiTutorService.init();
        return new ResponseDto(StatusCode.SUCCESS, result);
    }

    @GetMapping("/send")
    public ResponseDto send() {
        log.info("send");
        String result = aiTutorService.send();
        return new ResponseDto(StatusCode.SUCCESS, result);
    }

    @GetMapping("/pronunciation")
    public ResponseDto pronunciation() {
        log.info("pronunciation");
        String result = aiTutorService.pronunciation();
        return new ResponseDto(StatusCode.SUCCESS, result);
    }

    @GetMapping("/tts")
    public ResponseDto tts() {
        log.info("tts");
        String result = aiTutorService.tts();
        return new ResponseDto(StatusCode.SUCCESS, result);
    }
}
