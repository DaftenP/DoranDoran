package com.scheduler.repository;

import com.scheduler.entity.LeagueMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeagueMemberRepository extends JpaRepository<LeagueMember, String> {
    // 유저 아이디와 리그 아이디 prefix로 리그 멤버 조회
    @Query("SELECT lm FROM LeagueMember lm WHERE lm.userId = :userId AND lm.league.id LIKE CONCAT(:prefix, '%')")
    Optional<LeagueMember> findByUserIdAndLeagueIdPrefix(
            @Param("userId") Long userId,
            @Param("prefix") String prefix
    );

    // XP 기준으로 내림차순 정렬하여 멤버 리스트 조회
    List<LeagueMember> findByLeagueIdOrderByGainXPDesc(String leagueId);
}
