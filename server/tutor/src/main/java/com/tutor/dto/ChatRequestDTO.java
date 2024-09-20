package com.tutor.dto;

import lombok.Data;

import java.util.List;

@Data
public class ChatRequestDTO {
    private List<MessageDTO> messages;
    private MessageDTO userMessage;
}
