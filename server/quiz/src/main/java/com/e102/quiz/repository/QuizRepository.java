package com.e102.quiz.repository;

import com.e102.quiz.entity.Quiz;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface QuizRepository extends JpaRepository<Quiz, Integer> {
    @Query(value = "SELECT q FROM Quiz q WHERE q.quizType = :quizType AND q.quizCategory = :quizCategory ORDER BY RAND()")
    List<Quiz> findRandomByQuizTypeAndQuizCategory(@Param("quizType") Integer quizType,
                                                   @Param("quizCategory") Integer quizCategory,
                                                   Pageable pageable);
}
