package com.email.writer.prompt;

import com.email.writer.context.EmailContext;

final class PromptSupport {

	private PromptSupport() {
	}

	static String responseContract() {
		return """
				Return only valid JSON with this exact shape:
				{
				  "subject": "string or null",
				  "body": "string or null",
				  "tone": "PROFESSIONAL, FRIENDLY, FORMAL, CASUAL, or null",
				  "warnings": ["short warning strings if needed"]
				}
				Do not include markdown fences, explanations, or extra keys.
				""";
	}

	static String valueOrDefault(String value, String fallback) {
		return value == null || value.isBlank() ? fallback : value;
	}

	static String tone(EmailContext context) {
		return context.tone() == null ? "the original tone" : context.tone().name();
	}
}
