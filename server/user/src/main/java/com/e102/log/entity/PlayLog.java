package com.e102.log.entity;


import com.e102.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name="play_log")
public class PlayLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="play_log_id")
    private int pid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User puser;

    @Column(name="play_log_xp")
    private int xp;

    @Column(name="quiz_id")
    private int quizId;

    @CreatedDate
    @Column(name="item_log_created_at",columnDefinition = "TIMESTAMP", updatable = false)
    private LocalDateTime createdAt;

}
