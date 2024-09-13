package com.tutor.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tutor_subject")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TutorSubject {
    @Id
    @Column(name = "tutor_subject_id")
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "tutor_role_id")
    private TutorRole tutorRole;

    @Column(name = "tutor_subject_detail", nullable = false)
    private String subjectDetail;
}
