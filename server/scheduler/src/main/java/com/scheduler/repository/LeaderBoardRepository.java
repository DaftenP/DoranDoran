package com.scheduler.repository;

import com.scheduler.entity.LeaderBoardMember;
import org.springframework.data.repository.CrudRepository;

public interface LeaderBoardRepository extends CrudRepository<LeaderBoardMember, String> {
    LeaderBoardMember findByUserIdAndLeaderboardType(Long userId, Long leaderboardType);
}
