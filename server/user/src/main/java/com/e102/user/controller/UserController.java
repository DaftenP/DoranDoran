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


    /**
     * nickname, email, password로 유저의 정보를 DB에 등록한다.
     * @param userRequestDTO
     * @return 해당하는 StatusCode를 반환한다.
     */

    @PostMapping("/regist")
    public ResponseEntity<ResponseDto> regist(@RequestBody UserRequestDTO userRequestDTO){
        StatusCode statusCode = userService.registUser(userRequestDTO);
        if (statusCode.equals(StatusCode.REG_SUCCESS)) {
            int userId = userService.getUserId(userRequestDTO.getEmail());
            return ResponseDto.response(statusCode, userId);
        } else {
            return ResponseDto.response(statusCode);
        }
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

    /**
     * 유저의 상세정보를 조회한다.
     * @param userId
     * @return 해당하는 StatusCode를 반환한다.
     */

    @GetMapping("/my-page/user/{userId}")
    public ResponseEntity<ResponseDto> viewUser(@PathVariable("userId") int userId){
        MyPageResponseDTO myPageResponseDTO = userService.findMyPageById(userId);
        return ResponseDto.response(StatusCode.SUCCESS,myPageResponseDTO);
    }

    /**
     * userId에 해당하는 유저 이전 PW와 변경 PW 비교한다.
     * @param passwordModifyDTO
     * @return 해당하는 StatusCode를 반환한다.
     */

    @PatchMapping("/my-page/password")
    public ResponseEntity<ResponseDto> modUserPassword(@RequestBody PasswordModifyDTO passwordModifyDTO) {
        StatusCode statusCode = userService.modifyPassWord(passwordModifyDTO);
        return ResponseDto.response(statusCode);
    }

    /**
     * userId에 해당하는 유저 Nickname 변경한다.
     * @param nicknameModifyDTO
     * @return 해당하는 StatusCode를 반환한다.
     */

    @PatchMapping("/my-page/nickname")
    public ResponseEntity<ResponseDto> modUserNickname(@RequestBody NicknameModifyDTO nicknameModifyDTO) {
        StatusCode statusCode = userService.modifyNickname(nicknameModifyDTO);
        return ResponseDto.response(statusCode);
    }

    /**
     * userId에 해당하는 유저 BirthDay 변경한다.
     * @param birthdayModifyDTO
     * @return 해당하는 StatusCode를 반환한다.
     */

    @PatchMapping("/my-page/birthday")
    public ResponseEntity<ResponseDto> modUserBirthday(@RequestBody BirthdayModifyDTO birthdayModifyDTO) {
        StatusCode statusCode = userService.modifyBirthDay(birthdayModifyDTO);
        return ResponseDto.response(statusCode);
    }

    /**
     * userId에 해당하는 유저 정보를 삭제한다.
     * @param userId
     * @return 해당하는 StatusCode를 반환한다.
     */

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<ResponseDto> delete(@PathVariable("userId") int userId){
        //System.out.println("DELETE USER");
        StatusCode statusCode = userService.deleteUser(userId);
        //유저 삭제하고
        return ResponseDto.response(statusCode);
    }

    /**
     * 해당하는 유저에게 크레딧 로그 넣어준다.
     * @param creditLogRequestDTO
     * @return 해당하는 StatusCode를 반환한다.
     */

    @PostMapping("/credit-log")
    public ResponseEntity<ResponseDto> insertCLog(@RequestBody CreditLogRequestDTO creditLogRequestDTO) {
        StatusCode statusCode = userService.insertCreditLog(creditLogRequestDTO);
        return ResponseDto.response(statusCode);
    }

    /**
     * 유저가 가지고 있는 모든 크레딧 로그 가져온다.
     * @param userId
     * @return 해당하는 StatusCode를 반환한다.
     */

    @GetMapping("/credit-log/{userId}")
    public ResponseEntity<ResponseDto> getAllCLog(@PathVariable("userId") int userId) {
        List<CreditLogResponseDTO> lst = userService.getAllCreditLog(userId);
        return ResponseDto.response(StatusCode.SUCCESS,lst);
    }

    /**
     * 플레이 로그를 삽입한다.
     * @param playLogRequestDTO
     * @return 해당하는 StatusCode를 반환한다.
     */

    @PostMapping("/play-log/submit")
    public ResponseEntity<ResponseDto> insertPLog(@RequestBody PlayLogRequestDTO playLogRequestDTO) {
        StatusCode statusCode = userService.insertPlayLog(playLogRequestDTO);
        return ResponseDto.response(statusCode);
    }

    /**
     * 유저가 가지고 있는 모든 플레이 로그 반환한다
     * @param userId
     * @return 해당하는 StatusCode를 반환한다.
     */

    @GetMapping("/play-log/{userId}")
    public ResponseEntity<ResponseDto> getAllPLog(@PathVariable("userId") int userId) {
        List<PlayLogResponseDTO> lst = userService.getAllPlayLog(userId);
        return ResponseDto.response(StatusCode.SUCCESS, lst);
    }

    /**
     * 데일리 미션 수행 시 호출됨
     * @param playLogRequestDTO
     * @return 해당하는 StatusCode를 반환한다.
     */

    @PostMapping("/daily")
    public ResponseEntity<ResponseDto> insertMission(@RequestBody PlayLogRequestDTO playLogRequestDTO){
        StatusCode statusCode = userService.solveDaily(playLogRequestDTO);
        return ResponseDto.response(statusCode);
        //statusCode 리턴
    }

    /**
     * BFF에서 userId를 통해 user의 nickName을 반환하게 한다.
     * @param userIds
     * @return 해당하는 StatusCode를 반환한다.
     */

    @GetMapping("/find")
    public ResponseEntity<ResponseDto> findUserNickname(@RequestBody List<Integer> userIds){
        HashMap<Integer,String> hmap = userService.rankUserResponse(userIds);
        return ResponseDto.response(StatusCode.SUCCESS,hmap);
    }

    /**
     * XP와 GEM을 업데이트 할 userId를 받아 해당 유저를 업데이트 한다.
     * @param gemXpModifyDTO
     * @return 해당하는 StatusCode를 반환한다.
     */
    
    @PutMapping("/xp/update")
    public ResponseEntity<ResponseDto> modifyUserGemXp(@RequestBody GemXpModifyDTO gemXpModifyDTO){
        StatusCode statusCode = userService.modifyGX(gemXpModifyDTO);
        return ResponseDto.response(statusCode);
    }

    /**
     * 해당하는 유저의 Item 목록에 유저를 추가한다.
     * @param itemRequestDTO
     * @return 해당하는 StatusCode를 반환한다.
     */

    @PostMapping("/item/buy")
    public ResponseEntity<ResponseDto> buyItem(@RequestBody ItemRequestDTO itemRequestDTO){
        StatusCode statusCode = userService.buyItem(itemRequestDTO);
        return ResponseDto.response(statusCode);
    }

    /**
     * 해당하는 유저의 보유 Item 목록을 모두 들고온다.
     * @param userId
     * @return 해당하는 StatusCode를 반환한다.
     */

    @GetMapping("/item/{userId}")
    public ResponseEntity<ResponseDto> getItem(@PathVariable int userId){
        List<ItemResponseDTO> lst = userService.getItems(userId);
        return ResponseDto.response(StatusCode.SUCCESS, lst);
    }

    /**
     * 해당하는 유저가 아이템을 착용한다.
     * @param clothRequestDTO
     * @return 해당하는 StatusCode를 반환한다.
     */

    @PatchMapping("/cloth")
    public ResponseEntity<ResponseDto> modifyCloth(@RequestBody ClothRequestDTO clothRequestDTO) {
        StatusCode statusCode = userService.dressCloth(clothRequestDTO);
        return ResponseDto.response(statusCode);
    }

    /**
     * 유저가 플레이하는 스테이지를 상승한다.
     * @param userId
     * @return 해당하는 StatusCode를 반환한다.
     */

    @PatchMapping("/stage/inc/{userId}")
    public ResponseEntity<ResponseDto> increaseStage(@PathVariable int userId) {
        StatusCode statusCode = userService.increase(userId);
        return ResponseDto.response(statusCode);
    }
}
