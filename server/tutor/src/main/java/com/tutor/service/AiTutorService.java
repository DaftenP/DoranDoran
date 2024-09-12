package com.tutor.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class AiTutorService {

        public String init() {
            log.info("init");
            return "init";
        }

        public String send() {
            log.info("send");
            return "send";
        }

        public String pronunciation() {
            log.info("pronunciation");
            return "pronunciation";
        }

        public String tts() {
            log.info("tts");
            return "tts";
        }

}
