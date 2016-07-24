package com.xwolves.babyplan.entities;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public class MyPageable implements Pageable {
	
	int pageNumber=0;
	int pageSize=0;
	int Offset=0;	
	

	public void setPageNumber(int pageNumber) {
		this.pageNumber = pageNumber;
	}

	public void setPageSize(int pageSize) {
		this.pageSize = pageSize;
	}

	public void setOffset(int offset) {
		Offset = offset;
	}

	@Override
	public int getPageNumber() {
		// TODO Auto-generated method stub
		return pageNumber;
	}

	@Override
	public int getPageSize() {
		// TODO Auto-generated method stub
		return pageSize;
	}

	@Override
	public int getOffset() {
		// TODO Auto-generated method stub
		return Offset;
	}

	@Override
	public Sort getSort() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Pageable next() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Pageable previousOrFirst() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Pageable first() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean hasPrevious() {
		// TODO Auto-generated method stub
		return false;
	}

}
