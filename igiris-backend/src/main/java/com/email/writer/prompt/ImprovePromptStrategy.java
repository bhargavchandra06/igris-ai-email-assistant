package com.email.writer.prompt;

import com.email.writer.context.EmailContext;
import com.email.writer.email.service.EmailOperation;
import org.springframework.stereotype.Component;

@Component
public class ImprovePromptStrategy implements PromptStrategy {

	@Override
	public EmailOperation operation() {
		return EmailOperation.IMPROVE;
	}

	@Override
	public String buildPrompt(EmailContext context) {
		return """
				You are an expert email editor.
				Improve the draft while preserving the sender's intent.

				Target tone: %s
				Improvement instruction: %s
				Draft:
				%s

				%s
				""".formatted(
				PromptSupport.tone(context),
				PromptSupport.valueOrDefault(context.improvementInstruction(), "Improve clarity, flow, and concision."),
				context.draft(),
				PromptSupport.responseContract()
		);
	}
}
