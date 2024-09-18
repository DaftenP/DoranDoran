package com.e102.quiz.service;

import com.e102.quiz.entity.Quiz;
import com.e102.quiz.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;

    public List<Quiz> getQuiz(Integer quizType, Integer quizCategory, Integer cnt) {
        Pageable pageable = PageRequest.of(0, cnt);
        List<Quiz> quiz = quizRepository.findRandomByQuizTypeAndQuizCategory(quizType, quizCategory, pageable);
        return quiz;
    }
}
