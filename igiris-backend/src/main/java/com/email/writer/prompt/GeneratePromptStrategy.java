package com.email.writer.prompt;

import com.email.writer.context.EmailContext;
import com.email.writer.email.service.EmailOperation;
import org.springframework.stereotype.Component;

@Component
public class GeneratePromptStrategy implements PromptStrategy {

	@Override
	public EmailOperation operation() {
		return EmailOperation.GENERATE;
	}

	@Override
	public String buildPrompt(EmailContext context) {
		return """
				You are an expert email writing assistant.
				Write a complete email from the user's request.

				Tone: %s
				User request: %s
				Recipient context: %s
				Additional context: %s

				%s
				""".formatted(
				PromptSupport.tone(context),
				context.prompt(),
				PromptSupport.valueOrDefault(context.recipientContext(), "Not provided"),
				PromptSupport.valueOrDefault(context.additionalContext(), "Not provided"),
				PromptSupport.responseContract()
		);
	}
}
