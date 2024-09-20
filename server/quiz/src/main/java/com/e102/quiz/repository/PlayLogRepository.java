package com.e102.quiz.repository;

import com.e102.quiz.entity.PlayLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlayLogRepository extends JpaRepository<PlayLog,Integer> {
    // 특정 userId에 대한 PlayLog를 id기준으로 내림차순 정렬하여 반환하는 메소드
    List<PlayLog> findByUserIdOrderByIdDesc(int userId);
    //해당하는 Play Log 전부 리턴한다.

}
