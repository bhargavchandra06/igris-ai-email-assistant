package com.email.writer.ai;

import com.email.writer.exception.AiProviderException;
import org.springframework.stereotype.Component;

@Component
public class UnavailableEmailAiClient implements EmailAiClient {//automate ec2 deployment

	@Override
	public String generate(String prompt) {
		throw new AiProviderException("AI client is not configured. Set GEMINI_API_KEY before using email generation APIs.");
	}
}
