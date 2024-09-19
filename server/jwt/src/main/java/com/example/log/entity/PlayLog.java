package com.example.log.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name="play_log")
public class PlayLog {

    @Id
    @Column(name="play_log_id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    LocalDateTime play_log_created_at;
}
