package com.tutor.repository;

import com.tutor.entity.TutorSubjectId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.tutor.entity.TutorSubject;
@Repository
public interface TutorSubjectRepository extends JpaRepository<TutorSubject, TutorSubjectId> {
}
