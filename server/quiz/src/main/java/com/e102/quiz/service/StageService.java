package com.e102.quiz.service;

import com.e102.quiz.dto.QuizResponseDto;
import com.e102.quiz.dto.StageResponseDto;
import com.e102.quiz.entity.QuizImage;
import com.e102.quiz.entity.Stage;
import com.e102.quiz.repository.StageItemRepository;
import com.e102.quiz.repository.StageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StageService {
    private final StageRepository stageRepository;
    private final StageItemRepository stageItemRepository;

    public void save(Stage stage) {
        stageRepository.save(stage);
    }

    public List<QuizResponseDto> getStageQuizzes(int id) {
        return stageItemRepository.findByStageIdOrderByOrder(id).stream()
                .map(stageItem ->
                        QuizResponseDto.builder()
                                .quizType(stageItem.getQuiz().getQuizType())
                                .quizQuestion(stageItem.getQuiz().getQuizQuestion())
                                .quizAnswer(stageItem.getQuiz().getQuizAnswer())
                                .quizCategory(stageItem.getQuiz().getQuizCategory())
                                .quizId(stageItem.getQuiz().getId())
                                .quizVoiceUrl(stageItem.getQuiz().getQuizVoiceUrl())
                                .quizVoiceText(stageItem.getQuiz().getQuizVoiceText())
                                .quizImages(stageItem.getQuiz().getQuizImages().stream()
                                        .map(QuizImage::getUrl)
                                        .collect(Collectors.toList()))
                                .build())
                .collect(Collectors.toList());
    }

    public List<StageResponseDto> getStages() {
        return stageRepository.findAllByOrderByOrder().stream()
                .map(stage -> StageResponseDto.builder()
                        .id(stage.getId())
                        .order(stage.getOrder())
                        .stageName(stage.getName())
                        .build())
                .collect(Collectors.toList());
    }
}