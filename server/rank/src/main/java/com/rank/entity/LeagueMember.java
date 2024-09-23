package com.rank.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class LeagueMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "league_member_gain_xp")
    private Long gainXP;
    @Column(name="user_id")
    private Long userId;
    @Column(name="league_id")
    private Long leagueId;
}
