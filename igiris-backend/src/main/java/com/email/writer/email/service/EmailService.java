package com.email.writer.email.service;

import com.email.writer.email.dto.request.GenerateEmailRequest;
import com.email.writer.email.dto.request.GrammarFixRequest;
import com.email.writer.email.dto.request.ImproveEmailRequest;
import com.email.writer.email.dto.request.ReplyEmailRequest;
import com.email.writer.email.dto.request.SubjectRequest;
import com.email.writer.email.dto.request.SummarizeEmailRequest;
import com.email.writer.email.dto.request.ToneChangeRequest;
import com.email.writer.email.dto.response.EmailResponse;

public interface EmailService {

	EmailResponse generate(GenerateEmailRequest request);

	EmailResponse reply(ReplyEmailRequest request);

	EmailResponse improve(ImproveEmailRequest request);

	EmailResponse fixGrammar(GrammarFixRequest request);

	EmailResponse changeTone(ToneChangeRequest request);

	EmailResponse generateSubject(SubjectRequest request);

	EmailResponse summarize(SummarizeEmailRequest request);
}
