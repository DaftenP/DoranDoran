package com.tutor.common;

import com.tutor.common.exception.StatusCode;
import lombok.Getter;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

@Getter
public class ResponseDto {

    private final Object data;
    private final String message;
    private final LocalDateTime timestamp = LocalDateTime.now();

    public ResponseDto(StatusCode statusCode, Object data) {
        this.message = statusCode.getMessage();
        this.data = data;
    }

    public static ResponseEntity<ResponseDto> response(StatusCode statusCode, Object data) {
        return ResponseEntity
                .status(statusCode.getHttpStatus())
                .body(new ResponseDto(statusCode, data));
    }
}
