package com.example.log.service;

import com.example.log.repository.PlayLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PlayLogService {

    private final PlayLogRepository playLogRepository;

    @Autowired
    public PlayLogService(PlayLogRepository playLogRepository) {
        this.playLogRepository = playLogRepository;
    }


}
