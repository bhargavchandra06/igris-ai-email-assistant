package com.email.writer.prompt;

import com.email.writer.context.EmailContext;
import com.email.writer.email.service.EmailOperation;
import org.springframework.stereotype.Component;

@Component
public class GrammarPromptStrategy implements PromptStrategy {

	@Override
	public EmailOperation operation() {
		return EmailOperation.GRAMMAR;
	}

	@Override
	public String buildPrompt(EmailContext context) {
		return """
				You are an expert email copy editor.
				Fix grammar, spelling, punctuation, and awkward phrasing.
				Preserve tone: %s

				Email content:
				%s

				%s
				""".formatted(
				context.preserveTone(),
				context.content(),
				PromptSupport.responseContract()
		);
	}
}
