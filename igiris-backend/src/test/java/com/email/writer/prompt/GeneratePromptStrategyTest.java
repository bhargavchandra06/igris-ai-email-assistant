package com.email.writer.prompt;

import static org.assertj.core.api.Assertions.assertThat;

import com.email.writer.context.EmailContext;
import com.email.writer.email.service.EmailOperation;
import com.email.writer.email.dto.request.Tone;
import org.junit.jupiter.api.Test;

class GeneratePromptStrategyTest {

	private final GeneratePromptStrategy strategy = new GeneratePromptStrategy();

	@Test
	void operationReturnsGenerate() {
		assertThat(strategy.operation()).isEqualTo(EmailOperation.GENERATE);
	}

	@Test
	void buildPromptIncludesRequestToneRecipientContextAdditionalContextAndContract() {
		EmailContext context = context(
				Tone.FRIENDLY,
				"Invite Sarah to the Friday planning meeting",
				"Sarah leads product operations",
				"Keep it brief and include the 10 AM time"
		);

		String prompt = strategy.buildPrompt(context);

		assertThat(prompt)
				.contains("You are an expert email writing assistant.")
				.contains("Write a complete email from the user's request.")
				.contains("Tone: FRIENDLY")
				.contains("User request: Invite Sarah to the Friday planning meeting")
				.contains("Recipient context: Sarah leads product operations")
				.contains("Additional context: Keep it brief and include the 10 AM time")
				.contains("Return only valid JSON with this exact shape:")
				.contains("\"subject\": \"string or null\"")
				.contains("\"body\": \"string or null\"")
				.contains("\"tone\": \"PROFESSIONAL, FRIENDLY, FORMAL, CASUAL, or null\"")
				.contains("\"warnings\": [\"short warning strings if needed\"]")
				.contains("Do not include markdown fences, explanations, or extra keys.");
	}

	@Test
	void buildPromptUsesFallbacksWhenOptionalContextIsNullOrBlank() {
		EmailContext context = context(
				null,
				"Send a follow-up note",
				null,
				"   "
		);

		String prompt = strategy.buildPrompt(context);

		assertThat(prompt)
				.contains("Tone: the original tone")
				.contains("User request: Send a follow-up note")
				.contains("Recipient context: Not provided")
				.contains("Additional context: Not provided");
	}

	private EmailContext context(
			Tone tone,
			String prompt,
			String recipientContext,
			String additionalContext
	) {
		return new EmailContext(
				EmailOperation.GENERATE,
				tone,
				null,
				prompt,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				additionalContext,
				recipientContext,
				null,
				false
		);
	}
}
