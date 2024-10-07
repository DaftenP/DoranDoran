package com.rank.entity;

import java.util.List;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;
import java.util.ArrayList;


@Entity
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LeagueLog {
    @Id
    @Column(name = "league_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @CreatedDate
    @Column(name = "league_created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "league_rank", nullable = false)
    private Integer rank;

    @Column(name = "league_num", nullable = false)
    private Integer num;

    @OneToMany(mappedBy = "leagueLog")
    private List<LeagueMemberLog> leagueMemberLogs = new ArrayList<>();
}
