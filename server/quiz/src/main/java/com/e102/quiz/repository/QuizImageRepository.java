package com.e102.quiz.repository;

import com.e102.quiz.entity.QuizImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuizImageRepository extends JpaRepository<QuizImage, Integer> {

}
