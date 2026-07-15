package com.email.writer.email.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ToneChangeRequest(
		@NotBlank(message = "Content is required")
		@Size(max = 20_000, message = "Content must be at most 20000 characters")
		String content,

		@NotNull(message = "Target tone is required")
		Tone targetTone
) {
}
