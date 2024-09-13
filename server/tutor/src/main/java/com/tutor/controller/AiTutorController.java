package com.tutor.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.tutor.common.ResponseDto;
import com.tutor.common.exception.StatusCode;
import com.tutor.dto.TutorResponse;
import com.tutor.service.AiTutorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/api/v1/tutor")
@RequiredArgsConstructor
public class AiTutorController {

    private final AiTutorService aiTutorService;

    @GetMapping("/init")
    public ResponseDto init(@RequestParam Long role, @RequestParam Long situation) throws JsonProcessingException {
        log.info("controller : init");

        if(role == null || situation == null) {
            return new ResponseDto(StatusCode.BAD_REQUEST, null);
        }

        TutorResponse tutorResponse = aiTutorService.init(role, situation);
        return new ResponseDto(StatusCode.SUCCESS, tutorResponse);
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
