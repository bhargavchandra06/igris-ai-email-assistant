package com.email.writer.prompt;

import com.email.writer.context.EmailContext;
import com.email.writer.email.service.EmailOperation;
import org.springframework.stereotype.Component;

@Component
public class TonePromptStrategy implements PromptStrategy {

	@Override
	public EmailOperation operation() {
		return EmailOperation.TONE;
	}

	@Override
	public String buildPrompt(EmailContext context) {
		return """
				You are an expert email editor.
				Rewrite the email in the target tone while preserving meaning, facts, and structure.

				Target tone: %s
				Email content:
				%s

				%s
				""".formatted(
				PromptSupport.tone(context),
				context.content(),
				PromptSupport.responseContract()
		);
	}
}
