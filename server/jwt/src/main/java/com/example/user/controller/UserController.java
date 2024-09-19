package com.example.user.controller;

import com.example.common.ResponseDto;
import com.example.common.exception.StatusCode;
import com.example.user.dto.MyPageResponseDTO;
import com.example.user.dto.UserLoginDTO;
import com.example.user.dto.UserRequestDTO;
import com.example.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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


    @DeleteMapping("/delete")
    public ResponseEntity<ResponseDto> delete(@RequestParam("userId") int userId){
        //System.out.println("DELETE USER");
        StatusCode statusCode = userService.deleteUser(userId);
        //유저 삭제하고
        return ResponseDto.response(statusCode);
    }

    @PostMapping("/init")
    public void init(){
        //System.out.println("INIT");
        userService.init();
    }

}
