package com.xwolves.babyplan.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.xwolves.babyplan.entities.AccntDeposit;


public interface AccntDepositRepsitory extends JpaRepository<AccntDeposit, Integer>  {
	AccntDeposit findByAccountId(int accountId);
	List<AccntDeposit> findByOrgName(String orgname);
	List<AccntDeposit> findByAddress(String address);
	List<AccntDeposit> findByContactName(String contactname);
	List<AccntDeposit> findByContactPhone(String contactphone);
	List<AccntDeposit> findByLicenseType(int licenseType);
	List<AccntDeposit> findByPlaceContractType(int placeContractType);
	List<AccntDeposit> findById2Number(String id2);

	Page<AccntDeposit> findByOrgNameLikeOrContactNameLikeOrContactNameLike(String filter,Pageable pageable); 
	
	Page<AccntDeposit> findByOrgNameAndAddressAndContactNameAndContactPhoneAndLicenseTypeAndPlaceContractType(String orgname,String address,String contactname,String contactphone,int licenseType,int placeContractType,Pageable pageable); 
	 
}
