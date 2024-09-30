package com.tutor.common.exception;

import com.tutor.common.ResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {
    /**
     * @ExceptionHandler(감지 할 예외)
     * INTERNAL_SERVER_ERROR 예외의 상태 코드와 메시지를 ResponseEntity<ResponseDto> 만들어준다.
     * return handleExceptionInternal(ErrorCode.INTERNAL_SERVER_ERROR);
     */
    @ExceptionHandler({Exception.class})
    public ResponseEntity<ResponseDto> handleAllException(Exception ex) {
        log.error("[exceptionHandle] ex", ex);
        return handleExceptionInternal(StatusCode.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(RestApiException.class)
    public ResponseEntity<ResponseDto> handleRestApiException(RestApiException ex) {
        return handleExceptionInternal(ex.getStatusCode());
    }

    private ResponseEntity<ResponseDto> handleExceptionInternal(StatusCode errorCode) {
        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(new ResponseDto(errorCode,null));
    }

}
