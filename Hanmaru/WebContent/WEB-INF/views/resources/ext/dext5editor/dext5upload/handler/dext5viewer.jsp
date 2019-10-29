<%@ page contentType="text/html;charset=utf-8"%><%@ page import="Raonwiz.Dext5.UploadHandler" %><%
	out.clear();
	
	request.setCharacterEncoding("UTF-8");
	
	UploadHandler upload = new UploadHandler();
	
	// 디버그시 사용(system.out.println 출력)
	// upload.SetDebugMode(true);

	// Viewer 페이지의 Encoding을 설정할 때 사용 (기본값 : utf-8)
	// upload.SetEncoding("utf-8");

	String result = upload.Viewer(request, response);

    if(!result.equals("")) {
		out.print(result);
	}
%>