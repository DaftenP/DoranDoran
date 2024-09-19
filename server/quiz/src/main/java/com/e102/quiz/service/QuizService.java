package com.e102.quiz.service;

import com.e102.quiz.dto.QuizResponseDto;
import com.e102.quiz.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;

    public List<QuizResponseDto> getQuizzes(Optional<Integer> quizType, Optional<Integer> quizCategory, Integer cnt) {
        Pageable pageable = PageRequest.of(0, cnt);
        return quizRepository.findRandomByQuizTypeAndQuizCategory(
                        quizType.orElse(null),
                        quizCategory.orElse(null),
                        pageable).stream()
                .map(quizEntity -> QuizResponseDto.builder()
                        .id(quizEntity.getId())
                        .quizAnswer(quizEntity.getQuizAnswer())
                        .quizQuestion(quizEntity.getQuizQuestion())
                        .quizType(quizEntity.getQuizType())
                        .quizCategory(quizEntity.getQuizCategory())
                        .quizImages(quizEntity.getQuizImages())
                        .build()
                )
                .collect(Collectors.toList());
    }
}
