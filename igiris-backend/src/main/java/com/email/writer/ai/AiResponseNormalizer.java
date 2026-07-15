package com.email.writer.ai;

import com.email.writer.context.EmailContext;
import com.email.writer.email.service.EmailOperation;
import com.email.writer.email.dto.request.Tone;
import com.email.writer.email.dto.response.EmailResponse;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class AiResponseNormalizer {

	private final ObjectMapper objectMapper;

	public AiResponseNormalizer(ObjectMapper objectMapper) {
		this.objectMapper = objectMapper;
	}

	public EmailResponse normalize(EmailOperation operation, String aiOutput, EmailContext context) {
		String json = extractJson(aiOutput);
		if (json != null) {
			try {
				NormalizedAiResponse normalized = objectMapper.readValue(json, NormalizedAiResponse.class);
				return new EmailResponse(
						operation,
						blankToNull(normalized.subject()),
						blankToNull(normalized.body()),
						normalized.tone() == null ? context.tone() : normalized.tone(),
						normalized.warnings(),
						Instant.now()
				);
			}
			catch (JsonProcessingException ignored) {
				return fallback(operation, aiOutput, context, "AI response was not valid JSON; normalized from plain text.");
			}
		}
		return fallback(operation, aiOutput, context, "AI response did not contain JSON; normalized from plain text.");
	}

	private EmailResponse fallback(EmailOperation operation, String aiOutput, EmailContext context, String warning) {
		String cleaned = stripMarkdownFence(aiOutput).trim();
		List<String> warnings = new ArrayList<>();
		warnings.add(warning);
		if (operation == EmailOperation.SUBJECT) {
			return new EmailResponse(operation, firstLine(cleaned), null, context.tone(), warnings, Instant.now());
		}
		return new EmailResponse(operation, null, cleaned, context.tone(), warnings, Instant.now());
	}

	private String extractJson(String value) {
		if (value == null) {
			return null;
		}
		String cleaned = stripMarkdownFence(value).trim();
		int start = cleaned.indexOf('{');
		int end = cleaned.lastIndexOf('}');
		if (start >= 0 && end > start) {
			return cleaned.substring(start, end + 1);
		}
		return null;
	}

	private String stripMarkdownFence(String value) {
		return value == null ? "" : value.replace("```json", "").replace("```", "");
	}

	private String firstLine(String value) {
		String[] lines = value.split("\\R");
		return lines.length == 0 ? value : lines[0].trim();
	}

	private String blankToNull(String value) {
		return value == null || value.isBlank() ? null : value.trim();
	}

	private record NormalizedAiResponse(String subject, String body, Tone tone, List<String> warnings) {
	}
}
