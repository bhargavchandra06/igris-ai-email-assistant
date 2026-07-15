package com.email.writer.prompt;

import com.email.writer.context.EmailContext;
import com.email.writer.email.service.EmailOperation;
import org.springframework.stereotype.Component;

@Component
public class ReplyPromptStrategy implements PromptStrategy {

	@Override
	public EmailOperation operation() {
		return EmailOperation.REPLY;
	}

	@Override
	public String buildPrompt(EmailContext context) {
		return """
				You are an expert email writing assistant.
				Draft a reply to the original email. Be relevant, concise, and avoid inventing facts.

				Tone: %s
				Reply instruction: %s
				Thread context: %s
				Original email:
				%s

				%s
				""".formatted(
				PromptSupport.tone(context),
				PromptSupport.valueOrDefault(context.replyInstruction(), "Reply appropriately to the email."),
				PromptSupport.valueOrDefault(context.threadContext(), "Not provided"),
				context.originalEmail(),
				PromptSupport.responseContract()
		);
	}
}
