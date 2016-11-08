package com.xwolves.babyplan.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xwolves.babyplan.entities.PriceSetting;

public interface PriceSettingRepsitory  extends JpaRepository<PriceSetting, Integer>{
	PriceSetting findByRecordId(int id);
	PriceSetting findByBusinessId(int id);
}
