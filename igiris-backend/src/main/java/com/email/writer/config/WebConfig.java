package com.email.writer.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

	private final CorsProperties corsProperties;

	public WebConfig(CorsProperties corsProperties) {
		this.corsProperties = corsProperties;
	}

	@Override
	public void addCorsMappings(CorsRegistry registry) {
		if (corsProperties.allowedOrigins().isEmpty() && corsProperties.allowedOriginPatterns().isEmpty()) {
			return;
		}
		var registration = registry.addMapping("/api/**")
				.allowedOrigins(corsProperties.allowedOrigins().toArray(String[]::new))
				.allowedMethods("POST", "OPTIONS")
				.allowedHeaders("*")
				.maxAge(3600);

		if (!corsProperties.allowedOriginPatterns().isEmpty()) {
			registration.allowedOriginPatterns(corsProperties.allowedOriginPatterns().toArray(String[]::new));
		}
	}
}
