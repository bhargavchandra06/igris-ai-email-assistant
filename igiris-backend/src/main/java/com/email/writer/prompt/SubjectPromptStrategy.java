package com.email.writer.prompt;

import com.email.writer.context.EmailContext;
import com.email.writer.email.service.EmailOperation;
import org.springframework.stereotype.Component;

@Component
public class SubjectPromptStrategy implements PromptStrategy {

	@Override
	public EmailOperation operation() {
		return EmailOperation.SUBJECT;
	}

	@Override
	public String buildPrompt(EmailContext context) {
		return """
				You are an expert email assistant.
				Generate one clear, specific subject line for this email. Keep it under 70 characters.

				Tone: %s
				Additional context: %s
				Email body:
				%s

				%s
				For this operation, set body to null.
				""".formatted(
				PromptSupport.tone(context),
				PromptSupport.valueOrDefault(context.additionalContext(), "Not provided"),
				context.body(),
				PromptSupport.responseContract()
		);
	}
}
