package com.e102.quiz.service;


import com.e102.quiz.common.exception.RestApiException;
import com.e102.quiz.common.exception.StatusCode;
import com.e102.quiz.dto.PlayLogRequestDTO;
import com.e102.quiz.entity.PlayLog;
import com.e102.quiz.repository.PlayLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class PlayLogService {

    private final PlayLogRepository playLogRepository;


    public StatusCode addLog(PlayLogRequestDTO playLogRequestDTO, int xp) {

        PlayLog playLog = PlayLog.builder()
                .xp(xp)
                .userId(playLogRequestDTO.getUser_id())
                .quizId(playLogRequestDTO.getQuiz_id())
                .build();

        try {
            playLogRepository.save(playLog);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RestApiException(StatusCode.INTERNAL_SERVER_ERROR);
        }
        //실제 로그에 저장
        return StatusCode.LOG_REGISTER;

    }

    public List<PlayLog> getLogs(int userId) {
        return playLogRepository.findByUserIdOrderByIdDesc(userId);
    }

}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       