package com.email.writer.email.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record GrammarFixRequest(
		@NotBlank(message = "Content is required")
		@Size(max = 20_000, message = "Content must be at most 20000 characters")
		String content,

		boolean preserveTone
) {
}
