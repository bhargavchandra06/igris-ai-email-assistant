package com.email.writer.exception;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolationException;
import java.time.Instant;
import java.util.List;
import org.slf4j.MDC;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(MethodArgumentNotValidException.class)
	public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
		List<String> errors = ex.getBindingResult().getFieldErrors().stream()
				.map(error -> error.getField() + ": " + error.getDefaultMessage())
				.toList();
		return build(HttpStatus.BAD_REQUEST, "Validation failed", request, errors);
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ResponseEntity<ErrorResponse> handleConstraintViolation(ConstraintViolationException ex, HttpServletRequest request) {
		List<String> errors = ex.getConstraintViolations().stream()
				.map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
				.toList();
		return build(HttpStatus.BAD_REQUEST, "Validation failed", request, errors);
	}

	@ExceptionHandler(InvalidEmailRequestException.class)
	public ResponseEntity<ErrorResponse> handleInvalidEmailRequest(InvalidEmailRequestException ex, HttpServletRequest request) {
		return build(HttpStatus.BAD_REQUEST, ex.getMessage(), request, List.of());
	}

	@ExceptionHandler(RateLimitExceededException.class)
	public ResponseEntity<ErrorResponse> handleRateLimit(RateLimitExceededException ex, HttpServletRequest request) {
		return build(HttpStatus.TOO_MANY_REQUESTS, ex.getMessage(), request, List.of());
	}

	@ExceptionHandler(AiProviderException.class)
	public ResponseEntity<ErrorResponse> handleAiProvider(AiProviderException ex, HttpServletRequest request) {
		return build(HttpStatus.BAD_GATEWAY, ex.getMessage(), request, List.of());
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex, HttpServletRequest request) {
		return build(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected server error", request, List.of());
	}

	private ResponseEntity<ErrorResponse> build(HttpStatus status, String message, HttpServletRequest request, List<String> errors) {
		ErrorResponse response = new ErrorResponse(
				Instant.now(),
				status.value(),
				status.getReasonPhrase(),
				message,
				request.getRequestURI(),
				MDC.get("requestId"),
				errors
		);
		return ResponseEntity.status(status).body(response);
	}
}
