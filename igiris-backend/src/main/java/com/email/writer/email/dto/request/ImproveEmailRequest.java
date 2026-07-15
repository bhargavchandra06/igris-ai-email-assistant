package com.email.writer.email.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ImproveEmailRequest(
		@NotBlank(message = "Draft is required")
		@Size(max = 20_000, message = "Draft must be at most 20000 characters")
		String draft,

		@Size(max = 2_000, message = "Improvement instruction must be at most 2000 characters")
		String improvementInstruction,

		Tone tone
) {
}
