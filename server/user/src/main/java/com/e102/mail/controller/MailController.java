package com.e102.mail.controller;

import com.e102.common.ResponseDto;
import com.e102.common.exception.StatusCode;
import com.e102.mail.service.MailService;
import com.e102.user.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/mail")
public class MailController {

    private final MailService mailService;
    private final UserService userService;

    public MailController(MailService mailService, UserService userService) {
        this.mailService = mailService;
        this.userService = userService;
    }

    @PostMapping("/regist")
    public ResponseEntity<ResponseDto> registerSend(@RequestParam("email") String email) {
        StatusCode statusCode;
        if (userService.isUserExists(email)) {
            statusCode = StatusCode.DUPLICATE_EMAIL;
        } else {
            try {
                mailService.sendRMail(email);
                statusCode = StatusCode.MAIL_SENT;

            } catch (Exception e) {
                statusCode = StatusCode.BAD_REQUEST;
            }
        }
        return ResponseDto.response(statusCode);
    }

    // send password E-MAIL
    @PostMapping("/password")
    public ResponseEntity<ResponseDto> passwordSend( @RequestParam("email") String email) {
        StatusCode statusCode;
        try {
            mailService.sendPMail(email);

            statusCode = StatusCode.MAIL_SENT;

        } catch (Exception e) {
            statusCode = StatusCode.BAD_REQUEST;
        }

        return ResponseDto.response(statusCode);
    }

    @PutMapping("/reset")
    public ResponseEntity<ResponseDto> resetPW(@RequestParam("email") String email){
        String tempPassword = userService.resetPassword(email);
        //System.out.println("TEMP PW : "+ tempPassword);
        if(tempPassword == null){
            return ResponseDto.response(StatusCode.NOT_FOUND);
        }
        mailService.resetPW(email,tempPassword);
        //비밀번호 실제로 변경
        mailService.setPWMail(email,tempPassword);
        //이메일로 쏴 줌
        return ResponseDto.response(StatusCode.RESET_SUCCESS,tempPassword);
    }

    // authenticate
    @GetMapping("/check")
    public ResponseEntity<ResponseDto> mailCheck(@RequestParam("email") String email, @RequestParam("userNumber") int userNumber) {
        StatusCode statusCode = mailService.checkCode(email,userNumber);
        return ResponseDto.response(statusCode);

    }

}
