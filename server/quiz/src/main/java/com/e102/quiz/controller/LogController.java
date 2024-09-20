package com.e102.quiz.controller;

import com.e102.quiz.common.ResponseDto;
import com.e102.quiz.common.exception.StatusCode;
import com.e102.quiz.dto.PlayLogRequestDTO;
import com.e102.quiz.entity.PlayLog;
import com.e102.quiz.service.PlayLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/v1/quiz/play-log")
public class LogController {

    private final PlayLogService playLogService;

    @PostMapping("/submit")
    public ResponseEntity<ResponseDto> addLog(@RequestBody PlayLogRequestDTO playLogRequestDTO) {
        StatusCode statusCode = playLogService.addLog(playLogRequestDTO, 10);
        return ResponseDto.response(statusCode, null);
    }

    @GetMapping("/{userId}")
    public List<PlayLog> getLog(@PathVariable int userId) {
        return playLogService.getLogs(userId);
    }


}
