package com.tutor.controller;

import com.tutor.common.ResponseDto;
import com.tutor.common.exception.StatusCode;
import com.tutor.dto.ChatRequestDTO;
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

    @GetMapping("/send")
    public ResponseDto send(@RequestBody(required = false) ChatRequestDTO chatRequestDTO, @RequestParam Long role, @RequestParam Long situation) {
        log.info("send");

        if(role == null || situation == null) {
            return new ResponseDto(StatusCode.BAD_REQUEST, null);
        }

        if(chatRequestDTO == null) {
            chatRequestDTO = new ChatRequestDTO();
        }

        TutorResponse tutorResponse = aiTutorService.send(chatRequestDTO, role, situation);
        return new ResponseDto(StatusCode.SUCCESS, tutorResponse);
    }

    @GetMapping("/pronunciation")
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

        String pronunciationRate = aiTutorService.pronunciation(file);
        return new ResponseDto(StatusCode.SUCCESS, pronunciationRate);
    }

    @GetMapping("/tts")
    public ResponseDto tts() {
        log.info("tts");
        String result = aiTutorService.tts();
        return new ResponseDto(StatusCode.SUCCESS, result);
    }
}
