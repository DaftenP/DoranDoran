package com.scheduler.repository;

import com.scheduler.entity.LeagueMemberLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LeagueMemberLogRepository extends JpaRepository<LeagueMemberLog, Long> {
    @Query("SELECT l FROM LeagueMemberLog l " +
            "WHERE l.createdAt BETWEEN :startDate AND :endDate " +
            "ORDER BY l.gainXP DESC")
    List<LeagueMemberLog> findLogsByCreatedAtBetweenOrderByGainXPDesc(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate);

}
