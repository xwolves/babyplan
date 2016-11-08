package com.xwolves.babyplan.entities;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "tb_deposit_photos")
public class DepositPhotos {
	
//	  `AccountID` Integer(11) NOT NULL,
//	  `Name` varchar(128) DEFAULT NULL,
//	  `Mobile` varchar(128) DEFAULT NULL,
//	  `WeiXinNo` varchar(128) DEFAULT NULL,
//	  `Remark` varchar(1000) DEFAULT NULL,
//	  `CreateTime` datetime DEFAULT NULL,
//	  `ModifyTime` datetime DEFAULT NULL,
//	  `Password` varchar(128) DEFAULT NULL,
	  
		@Id
		// @GeneratedValue(strategy = GenerationType.SEQUENCE, generator =
		// "DSP_DOCUMENT_seq")
		// @SequenceGenerator(name = "DSP_DOCUMENT_seq", sequenceName =
		// "DSP_DOCUMENT_seq", allocationSize = 1)
		@Column(name = "PhotoID")
		Integer photoId;

		@Column(name = "DepositID")
		Integer depositId;
		

		@Column(name = "PhotoType")
		Integer photoType;
		

		public Integer getPhotoType() {
			return photoType;
		}

		public void setPhotoType(Integer photoType) {
			this.photoType = photoType;
		}

		@Column(name = "Remark")
		String remark;

		@Column(name = "PhotoLink")
		String photoLink;

		@Column(name = "CreateTime")
		Date createTime;

		@Column(name = "ModifyTime")
		Date modifyTime;

		public Integer getPhotoId() {
			return photoId;
		}

		public void setPhotoId(Integer photoId) {
			this.photoId = photoId;
		}

		public Integer getDepositId() {
			return depositId;
		}

		public void setDepositId(Integer depositId) {
			this.depositId = depositId;
		}

		public String getRemark() {
			return remark;
		}

		public void setRemark(String remark) {
			this.remark = remark;
		}

		public String getPhotoLink() {
			return photoLink;
		}

		public void setPhotoLink(String photoLink) {
			this.photoLink = photoLink;
		}

		public Date getCreateTime() {
			return createTime;
		}

		public void setCreateTime(Date createTime) {
			this.createTime = createTime;
		}

		public Date getModifyTime() {
			return modifyTime;
		}

		public void setModifyTime(Date modifyTime) {
			this.modifyTime = modifyTime;
		}
}
