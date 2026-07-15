package com.email.writer.email.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SummarizeEmailRequest(
		@NotBlank(message = "Content is required")
		@Size(max = 30_000, message = "Content must be at most 30000 characters")
		String content,

		SummaryStyle summaryStyle,

		@Size(max = 1_000, message = "Focus must be at most 1000 characters")
		String focus
) {
}
