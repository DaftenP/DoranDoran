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
@Table(name="item_log")
public class ItemLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="item_log_id")
    private int iid;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="user_id")
    private User iuser;

    @Column(name="item_log_type")
    private int type;

    @Column(name="item_log_changes")
    private int changes;

    @CreatedDate
    @Column(name="item_log_created_at",columnDefinition = "TIMESTAMP", updatable = false)
    private LocalDateTime createdAt;


}
