package com.email.writer;

import com.email.writer.ai.EmailAiClient;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

@SpringBootTest(properties = "spring.ai.model.chat=none")
class EmailWriterSbApplicationTests {

	@MockitoBean
	private EmailAiClient emailAiClient;

	@Test
	void contextLoads() {
	}
}
