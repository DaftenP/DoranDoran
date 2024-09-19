package com.example.user.repository;

import com.example.user.entity.User;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Boolean existsByNickname(String username);

    Boolean existsByEmail(String email);

    User findByNickname(String username);

    User findById(int id);

    User findByEmail(String email);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.password = :password WHERE u.id = :id")
    void resetPasswordById(@Param("id") Integer id, @Param("password") String password);

}
