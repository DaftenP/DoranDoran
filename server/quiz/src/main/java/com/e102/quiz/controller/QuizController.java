package com.e102.quiz.controller;

import com.e102.quiz.common.ResponseDto;
import com.e102.quiz.common.exception.StatusCode;
import com.e102.quiz.dto.QuizRequestDto;
import com.e102.quiz.dto.QuizResponseDto;
import com.e102.quiz.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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


    @GetMapping("/quizzes")
    public ResponseEntity<ResponseDto> getQuiz(@RequestParam(required = false) Integer quizType, @RequestParam(required = false) Integer quizCategory, @RequestParam(required = false) Integer cnt) {
        if (cnt == null)
            cnt = 1;
        List<QuizResponseDto> results = quizService.getQuizzes(Optional.ofNullable(quizType), Optional.ofNullable(quizCategory), cnt);
        return ResponseDto.response(StatusCode.SUCCESS, results);
    }

    @GetMapping("/quizzes/{quizId}")
    public ResponseEntity<ResponseDto> getQuizById(@PathVariable Integer quizId) {
        QuizResponseDto quizResponseDto = quizService.getQuiz(quizId);
        return ResponseDto.response(StatusCode.SUCCESS, quizResponseDto);
    }

    @PostMapping("/quizzes/regist")
    public ResponseEntity<ResponseDto> registQuiz(@RequestBody @Valid QuizRequestDto quizRequestDto){
        quizService.registQuiz(quizRequestDto);
        return ResponseDto.response(StatusCode.QUIZ_REGISTER, null);
    }

}
