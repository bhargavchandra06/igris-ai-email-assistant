package com.email.writer.exception;

import java.time.Instant;
import java.util.List;

public record ErrorResponse(
		Instant timestamp,
		int status,
		String error,
		String message,
		String path,
		String requestId,
		List<String> validationErrors
) {
	public ErrorResponse {
		validationErrors = validationErrors == null ? List.of() : List.copyOf(validationErrors);
	}
}
