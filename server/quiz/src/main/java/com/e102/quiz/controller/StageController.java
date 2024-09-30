package com.e102.quiz.controller;

import com.e102.quiz.common.ResponseDto;
import com.e102.quiz.common.exception.StatusCode;
import com.e102.quiz.dto.QuizResponseDto;
import com.e102.quiz.dto.StageResponseDto;
import com.e102.quiz.service.StageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/quiz")
public class StageController {

    private final StageService stageService;

    @GetMapping("/stage/{stageId}")
    public ResponseEntity<ResponseDto> getStageQuizzes(@PathVariable int stageId) {
        List<QuizResponseDto> quizzes = stageService.getStageQuizzes(stageId);
        return ResponseDto.response(StatusCode.SUCCESS, quizzes);
    }

    @GetMapping("/stage/all")
    public ResponseEntity<ResponseDto> getAllStageQuizzes() {
        List<StageResponseDto> stages = stageService.getStages();
        return ResponseDto.response(StatusCode.SUCCESS, stages);
    }

}
