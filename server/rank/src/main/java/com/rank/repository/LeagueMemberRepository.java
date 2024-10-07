package com.rank.repository;

import com.rank.entity.LeagueMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeagueMemberRepository extends JpaRepository<LeagueMember, String> {
    // XP 기준으로 내림차순 정렬하여 멤버 리스트 조회
    List<LeagueMember> findByLeagueIdOrderByGainXPDesc(Long leagueId);

    int countByLeagueId(Long id);

    Optional<LeagueMember> findByUserId(Long userId);
}
