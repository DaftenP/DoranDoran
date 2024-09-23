package com.rank.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class League {
    @Id
    @Column(name = "league_id")
    private Long id;

    @CreatedDate
    @Column(name = "league_created_at")
    private LocalDateTime createdAt;

    @Column(name = "league_rank")
    private Long rank;

    @Column(name = "league_num")
    private Long num;
}
