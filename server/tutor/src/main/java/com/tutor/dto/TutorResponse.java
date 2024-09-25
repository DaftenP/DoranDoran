package com.tutor.dto;

import lombok.Data;

@Data
public class TutorResponse {
    private String tutorResponse;
    private String translatedResponse;
    private String hint;
    private String translatedHint;
    private Boolean isOver;
    private Integer correctness;
}
