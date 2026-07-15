package com.email.writer.ratelimit;

import java.time.Duration;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.rate-limit")
public record RateLimitProperties(
		boolean enabled,
		int requestsPerWindow,
		Duration window
) {
	public RateLimitProperties {
		if (requestsPerWindow <= 0) {
			requestsPerWindow = 60;
		}
		if (window == null || window.isNegative() || window.isZero()) {
			window = Duration.ofMinutes(1);
		}
	}
}
