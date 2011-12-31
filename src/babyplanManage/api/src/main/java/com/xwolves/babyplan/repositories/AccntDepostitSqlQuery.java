package com.xwolves.babyplan.repositories;

import java.sql.ResultSet;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import javax.sql.DataSource;

import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.ResultSetExtractor;
import org.springframework.jdbc.core.RowMapper;

import com.xwolves.babyplan.entities.AccntDeposit;



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
	public List<AccntDeposit> queryData(){
//    	return (List<AccntDeposit>) jdbcTemplate.queryForList("select * from tb_test1 where username = ?",   
//                new Object[]{"sss"},  
//                AccntDeposit.class);    
    	
    	 List ttes = jdbcTemplate.queryForList("select * from tb_accnt_deposit ");
    	 System.out.println(ttes.toString());
    	//List<AccntDeposit> test=  jdbcTemplate.queryForList("select * from tb_accnt_deposit ",  AccntDeposit.class);
//    	return jdbcTemplate.query("select * from tb_accnt_deposit where OrgName like '%?%'",   
//                new Object[]{"test"},   
//                new int[]{java.sql.Types.VARCHAR},   
//                new RowMapper(){               
//                    @Override  
//                    public Object mapRow(ResultSet rs, int rowNum) throws SQLException {  
//                    	AccntDeposit user  = new AccntDeposit();  
//                    	System.out.println(rs.toString());
////                        user.setAccountId(rs.); 
////                        user.setUsername(rs.getString("username"));  
////                        user.setPassword(rs.getString("password"));  
//                        return user;  
//                    }  
//        }); 
		return ttes;
    }


}
