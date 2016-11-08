package com.xwolves.babyplan.entities;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "tb_price_setting")
public class PriceSetting {
	
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
		@GeneratedValue(strategy = GenerationType.AUTO)
		@Column(name = "RecordID")
		Integer recordId;

		@Column(name = "BusinessID")
		Integer businessId;

		@Column(name = "BusinessName")
		String businessName;


		@Column(name = "BusinessDesc")
		String businessDesc;

		@Column(name = "Price")
		Float price;

		@Column(name = "Provide")
		String provide;
		
		@Column(name = "Reason")
		String reason;
		
		@Column(name = "Status")
		Integer status;
		
		@Column(name = "NumOfDays")
		Integer numOfDays;
		@Column(name = "CreateTime")
		Date createTime;

		public Integer getRecordId() {
			return recordId;
		}
		public void setRecordId(Integer recordId) {
			this.recordId = recordId;
		}
		public Integer getBusinessId() {
			return businessId;
		}
		public void setBusinessId(Integer businessId) {
			this.businessId = businessId;
		}
		public String getBusinessName() {
			return businessName;
		}
		public void setBusinessName(String businessName) {
			this.businessName = businessName;
		}
		public String getBusinessDesc() {
			return businessDesc;
		}
		public void setBusinessDesc(String businessDesc) {
			this.businessDesc = businessDesc;
		}
		public Float getPrice() {
			return price;
		}
		public void setPrice(Float price) {
			this.price = price;
		}
		public String getProvide() {
			return provide;
		}
		public void setProvide(String provide) {
			this.provide = provide;
		}
		public String getReason() {
			return reason;
		}
		public void setReason(String reason) {
			this.reason = reason;
		}
		public Integer getStatus() {
			return status;
		}
		public void setStatus(Integer status) {
			this.status = status;
		}
		public Integer getNumOfDays() {
			return numOfDays;
		}
		public void setNumOfDays(Integer numOfDays) {
			this.numOfDays = numOfDays;
		}
		public Date getCreateTime() {
			return createTime;
		}
		public void setCreateTime(Date createTime) {
			this.createTime = createTime;
		}

	
		@Override
		public String toString() {
			return "PriceSetting [recordId=" + recordId + ", businessId=" + businessId + ", businessName="
					+ businessName + ", businessDesc=" + businessDesc + ", price=" + price + ", provide=" + provide
					+ ", reason=" + reason + ", status=" + status + ", numOfDays=" + numOfDays + ", createTime="
					+ createTime + "]";
		}


	


}
