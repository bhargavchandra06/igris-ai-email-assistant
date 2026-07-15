package com.email.writer;

import com.email.writer.config.CorsProperties;
import com.email.writer.ratelimit.RateLimitProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({CorsProperties.class, RateLimitProperties.class})
public class EmailWriterSbApplication {

	public static void main(String[] args) {
		SpringApplication.run(EmailWriterSbApplication.class, args);
	}
}
