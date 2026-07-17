package com.email.writer.ai;

import com.email.writer.exception.AiProviderException;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

@Component
@Primary
public class SpringAiClient implements EmailAiClient { // to test ec2 deployment

	private final ChatClient chatClient;

	public SpringAiClient(ChatClient.Builder chatClientBuilder) {
		this.chatClient = chatClientBuilder.build();
	}

	@Override
	public String generate(String prompt) {
		try {
			String content = chatClient.prompt()
					.user(prompt)
					.call()
					.content();
			if (content == null || content.isBlank()) {
				throw new AiProviderException("AI provider returned an empty response");
			}
			return content;
		}
		catch (AiProviderException ex) {
			throw ex;
		}
		catch (RuntimeException ex) {
			throw new AiProviderException("AI provider request failed", ex);
		}
	}
}
