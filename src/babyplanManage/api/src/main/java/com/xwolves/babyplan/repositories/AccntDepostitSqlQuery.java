package com.xwolves.babyplan.repositories;

import java.sql.ResultSet;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.json.JSONObject;
import org.springframework.dao.DataAccessException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;

import com.xwolves.babyplan.entities.AccntDeposit;
import com.xwolves.babyplan.entities.ChildrenInfoExt;



public class AccntDepostitSqlQuery {

	private static String sqlStr = "select * from DSP_SIGNPROCESS s "
			+ "join DSP_DOCUMENT d on s.FWBH = d.FWBH "
			+ "where s.RQ between to_date(?,'yyyymmdd') and to_date(?,'yyyymmdd') "
			+ "order by s.BH "; 
	private JdbcTemplate jdbcTemplate;

	public AccntDepostitSqlQuery(DataSource dataSource) {
		this.jdbcTemplate = new JdbcTemplate(dataSource);
    }
    
    @SuppressWarnings({ "unchecked", "rawtypes" })
	public List<AccntDeposit> queryDepositData(){
    	
    	 List ttes = jdbcTemplate.queryForList("select * from tb_accnt_deposit ");
    	 System.out.println(ttes.toString());
		return ttes;
    }
    public int getNewId(){
	   	 int id = jdbcTemplate.queryForInt("select max(t.AccountID)  from tb_accnt_deposit t")+1;
	   	 return id;
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
	public String queryChildExtData(String sql,  String filter ,String order,Pageable pageable){
    	
    	String where="";
    	if(filter!=null &&"".endsWith(filter))
    	{
    		where = "where " + filter;
     	}
    	
    	if(order!=null &&"".endsWith(order))
    	{
    		order = "order by  " + order;
     	}
    	
//    	String sqltemp = " select t.AccountID,t.Name,t.Sex,t.FingerFeature,t.Remark,t.CreateTime,t.ModifyTime,n.AccountID as parentAccountID,n.Name as partentName,n.Sex as partentSex"
//    	 		+ " from tb_accnt_children t "
//    	 		+ "left join  tb_parent_children x on x.ChildrenID = t.AccountID  "
//    	 		+ "left join tb_accnt_parent n on n.AccountID= x.ParentID  " ;
    	
    	
    	String sqltemp = "select count(*) from " + sql+" " + where ;
    	
    	
    	int TotalElements = jdbcTemplate.queryForInt(sqltemp);
    	
    	
    	 List list = jdbcTemplate.queryForList("sqltemp");
    	 
    	 int id = jdbcTemplate.queryForInt("select max(t.AccountID)  from tb_accnt_deposit t")+1;
    	 
    	String jsonStr = new JSONObject(list).toString();
    	if (list.size() > 0) {
    		
    	    jsonStr ="{\"content\":" + jsonStr
    	      + ",\"totalElements\":" + TotalElements
    	      + ",\"last\":" + true
    	      + ",\"totalPages\":" + page.getTotalPages()
    	      + ",\"size\":" + page.getSize()
    	      + ",\"number\":" + page.getNumber()
    	            + ",\"numberOfElements\":" + page.getNumberOfElements()
//    	            + ",\"sort\":" + page.getSort()
    	            + ",\"first\":" + true
    	      + ",\"currentPage\":" + currentPage + "}";
    	   }
    	
    	 System.out.println(list.toString());
		 return jsonStr;
    }
}
