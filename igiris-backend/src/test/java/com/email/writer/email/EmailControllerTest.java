package com.email.writer.email;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.email.writer.email.controller.EmailController;
import com.email.writer.email.dto.response.EmailResponse;
import com.email.writer.email.service.EmailOperation;
import com.email.writer.email.service.EmailService;
import com.email.writer.ratelimit.ClientIpResolver;
import com.email.writer.ratelimit.RateLimitService;
import java.time.Instant;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(EmailController.class)
class EmailControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockitoBean
	private EmailService emailService;

	@MockitoBean
	private RateLimitService rateLimitService;

	@MockitoBean
	private ClientIpResolver clientIpResolver;

	@Test
	void generateReturnsNormalizedResponse() throws Exception {
		when(emailService.generate(any())).thenReturn(new EmailResponse(
				EmailOperation.GENERATE,
				"Project update",
				"Hi team...",
				null,
				List.of(),
				Instant.parse("2026-07-08T10:00:00Z")
		));

		mockMvc.perform(post("/api/v1/email/generate")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"prompt":"Write an update request","tone":"PROFESSIONAL"}
								"""))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.operation").value("GENERATE"))
				.andExpect(jsonPath("$.subject").value("Project update"))
				.andExpect(jsonPath("$.body").value("Hi team..."));
	}

	@Test
	void generateRejectsBlankPrompt() throws Exception {
		mockMvc.perform(post("/api/v1/email/generate")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"prompt":" "}
								"""))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Validation failed"))
				.andExpect(jsonPath("$.validationErrors[0]").value("prompt: Prompt is required"));
	}
}
