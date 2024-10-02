package com.tutor.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Embeddable
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TutorSubjectId {
    @Column(name = "tutor_subject_id")
    private Long subjectId;
    @Column(name = "tutor_role_id")
    private Long roleId;
}
