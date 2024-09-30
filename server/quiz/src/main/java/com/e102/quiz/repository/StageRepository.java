package com.e102.quiz.repository;

import com.e102.quiz.entity.Stage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StageRepository extends JpaRepository<Stage, Integer> {
    List<Stage> findAllByOrderByOrder();
}