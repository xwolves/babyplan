package com.xwolves.babyplan.entities;

import java.util.Date;

public class ChildrenInfoExt {
	public ChildrenInfoExt()
	{
		
	};
	Integer accountId;
	String name;
	Integer sex;
	String fingerFeature;
	String remark;
	Date createTime;
	Date modifyTime;
	
	// partent
	Integer partentAccountId;
	String  partentName;
	Integer partentSex;
	String  partentMobile;
	
	//tb_parent_children
	String  relationShip;
	
	
	//tb_deposit_children
	
	Integer depositId;
	Date depositStartTime ;
	Date depositEndTime ;
	Integer depositType ;
	
	//tb_accnt_deposit
	
	String orgName ;
}
