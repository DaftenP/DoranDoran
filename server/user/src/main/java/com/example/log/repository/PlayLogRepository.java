package com.example.log.repository;

import com.example.log.entity.PlayLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlayLogRepository extends JpaRepository<PlayLog,Integer> {

}
