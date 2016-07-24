<%@page contentType="text/html"%>
<%@page pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
   "http://www.w3.org/TR/html4/loose.dtd">

<!-- 转向路径必须跟登录路径不一致才不会报ticket错误，所有后面加了个'/' -->
<%! String cas_url="/";%>
<%
  session.invalidate();
  response.sendRedirect(cas_url);
%>

<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>应用退出</title>
    </head>
    <body>
    	<h1>应用退出</h1>
	    <p>即将自动退出应用，请稍后</p>
	    <hr>
	    <a href="<%=cas_url%>">手动退出</a>
    </body>
</html>
