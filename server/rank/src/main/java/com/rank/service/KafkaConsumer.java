package com.rank.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rank.dto.XpUpdateMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumer {

    private final RankService rankService;
    private final ObjectMapper objectMapper;
    /**
     * Kafka 메시지로 XP 업데이트
     * @param String
     */
    @KafkaListener(topics = "topic-rank-updateXP", groupId = "group-rank-updateXP")
    public void consume(String kafkaMessage){
        log.info("Consumed message: {}", kafkaMessage);

        try {
            XpUpdateMessage message = objectMapper.readValue(kafkaMessage, XpUpdateMessage.class);
            rankService.updateXP(message.getUserId(), message.getXp());
        } catch (Exception e) {
            log.error("Error occurred while consuming message: {}", kafkaMessage);
        }

    }
}
