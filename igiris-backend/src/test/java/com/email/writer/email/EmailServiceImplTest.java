package com.email.writer.email;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.contains;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.email.writer.ai.AiResponseNormalizer;
import com.email.writer.ai.EmailAiClient;
import com.email.writer.context.EmailContextBuilder;
import com.email.writer.email.dto.request.GenerateEmailRequest;
import com.email.writer.email.dto.request.Tone;
import com.email.writer.email.dto.response.EmailResponse;
import com.email.writer.email.service.EmailOperation;
import com.email.writer.email.service.EmailService;
import com.email.writer.email.service.EmailServiceImpl;
import com.email.writer.prompt.GeneratePromptStrategy;
import com.email.writer.prompt.GrammarPromptStrategy;
import com.email.writer.prompt.ImprovePromptStrategy;
import com.email.writer.prompt.PromptStrategy;
import com.email.writer.prompt.PromptStrategyRegistry;
import com.email.writer.prompt.ReplyPromptStrategy;
import com.email.writer.prompt.SubjectPromptStrategy;
import com.email.writer.prompt.SummarizePromptStrategy;
import com.email.writer.prompt.TonePromptStrategy;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class EmailServiceImplTest {

	private final EmailAiClient emailAiClient = Mockito.mock(EmailAiClient.class);
	private final EmailService emailService = new EmailServiceImpl(
			new EmailContextBuilder(),
			new PromptStrategyRegistry(strategies()),
			emailAiClient,
			new AiResponseNormalizer(new ObjectMapper())
	);

	@Test
	void generateBuildsPromptAndNormalizesAiResponse() {
		when(emailAiClient.generate(contains("Write a complete email from the user's request")))
				.thenReturn("""
						{"subject":"Status request","body":"Hi team, can you share the latest status?","tone":"PROFESSIONAL","warnings":[]}
						""");

		EmailResponse response = emailService.generate(new GenerateEmailRequest(
				"Ask for project status",
				Tone.PROFESSIONAL,
				"Project team",
				"Need update by Friday"
		));

		assertThat(response.operation()).isEqualTo(EmailOperation.GENERATE);
		assertThat(response.subject()).isEqualTo("Status request");
		assertThat(response.body()).contains("latest status");
		verify(emailAiClient).generate(contains("Need update by Friday"));
	}

	private List<PromptStrategy> strategies() {
		return List.of(
				new GeneratePromptStrategy(),
				new ReplyPromptStrategy(),
				new ImprovePromptStrategy(),
				new GrammarPromptStrategy(),
				new TonePromptStrategy(),
				new SubjectPromptStrategy(),
				new SummarizePromptStrategy()
		);
	}
}
