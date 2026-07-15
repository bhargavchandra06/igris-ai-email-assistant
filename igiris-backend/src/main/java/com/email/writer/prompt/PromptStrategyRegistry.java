package com.email.writer.prompt;

import com.email.writer.email.service.EmailOperation;
import com.email.writer.exception.InvalidEmailRequestException;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Component;

@Component
public class PromptStrategyRegistry {

	private final Map<EmailOperation, PromptStrategy> strategies;

	public PromptStrategyRegistry(List<PromptStrategy> strategies) {
		EnumMap<EmailOperation, PromptStrategy> mappedStrategies = new EnumMap<>(EmailOperation.class);
		for (PromptStrategy strategy : strategies) {
			PromptStrategy duplicate = mappedStrategies.put(strategy.operation(), strategy);
			if (duplicate != null) {
				throw new IllegalStateException("Duplicate prompt strategy for " + strategy.operation());
			}
		}
		this.strategies = Map.copyOf(mappedStrategies);
	}

	public PromptStrategy get(EmailOperation operation) {
		PromptStrategy strategy = strategies.get(operation);
		if (strategy == null) {
			throw new InvalidEmailRequestException("No prompt strategy configured for " + operation);
		}
		return strategy;
	}
}
