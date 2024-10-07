package com.e102.user.repository;

import com.e102.user.entity.User;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    Boolean existsByNickname(String username);

    Boolean existsByEmail(String email);

    User findByNickname(String username);

    User findById(int id);

    User findByEmail(String email);

    @Query("SELECT u.id FROM User u WHERE u.email = :email")
    int findIdByEmail(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE u.id IN :ids")
    List<User> findByIdIn(@Param("ids") List<Integer> ids);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.password = :password WHERE u.id = :id")
    void resetPasswordById(@Param("id") Integer id, @Param("password") String password);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.gem = u.gem + :gem WHERE u.id = :id")
    int updateGemById(@Param("id") Integer id, @Param("gem") int gem);

    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.xp = u.xp + :xp WHERE u.id = :id")
    int updateXpById(@Param("id") Integer id, @Param("xp") int xp);

}
