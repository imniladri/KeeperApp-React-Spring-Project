package com.niladrimondal.keeperapp.controller;

import com.niladrimondal.keeperapp.error.ErrorResponse;
import com.niladrimondal.keeperapp.exception.EntryNotFoundException;
import com.niladrimondal.keeperapp.exception.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ExceptionController {

	@ExceptionHandler
	public ErrorResponse handleException(Exception ex) {
		ErrorResponse errorResponse = new ErrorResponse();

		errorResponse.setStatus(HttpStatus.BAD_REQUEST.value());
		errorResponse.setMessage(ex.getMessage());

		return errorResponse;
	}

	@ExceptionHandler
	public ErrorResponse handleException(UserNotFoundException ex) {
		ErrorResponse errorResponse = new ErrorResponse();

		errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
		errorResponse.setMessage(ex.getMessage());

		return errorResponse;
	}
	
	@ExceptionHandler
	public ErrorResponse handleException(EntryNotFoundException ex) {
		ErrorResponse errorResponse = new ErrorResponse();

		errorResponse.setStatus(HttpStatus.NOT_FOUND.value());
		errorResponse.setMessage(ex.getMessage());

		return errorResponse;
	}

}
