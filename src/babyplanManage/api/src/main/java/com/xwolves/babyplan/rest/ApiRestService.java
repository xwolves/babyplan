package com.xwolves.babyplan.rest;


//import java.util.Map;
import java.util.logging.Logger;


//import javax.servlet.http.HttpServletRequest;

//import org.jasig.cas.client.authentication.AttributePrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


import com.xwolves.babyplan.entities.AccntDeposit;
import com.xwolves.babyplan.entities.Result;
import com.xwolves.babyplan.repositories.AccntDepositRepsitory;

//@CrossOrigin(origins = {"http://zssys.sustc.edu.cn:8080","http://zssys.sustc.edu.cn","http://localhost:63344","http://localhost:8080"}, methods={RequestMethod.GET,RequestMethod.POST,RequestMethod.PUT})
@RestController
@RequestMapping("/api/v1")
public class ApiRestService {

	private final static Logger logger = Logger.getLogger(ApiRestService.class.getName());

	@Autowired
	AccntDepositRepsitory adDao;

	/**
	 * /api/v1/login 登录
	 * 
	 * @param user
	 * @param password
	 */
	@RequestMapping(value = "/login", method = RequestMethod.POST, consumes = "application/json;charset=UTF-8", produces = "application/json;charset=UTF-8")
	public Result login(@RequestBody AccntDeposit ad) {

		return new Result(Result.STATUS_FAIL, "not is exits");
	}

	@RequestMapping(value = "/register", method = RequestMethod.POST, consumes = "application/json;charset=UTF-8", produces = "application/json;charset=UTF-8")
	public Result register(@RequestBody AccntDeposit ad) {
		ad = adDao.saveAndFlush(ad);
		logger.info("save obj " + ad);
		return new Result(Result.STATUS_SUCCESS, "success", ad);	
	}
	
	

}
