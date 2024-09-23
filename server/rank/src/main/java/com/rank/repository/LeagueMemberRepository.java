package com.rank.repository;

import com.rank.entity.LeagueMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeagueMemberRepository extends JpaRepository<LeagueMember, Long> {
}
