package com.e102.quiz.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "quiz")
public class Quiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quiz_id")
    private int id;

    @Column(name = "quiz_type")
    private int quizType;

    @Column(name = "quiz_answer")
    private String quizAnswer;

    @Column(name = "quiz_category")
    private int quizCategory;

    @Column(name = "quiz_question")
    private String quizQuestion;

    @CreatedDate
    @Column(name = "quiz_created_at", columnDefinition = "TIMESTAMP", updatable = false)
    private LocalDateTime quizCreatedAt;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<QuizImage> quizImages;

}
