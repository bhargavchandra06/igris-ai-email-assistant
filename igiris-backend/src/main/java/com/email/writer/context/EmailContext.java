package com.email.writer.context;

import com.email.writer.email.service.EmailOperation;
import com.email.writer.email.dto.request.SummaryStyle;
import com.email.writer.email.dto.request.Tone;

public record EmailContext(
		EmailOperation operation,
		Tone tone,
		SummaryStyle summaryStyle,
		String prompt,
		String originalEmail,
		String threadContext,
		String replyInstruction,
		String draft,
		String improvementInstruction,
		String content,
		String body,
		String additionalContext,
		String recipientContext,
		String focus,
		boolean preserveTone
) {
}
