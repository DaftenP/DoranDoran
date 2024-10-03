package com.tutor.util;

import org.springframework.ai.chat.client.AdvisedRequest;
import org.springframework.ai.chat.client.advisor.AbstractChatMemoryAdvisor;
import org.springframework.ai.chat.memory.ChatMemory;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.MessageType;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.model.Content;
import reactor.core.publisher.Flux;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * AbstractChatMemoryAdvisor 커스텀 구현체
 * 사용자의 입력을 대화 이력에 추가하고, 시스템 텍스트에 대화 이력을 추가하는 Advisor
 */
public class CustomPromptChatMemoryAdvisor extends AbstractChatMemoryAdvisor<ChatMemory> {

    private static final String DEFAULT_SYSTEM_TEXT_ADVISE = """

			Use the conversation memory from the MEMORY section to provide accurate answers.

			---------------------
			MEMORY:
			{memory}
			---------------------

			""";

    private final String systemTextAdvise;

    public CustomPromptChatMemoryAdvisor(ChatMemory chatMemory) {
        this(chatMemory, DEFAULT_SYSTEM_TEXT_ADVISE);
    }

    public CustomPromptChatMemoryAdvisor(ChatMemory chatMemory, String systemTextAdvise) {
        super(chatMemory);
        this.systemTextAdvise = systemTextAdvise;
    }

    public CustomPromptChatMemoryAdvisor(ChatMemory chatMemory, String defaultConversationId, int chatHistoryWindowSize) {
        super(chatMemory, defaultConversationId, chatHistoryWindowSize);
        this.systemTextAdvise = DEFAULT_SYSTEM_TEXT_ADVISE;
    }


    public CustomPromptChatMemoryAdvisor(ChatMemory chatMemory, String defaultConversationId, int chatHistoryWindowSize,
                                         String systemTextAdvise) {
        super(chatMemory, defaultConversationId, chatHistoryWindowSize);
        this.systemTextAdvise = systemTextAdvise;
    }

    @Override
    public AdvisedRequest adviseRequest(AdvisedRequest request, Map<String, Object> context) {

        // 1. Advise system parameters.
        List<Message> memoryMessages = this.getChatMemoryStore()
                .get(this.doGetConversationId(context), this.doGetChatMemoryRetrieveSize(context));

        String memory = (memoryMessages != null) ? memoryMessages.stream()
                .filter(m -> m.getMessageType() == MessageType.USER || m.getMessageType() == MessageType.ASSISTANT)
                .map(m -> m.getMessageType() + ":" + ((Content) m).getContent())
                .collect(Collectors.joining(System.lineSeparator())) : "";

        Map<String, Object> advisedSystemParams = new HashMap<>(request.systemParams());
        advisedSystemParams.put("memory", memory);

        // 2. Advise the system text.
        String advisedSystemText = request.systemText() + System.lineSeparator() + this.systemTextAdvise;

        // 3. Create a new request with the advised system text and parameters.
        AdvisedRequest advisedRequest = AdvisedRequest.from(request)
                .withSystemText(advisedSystemText)
                .withSystemParams(advisedSystemParams)
                .build();

        // 4. Add the new user input to the conversation memory.
        UserMessage userMessage = new UserMessage(request.userText(), request.media());
        this.getChatMemoryStore().add(this.doGetConversationId(context), userMessage);

        return advisedRequest;
    }

    @Override
    public ChatResponse adviseResponse(ChatResponse chatResponse, Map<String, Object> context) {

        List<Message> assistantMessages = chatResponse.getResults().stream().map(g -> (Message) g.getOutput()).toList();

        this.getChatMemoryStore().add(this.doGetConversationId(context), assistantMessages);

        return chatResponse;
    }
}
