package com.email.writer.context;

import com.email.writer.email.service.EmailOperation;
import com.email.writer.email.dto.request.GenerateEmailRequest;
import com.email.writer.email.dto.request.GrammarFixRequest;
import com.email.writer.email.dto.request.ImproveEmailRequest;
import com.email.writer.email.dto.request.ReplyEmailRequest;
import com.email.writer.email.dto.request.SubjectRequest;
import com.email.writer.email.dto.request.SummarizeEmailRequest;
import com.email.writer.email.dto.request.SummaryStyle;
import com.email.writer.email.dto.request.Tone;
import com.email.writer.email.dto.request.ToneChangeRequest;
import org.springframework.stereotype.Component;

@Component
public class EmailContextBuilder {

	public EmailContext from(GenerateEmailRequest request) {
		return new EmailContext(
				EmailOperation.GENERATE,
				defaultTone(request.tone()),
				null,
				clean(request.prompt()),
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				clean(request.additionalContext()),
				clean(request.recipientContext()),
				null,
				false
		);
	}

	public EmailContext from(ReplyEmailRequest request) {
		return new EmailContext(
				EmailOperation.REPLY,
				defaultTone(request.tone()),
				null,
				null,
				clean(request.originalEmail()),
				clean(request.threadContext()),
				clean(request.replyInstruction()),
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				false
		);
	}

	public EmailContext from(ImproveEmailRequest request) {
		return new EmailContext(
				EmailOperation.IMPROVE,
				defaultTone(request.tone()),
				null,
				null,
				null,
				null,
				null,
				clean(request.draft()),
				clean(request.improvementInstruction()),
				null,
				null,
				null,
				null,
				null,
				false
		);
	}

	public EmailContext from(GrammarFixRequest request) {
		return new EmailContext(
				EmailOperation.GRAMMAR,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				clean(request.content()),
				null,
				null,
				null,
				null,
				request.preserveTone()
		);
	}

	public EmailContext from(ToneChangeRequest request) {
		return new EmailContext(
				EmailOperation.TONE,
				request.targetTone(),
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				clean(request.content()),
				null,
				null,
				null,
				null,
				false
		);
	}

	public EmailContext from(SubjectRequest request) {
		return new EmailContext(
				EmailOperation.SUBJECT,
				defaultTone(request.tone()),
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				clean(request.body()),
				clean(request.additionalContext()),
				null,
				null,
				false
		);
	}

	public EmailContext from(SummarizeEmailRequest request) {
		return new EmailContext(
				EmailOperation.SUMMARIZE,
				null,
				request.summaryStyle() == null ? SummaryStyle.SHORT : request.summaryStyle(),
				null,
				null,
				null,
				null,
				null,
				null,
				clean(request.content()),
				null,
				null,
				null,
				clean(request.focus()),
				false
		);
	}

	private Tone defaultTone(Tone tone) {
		return tone == null ? Tone.PROFESSIONAL : tone;
	}

	private String clean(String value) {
		if (value == null) {
			return null;
		}
		String cleaned = value.trim();
		return cleaned.isEmpty() ? null : cleaned;
	}
}
