package com.e102.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum StatusCode {
    SUCCESS(HttpStatus.OK, null),
    WRONG_PW(HttpStatus.UNAUTHORIZED, "비밀번호가 잘못되었습니다. 다시 시도해 주세요."),
    BAD_REQUEST(HttpStatus.BAD_REQUEST, "잘못된 요청입니다."),
    UNAUTHORIZED_REQUEST(HttpStatus.UNAUTHORIZED, "인증되지 않은 사용자입니다."),
    FORBIDDEN_ACCESS(HttpStatus.FORBIDDEN, "권한이 없는 사용자입니다."),
    NOT_FOUND(HttpStatus.NOT_FOUND, "NOT FOUND."),
    METHOD_NOT_ALLOWED(HttpStatus.METHOD_NOT_ALLOWED, "허용되지 않은 Request Method 호출입니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류"),
    NO_EMAIL(HttpStatus.BAD_REQUEST,"존재하지 않는 이메일입니다."),
    DUPLICATE_EMAIL(HttpStatus.BAD_REQUEST, "중복된 이메일 입니다."),
    REG_DUP_OK(HttpStatus.OK, "이메일 중복 확인이 완료되었습니다. 사용 가능합니다."),
    INVALID_EMAIL_OR_PASSWORD(HttpStatus.BAD_REQUEST,"이메일 혹은 비밀번호가 일치하지 않습니다"),
    REG_SUCCESS(HttpStatus.OK,"회원가입이 정상적으로 완료되었습니다."),
    DROP_SUCCESS(HttpStatus.OK,"회원탈퇴가 정상적으로 완료되었습니다."),
    MAIL_SENT(HttpStatus.OK,"메일로 메시지가 전송되었습니다."),
    RESET_SUCCESS(HttpStatus.OK,"비밀번호가 성공적으로 변경되었습니다."),
    EXPIRED(HttpStatus.NOT_FOUND,"인증이 만료되었습니다."),
    CODE_CORRECT(HttpStatus.OK,"인증이 완료되었습니다."),
    CODE_INCORRECT(HttpStatus.UNAUTHORIZED,"인증번호가 잘못되었습니다."),
    LOG_REGISTER(HttpStatus.OK,"문제가 등록되었습니다."),
    MISSION_DONE(HttpStatus.METHOD_NOT_ALLOWED,"오늘의 미션을 진행 완료하셨습니다."),
    DAILY_CLEARED(HttpStatus.OK,"오늘의 미션을 클리어 하였습니다."),
    ALREADY_GET(HttpStatus.OK, "이미 가지고 있는 상품입니다."),
    NOT_ENOUGH_MONEY(HttpStatus.BAD_REQUEST, "돈이 부족합니다.");

    private final HttpStatus httpStatus;
    private final String message;
}
