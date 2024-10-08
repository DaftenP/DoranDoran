package com.rank.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rank.dto.XpUpdateMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class KafkaConsumer {

    private final RankService rankService;
    private final ObjectMapper objectMapper;
    /**
     * Kafka 메시지로 XP 업데이트
     * @param updateXPMessage
     */
    @KafkaListener(topics = "topic-rank-updateXP", groupId = "group-rank-updateXP")
    public void consumeUpdateXP(String updateXPMessage) {
        log.info("Consumed message: {}", updateXPMessage);

        try {
            XpUpdateMessage message = objectMapper.readValue(updateXPMessage, XpUpdateMessage.class);
            rankService.updateXP(message.getUserId(), message.getXp());
        } catch (Exception e) {
            log.error("Error occurred while consuming message: {}", updateXPMessage);
        }
    }

    @KafkaListener(topics="topic-rank-placement", groupId="group-rank-placement")
    public void consumePlacement(String placementMessage){
        log.info("Consumed message: {}", placementMessage);

        try {
            Map<String, Integer> message = objectMapper.readValue(placementMessage, Map.class);

            Long userId = message.get("userId").longValue();

            rankService.placement(userId);
        } catch (Exception e) {
            log.error("Error occurred while consuming message: {}", placementMessage);
        }
    }
}
