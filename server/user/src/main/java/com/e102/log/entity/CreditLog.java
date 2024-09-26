package com.e102.log.entity;

import com.e102.user.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@EntityListeners(AuditingEntityListener.class)
@Getter
@Builder
@AllArgsConstructor

@Table(name= "credit_log")
public class CreditLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="credit_log_id")
    private int cid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User cuser;

    @Column(name="credit_changes")
    private int changes;

    @Column(name="credit_log_type")
    private int logTypes;

    @CreatedDate
    @Column(name = "credit_log_created_at",columnDefinition = "TIMESTAMP", updatable = false)
    private LocalDateTime createdAt;

    public CreditLog() {
    }
}
