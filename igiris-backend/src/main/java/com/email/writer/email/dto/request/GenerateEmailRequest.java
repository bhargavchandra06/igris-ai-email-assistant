package com.email.writer.email.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record GenerateEmailRequest(
		@NotBlank(message = "Prompt is required")
		@Size(max = 2_000, message = "Prompt must be at most 2000 characters")
		String prompt,

		Tone tone,

		@Size(max = 500, message = "Recipient context must be at most 500 characters")
		String recipientContext,

		@Size(max = 2_000, message = "Additional context must be at most 2000 characters")
		String additionalContext
) {
}
