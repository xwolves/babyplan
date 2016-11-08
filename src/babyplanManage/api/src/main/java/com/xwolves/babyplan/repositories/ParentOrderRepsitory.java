package com.xwolves.babyplan.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xwolves.babyplan.entities.ParentOrder;

public interface ParentOrderRepsitory  extends JpaRepository<ParentOrder, Integer>{
	ParentOrder findByOrderId(String id);

}
