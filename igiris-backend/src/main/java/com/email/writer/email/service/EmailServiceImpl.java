package com.email.writer.email.service;

import com.email.writer.ai.AiResponseNormalizer;
import com.email.writer.ai.EmailAiClient;
import com.email.writer.context.EmailContext;
import com.email.writer.context.EmailContextBuilder;
import com.email.writer.email.dto.request.GenerateEmailRequest;
import com.email.writer.email.dto.request.GrammarFixRequest;
import com.email.writer.email.dto.request.ImproveEmailRequest;
import com.email.writer.email.dto.request.ReplyEmailRequest;
import com.email.writer.email.dto.request.SubjectRequest;
import com.email.writer.email.dto.request.SummarizeEmailRequest;
import com.email.writer.email.dto.request.ToneChangeRequest;
import com.email.writer.email.dto.response.EmailResponse;
import com.email.writer.prompt.PromptStrategy;
import com.email.writer.prompt.PromptStrategyRegistry;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

	private final EmailContextBuilder contextBuilder;
	private final PromptStrategyRegistry promptStrategyRegistry;
	private final EmailAiClient emailAiClient;
	private final AiResponseNormalizer responseNormalizer;

	public EmailServiceImpl(
			EmailContextBuilder contextBuilder,
			PromptStrategyRegistry promptStrategyRegistry,
			EmailAiClient emailAiClient,
			AiResponseNormalizer responseNormalizer
	) {
		this.contextBuilder = contextBuilder;
		this.promptStrategyRegistry = promptStrategyRegistry;
		this.emailAiClient = emailAiClient;
		this.responseNormalizer = responseNormalizer;
	}

	@Override
	public EmailResponse generate(GenerateEmailRequest request) {
		return execute(contextBuilder.from(request));
	}

	@Override
	public EmailResponse reply(ReplyEmailRequest request) {
		return execute(contextBuilder.from(request));
	}

	@Override
	public EmailResponse improve(ImproveEmailRequest request) {
		return execute(contextBuilder.from(request));
	}

	@Override
	public EmailResponse fixGrammar(GrammarFixRequest request) {
		return execute(contextBuilder.from(request));
	}

	@Override
	public EmailResponse changeTone(ToneChangeRequest request) {
		return execute(contextBuilder.from(request));
	}

	@Override
	public EmailResponse generateSubject(SubjectRequest request) {
		return execute(contextBuilder.from(request));
	}

	@Override
	public EmailResponse summarize(SummarizeEmailRequest request) {
		return execute(contextBuilder.from(request));
	}

	private EmailResponse execute(EmailContext context) {
		PromptStrategy strategy = promptStrategyRegistry.get(context.operation());
		String prompt = strategy.buildPrompt(context);
		String aiOutput = emailAiClient.generate(prompt);
		return responseNormalizer.normalize(context.operation(), aiOutput, context);
	}
}
