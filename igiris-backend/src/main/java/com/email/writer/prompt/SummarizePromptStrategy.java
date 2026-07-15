package com.email.writer.prompt;

import com.email.writer.context.EmailContext;
import com.email.writer.email.service.EmailOperation;
import org.springframework.stereotype.Component;

@Component
public class SummarizePromptStrategy implements PromptStrategy {

	@Override
	public EmailOperation operation() {
		return EmailOperation.SUMMARIZE;
	}

	@Override
	public String buildPrompt(EmailContext context) {
		return """
				You are an expert email assistant.
				Summarize the email or email thread accurately. Highlight commitments, deadlines, and action items when present.

				Summary style: %s
				Focus: %s
				Content:
				%s

				%s
				For this operation, set subject to null and put the summary in body.
				""".formatted(
				context.summaryStyle(),
				PromptSupport.valueOrDefault(context.focus(), "General summary"),
				context.content(),
				PromptSupport.responseContract()
		);
	}
}
