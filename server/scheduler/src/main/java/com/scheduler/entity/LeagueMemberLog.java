package com.scheduler.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LeagueMemberLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "league_member_log_id", nullable = false)
    private Long id;

    @Column(name = "league_member_gain_xp", nullable = false, columnDefinition = "BIGINT DEFAULT 0")
    private Long gainXP;

    @Column(name="user_id", nullable = false)
    private Long userId;

    @Column(name = "league_member_rank", nullable = false)
    private int rank;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "league_log_id", nullable = false)
    private LeagueLog leagueLog;

    @Column(name = "league_member_log_created_at", nullable = false)
    private LocalDateTime createdAt;
}
