package com.scheduler.repository;

import com.scheduler.entity.LeagueMemberLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeagueMemberLogRepository extends JpaRepository<LeagueMemberLog, Long> {
}
