package com.xwolves.babyplan.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.xwolves.babyplan.entities.AccntDeposit;


public interface AccntDepositRepsitory extends JpaRepository<AccntDeposit, Integer>  {
	AccntDeposit findByAccountId(int id);
	List<AccntDeposit> findByOrgName(String orgname);
	List<AccntDeposit> findByAddress(String address);
	List<AccntDeposit> findByContactName(String contactname);
	List<AccntDeposit> findByContactPhone(String contactphone);
	List<AccntDeposit> findById2Number(String id2);

	Page<AccntDeposit> findByOrgNameLikeOrContactNameLikeOrContactNameLike(String filter,Pageable pageable); 
}
