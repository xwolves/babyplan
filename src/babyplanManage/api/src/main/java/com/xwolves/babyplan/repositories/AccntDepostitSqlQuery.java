package com.xwolves.babyplan.repositories;


import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;
import org.springframework.jdbc.core.JdbcTemplate;
import com.xwolves.babyplan.entities.ResultComn;



public class AccntDepostitSqlQuery {

	private static String sqlStr = "select * from DSP_SIGNPROCESS s "
			+ "join DSP_DOCUMENT d on s.FWBH = d.FWBH "
			+ "where s.RQ between to_date(?,'yyyymmdd') and to_date(?,'yyyymmdd') "
			+ "order by s.BH "; 
	private JdbcTemplate jdbcTemplate;

	public AccntDepostitSqlQuery(DataSource dataSource) {
		this.jdbcTemplate = new JdbcTemplate(dataSource);
    }
    
	public ResultComn queryDepositData(String filter ,String order,int pageNumber,int pagesize){
    	
//    	 List ttes = jdbcTemplate.queryForList("select * from tb_accnt_deposit ");
//    	 System.out.println(ttes.toString());
//		return ttes;
    	String sqltemp ="select * from tb_accnt_deposit t";
    	return queryComonData(sqltemp,filter,order,pageNumber,pagesize);
    }
    public int getNewId(){
	   	 int id = jdbcTemplate.queryForInt("select max(t.AccountID)  from tb_accnt_deposit t")+1;
	   	 return id;
    }
    
    public int getNewPriceSetId(){
	   	 int id = jdbcTemplate.queryForInt("select max(t.RecordID)  from  tb_price_setting t")+1;
	   	 return id;
   }
    
    
    public int getNewDepositPhotosId(){
	   	 int id = jdbcTemplate.queryForInt("select max(t.PhotoID)  from  tb_deposit_photos t")+1;
	   	 return id;
   }
    
    public ResultComn queryTeacherExtData(String filter ,String order,int pageNumber,int pagesize)
    {
    	
    	String sqltemp = "select t.*,x.DepositID,m.OrgName from tb_accnt_teacher t "
    			+ "left join tb_deposit_teacher x on x.TeacherID=t.AccountID "
    	 		+ "left join tb_accnt_deposit m on m.AccountID=x.DepositID ";
    	return queryComonData(sqltemp,filter,order,pageNumber,pagesize);
    }
    
    
    public int  queryparentExist(String mobile)
    {
    	
    	String sqltemp = "select t.* from tb_accnt_parent t where t.Mobile='"+mobile+"'";
    	List list = jdbcTemplate.queryForList(sqltemp);
    	
    	if (list.isEmpty())
    	{
    		return -1;
    	}
    	Iterator it = list.iterator(); 
    	if(it.hasNext()) {  
    	    Map userMap = (Map) it.next();  
    	    System.out.println("AccountID="+userMap.get("AccountID"));
    	    return (Integer) userMap.get("AccountID");
//    	    System.out.print(userMap.get("user_id") + "\t");  
//    	    System.out.print(userMap.get("name") + "\t");  
//    	    System.out.print(userMap.get("sex") + "\t");  
//    	    System.out.println(userMap.get("age") + "\t");  
    	}  
    	return -1;
    }
    
    
    public ResultComn queryChildExtData(String filter ,String order,int pageNumber,int pagesize)
    {
    	
    	String sqltemp = " select t.AccountID,t.Name,t.Sex,t.FingerFeature,t.Remark,t.CreateTime,t.ModifyTime,n.Mobile as PMobile,x.ParentID,n.Name as PName,n.Sex as PSex ,n.WeiXinNo as PWeiXinNo, "
    			+ " n.Remark as PRemark,n.CreateTime as PCreateTime , n.ModifyTime as PModifyTime,"
    			+ "	x.RelationShip,n.Nick as PNick,m.DepositID,m.DepositStartTime,m.DepositEndTime,m.DepositType,v.OrgName "
    	 		+ " from tb_accnt_children t "
    	 		+ "left join  tb_parent_children x on x.ChildrenID = t.AccountID  "
    	 		+ "left join tb_accnt_parent n on n.AccountID= x.ParentID  "
    	 		+ "left join tb_deposit_children m on m.ChildrenID=t.AccountID "
    	 		+ "left join  tb_accnt_deposit v on v.AccountID=m.DepositID " ;
    	return queryComonData(sqltemp,filter,order,pageNumber,pagesize);
    }

  
    
    

    public ResultComn queryDeviceDetailData(String filter ,String order,int pageNumber,int pagesize)
    {
    	
    	String sqltemp = "   SELECT t.*,ac_de.OrgName, de_st.uploadtime FROM tb_device_detail t "
    			+ " left join tb_accnt_deposit ac_de on ac_de.AccountID=t.DepositID "
    			+ "	LEFT JOIN (SELECT MAX(t.CreateTime)as uploadtime,t.DepositID FROM  tb_device_status t GROUP BY  t.DepositID ) de_st on de_st.DepositID=t.DepositID ";
    	return queryComonData(sqltemp,filter,order,pageNumber,pagesize);
    }
    
    public ResultComn queryChildrenSingData(String filter ,String order,int pageNumber,int pagesize)
    {
    	
    	String sqltemp = " SELECT t.*,ac_ch.Name,ac_de.OrgName FROM tb_children_signin t  "
    			+ " LEFT JOIN tb_accnt_children ac_ch on ac_ch.AccountID=t.ChildID"
    			+ "	left join tb_accnt_deposit ac_de on ac_de.AccountID=t.DepositID ";
    	return queryComonData(sqltemp,filter,order,pageNumber,pagesize);
    }

    
    
    
    public ResultComn queryDepositDailyData(String filter ,String order,int pageNumber,int pagesize)
    {
    	
    	String sqltemp = " SELECT t.*,ac_de.OrgName,ac_tea.Name FROM tb_deposit_daily t   "
    			+ " left join tb_accnt_deposit ac_de on ac_de.AccountID=t.DepositID "
    			+ "	LEFT JOIN tb_accnt_teacher ac_tea on ac_tea.AccountID=t.PublisherID ";
    	return queryComonData(sqltemp,filter,order,pageNumber,pagesize);
    }
    
    
    public ResultComn queryParentOrderData(String filter ,String order,int pageNumber,int pagesize)
    {
    	
    	String sqltemp = "SELECT t.*,ac_pa.Name,ac_pa.Mobile,pr_se.BusinessName FROM tb_parent_order t "
    			+"LEFT JOIN tb_price_setting pr_se on pr_se.BusinessID=t.BusinessID"
    			+ " LEFT JOIN tb_accnt_parent ac_pa on ac_pa.AccountID=t.ParentID ";
    	return queryComonData(sqltemp,filter,order,pageNumber,pagesize);
    } 
    
    //上报记录
    public ResultComn queryDeviceStatusData(String filter ,String order,int pageNumber,int pagesize)
    {
    	
    	String sqltemp = "SELECT t.*,ac_de.OrgName,ac_de.ContactName,ac_de.ContactPhone FROM tb_device_status t "
    			+ " LEFT JOIN tb_accnt_deposit ac_de on ac_de.AccountID=t.DepositID ";
    	return queryComonData(sqltemp,filter,order,pageNumber,pagesize);
    } 
    
    //price table
    public ResultComn queryPriceSettingData(String filter ,String order,int pageNumber,int pagesize)
    {
    	
    	String sqltemp = "SELECT t.* FROM tb_price_setting t ";
    	return queryComonData(sqltemp,filter,order,pageNumber,pagesize);
    } 
    
    //insert table
    
    public int execomand(String sql)
    {
    	System.out.println(sql);
    	int ret = jdbcTemplate.update(sql);
    	System.out.println("ret="+ret);
    	return ret;
    	
    }
    
	public ResultComn queryComonData(String sql,  String filter ,String ordertemp,int pageNumber,int pagesize){
    	
    	String where="";
    	String order="";
    	if(filter!=null &&!"".endsWith(filter))
    	{
    		where = "where " + filter;
     	}
    	
    	if(ordertemp!=null &&!"".endsWith(ordertemp))
    	{
    		order = " order by  " + ordertemp;
     	}
    	
//    	String sqltemp = " select t.AccountID,t.Name,t.Sex,t.FingerFeature,t.Remark,t.CreateTime,t.ModifyTime,n.AccountID as parentAccountID,n.Name as partentName,n.Sex as partentSex"
//    	 		+ " from tb_accnt_children t "
//    	 		+ "left join  tb_parent_children x on x.ChildrenID = t.AccountID  "
//    	 		+ "left join tb_accnt_parent n on n.AccountID= x.ParentID  " ;
    	
    	int start = (pageNumber-1)*pagesize;
    	String sqltemp = "select count(*) from (" + sql+") t " + where ;
    	
    	System.out.println(sqltemp);
    	int TotalElements = jdbcTemplate.queryForInt(sqltemp);
    	System.out.println(TotalElements);
    	int totalPages=0;
    	int	numberOfElements;
    	if(TotalElements%pagesize==0)
    	{
    		numberOfElements=pagesize;
    		totalPages= TotalElements/pagesize;
    	}
    	else
    	{
    		numberOfElements=TotalElements%pagesize;
    		totalPages = TotalElements/pagesize+1;
    	}
    	
    	sqltemp = "select * from (" + sql+") t " + where + order +" limit "+start+" , "+pagesize;
    	
    	
    	List list = jdbcTemplate.queryForList(sqltemp);
    	
    	 System.out.println(list.toString());
		 return new ResultComn(0, "success", list,TotalElements,totalPages,numberOfElements,0, 0);
    }
	
	
}
