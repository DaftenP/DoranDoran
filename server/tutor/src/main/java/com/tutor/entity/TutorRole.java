package com.tutor.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import static jakarta.persistence.GenerationType.*;

@Entity
@Table(name = "tutor_role")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TutorRole {
    @Id
    @GeneratedValue(strategy = IDENTITY)
    @Column(name = "tutor_role_id", nullable = false)
    private Long id;

    @Column(name = "tutor_role_name", nullable = false)
    private String roleName;
}
