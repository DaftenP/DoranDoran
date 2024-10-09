package com.scheduler.repository;

import com.scheduler.entity.LeagueMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LeagueMemberRepository extends JpaRepository<LeagueMember, Long> {
    List<LeagueMember> findAllByOrderByGainXP();

    List<LeagueMember> findAllByLeagueIdOrderByGainXP(Long id);

    List<LeagueMember> findByRank(Long rank);

    List<LeagueMember> findAllByOrderByGainXPDesc();
}
