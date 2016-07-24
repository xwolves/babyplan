package com.xwolves.babyplan.rest;

import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.xwolves.babyplan.entities.AccntConsultant;
import com.xwolves.babyplan.entities.AccntDeposit;
import com.xwolves.babyplan.entities.MyPageable;
import com.xwolves.babyplan.entities.Result;
import com.xwolves.babyplan.repositories.AccntConsultantRepsitory;
import com.xwolves.babyplan.repositories.AccntDepositRepsitory;

//@CrossOrigin(origins = {"http://zssys.sustc.edu.cn:8080","http://zssys.sustc.edu.cn","http://localhost:63344","http://localhost:8080"}, methods={RequestMethod.GET,RequestMethod.POST,RequestMethod.PUT})
@RestController
@RequestMapping("/api/v1")
public class ApiRestService {

	private final static Logger logger = Logger.getLogger(ApiRestService.class.getName());

	@Autowired
	AccntConsultantRepsitory acDao;// 顾问

	@Autowired
	AccntDepositRepsitory adDao;// 托管结构

	private boolean issessionok(HttpServletRequest request) {
		HttpSession session = request.getSession(false);
		if (session == null) {
			return false;
		}
		return true;
	}

	/**
	 * /api/v1/login //顾问登录 { "name": "test", "password": "123456" }
	 * 
	 * @param user
	 * @param password
	 */
	@RequestMapping(value = "/login", method = RequestMethod.POST, consumes = "application/json;charset=UTF-8", produces = "application/json;charset=UTF-8")
	public Result login(@RequestBody AccntConsultant ac, HttpServletRequest request, HttpServletResponse response) {

		logger.info("getName" + ac.getName() + "password" + ac.getPassword());
		List<AccntConsultant> obj = acDao.findByNameAndPassword(ac.getName(), ac.getPassword());
		if (obj != null && obj.size() > 0) {

			HttpSession session = request.getSession();
			return new Result(Result.STATUS_SUCCESS, "login success", obj.get(0));
		} else {
			return new Result(Result.STATUS_FAIL, "not is exits");
		}
		//
		// return new Result(Result.STATUS_FAIL, "not is exits");
	}

	/**
	 * /api/v1/register //注册托管用户 { "accountId":"11111", "orgName":
	 * "test","password": "123456" }
	 * 
	 * @param AccntDeposit
	 *            body
	 */

	@RequestMapping(value = "/register", method = RequestMethod.POST, consumes = "application/json;charset=UTF-8", produces = "application/json;charset=UTF-8")
	public Result register(@RequestBody AccntDeposit ad, HttpServletRequest request) {
		if (issessionok(request) == false) {
			return new Result(Result.STATUS_FAIL, "session is time out");
		}
		if (ad.getOrgName() == null) {
			return new Result(Result.STATUS_FAIL, "orgname is null");
		}
		ad.setPassword("123456");// 默认密码
		ad = adDao.saveAndFlush(ad);
		logger.info("save obj " + ad);
		return new Result(Result.STATUS_SUCCESS, "success", ad);
	}

	@RequestMapping(value = "/depositinfo", method = RequestMethod.GET)
	public Result depositinfo(@RequestParam(value="pageNumber",required=false) String pageNumber,
    		@RequestParam(value="pageSize",required=false) String pageSize,
    		@RequestParam(value="offset",required=false) String offset,HttpServletRequest request) {
		

		logger.info("pageNumber" + pageNumber + "pageSize" + pageSize+"offset" + offset);
		MyPageable pageable = new MyPageable();
		pageable.setPageNumber(Integer.parseInt(pageNumber));
		pageable.setOffset(Integer.parseInt(offset));
		pageable.setPageSize(Integer.parseInt(pageSize));
		
//		if (issessionok(request) == false) {
//			return new Result(Result.STATUS_FAIL, "session is time out");
//		}
//		

		Page<AccntDeposit> obj = adDao.findAll(pageable);
		return new Result(Result.STATUS_SUCCESS, "success", obj);
	}
	
	

}
