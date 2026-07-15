package com.email.writer.ai;

import static org.assertj.core.api.Assertions.assertThat;

import com.email.writer.context.EmailContext;
import com.email.writer.email.service.EmailOperation;
import com.email.writer.email.dto.request.Tone;
import com.email.writer.email.dto.response.EmailResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;

class AiResponseNormalizerTest {

	private final AiResponseNormalizer normalizer = new AiResponseNormalizer(new ObjectMapper());

	@Test
	void normalizesJsonResponse() {
		EmailContext context = context(EmailOperation.REPLY, Tone.FRIENDLY);

		EmailResponse response = normalizer.normalize(
				EmailOperation.REPLY,
				"""
						{"subject":null,"body":"Thanks for the update.","tone":"FRIENDLY","warnings":[]}
						""",
				context
		);

		assertThat(response.operation()).isEqualTo(EmailOperation.REPLY);
		assertThat(response.body()).isEqualTo("Thanks for the update.");
		assertThat(response.tone()).isEqualTo(Tone.FRIENDLY);
		assertThat(response.warnings()).isEmpty();
		assertThat(response.generatedAt()).isNotNull();
	}

	@Test
	void fallsBackToSubjectForPlainTextSubjectResponse() {
		EmailContext context = context(EmailOperation.SUBJECT, Tone.PROFESSIONAL);

		EmailResponse response = normalizer.normalize(EmailOperation.SUBJECT, "Project status update", context);

		assertThat(response.subject()).isEqualTo("Project status update");
		assertThat(response.body()).isNull();
		assertThat(response.warnings()).hasSize(1);
	}

	private EmailContext context(EmailOperation operation, Tone tone) {
		return new EmailContext(operation, tone, null, null, null, null, null, null, null, null, null, null, null, null, false);
	}
}
