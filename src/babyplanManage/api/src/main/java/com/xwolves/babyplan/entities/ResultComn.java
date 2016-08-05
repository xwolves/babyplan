package com.xwolves.babyplan.entities;


public class ResultComn {
	private Object content;	
	int totalElements;
	int totalPages;
	int numberOfElements;
	int size;
	int number;
	
//	"last":false,"totalPages":21,"totalElements":42,
//	"size":2,"number":0,"first":true,,"numberOfElements":2},
	
	
	
	public int getTotalElements() {
		return totalElements;
	}

	public void setTotalElements(int totalElements) {
		this.totalElements = totalElements;
	}

	public int getTotalPages() {
		return totalPages;
	}

	public void setTotalPages(int totalPages) {
		this.totalPages = totalPages;
	}

	public int getNumberOfElements() {
		return numberOfElements;
	}

	public void setNumberOfElements(int numberOfElements) {
		this.numberOfElements = numberOfElements;
	}

	public int getSize() {
		return size;
	}

	public void setSize(int size) {
		this.size = size;
	}

	public int getNumber() {
		return number;
	}

	public void setNumber(int number) {
		this.number = number;
	}

	private String message;
	
	public static final int STATUS_SUCCESS=0;
	public static final int STATUS_FAIL=-1;
	public static final int STATUS_TIMEOUT=401;
//	public static final int STATUS_FAIL=-1;
//	public static final int STATUS_FAIL=-1;
	




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

	public ResultComn() {
		this.content = "";
		this.message = "";
	}

	public ResultComn(int status, String message) {

		this.message = message;
		this.content = null;
		
		this.totalElements=0;
		this.totalPages=0;
		this.numberOfElements=0;
		this.size=0;
	}

	public ResultComn(int status, String message, Object content,int totalElements,int totalPages,int numberOfElements,int size,int number) {

		this.content = content;
		this.message = message;
		this.totalElements=totalElements;
		this.totalPages=totalPages;
		this.numberOfElements=numberOfElements;
		this.size=number;
	}

	@Override
	public String toString() {
		return "ResultComn [content=" + content + ", totalElements=" + totalElements + ", totalPages=" + totalPages
				+ ", numberOfElements=" + numberOfElements + ", size=" + size + ", number=" + number + ", message="
				+ message + "]";
	}
	
}
