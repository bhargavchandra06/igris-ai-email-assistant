package com.email.writer.exception;

public class InvalidEmailRequestException extends RuntimeException {

	public InvalidEmailRequestException(String message) {
		super(message);
	}
}
