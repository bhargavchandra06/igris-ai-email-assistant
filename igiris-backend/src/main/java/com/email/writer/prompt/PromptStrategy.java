package com.email.writer.prompt;

import com.email.writer.context.EmailContext;
import com.email.writer.email.service.EmailOperation;

public interface PromptStrategy {

	EmailOperation operation();

	String buildPrompt(EmailContext context);
}
