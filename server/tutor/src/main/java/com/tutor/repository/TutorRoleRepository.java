package com.tutor.repository;

import com.tutor.entity.TutorRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TutorRoleRepository extends JpaRepository<TutorRole, Long> {
    TutorRole findByRoleName(String roleName);
}
