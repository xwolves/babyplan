package com.xwolves.babyplan.rest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.xwolves.babyplan.entities.Result;


@Controller
@RequestMapping("/")
public class MvcController {

	@RequestMapping(value="showIndex",method=RequestMethod.GET)
	public Result showIndex(HttpServletRequest request, HttpServletResponse response) {
		
		HttpSession session = request.getSession(false);
		if (session == null) {
			System.out.println("start111");
			System.out.println("is timeout");

			session = request.getSession();
			System.out.println(session.toString());

			System.out.println("getId=" + session.getId());
			System.out.println("out time=" + session.getMaxInactiveInterval());

			System.out.println("LastAccessedTime=" + session.getLastAccessedTime());
		}
		else
		{
			System.out.println("start2222");
			System.out.println(session.toString());

			System.out.println("getId=" + session.getId());
			System.out.println("out time=" + session.getMaxInactiveInterval());

			System.out.println("LastAccessedTime=" + session.getLastAccessedTime());
		}

		return new Result(Result.STATUS_SUCCESS, "success", null);
	}
}
