package com.tutor.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TutorSubjectId implements Serializable {
    @Column(name = "tutor_subject_id")
    private Long subjectId;
    @Column(name = "tutor_role_id")
    private Long roleId;

    // equals 메서드
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        TutorSubjectId that = (TutorSubjectId) o;
        return Objects.equals(roleId, that.roleId) &&
                Objects.equals(subjectId, that.subjectId);
    }

    // hashCode 메서드
    @Override
    public int hashCode() {
        return Objects.hash(roleId, subjectId);
    }
}
