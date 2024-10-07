package com.rank.repository;

import com.rank.entity.LeagueLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeagueLogRepository extends JpaRepository<LeagueLog, Long> {
}
