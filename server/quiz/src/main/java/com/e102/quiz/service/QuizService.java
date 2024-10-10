package com.e102.quiz.service;

import com.e102.quiz.common.exception.RestApiException;
import com.e102.quiz.common.exception.StatusCode;
import com.e102.quiz.dto.QuizRequestDto;
import com.e102.quiz.dto.QuizResponseDto;
import com.e102.quiz.entity.Quiz;
import com.e102.quiz.entity.QuizImage;
import com.e102.quiz.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;
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
                        .quizId(quizEntity.getId())
                        .quizAnswer(quizEntity.getQuizAnswer())
                        .quizQuestion(quizEntity.getQuizQuestion())
                        .quizVoiceUrl(quizEntity.getQuizVoiceUrl())
                        .quizType(quizEntity.getQuizType())
                        .quizCategory(quizEntity.getQuizCategory())
                        .quizVoiceText(quizEntity.getQuizVoiceText())
                        .quizImages(quizEntity.getQuizImages().stream()
                                .map(QuizImage::getUrl)
                                .collect(Collectors.toList()))
                        .build()
                )
                .collect(Collectors.toList());
    }

    public QuizResponseDto getQuiz(Integer quizId) {
        Quiz quiz = quizRepository.findById(quizId).orElse(null);
        if (quiz == null) {
            throw new RestApiException(StatusCode.NO_SUCH_ELEMENT);
        }
        return QuizResponseDto.builder()
                .quizId(quiz.getId())
                .quizAnswer(quiz.getQuizAnswer())
                .quizQuestion(quiz.getQuizQuestion())
                .quizType(quiz.getQuizType())
                .quizCategory(quiz.getQuizCategory())
                .quizVoiceUrl(quiz.getQuizVoiceUrl())
                .quizVoiceText(quiz.getQuizVoiceText())
                .quizImages(quiz.getQuizImages().stream()
                        .map(QuizImage::getUrl)
                        .collect(Collectors.toList()))
                .build();
    }

    @Transactional
    public void registQuiz(QuizRequestDto quizRequestDto) {
        // 퀴즈 엔티티 객체 생성
        Quiz quiz = Quiz.builder()
                .quizType(quizRequestDto.getQuizType())
                .quizCategory(quizRequestDto.getQuizCategory())
                .quizAnswer(quizRequestDto.getQuizAnswer())
                .quizQuestion(quizRequestDto.getQuizQuestion())
                .quizVoiceUrl(quizRequestDto.getQuizVoiceUrl())
                .build();
        
        // 퀴즈 이미지 엔티티 컬렉션 생성
        List<QuizImage> quizImages = quizRequestDto.getQuizImages().stream()
                .map(quizImageRequestDto -> QuizImage.builder()
                        .url(quizImageRequestDto.getQuizImageUrl())
                        .text(quizImageRequestDto.getQuizImageText())
                        .quiz(quiz)
                        .build()
                )
                .collect(Collectors.toList());
        
        // 퀴즈 엔티티에 이미지 필드 설정
        quiz.updateQuizImages(quizImages);
        quizRepository.save(quiz);
    }
}
