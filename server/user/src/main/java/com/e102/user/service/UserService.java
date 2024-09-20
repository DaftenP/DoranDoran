package com.e102.user.service;

import com.e102.common.exception.StatusCode;
import com.e102.log.dto.CreditLogRequestDTO;
import com.e102.log.dto.CreditLogResponseDTO;
import com.e102.log.entity.CreditLog;
import com.e102.user.dto.MyPageResponseDTO;
import com.e102.user.dto.UserLoginDTO;
import com.e102.user.dto.UserRequestDTO;
import com.e102.user.entity.User;
import com.e102.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.ArrayList;
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

    public MyPageResponseDTO findMyPageById(int userId){
        User sUser = userRepository.findById(userId);
        //유저 뽑고
        //System.out.println("USER");
        //System.out.println(sUser);

        MyPageResponseDTO myPageResponseDTO = MyPageResponseDTO.builder()
                .nickname(sUser.getEmail())
                .email(sUser.getEmail())
                .xp(sUser.getXp())
                .character(sUser.getCharacter())
                .avatar(sUser.getAvatar())
                .voice(sUser.getVoice())
                .gem(sUser.getGem())
                .rank(sUser.getRank())
                .build();

        return myPageResponseDTO;
    }

    public void init(){

        User sUser = userRepository.findById(1);

        for(int i=0;i<=10;i++){
            sUser.getItems().put(i,i);
        }

        userRepository.save(sUser);
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

        sUser.setPassword(encryptedPassword);
        //System.out.println("SID : " + sUser.getId());
        //System.out.println("RAW - PASSWORD : " + rawPassword);

        //userRepository.resetPasswordById(sUser.getId(),"1234");
        //유저 비밀번호 업데이트

        return rawPassword;

        //return new ResponseDto(StatusCode.RESET_SUCCESS,encryptedPassword);

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

    //해당하는 유저의
    public List<CreditLogResponseDTO> getAllLog(int userId){
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

    public StatusCode insertLog(CreditLogRequestDTO creditLogRequestDTO){
        User sUser = userRepository.findById(creditLogRequestDTO.getUserId());
        if(sUser != null){

            CreditLog creditLog = CreditLog.builder()
                    .user(sUser)
                    .logTypes(creditLogRequestDTO.getLogTypes())
                    .changes(creditLogRequestDTO.getChanges())
                    .build();


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

}
