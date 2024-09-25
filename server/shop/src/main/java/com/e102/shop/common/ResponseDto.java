package com.e102.shop.common;

import com.e102.shop.common.exception.StatusCode;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.Getter;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

@Getter
public class ResponseDto {

    private final Object data;
    private final String message;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private final LocalDateTime timestamp = LocalDateTime.now();

    public ResponseDto(StatusCode statusCode) {
        this.message = statusCode.getMessage();
        this.data = null;
    }

    public ResponseDto(StatusCode statusCode, Object data) {
        this.message = statusCode.getMessage();
        this.data = data;
    }

    public static ResponseEntity<ResponseDto> response(StatusCode statusCode) {
        return ResponseEntity
                .status(statusCode.getHttpStatus())
                .body(new ResponseDto(statusCode));
    }

    public static ResponseEntity<ResponseDto> response(StatusCode statusCode, Object data) {
        return ResponseEntity
                .status(statusCode.getHttpStatus())
                .body(new ResponseDto(statusCode, data));
    }

    // 추가: String으로 변환해서 반환하는 메소드
    public static String toJsonString(StatusCode statusCode) {
        ResponseDto responseDto = new ResponseDto(statusCode);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()); // LocalDateTime 직렬화 지원
        try {
            return objectMapper.writeValueAsString(responseDto);
        } catch (Exception e) {
            throw new RuntimeException("Error converting ResponseDto to JSON string", e);
        }
    }

    public static String toJsonString(StatusCode statusCode, Object data) {
        ResponseDto responseDto = new ResponseDto(statusCode, data);
        ObjectMapper objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()); // LocalDateTime 직렬화 지원
        try {
            return objectMapper.writeValueAsString(responseDto);
        } catch (Exception e) {
            throw new RuntimeException("Error converting ResponseDto to JSON string", e);
        }
    }


}
