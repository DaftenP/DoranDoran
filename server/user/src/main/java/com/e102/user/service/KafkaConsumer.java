package com.e102.user.service;

import com.e102.user.dto.GemXpModifyDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumer {
    private final UserService userService;
    private final ObjectMapper objectMapper;

    @KafkaListener(topics = "topic-user-updateXP", groupId = "group-user-updateXP")
    public void consume(String kafkaMessage) {
        log.info("Consumed message: {} ", kafkaMessage);

        try {
            GemXpModifyDTO message = objectMapper.readValue(kafkaMessage, GemXpModifyDTO.class);
            log.info("Consumed message: {} ", message);
            userService.modifyGX(message);
        } catch (Exception e) {
            log.error("Error occurred while consuming message: {}", kafkaMessage);
        }

    }


}
