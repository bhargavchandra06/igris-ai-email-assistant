package com.email.writer.email.dto.response;

import com.email.writer.email.service.EmailOperation;
import com.email.writer.email.dto.request.Tone;
import java.time.Instant;
import java.util.List;

public record EmailResponse(
		EmailOperation operation,
		String subject,
		String body,
		Tone tone,
		List<String> warnings,
		Instant generatedAt
) {
	public EmailResponse {
		warnings = warnings == null ? List.of() : List.copyOf(warnings);
		generatedAt = generatedAt == null ? Instant.now() : generatedAt;
	}
}
