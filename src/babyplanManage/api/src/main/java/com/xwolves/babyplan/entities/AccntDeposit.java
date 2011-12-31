package com.xwolves.babyplan.entities;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;

@Entity
@Table(name = "tb_accnt_deposit")
public class AccntDeposit {

	public AccntDeposit() {
	}

	@Id
	// @GeneratedValue(strategy = GenerationType.SEQUENCE, generator =
	// "DSP_DOCUMENT_seq")
	// @SequenceGenerator(name = "DSP_DOCUMENT_seq", sequenceName =
	// "DSP_DOCUMENT_seq", allocationSize = 1)
	@Column(name = "AccountID")
	Integer accountId;

	@Column(name = "OrgName")
	String orgName;

	@Column(name = "Address")
	String address;

	@Column(name = "MarkID")
	String markId;

	@Column(name = "ContactName")
	String contactName;

	@Column(name = "ContactPhone")
	String contactPhone;

	@Column(name = "LicenseType",nullable=false,columnDefinition="Integer  default 0")
	Integer licenseType;

	@Column(name = "PlaceContractType",nullable=false,columnDefinition="Integer  default 0")
	Integer placeContractType;

	@Column(name = "FrontDeskLink")
	String frontDeskLink;

	@Column(name = "PublicZoneLink")
	String pubilcZoneLink;

	@Column(name = "KitchenLink")
	String kitchenLink;

	@Column(name = "DiningRoomLink")
	String diningRoomLink;

	@Column(name = "RestRoomLink1")
	String restRoomLink1;

	@Column(name = "RestRoomLink2")
	String restRoomLink2;

	@Column(name = "ClassRoomLink1")
	String classRoomLink1;

	@Column(name = "ClassRoomLink2")
	String classRoomLink2;

	@Column(name = "OtherRoomLink1")
	String otherRoomLink1;

	@Column(name = "OtherRoomLink2")
	String otherRoomLink2;

	@Column(name = "ID2Number")
	String id2Number;

	@Column(name = "ID2PhotoLink")
	String id2PhotoLink;

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

	public void setAccountId(int accountId) {
		this.accountId = accountId;
	}

	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getMarkId() {
		return markId;
	}

	public void setMarkId(String markId) {
		this.markId = markId;
	}

	public String getContactName() {
		return contactName;
	}

	public void setContactName(String contactName) {
		this.contactName = contactName;
	}

	public String getContactPhone() {
		return contactPhone;
	}

	public void setContactPhone(String contactPhone) {
		this.contactPhone = contactPhone;
	}

	public Integer getLicenseType() {
		return licenseType;
	}

	public void setLicenseType(int licenseType) {
		this.licenseType = licenseType;
	}

	public Integer getPlaceContractType() {
		return placeContractType;
	}

	public void setPlaceContractType(Integer placeContractType) {
		//System.out.println("setPlaceContractType");
		if(placeContractType!=null)
		this.placeContractType = placeContractType;
		else this.placeContractType =0;
	}

	public String getFrontDeskLink() {
		return frontDeskLink;
	}

	public void setFrontDeskLink(String frontDeskLink) {
		this.frontDeskLink = frontDeskLink;
	}

	public String getPubilcZoneLink() {
		return pubilcZoneLink;
	}

	public void setPubilcZoneLink(String pubilcZoneLink) {
		this.pubilcZoneLink = pubilcZoneLink;
	}

	public String getKitchenLink() {
		return kitchenLink;
	}

	public void setKitchenLink(String kitchenLink) {
		this.kitchenLink = kitchenLink;
	}

	public String getDiningRoomLink() {
		return diningRoomLink;
	}

	public void setDiningRoomLink(String diningRoomLink) {
		this.diningRoomLink = diningRoomLink;
	}

	public String getRestRoomLink1() {
		return restRoomLink1;
	}

	public void setRestRoomLink1(String restRoomLink1) {
		this.restRoomLink1 = restRoomLink1;
	}

	public String getRestRoomLink2() {
		return restRoomLink2;
	}

	public void setRestRoomLink2(String restRoomLink2) {
		this.restRoomLink2 = restRoomLink2;
	}

	public String getClassRoomLink1() {
		return classRoomLink1;
	}

	public void setClassRoomLink1(String classRoomLink1) {
		this.classRoomLink1 = classRoomLink1;
	}

	public String getClassRoomLink2() {
		return classRoomLink2;
	}

	public void setClassRoomLink2(String classRoomLink2) {
		this.classRoomLink2 = classRoomLink2;
	}

	public String getOtherRoomLink1() {
		return otherRoomLink1;
	}

	public void setOtherRoomLink1(String otherRoomLink1) {
		this.otherRoomLink1 = otherRoomLink1;
	}

	public String getOtherRoomLink2() {
		return otherRoomLink2;
	}

	public void setOtherRoomLink2(String otherRoomLink2) {
		this.otherRoomLink2 = otherRoomLink2;
	}

	public String getId2Number() {
		return id2Number;
	}

	public void setId2Number(String id2Number) {
		this.id2Number = id2Number;
	}

	public String getId2PhotoLink() {
		return id2PhotoLink;
	}

	public void setId2PhotoLink(String id2PhotoLink) {
		this.id2PhotoLink = id2PhotoLink;
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

	@Override
	public String toString() {
		return "AccntDeposit [accountId=" + accountId + ", orgName=" + orgName + ", address=" + address + ", markId="
				+ markId + ", contactName=" + contactName + ", contactPhone=" + contactPhone + ", licenseType="
				+ licenseType + ", placeContractType=" + placeContractType + ", frontDeskLink=" + frontDeskLink
				+ ", pubilcZoneLink=" + pubilcZoneLink + ", kitchenLink=" + kitchenLink + ", diningRoomLink="
				+ diningRoomLink + ", restRoomLink1=" + restRoomLink1 + ", restRoomLink2=" + restRoomLink2
				+ ", classRoomLink1=" + classRoomLink1 + ", classRoomLink2=" + classRoomLink2 + ", otherRoomLink1="
				+ otherRoomLink1 + ", otherRoomLink2=" + otherRoomLink2 + ", id2Number=" + id2Number + ", id2PhotoLink="
				+ id2PhotoLink + ", remark=" + remark + ", createTime=" + createTime + ", modifyTime=" + modifyTime
				+ ", password=" + password + "]";
	}

}
