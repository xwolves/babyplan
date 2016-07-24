package com.xwolves.babyplan.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xwolves.babyplan.entities.AccntConsultant;

public interface AccntConsultantRepsitory  extends JpaRepository<AccntConsultant, Integer>{
	AccntConsultant findByAccountId(int id);
	List<AccntConsultant> findByNameAndPassword(String user, String pwd);

}
