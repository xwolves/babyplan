package com.xwolves.babyplan.entities;


public class Result {

	private int status;
	private Object content;
	private String message;
	
	public static final int STATUS_SUCCESS=0;
	public static final int STATUS_FAIL=-1;
	public static final int STATUS_TIMEOUT=401;
//	public static final int STATUS_FAIL=-1;
//	public static final int STATUS_FAIL=-1;
	
	public int getStatus() {
		return status;
	}

	public void setStatus(int status) {
		this.status = status;
	}

	public Object getContent() {
		return content;
	}

	public void setContent(Object content) {
		this.content = content;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public Result() {
		this.status = -1;
		this.content = "";
		this.message = "";
	}

	public Result(int status, String message) {
		this.status = status;
		this.message = message;
		this.content = null;
	}

	public Result(int status, String message, Object content) {
		this.status = status;
		this.content = content;
		this.message = message;
	}
	
	@Override
	public String toString() {
		return "Result [status=" + status + ", content=" + content + ", message=" + message + "]";
	}

}
