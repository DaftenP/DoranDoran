package com.scheduler.repository;

import com.scheduler.entity.League;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeagueRepository extends JpaRepository<League, String> {
    List<League> findAllByIdStartingWith(String leaguePrefix);
}
