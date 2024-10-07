package com.scheduler.repository;

import com.scheduler.entity.LeagueLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LeagueLogRepository extends JpaRepository<LeagueLog, Long> {
    @Query("SELECT l FROM LeagueLog l WHERE l.createdAt BETWEEN :startOfLastWeek AND :endOfLastWeek")
    List<LeagueLog> findLeagueLogByCreatedAtLastWeek(
            @Param("startOfLastWeek") LocalDateTime startOfLastWeek,
            @Param("endOfLastWeek") LocalDateTime endOfLastWeek);
}
