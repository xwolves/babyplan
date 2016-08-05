package com.xwolves.babyplan.rest;

import java.util.logging.Logger;

import javax.persistence.Column;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import javax.sql.DataSource;

import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;

import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Date;
import java.util.List;

import org.json.JSONObject;
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
import org.springframework.web.multipart.MultipartFile;

import com.xwolves.babyplan.entities.AccntConsultant;
import com.xwolves.babyplan.entities.AccntDeposit;
import com.xwolves.babyplan.entities.ChildrenInfoExt;
import com.xwolves.babyplan.entities.Result;
import com.xwolves.babyplan.entities.ResultComn;
import com.xwolves.babyplan.repositories.AccntConsultantRepsitory;
import com.xwolves.babyplan.repositories.AccntDepositRepsitory;
import com.xwolves.babyplan.repositories.AccntDepostitSqlQuery;

//@CrossOrigin(origins = {"http://zssys.sustc.edu.cn:8080","http://zssys.sustc.edu.cn","http://localhost:63344","http://localhost:8080"}, methods={RequestMethod.GET,RequestMethod.POST,RequestMethod.PUT})
@RestController
@RequestMapping("/api/v1")
public class ApiRestService {

	private final static Logger logger = Logger.getLogger(ApiRestService.class.getName());
	
	private final static String thirdupdload="http://116.7.234.129/upload";

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
	public Result login(@RequestBody AccntConsultant ac, HttpServletRequest request, HttpServletResponse response)
			throws Exception {

		logger.info("getName" + ac.getName() + "password" + ac.getPassword());
		if (ac.getName() == null || ac.getName().equals("") || ac.getPassword() == null
				|| ac.getPassword().equals("")) {
			return new Result(Result.STATUS_FAIL,"账号和密码不能为空");
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
	 * @throws Exception 
	 */

	@RequestMapping(value = "/register", method = RequestMethod.POST, consumes = "application/json;charset=UTF-8", produces = "application/json;charset=UTF-8")
	public Result register(@RequestBody AccntDeposit ad, HttpServletRequest request, HttpServletResponse response) throws Exception {
		if (issessionok(request) == false) {
			response.setStatus(Result.STATUS_TIMEOUT);
			throw new Exception("TIMEOUT");
		}
		
		if (ad.getOrgName() == null) {
			return new Result(Result.STATUS_FAIL, "orgname is null");
		}
		if (ad.getAccountId() == null || ad.getAccountId() == 0)// 新增接口
		{
			ad.setAccountId(accntDepostquery.getNewId());
			ad.setPassword("123456");// 默认密码
			ad.setModifyTime(new Date());
			ad.setCreateTime(new Date());
		} else// update
		{
			AccntDeposit accntdepoist = adDao.findByAccountId(ad.getAccountId());
			ad.setPassword(accntdepoist.getPassword());
			ad.setModifyTime(new Date());
			ad.setCreateTime(accntdepoist.getCreateTime());
		}

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
			throw new Exception("TIMEOUT");
			// return null;
			// return new Result(Result.STATUS_TIMEOUT, "session is time out");
			// responseStatusTest();
		}

		Page<AccntDeposit> obj = adDao.findAll(pageable);

		return new Result(Result.STATUS_SUCCESS, "success", obj);
	}

	@RequestMapping(value = "/depositinfoOne", method = RequestMethod.GET)
	public Result depositinfoOne(@RequestParam(value = "id", required = true) int id, HttpServletRequest request,
			HttpServletResponse response) throws Exception {

		if (issessionok(request) == false) {
			if (issessionok(request) == false) {
				response.setStatus(Result.STATUS_TIMEOUT);
				throw new Exception("TIMEOUT");
			}
		}

		AccntDeposit obj = adDao.findByAccountId(id);

		return new Result(Result.STATUS_SUCCESS, "success", obj);
	}

	@RequestMapping(value = "/queryDepositinfo", method = RequestMethod.GET)
	public Result queryDepositinfo(@RequestParam(value = "pageNumber", required = true) int pageNumber,
			@RequestParam(value = "pageSize", required = true) int pageSize,
			@RequestParam(value = "filter", required = false) String filter,
			@RequestParam(value = "order", required = false) String order,
			HttpServletRequest request, HttpServletResponse response) throws Exception {
		
		if (issessionok(request) == false) {
			response.setStatus(Result.STATUS_TIMEOUT);
			throw new Exception("TIMEOUT");
		}
		
		ResultComn obj = accntDepostquery.queryDepositData(filter,order,pageNumber,pageSize);
		return new Result(Result.STATUS_SUCCESS, "success", obj);
		//return new Result(Result.STATUS_SUCCESS, "success", obj);
	}
	
	
	@RequestMapping(value = "/queryChildrenExtinfo", method = RequestMethod.GET)
	public Result queryChildrenExtinfo(@RequestParam(value = "pageNumber", required = true) int pageNumber,
			@RequestParam(value = "pageSize", required = true) int pageSize,
			@RequestParam(value = "filter", required = false) String filter,
			@RequestParam(value = "order", required = false) String order,
			HttpServletRequest request, HttpServletResponse response
			) throws Exception {
		
		if (issessionok(request) == false) {
			response.setStatus(Result.STATUS_TIMEOUT);
			throw new Exception("TIMEOUT");
		}

		ResultComn obj =  accntDepostquery.queryChildExtData(filter,order,pageNumber,pageSize);
		return new Result(Result.STATUS_SUCCESS, "success", obj);
		//return new Result(Result.STATUS_SUCCESS, "success", obj);
	}
	
	
	
	@RequestMapping(value = "/queryTeacherExtinfo", method = RequestMethod.GET)
	public Result queryTeacherExtinfo(@RequestParam(value = "pageNumber", required = true) int pageNumber,
			@RequestParam(value = "pageSize", required = true) int pageSize,
			@RequestParam(value = "filter", required = false) String filter,
			@RequestParam(value = "order", required = false) String order,
			HttpServletRequest request, HttpServletResponse response
			) throws Exception {
		
		if (issessionok(request) == false) {
			response.setStatus(Result.STATUS_TIMEOUT);
			throw new Exception("TIMEOUT");
		}
		
		ResultComn obj =  accntDepostquery.queryTeacherExtData(filter,order,pageNumber,pageSize);
		return new Result(Result.STATUS_SUCCESS, "success", obj);
		//return new Result(Result.STATUS_SUCCESS, "success", obj);
	}

	/**
	 * @param request
	 * @param file
	 * @return
	 */
	@RequestMapping(value = "/upload", produces = { "application/json" }, method = RequestMethod.POST)
	public String upload(HttpServletRequest request, @RequestParam("file") MultipartFile file) {
		if (!file.isEmpty()) {
			try {
				System.out.println(file.getOriginalFilename());
				String name = file.getOriginalFilename();
				byte[] bytes = file.getBytes();
				System.out.println(bytes.length);
				String realPath = request.getSession().getServletContext().getRealPath("/") + "upload/temp/" + name;
				System.out.println(realPath);
				BufferedOutputStream stream = new BufferedOutputStream(new FileOutputStream(new File(realPath)));

				logger.info("file " + realPath + "upload/temp/" + name);

				stream.write(bytes);
				stream.flush();
				stream.close();

				logger.info("success one ");
				// PostMethod postMethod=new
				// PostMethod("http://116.7.234.129/upload");

				// 1.构造HttpClient的实例
				String ret = FileFormUpload(realPath, thirdupdload);

				logger.info("ret " + ret);

				return ret;
			} catch (Exception e) {
				logger.info("You failed to upload " + " => " + e.getMessage());
				return null;
			}
		} else {
			logger.info( "You failed to upload " + " because the file was empty.");
			return null;
		}
	}

	/**
	 * @param request
	 * @param file
	 * @return
	 */
	@RequestMapping(value = "/uploadExt", produces = { "application/json" }, method = RequestMethod.POST)
	public String uploadExt(HttpServletRequest request, @RequestParam("file") MultipartFile file,
			@RequestParam("updatefield") String updatefield, @RequestParam("id") int id) {
		String ret = upload(request, file);		
		JSONObject jsonObject = new JSONObject(ret);
		
		int errno = jsonObject.getInt("errno");
		logger.info("errno="+errno);
		if(errno!=0)
		{
			return null;
		}
		JSONObject data = jsonObject.getJSONObject("data");
		
		String fileurl = data.getString("fileurl");
		logger.info("fileurl="+fileurl);
		if(fileurl== null)
		{
			return null;
		}

		AccntDeposit accntdepoist = adDao.findByAccountId(id);
		if (("frontDeskLink").equalsIgnoreCase(updatefield)) {
			accntdepoist.setFrontDeskLink(fileurl);
		} else if (("pubilcZoneLink").equalsIgnoreCase(updatefield)) {
			accntdepoist.setPubilcZoneLink(fileurl);
		} else if (("kitchenLink").equalsIgnoreCase(updatefield)) {
			accntdepoist.setKitchenLink(fileurl);
		} else if (("diningRoomLink").equalsIgnoreCase(updatefield)) {
			accntdepoist.setDiningRoomLink(fileurl);
		} else if (("restRoomLink1").equalsIgnoreCase(updatefield)) {
			accntdepoist.setRestRoomLink1(fileurl);
		} else if (("restRoomLink2").equalsIgnoreCase(updatefield)) {
			accntdepoist.setRestRoomLink2(fileurl);
		} else if (("ClassRoomLink1").equalsIgnoreCase(updatefield)) {
			accntdepoist.setClassRoomLink1(fileurl);
		} else if (("ClassRoomLink2").equalsIgnoreCase(updatefield)) {
			accntdepoist.setClassRoomLink2(fileurl);
		} else if (("otherRoomLink1").equalsIgnoreCase(updatefield)) {
			accntdepoist.setOtherRoomLink1(fileurl);
		} else if (("otherRoomLink2").equalsIgnoreCase(updatefield)) {
			accntdepoist.setOtherRoomLink2(fileurl);
		} else if (("id2PhotoLink").equalsIgnoreCase(updatefield)) {
			accntdepoist.setId2PhotoLink(fileurl);
		}
		

		adDao.saveAndFlush(accntdepoist);

		return ret;
	}

	// String url="http://116.7.234.129/upload";
	public String FileFormUpload(String filePath, String url) throws IOException {

		String result = null;

		File file = new File(filePath);
		if (!file.exists() || !file.isFile()) {
			System.out.println("文件不存在！");
			throw new IOException("文件不存在");
		}

		URL urlObj = new URL(url);

		HttpURLConnection con = (HttpURLConnection) urlObj.openConnection();

		con.setRequestMethod("POST");
		con.setDoInput(true);
		con.setDoOutput(true);
		con.setUseCaches(false); // post方式不能使用缓存
		con.setRequestProperty("Connection", "Keep-Alive");
		con.setRequestProperty("Charset", "UTF-8");

		String BOUNDARY = "----------" + System.currentTimeMillis();
		con.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + BOUNDARY);

		// 第一部分：
		StringBuilder sb = new StringBuilder();
		sb.append("--"); // 必须多两道线
		sb.append(BOUNDARY);
		sb.append("\r\n");
		sb.append("Content-Disposition: form-data;name=\"file\";filename=\"" + file.getName() + "\"\r\n");
		// sb.append("Content-Disposition: form-data;name=\"file\"" + "\"\r\n");
		sb.append("Content-Type:application/octet-stream\r\n\r\n");
		System.out.println("2222222222222222！");
		byte[] head = sb.toString().getBytes("utf-8");

		OutputStream out = new DataOutputStream(con.getOutputStream());
		out.write(head);

		// 文件正文部分
		// 把文件已流文件的方式 推入到url中
		DataInputStream in = new DataInputStream(new FileInputStream(file));
		int bytes = 0;
		byte[] bufferOut = new byte[1024];
		while ((bytes = in.read(bufferOut)) != -1) {
			out.write(bufferOut, 0, bytes);
		}
		in.close();

		// 结尾部分
		byte[] foot = ("\r\n--" + BOUNDARY + "--\r\n").getBytes("utf-8");// 定义最后数据分隔线
		out.write(foot);
		out.flush();
		out.close();

		StringBuffer buffer = new StringBuffer();
		BufferedReader reader = null;
		try {
			// 定义BufferedReader输入流来读取URL的响应
			reader = new BufferedReader(new InputStreamReader(con.getInputStream()));
			String line = null;
			while ((line = reader.readLine()) != null) {
				// System.out.println(line);
				buffer.append(line);
			}
			if (result == null) {
				result = buffer.toString();

				System.out.println("result111=" + result);
			}
		} catch (IOException e) {
			System.out.println("发送POST请求出现异常！" + e);
			e.printStackTrace();
			throw new IOException("数据读取异常");
		} finally {
			if (reader != null) {
				reader.close();
			}
		}

		return result;

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
