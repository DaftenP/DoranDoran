package com.e102.quiz.repository;

import com.e102.quiz.entity.StageItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface StageItemRepository extends JpaRepository<StageItem, Integer> {
    List<StageItem> findByStageIdOrderByOrder(int stageId);
}