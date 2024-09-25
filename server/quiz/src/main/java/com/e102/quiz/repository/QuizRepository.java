package com.e102.quiz.repository;

import com.e102.quiz.entity.Quiz;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Integer> {
    @Query(value = "SELECT q FROM Quiz q WHERE (:quizType IS NULL OR q.quizType = :quizType) " +
            "AND (:quizCategory IS NULL OR q.quizCategory = :quizCategory) " +
            "ORDER BY RAND()")
    List<Quiz> findRandomByQuizTypeAndQuizCategory(@Param("quizType") Integer quizType,
                                                   @Param("quizCategory") Integer quizCategory,
                                                   Pageable pageable);
}
