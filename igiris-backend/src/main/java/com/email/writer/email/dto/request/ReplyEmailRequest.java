package com.email.writer.email.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ReplyEmailRequest(
		@NotBlank(message = "Original email is required")
		@Size(max = 20_000, message = "Original email must be at most 20000 characters")
		String originalEmail,

		@Size(max = 20_000, message = "Thread context must be at most 20000 characters")
		String threadContext,

		@Size(max = 2_000, message = "Reply instruction must be at most 2000 characters")
		String replyInstruction,

		Tone tone
) {
}
