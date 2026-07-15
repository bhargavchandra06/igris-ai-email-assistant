package com.email.writer.email.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SubjectRequest(
		@NotBlank(message = "Body is required")
		@Size(max = 20_000, message = "Body must be at most 20000 characters")
		String body,

		Tone tone,

		@Size(max = 2_000, message = "Additional context must be at most 2000 characters")
		String additionalContext
) {
}
