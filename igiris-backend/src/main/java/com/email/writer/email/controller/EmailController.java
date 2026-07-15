package com.email.writer.email.controller;

import com.email.writer.email.service.EmailService;
import com.email.writer.email.dto.request.GenerateEmailRequest;
import com.email.writer.email.dto.request.GrammarFixRequest;
import com.email.writer.email.dto.request.ImproveEmailRequest;
import com.email.writer.email.dto.request.ReplyEmailRequest;
import com.email.writer.email.dto.request.SubjectRequest;
import com.email.writer.email.dto.request.SummarizeEmailRequest;
import com.email.writer.email.dto.request.ToneChangeRequest;
import com.email.writer.email.dto.response.EmailResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/v1/email")
public class EmailController {

	private final EmailService emailService;

	public EmailController(EmailService emailService) {
		this.emailService = emailService;
	}

	@PostMapping("/generate")
	@ResponseStatus(HttpStatus.OK)
	public EmailResponse generate(@Valid @RequestBody GenerateEmailRequest request) {
		return emailService.generate(request);
	}

	@PostMapping("/reply")
	@ResponseStatus(HttpStatus.OK)
	public EmailResponse reply(@Valid @RequestBody ReplyEmailRequest request) {
		return emailService.reply(request);
	}

	@PostMapping("/improve")
	@ResponseStatus(HttpStatus.OK)
	public EmailResponse improve(@Valid @RequestBody ImproveEmailRequest request) {
		return emailService.improve(request);
	}

	@PostMapping("/grammar")
	@ResponseStatus(HttpStatus.OK)
	public EmailResponse fixGrammar(@Valid @RequestBody GrammarFixRequest request) {
		return emailService.fixGrammar(request);
	}

	@PostMapping("/tone")
	@ResponseStatus(HttpStatus.OK)
	public EmailResponse changeTone(@Valid @RequestBody ToneChangeRequest request) {
		return emailService.changeTone(request);
	}

	@PostMapping("/subject")
	@ResponseStatus(HttpStatus.OK)
	public EmailResponse generateSubject(@Valid @RequestBody SubjectRequest request) {
		return emailService.generateSubject(request);
	}

	@PostMapping("/summarize")
	@ResponseStatus(HttpStatus.OK)
	public EmailResponse summarize(@Valid @RequestBody SummarizeEmailRequest request) {
		return emailService.summarize(request);
	}
}
