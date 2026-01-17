package com.niladrimondal.keeperapp.exception;

public class EntryNotFoundException extends RuntimeException {

	private static final long serialVersionUID = 1L;

	public EntryNotFoundException() {
		super();
	}

	public EntryNotFoundException(String message) {
		super(message);
	}
}
