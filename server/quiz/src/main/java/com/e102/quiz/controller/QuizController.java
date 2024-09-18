package com.e102.quiz.controller;

import com.e102.quiz.common.ResponseDto;
import com.e102.quiz.common.exception.StatusCode;
import com.e102.quiz.entity.Quiz;
import com.e102.quiz.service.QuizService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/quiz")
public class QuizController {

    private final QuizService quizService;

    // 서버 응답 확인용 메소드
    @GetMapping("/healthz")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity
                .status(HttpStatus.OK) // 200 상태 코드 설정
                .build();
    }

    @GetMapping("/quizzes")
    public ResponseEntity<ResponseDto> getQuiz(@RequestParam(required = false) int quizType, @RequestParam(required = false) int quizCategory, @RequestParam(required = false) int cnt) {
        List<Quiz> result = quizService.getQuiz(quizType, quizCategory, cnt);
        return ResponseDto.response(StatusCode.SUCCESS, result);
    }
}
