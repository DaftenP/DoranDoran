package com.tutor.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "tutor_subject")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class TutorSubject {
    @EmbeddedId
    private TutorSubjectId id;

    @MapsId("roleId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tutor_role_id", nullable = false)
    private TutorRole tutorRole;

    @Column(name = "tutor_subject_detail", nullable = false)
    private String subjectDetail;

    @Column(name = "tutor_subject_prompt", nullable = false, length = 1000)
    private String subjectPrompt;
}
