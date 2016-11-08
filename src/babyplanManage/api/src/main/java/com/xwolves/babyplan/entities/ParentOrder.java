package com.xwolves.babyplan.entities;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "tb_parent_order")
public class ParentOrder {

	// `AccountID` Integer(11) NOT NULL,
	// `Name` varchar(128) DEFAULT NULL,
	// `Mobile` varchar(128) DEFAULT NULL,
	// `WeiXinNo` varchar(128) DEFAULT NULL,
	// `Remark` varchar(1000) DEFAULT NULL,
	// `CreateTime` datetime DEFAULT NULL,
	// `ModifyTime` datetime DEFAULT NULL,
	// `Password` varchar(128) DEFAULT NULL,

	@Id
	// @GeneratedValue(strategy = GenerationType.SEQUENCE, generator =
	// "DSP_DOCUMENT_seq")
	// @SequenceGenerator(name = "DSP_DOCUMENT_seq", sequenceName =
	@Column(name = "OrderID")
	String orderId;

	@Column(name = "ParentID")
	Integer parentId;

	@Column(name = "OrderType")
	Integer orderType;

	@Column(name = "Amount")
	Integer amount;

	@Column(name = "PayStatus")
	Integer payStatus;

	@Column(name = "PayType")
	Integer PayType;

	@Column(name = "PayTime")
	Date payTime;

	@Column(name = "NumOfDays")
	Integer numOfDays;

	@Column(name = "CutOffTime")
	Date cutOffTime;

	@Column(name = "BusinessID")
	Integer businessId;

	@Column(name = "CreateTime")
	Date createTime;

	@Column(name = "ModifyTime")
	Date modifyTime;

	public String getOrderId() {
		return orderId;
	}

	public void setOrderId(String orderId) {
		this.orderId = orderId;
	}

	public Integer getParentId() {
		return parentId;
	}

	public void setParentId(Integer parentId) {
		this.parentId = parentId;
	}

	public Integer getOrderType() {
		return orderType;
	}

	public void setOrderType(Integer orderType) {
		this.orderType = orderType;
	}

	public Integer getAmount() {
		return amount;
	}

	public void setAmount(Integer amount) {
		this.amount = amount;
	}

	public Integer getPayStatus() {
		return payStatus;
	}

	public void setPayStatus(Integer payStatus) {
		this.payStatus = payStatus;
	}

	public Integer getPayType() {
		return PayType;
	}

	public void setPayType(Integer payType) {
		PayType = payType;
	}

	public Date getPayTime() {
		return payTime;
	}

	public void setPayTime(Date payTime) {
		this.payTime = payTime;
	}

	public Integer getNumOfDays() {
		return numOfDays;
	}

	public void setNumOfDays(Integer numOfDays) {
		this.numOfDays = numOfDays;
	}

	public Date getCutOffTime() {
		return cutOffTime;
	}

	public void setCutOffTime(Date cutOffTime) {
		this.cutOffTime = cutOffTime;
	}

	public Integer getBusinessId() {
		return businessId;
	}

	public void setBusinessId(Integer businessId) {
		this.businessId = businessId;
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

	@Override
	public String toString() {
		return "ParentOrder [orderId=" + orderId + ", parentId=" + parentId + ", orderType=" + orderType + ", amount="
				+ amount + ", payStatus=" + payStatus + ", PayType=" + PayType + ", payTime=" + payTime + ", numOfDays="
				+ numOfDays + ", cutOffTime=" + cutOffTime + ", businessId=" + businessId + ", createTime=" + createTime
				+ ", modifyTime=" + modifyTime + "]";
	}




}
