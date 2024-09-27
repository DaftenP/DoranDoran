package com.tutor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TutorResponse {
    private String tutorResponse;
    private String translatedResponse;
    private String hint;
    private String translatedHint;
    private Boolean isOver;
    private Integer correctness;
}
