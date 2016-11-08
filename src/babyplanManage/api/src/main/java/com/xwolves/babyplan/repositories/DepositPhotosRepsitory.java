package com.xwolves.babyplan.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.xwolves.babyplan.entities.AccntConsultant;
import com.xwolves.babyplan.entities.DepositPhotos;

public interface DepositPhotosRepsitory  extends JpaRepository<DepositPhotos, Integer>{
	AccntConsultant findByPhotoId(int id);
	List<DepositPhotos> findByDepositId(int depid);
	List<DepositPhotos> findByDepositIdAndPhotoType(int depid,int phtype);

}
