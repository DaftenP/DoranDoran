package com.tutor.dto;

import lombok.Data;

@Data
public class TutorResponse {
    private String tutorResponse;
    private Boolean isOver;
    private Integer correctness;
}
