package com.rank.repository;

import com.rank.entity.League;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Repository
public interface LeagueRepository extends JpaRepository<League, String> {
    @Query("SELECT l FROM League l WHERE l.id LIKE CONCAT(:prefix, '-', :rank, '-%') ORDER BY l.num DESC")
    List<League> findLeaguesByPrefixAndRank(@Param("prefix") String prefix, @Param("rank") int rank);

}