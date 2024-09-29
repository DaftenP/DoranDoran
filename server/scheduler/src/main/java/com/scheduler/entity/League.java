package com.scheduler.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class League {
    @Id
    @Column(name = "league_id", nullable = false)
    private String id;

    @CreatedDate
    @Column(name = "league_created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "league_rank", nullable = false)
    private Integer rank;

    @Column(name = "league_num", nullable = false)
    private Integer num;
}
