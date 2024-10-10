package com.e102.quiz.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
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

    @Column(name = "quiz_voice_url")
    private String quizVoiceUrl;

    @Column(name = "quiz_voice_text")
    private String quizVoiceText;

    @CreatedDate
    @Column(name = "quiz_created_at", columnDefinition = "TIMESTAMP", updatable = false)
    private LocalDateTime quizCreatedAt;

    @OneToMany(mappedBy = "quiz", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("id ASC")
    private List<QuizImage> quizImages;

    public void updateQuizImages(List<QuizImage> quizImages) {
        this.quizImages = quizImages;
    }
}
