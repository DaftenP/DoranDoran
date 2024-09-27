package com.tutor.controller;

import com.tutor.common.ResponseDto;
import com.tutor.common.exception.StatusCode;
import com.tutor.dto.MessageRequestDTO;
import com.tutor.dto.TutorResponse;
import com.tutor.service.AiTutorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@Slf4j
@RequestMapping("/api/v1/tutor")
@RequiredArgsConstructor
public class AiTutorController {

    private final AiTutorService aiTutorService;

    @PostMapping("/send")
    public ResponseDto send(@RequestBody(required = false) MessageRequestDTO messageRequest, @RequestParam Long role, @RequestParam Long situation, @RequestParam String locale) {
        log.info("send");

        if(role == null || situation == null || locale == null) {
            return new ResponseDto(StatusCode.BAD_REQUEST, null);
        }

        if(messageRequest == null) {
            return new ResponseDto(StatusCode.BAD_REQUEST, null);
        }

        TutorResponse tutorResponse = aiTutorService.send(messageRequest, role, situation, locale);
        return new ResponseDto(StatusCode.SUCCESS, tutorResponse);
    }

    @PostMapping("/pronunciation")
    public ResponseDto pronunciation(@RequestParam("file")MultipartFile file) {
        log.info("pronunciation");

        if(file.isEmpty()){
            return new ResponseDto(StatusCode.BAD_REQUEST, null);
        }

        // 파일 정보 출력 (MIME 타입 및 파일명)
        String mimeType = file.getContentType();
        String originalFilename = file.getOriginalFilename();

        log.info("MIME 타입: {}", mimeType);
        log.info("파일명: {}", originalFilename);

        Double pronunciationRate = aiTutorService.pronunciation(file);
        return new ResponseDto(StatusCode.SUCCESS, pronunciationRate);
    }

    @GetMapping("/tts")
    public ResponseDto tts() {
        log.info("tts");
        String result = aiTutorService.tts();
        return new ResponseDto(StatusCode.SUCCESS, result);
    }
}
