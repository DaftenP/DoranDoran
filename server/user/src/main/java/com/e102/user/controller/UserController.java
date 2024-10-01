package com.e102.user.controller;

import com.e102.common.ResponseDto;
import com.e102.common.exception.StatusCode;
import com.e102.log.dto.CreditLogRequestDTO;
import com.e102.log.dto.CreditLogResponseDTO;
import com.e102.log.dto.PlayLogRequestDTO;
import com.e102.log.dto.PlayLogResponseDTO;
import com.e102.user.dto.*;
import com.e102.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/v1/user")
public class UserController {

    private final UserService userService;

    @Autowired
    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/regist")
    public ResponseEntity<ResponseDto> regist(@RequestBody UserRequestDTO userRequestDTO){
        StatusCode statusCode = userService.registUser(userRequestDTO);
        return ResponseDto.response(statusCode);
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseDto> login(@RequestBody UserLoginDTO userLoginDTO){
        StatusCode statusCode = userService.loginUser(userLoginDTO);
        //System.out.println(statusCode.toString());
        return ResponseDto.response(statusCode);
    }

    @GetMapping("/duplication")
    public ResponseEntity<ResponseDto> checkDuplicate(@RequestParam("email") String email){
        //System.out.println("called");
        StatusCode statusCode = userService.duplicateUser(email);
        return ResponseDto.response(statusCode);
    }

    @GetMapping("/my-page/user/{userId}")
    public ResponseEntity<ResponseDto> viewUser(@PathVariable("userId") int userId){
        MyPageResponseDTO myPageResponseDTO = userService.findMyPageById(userId);
        return ResponseDto.response(StatusCode.SUCCESS,myPageResponseDTO);
    }

    @PatchMapping("/my-page/password")
    public ResponseEntity<ResponseDto> modUserPassword(@RequestBody PasswordModifyDTO passwordModifyDTO) {
        StatusCode statusCode = userService.modifyPassWord(passwordModifyDTO);
        return ResponseDto.response(statusCode);
    }

    @PatchMapping("/my-page/nickname")
    public ResponseEntity<ResponseDto> modUserNickname(@RequestBody NicknameModifyDTO nicknameModifyDTO) {
        StatusCode statusCode = userService.modifyNickname(nicknameModifyDTO);
        return ResponseDto.response(statusCode);
    }

    @PatchMapping("/my-page/birthday")
    public ResponseEntity<ResponseDto> modUserBirthday(@RequestBody BirthdayModifyDTO birthdayModifyDTO) {
        StatusCode statusCode = userService.modifyBirthDay(birthdayModifyDTO);
        return ResponseDto.response(statusCode);
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<ResponseDto> delete(@PathVariable("userId") int userId){
        //System.out.println("DELETE USER");
        StatusCode statusCode = userService.deleteUser(userId);
        //유저 삭제하고
        return ResponseDto.response(statusCode);
    }

    @PostMapping("/creditLog")
    public ResponseEntity<ResponseDto> insertCLog(@RequestBody CreditLogRequestDTO creditLogRequestDTO) {
        StatusCode statusCode = userService.insertCreditLog(creditLogRequestDTO);
        return ResponseDto.response(statusCode);
    }

    @GetMapping("/creditLog/{userId}")
    public ResponseEntity<ResponseDto> getAllCLog(@PathVariable("userId") int userId) {
        List<CreditLogResponseDTO> lst = userService.getAllCreditLog(userId);
        return ResponseDto.response(StatusCode.SUCCESS,lst);
    }

    @PostMapping("/playLog")
    public ResponseEntity<ResponseDto> insertPLog(@RequestBody PlayLogRequestDTO playLogRequestDTO) {
        StatusCode statusCode = userService.insertPlayLog(playLogRequestDTO);
        return ResponseDto.response(statusCode);
    }

    @GetMapping("/playLog/{userId}")
    public ResponseEntity<ResponseDto> getAllPLog(@PathVariable("userId") int userId) {
        List<PlayLogResponseDTO> lst = userService.getAllPlayLog(userId);
        return ResponseDto.response(StatusCode.SUCCESS, lst);
    }

    @GetMapping("/mission/{userId}")
    public ResponseEntity<ResponseDto> missionCheck(@PathVariable("userId")int userId){
        boolean isCleared = userService.todayMissionCheck(userId);
        return ResponseDto.response(StatusCode.SUCCESS, isCleared);
    }

    @PostMapping("/mission/{userId}")
    public ResponseEntity<ResponseDto> missionAccomplish(@PathVariable("userId")int userId){
        userService.missionAccomplished(userId);
        return ResponseDto.response(StatusCode.SUCCESS);
    }

    @GetMapping("/find")
    public ResponseEntity<ResponseDto> findUserNickname(@RequestBody List<Integer> userIds){
        HashMap<Integer,String> hmap = userService.rankUserResponse(userIds);
        return ResponseDto.response(StatusCode.SUCCESS,hmap);
    }


}
