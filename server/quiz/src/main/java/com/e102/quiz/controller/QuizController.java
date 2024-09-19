package com.e102.quiz.controller;

import com.e102.quiz.common.ResponseDto;
import com.e102.quiz.common.exception.StatusCode;
import com.e102.quiz.dto.QuizResponseDto;
import com.e102.quiz.service.QuizService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

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
    public ResponseEntity<ResponseDto> getQuiz(@RequestParam(required = false) Integer quizType, @RequestParam(required = false) Integer quizCategory, @RequestParam(required = false) Integer cnt) {
        if (cnt == null)
            cnt = 1;
        List<QuizResponseDto> results = quizService.getQuizzes(Optional.ofNullable(quizType), Optional.ofNullable(quizCategory), cnt);
        return ResponseDto.response(StatusCode.SUCCESS, results);
    }

}
