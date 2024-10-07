package com.rank.repository;

import com.rank.entity.LeagueMemberLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LeagueMemberLogRepository extends JpaRepository<LeagueMemberLog, Long> {
    @Query("SELECT l FROM LeagueMemberLog l WHERE l.userId = :userId AND l.createdAt BETWEEN :startOfLastWeek AND :endOfLastWeek")
    List<LeagueMemberLog> findLogsByUserIdAndLastWeek(@Param("userId") Long userId,
                                                      @Param("startOfLastWeek") LocalDateTime startOfLastWeek,
                                                      @Param("endOfLastWeek") LocalDateTime endOfLastWeek);

}
