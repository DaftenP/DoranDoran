package com.tutor.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tutor.dto.MessageDTO;
import com.tutor.dto.TutorResponse;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.*;
import org.springframework.data.redis.core.ListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * RedisChatMemory
 * Redis를 이용한 ChatMemory 커스텀 구현체
 */
@Component
public class RedisChatMemory implements ChatMemory {

    private final ListOperations<String, MessageDTO> listOperations;
    private final ObjectMapper objectMapper;
    private static final String REDIS_KEY = "chat:memory";
    private static final long TTL_IN_SECONDS = 60 * 60 * 24; // 1주일

    public RedisChatMemory(RedisTemplate<String, MessageDTO> redisTemplate) {
        this.listOperations = redisTemplate.opsForList();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void add(String conversationId, Message message) {
        String key = REDIS_KEY + ":" + conversationId;

        MessageDTO messageDTO = null;
        try {
            messageDTO = ConvertMessageDTO(message);
        } catch (JsonProcessingException e) {
            throw new RuntimeException(e);
        }

        // TTL 설정
        listOperations.getOperations().expire(key, TTL_IN_SECONDS, TimeUnit.SECONDS);
        listOperations.rightPush(key, messageDTO);
    }

    private MessageDTO ConvertMessageDTO(Message message) throws JsonProcessingException {
        MessageType messageType = message.getMessageType();
        String content = message.getContent();

        if(messageType == MessageType.ASSISTANT){
            TutorResponse tutorResponse = objectMapper.readValue(content, TutorResponse.class);
            content = tutorResponse.getTutorResponse();
        }

        MessageDTO messageDTO = MessageDTO.builder()
                .messageType(messageType)
                .content(content)
                .build();

        return messageDTO;
    }

    @Override
    public void add(String conversationId, List<Message> messages) {
        String key = REDIS_KEY + ":" + conversationId;

        List<MessageDTO> messagesDTO = new ArrayList<>();
        for (Message message : messages) {
            MessageDTO messageDTO = null;
            try {
                messageDTO = ConvertMessageDTO(message);
            } catch (JsonProcessingException e) {
                throw new RuntimeException(e);
            }
            messagesDTO.add(messageDTO);
        }

        // TTL 설정
        listOperations.getOperations().expire(key, TTL_IN_SECONDS, TimeUnit.SECONDS);
        listOperations.rightPushAll(key, messagesDTO);
    }

    @Override
    public List<Message> get(String conversationId, int lastN) {
        String key = REDIS_KEY + ":" + conversationId;
        long size = listOperations.size(key);
        long start = Math.max(size - lastN, 0);
        List<Message> ret = new ArrayList<>();

        if(size == 0) {
            return ret;
        }

        List<MessageDTO> messagesDTO = listOperations.range(key, start, size - 1);
        for (MessageDTO messageDTO : messagesDTO) {
            MessageType messageType = messageDTO.getMessageType();
            String content = messageDTO.getContent();

            if (messageType == MessageType.USER) {
                ret.add(new UserMessage(content));
            } else if (messageType == MessageType.SYSTEM) {
                ret.add(new SystemMessage(content));
            } else if (messageType == MessageType.ASSISTANT) {
                ret.add(new SystemMessage(content));
            } else {
                throw new IllegalArgumentException("Unknown message type: " + messageType);
            }
        }
        return ret;
    }

    @Override
    public void clear(String conversationId) {
        String key = REDIS_KEY + ":" + conversationId;
        listOperations.getOperations().delete(key);
    }
}
