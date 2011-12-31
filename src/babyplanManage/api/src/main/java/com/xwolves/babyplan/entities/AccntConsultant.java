package com.xwolves.babyplan.entities;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "tb_accnt_consultant")
public class AccntConsultant {
	
//	  `AccountID` int(11) NOT NULL,
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
		@Column(name = "AccountID")
		Integer accountId;

		@Column(name = "Name")
		String name;

		@Column(name = "Mobile")
		String mobile;

		@Column(name = "Remark")
		String remark;

		@Column(name = "CreateTime")
		Date createTime;

		@Column(name = "ModifyTime")
		Date modifyTime;
		
		@Column(name = "Password")
		String password;
		
		public Integer getAccountId() {
			return accountId;
		}

		public void setAccountId(Integer accountId) {
			this.accountId = accountId;
		}

		public String getName() {
			return name;
		}

		public void setName(String name) {
			this.name = name;
		}

		public String getMobile() {
			return mobile;
		}

		public void setMobile(String mobile) {
			this.mobile = mobile;
		}

		public String getRemark() {
			return remark;
		}

		public void setRemark(String remark) {
			this.remark = remark;
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

		public String getPassword() {
			return password;
		}

		public void setPassword(String password) {
			this.password = password;
		}



}
