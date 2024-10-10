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
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.util.*;

@Transactional
@Service
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Autowired
    public UserService(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder, KafkaTemplate<String, Object> kafkaTemplate) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.kafkaTemplate = kafkaTemplate;
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

    public int getUserId(String email) {
        return userRepository.findIdByEmail(email);
    }

    public boolean isUserExists(String email) {
        return userRepository.existsByEmail(email);
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

            Set<ItemKey> items = newUser.getItems();
            ItemKey defaultBird = ItemKey.builder()
                    .itemId(1)
                    .itemType(1)
                    .build();

            ItemKey defaultBackground = ItemKey.builder()
                    .itemId(1)
                    .itemType(3)
                    .build();

            items.add(defaultBird);
            items.add(defaultBackground);

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
                        .gainXp(playLog.getXp())
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

            int xp = 10;
            int gem = 10;

            PlayLog playLog = PlayLog.builder()
                    .puser(sUser)
                    .xp(xp)
                    .quizId(playLogRequestDTO.getQuizId())
                    .build();


            if(userRepository.updateXpById(playLogRequestDTO.getUserId(), xp)> 0 && userRepository.updateGemById(playLogRequestDTO.getUserId(), gem)>0){

                try {
                    // 플레이 로그 추가
                    sUser.getPlayLogList().add(playLog);
                    userRepository.save(sUser);  // 상태 변경 저장

                    // Kafka 메시지 생성 (Map 객체)
                    Map<String, Integer> message = new HashMap<>();
                    message.put("userId", playLogRequestDTO.getUserId());
                    message.put("xp", xp);

                    log.info("KAFKA 메시지 전송");

                    // Kafka 메시지를 동기적으로 전송하여 전송 성공 여부 확인
                    //kafkaTemplate.send("topic-rank-updateXP", message).get();


                } catch (Exception e) {
                    // 카프카 전송 실패 시 예외 발생 -> 트랜잭션 롤백
                    throw new RuntimeException("Kafka 메시지 전송 실패", e);
                }
            }
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

            if(!sUser.isMissionCleared()){
                sUser.increaseDaily();
                //하나 증가하고
            }

            int xp = 10;
            int gem = 10;

            if(sUser.getDailyStatus() == 10){
                sUser.todayMissionCleared();
                //오늘 미션 클리어 처리
                //50씩 준다 xp, gem
                xp += 40;
                gem += 40;
            }
            PlayLog playLog = PlayLog.builder()
                    .puser(sUser)
                    .xp(xp)
                    .quizId(playLogRequestDTO.getQuizId())
                    .build();

                if(userRepository.updateXpById(playLogRequestDTO.getUserId(), xp)> 0 && userRepository.updateGemById(playLogRequestDTO.getUserId(), gem)>0){

                    try {
                        // 플레이 로그 추가
                        sUser.getPlayLogList().add(playLog);
                        userRepository.save(sUser);  // 상태 변경 저장


                        // Kafka 메시지 생성 (Map 객체)
                        Map<String, Integer> message = new HashMap<>();
                        message.put("userId", playLogRequestDTO.getUserId());
                        message.put("xp", xp);

                        log.info("KAFKA 메시지 전송");

                        // Kafka 메시지를 동기적으로 전송하여 전송 성공 여부 확인
                        //kafkaTemplate.send("topic-rank-updateXP", message).get();

                    } catch (Exception e) {
                        // 카프카 전송 실패 시 예외 발생 -> 트랜잭션 롤백
                        throw new RuntimeException("Kafka 메시지 전송 실패", e);
                    }
                }

                if(sUser.getDailyStatus() == 10){
                    return StatusCode.DAILY_CLEARED;
                }
                else{
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

    public StatusCode buyItem(ItemRequestDTO itemRequestDTO){
        User sUser = userRepository.findById(itemRequestDTO.getUserId());
        int price = itemRequestDTO.getPrice();

        if(sUser != null){
            if (price > sUser.getGem()) {
                return StatusCode.NOT_ENOUGH_MONEY;
            } else {
                Set<ItemKey> items = sUser.getItems();
                ItemKey inputKey = ItemKey.builder()
                        .itemId(itemRequestDTO.getItemId())
                        .itemType(itemRequestDTO.getItemType())
                        .build();
                if (items.contains(inputKey)) {
                    sUser.addGem(price * -1);
                    return StatusCode.ALREADY_GET;
                } else {
                    items.add(inputKey);
                    //해당하는 아이템에 넣는다.
                    sUser.addGem(price * -1);
                    return StatusCode.SUCCESS;
                }
            }
        }
        else{
            return StatusCode.NO_EMAIL;
        }
    }

    public List<ItemResponseDTO> getItems(int userId){
        User sUser = userRepository.findById(userId);

        List<ItemResponseDTO> lst = new ArrayList<>();

        if(sUser != null){
            Set<ItemKey> items = sUser.getItems();
            for( ItemKey ik : items ){
                lst.add(
                        ItemResponseDTO.builder()
                                .itemId(ik.getItemId())
                                .itemType(ik.getItemType())
                                .build()
                );
            }
        }
        return lst;
    }

    public StatusCode dressCloth(ClothRequestDTO clothRequestDTO) {
        User sUser = userRepository.findById(clothRequestDTO.getUserId());

        int itemType = clothRequestDTO.getItemType();
        int itemId = clothRequestDTO.getItemId();
        if (itemType == 1) {
            sUser.changeColor(itemId);
        } else if (itemType == 2) {
            sUser.changeEquipment(itemId);
        } else if (itemType == 3) {
            sUser.changeBackground(itemId);
        } else {
            return StatusCode.NOT_FOUND;
        }
        return StatusCode.SUCCESS;
    }

    public StatusCode increase(int userId) {
        User sUser = userRepository.findById(userId);
        sUser.increaseStage();
        return StatusCode.SUCCESS;
    }


}
