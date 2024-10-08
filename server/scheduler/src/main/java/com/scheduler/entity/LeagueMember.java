package com.scheduler.entity;

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
    @Column(name = "league_member_id", nullable = false)
    private Long id;

    @Column(name = "league_member_gain_xp", nullable = false, columnDefinition = "BIGINT DEFAULT 0")
    private Long gainXP;

    @Column(name="user_id", nullable = false)
    private Long userId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "league_id", nullable = false)
    private League league;

    @Column(name="league_member_rank", nullable = false, columnDefinition = "INT DEFAULT 1000")
    private Long rank;

    public void updateGainXP(long l) {
        this.gainXP += l;
    }

    public void updateGainXP0() {
        this.gainXP = 0L;
    }

    public void updateLeague(League league) {
        this.league = league;
    }
}
