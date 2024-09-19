package com.example.log.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import java.time.LocalDateTime;

@Entity
@Table(name="play_log")
public class PlayLog {

    @Id
    @Column(name="play_log_id", nullable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @CreatedDate
    @Column(name = "play_log_created_at",columnDefinition = "TIMESTAMP", updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @Column(name="play_log_gain_xp", nullable = false)
    private int xp;

    @Column(name ="user_id" , nullable = false)
    private int userId;

    @Column(name= "quiz_id", nullable = false)
    private int quizId;


}
