package com.rank.repository;

import com.rank.entity.LeaderBoardMember;
import org.springframework.data.repository.CrudRepository;

public interface LeaderBoardRepository extends CrudRepository<LeaderBoardMember, String> {
}
