package com.email.writer.config;

import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "app.cors")
public record CorsProperties(List<String> allowedOrigins, List<String> allowedOriginPatterns) {

	public CorsProperties {
		allowedOrigins = allowedOrigins == null ? List.of() : List.copyOf(allowedOrigins);
		allowedOriginPatterns = allowedOriginPatterns == null ? List.of() : List.copyOf(allowedOriginPatterns);
	}
}

