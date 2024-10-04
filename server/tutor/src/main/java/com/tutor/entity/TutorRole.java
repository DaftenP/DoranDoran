package com.tutor.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tutor_role")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TutorRole {
    @Id
    @Column(name = "tutor_role_id", nullable = false)
    private Long id;

    @Column(name = "tutor_role_name", nullable = false)
    private String roleName;
}
