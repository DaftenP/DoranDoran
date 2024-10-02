package com.e102.user.service;

import com.e102.common.exception.StatusCode;
import com.e102.log.dto.CreditLogRequestDTO;
import com.e102.log.dto.CreditLogResponseDTO;
import com.e102.log.dto.PlayLogRequestDTO;
import com.e102.log.dto.PlayLogResponseDTO;
import com.e102.log.entity.CreditLog;
import com.e102.log.entity.PlayLog;
import com.e102.user.dto.*;
import com.e102.user.entity.User;
import com.e102.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Random;

@Transactional
@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Transactional
    @Scheduled(cron = "0 0 0 * * ?")
    //@Scheduled(cron = "0 * * * * *") // for test 1분 마다 실행
    public void resetDailyMission(){
        List<User> allUser = userRepository.findAll();
        //유저 Daily Mission과 시도 횟수 삭제
        for(User u : allUser){
            u.resetDailyStatus();
        }
    }

    @Transactional
    @Scheduled(cron = "0 0 0 * * MON")
    //@Scheduled(cron = "0 * * * * *") // for test 1분 마다 실행
    public void resetWeeklyMission(){
        List<User> allUser = userRepository.findAll();

        //유저 Weekly Mission 초기화
        for(User u : allUser){
            u.resetWeeklyStatus();
        }
    }

    @Transactional
    public HashMap<Integer,String> rankUserResponse(List<Integer> reqLst){
        HashMap<Integer,String> hmap = new HashMap<>();
        List<User> users = userRepository.findByIdIn(reqLst);
        // User 정보를 RankUserResponseDTO로 변환하여 lst에 추가
        for (User user : users) {
            hmap.put(user.getId(),user.getNickname());
        }
        return hmap;
    }


    public MyPageResponseDTO findMyPageById(int userId){
        User sUser = userRepository.findById(userId);

        MyPageResponseDTO myPageResponseDTO = MyPageResponseDTO.builder()
                .nickname(sUser.getNickname())
                .email(sUser.getEmail())
                .xp(sUser.getXp())
                .color(sUser.getColor())
                .equipment(sUser.getEquipment())
                .background(sUser.getBackground())
                .gem(sUser.getGem())
                .dailyStatus(sUser.getDailyStatus())
                .status(sUser.statusToBit())
                .birthday(sUser.getBirthDay())
                .pSize(sUser.getPlayLogList().size())
                .build();
        return myPageResponseDTO;
    }

    public String resetPassword(String email){
        //System.out.println("reset CALLEED");
        User sUser = userRepository.findByEmail(email);

        //System.out.println(sUser);
        if(sUser == null){
            return null;
            //return new ResponseDto(StatusCode.NOT_FOUND);
        }
        // 비밀번호 길이 설정
        int passwordLength = 12; // 원하는 비밀번호 길이

        // 비밀번호 생성기 초기화
        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        Random random = new SecureRandom(); // 보안적으로 더 안전한 랜덤 생성기
        StringBuilder sb = new StringBuilder(passwordLength);

        for (int i = 0; i < passwordLength; i++) {
            int index = random.nextInt(characters.length());
            sb.append(characters.charAt(index));
        }
        //랜덤 패스워드 생성

        String rawPassword = sb.toString();

        String encryptedPassword = bCryptPasswordEncoder.encode(rawPassword);

        sUser.modPassword(encryptedPassword);

        return rawPassword;
    }

    public StatusCode registUser(UserRequestDTO userRequestDTO){
        User sUser = userRepository.findByEmail(userRequestDTO.getEmail());
        //찾은 유저
        if (sUser == null){
            User newUser = new User(userRequestDTO.getNickname(), userRequestDTO.getEmail(),
                    bCryptPasswordEncoder.encode(userRequestDTO.getPassword()));

            userRepository.save(newUser);
            //유저 저장한다.
            return StatusCode.REG_SUCCESS;
        }
        else{
            return StatusCode.DUPLICATE_EMAIL;
        }
    }

    public StatusCode deleteUser(int userId){
        User sUser = userRepository.findById(userId);

        if(sUser == null){
            return StatusCode.NO_EMAIL;
        }
        else{
            userRepository.deleteById(sUser.getId());
            //해당하는 유저 지운다
            return StatusCode.DROP_SUCCESS;
        }
    }

    public StatusCode duplicateUser(String email){
        User sUser = userRepository.findByEmail(email);
        if(sUser == null){
            return StatusCode.REG_DUP_OK;
        }
        else{
            return StatusCode.DUPLICATE_EMAIL;
        }
    }

    public List<CreditLogResponseDTO> getAllCreditLog(int userId) {
        User sUser = userRepository.findById(userId);
        List<CreditLogResponseDTO> lst = new ArrayList<>();
        if(sUser != null){
            for(CreditLog creditLog : sUser.getCreditLogList())
                lst.add(CreditLogResponseDTO.builder()
                        .logTypes(creditLog.getLogTypes())
                        .createdAt(creditLog.getCreatedAt())
                        .changes(creditLog.getChanges())
                        .build());
            }
        //User의 List에 추가한다.
        return lst;
    }



    public List<PlayLogResponseDTO> getAllPlayLog(int userId) {
        User sUser = userRepository.findById(userId);
        List<PlayLogResponseDTO> lst = new ArrayList<>();
        if (sUser != null) {
            for (PlayLog playLog : sUser.getPlayLogList())
                lst.add(PlayLogResponseDTO.builder()
                        .quizType(playLog.getQuizId())
                        .createdAt(playLog.getCreatedAt())
                        .build());
        }
        return lst;
    }

    @Transactional
    public StatusCode insertPlayLog(PlayLogRequestDTO playLogRequestDTO) {
        User sUser = userRepository.findById(playLogRequestDTO.getUserId());
        if (sUser != null) {

            PlayLog playLog = PlayLog.builder()
                    .puser(sUser)
                    .xp(10) //Dummy Data
                    .quizId(playLogRequestDTO.getQuizId())
                    .build();

            userRepository.updateXpById(playLogRequestDTO.getUserId(), playLogRequestDTO.getQuizId());

            sUser.getPlayLogList().add(playLog);
            //넣고
            userRepository.save(sUser);
            //DB에 반영

            return StatusCode.SUCCESS;

        } else {
            return StatusCode.BAD_REQUEST;
        }
    }

    public StatusCode modifyNickname(NicknameModifyDTO nicknameModifyDTO) {
        User sUser = userRepository.findById(nicknameModifyDTO.getUserId());
        if (sUser != null) {
            sUser.modNickname(nicknameModifyDTO.getNickname());

            return StatusCode.SUCCESS;
        } else {
            return StatusCode.BAD_REQUEST;
        }
    }

    public StatusCode modifyPassWord(PasswordModifyDTO passwordModifyDTO) {
        User sUser = userRepository.findById(passwordModifyDTO.getUserId());
        if (sUser != null) {
            boolean correct = bCryptPasswordEncoder.matches(passwordModifyDTO.getPrevPassword(), sUser.getPassword());
            if (correct) {
                sUser.modPassword(bCryptPasswordEncoder.encode(passwordModifyDTO.getModPassword()));
                return StatusCode.SUCCESS;
            } else {
                return StatusCode.WRONG_PW;
            }
        } else {
            return StatusCode.BAD_REQUEST;
        }
    }

    public StatusCode modifyBirthDay(BirthdayModifyDTO birthdayModifyDTO) {
        User sUser = userRepository.findById(birthdayModifyDTO.getUserId());
        if (sUser != null) {
            sUser.modBirthDay(birthdayModifyDTO.getBirthday());
            return StatusCode.SUCCESS;
        } else {
            return StatusCode.BAD_REQUEST;
        }
    }



    @Transactional
    public StatusCode insertCreditLog(CreditLogRequestDTO creditLogRequestDTO) {
        User sUser = userRepository.findById(creditLogRequestDTO.getUserId());
        if(sUser != null){
            if (sUser.getGem() + creditLogRequestDTO.getChanges() < 0) {
                throw new RuntimeException("not enough GEM");
            }
            CreditLog creditLog = CreditLog.builder()
                    .cuser(sUser)
                    .logTypes(creditLogRequestDTO.getLogTypes())
                    .changes(creditLogRequestDTO.getChanges())
                    .build();

            userRepository.updateGemById(creditLogRequestDTO.getUserId(), creditLogRequestDTO.getChanges());
            sUser.getCreditLogList().add(creditLog);
            //넣고
            userRepository.save(sUser);
            //DB에 반영
            return StatusCode.SUCCESS;
        }
        else{
            return StatusCode.BAD_REQUEST;
        }
    }

    public StatusCode solveDaily(PlayLogRequestDTO playLogRequestDTO){
        User sUser = userRepository.findById(playLogRequestDTO.getUserId());
        if(sUser != null){
            if(sUser.isMissionCleared()){
                //Mission
                return StatusCode.MISSION_DONE;
            }
            else{
                sUser.increaseDaily();
                //하나 증가하고

                PlayLog playLog = PlayLog.builder()
                        .puser(sUser)
                        .xp(10) //Dummy Data
                        .quizId(playLogRequestDTO.getQuizId())
                        .build();

                userRepository.updateXpById(playLogRequestDTO.getUserId(), playLogRequestDTO.getQuizId());

                sUser.getPlayLogList().add(playLog);
                //넣고
                userRepository.save(sUser);
                //DB에 반영

                if(sUser.getDailyStatus() == 10){
                    sUser.todayMissionCleared();
                    //오늘 미션 클리어 처리
                    //50씩 준다 xp, gem
                    return StatusCode.DAILY_CLEARED;
                }
                return StatusCode.SUCCESS;
            }
        }
        else{
            return StatusCode.NO_EMAIL;
        }
    }


    public StatusCode loginUser(UserLoginDTO userLoginDTO){
        User sUser = userRepository.findByEmail(userLoginDTO.getEmail());
        if(sUser != null){
            String encPassword = sUser.getPassword();
            //비밀번호 가져와서 매칭되는지 확인한다.
            boolean match = bCryptPasswordEncoder.matches(userLoginDTO.getPassword(),encPassword);
            if(match){
                return StatusCode.SUCCESS;
            }
            else{
                return StatusCode.WRONG_PW;
            }
        }
        else{
            return StatusCode.NO_EMAIL;
        }
    }

    public StatusCode modifyGX(GemXpModifyDTO gemXpModifyDTO){
        User sUser = userRepository.findById(gemXpModifyDTO.getUserId());

        if(sUser != null){
            sUser.addGem(gemXpModifyDTO.getGem());
            sUser.addXp(gemXpModifyDTO.getXp());
            return StatusCode.SUCCESS;
        }
        else{
            return StatusCode.NO_EMAIL;
        }
    }



}
