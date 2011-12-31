package com.xwolves.babyplan.rest;

import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.xwolves.babyplan.entities.AccntConsultant;
import com.xwolves.babyplan.entities.AccntDeposit;
import com.xwolves.babyplan.entities.Result;
import com.xwolves.babyplan.repositories.AccntConsultantRepsitory;
import com.xwolves.babyplan.repositories.AccntDepositRepsitory;
import com.xwolves.babyplan.repositories.AccntDepostitSqlQuery;

//@CrossOrigin(origins = {"http://zssys.sustc.edu.cn:8080","http://zssys.sustc.edu.cn","http://localhost:63344","http://localhost:8080"}, methods={RequestMethod.GET,RequestMethod.POST,RequestMethod.PUT})
@RestController
@RequestMapping("/api/v1")
public class ApiRestService {

	private final static Logger logger = Logger.getLogger(ApiRestService.class.getName());

	@Autowired
	AccntConsultantRepsitory acDao;// 顾问

	@Autowired
	AccntDepositRepsitory adDao;// 托管结构

	AccntDepostitSqlQuery accntDepostquery;

	@Autowired
	public void setDataSource(DataSource dataSource) {
		// statisticsMappingQuery = new StatisticsMappingSqlQuery(dataSource);
		// signDetailMappingQuery = new SignDetailMappingSqlQuery(dataSource);
		// signDetailDateMappingQuery = new
		// SignDetailDateMappingSqlQuery(dataSource);
		accntDepostquery = new AccntDepostitSqlQuery(dataSource);
	}

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
	 * @throws Exception 
	 */
	@RequestMapping(value = "/login", method = RequestMethod.POST, consumes = "application/json;charset=UTF-8", produces = "application/json;charset=UTF-8")
	public Result login(@RequestBody AccntConsultant ac, HttpServletRequest request, HttpServletResponse response)  {

		logger.info("getName" + ac.getName() + "password" + ac.getPassword());
		if((ac.getName()==null&& ac.getName().equals(""))||(ac.getPassword()==null&& ac.getPassword().equals("")))
		{
			response.setStatus(Result.STATUS_TIMEOUT);
			//throw new Exception("i don't know");
		}
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
	public Result register(@RequestBody AccntDeposit ad, HttpServletRequest request, HttpServletResponse response) {
		if (issessionok(request) == false) {
			response.setStatus(Result.STATUS_TIMEOUT);
			return new Result(Result.STATUS_TIMEOUT, "session is time out");
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
	public Result depositinfo(@RequestParam(value = "pageNumber", required = false) int pageNumber,
			@RequestParam(value = "pageSize", required = false) int pageSize,
			@RequestParam(value = "sortType", required = false, defaultValue = "0") int sortType,
			@RequestParam(value = "sortString", required = false) String sortString,

			@RequestParam(value = "orgname", required = false) String orgname,
			@RequestParam(value = "address", required = false) String address,
			@RequestParam(value = "contactname", required = false) String contactname,
			@RequestParam(value = "contactphone", required = false) String contactphone,
			@RequestParam(value = "licenseType", required = false) String licenseType,
			@RequestParam(value = "placeContractType", required = false) String placeContractType,

			HttpServletRequest request, HttpServletResponse response) throws Exception {

		// Pageable pageable = new PageRequest(pageNumber, pageSize);

		Sort sort = new Sort(Direction.DESC, "accountId");
		;
		if (sortString != null) {
			if (sortType == 0) {
				sort = new Sort(Direction.ASC, sortString);
			} else {
				sort = new Sort(Direction.DESC, sortString);
			}
		}

		// logger.info("pageNumber" + pageNumber + "pageSize" +
		// pageSize+"sortType" + sortType);
		// int offsettemp =
		// (Integer.parseInt(pageNumber)-1)*Integer.parseInt(pageSize);
		// MyPageable pageable = new MyPageable();
		// pageable.setPageNumber(Integer.parseInt(pageNumber));
		// pageable.setOffset(offsettemp);
		// pageable.setPageSize(Integer.parseInt(pageSize));
		if (orgname != null) {

		}

		Pageable pageable = new PageRequest((pageNumber - 1), pageSize, sort);

		if (issessionok(request) == false) {
			response.setStatus(Result.STATUS_TIMEOUT);
			// throw new Exception("出现壹！");
			// responseStatusTest();
			throw new Exception("i don't know");
			// return null;
			// return new Result(Result.STATUS_TIMEOUT, "session is time out");
			// responseStatusTest();
		}

		Page<AccntDeposit> obj = adDao.findAll(pageable);

		return new Result(Result.STATUS_SUCCESS, "success", obj);
	}

	@RequestMapping(value = "/depositinfoOne", method = RequestMethod.GET)
	public Result depositinfoOne(@RequestParam(value = "id", required = true) int id,
			HttpServletRequest request, HttpServletResponse response) throws Exception {

		if (issessionok(request) == false) {
			response.setStatus(Result.STATUS_TIMEOUT);
			// throw new Exception("出现壹！");
			// responseStatusTest();
			throw new Exception("i don't know");
			// return null;
			// return new Result(Result.STATUS_TIMEOUT, "session is time out");
			// responseStatusTest();
		}

		AccntDeposit obj = adDao.findByAccountId(id);

		return new Result(Result.STATUS_SUCCESS, "success", obj);
	}

	@RequestMapping(value = "/queryDepositinfo", method = RequestMethod.GET)
	public Result queryDepositinfo() {
		List<AccntDeposit> obj = accntDepostquery.queryData();
		return new Result(Result.STATUS_SUCCESS, "success", obj);
	}

	@ResponseStatus(reason = "no reason", value = HttpStatus.BAD_REQUEST)
	@RequestMapping("/responsestatus")
	public void responseStatusTest() {

	}

	@ExceptionHandler
	public String handleException(Exception e, HttpServletRequest request) {
		System.out.println(e.getMessage());
		return e.getMessage();
	}

}
