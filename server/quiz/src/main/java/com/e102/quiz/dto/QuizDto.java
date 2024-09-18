package com.e102.quiz.dto;

import com.e102.quiz.entity.QuizImage;
import lombok.*;

import java.util.Set;

@Data
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuizDto {
    private int id;

    private int quizType;

    private String quizAnswer;

    private int quizCategory;

    private String quizQuestion;

    private Set<QuizImage> quizImages;
}
