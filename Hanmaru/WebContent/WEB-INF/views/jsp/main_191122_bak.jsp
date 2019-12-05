<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>

<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta http-equiv="X-UA-Compatible" content="iE-edge">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"/>
		<link rel="stylesheet" href="/resources/css/style.css"/>
		
		<script type="text/javascript" src="/resources/script/lib/jq/jquery-2.1.3.min.js"></script>
		<script src="/resources/script/front/main.js"></script>
	</head>
	
	<body>
		<div id="pg_login">
			<div class="login_wrapper">
				<div class="wrap_login_area">
					<div class="subwrap_login_area">
						<img class="ic_login_logo" src="/resources/image/bg/login/login_logo.png">
					
						<div class="wrap_login_elem input_idpw">
							<c:if test="${isAndroid }">
								<a class="btn_download android">
									<img src="/resources/image/download/btn_android.png">
								</a>
							</c:if>
							<c:if test="${isIPhone }">
								<a class="btn_download ios">
									<img src="/resources/image/download/btn_ios.png">
								</a>
							</c:if>
						</div>
					</div>
					
					<span class="wrap_copyright">
						&copy; Halla Co., Ltd. | 
						<a href="tel:02-3434-5272">(02)3434 - 5272 / 5274</a> 
					</span>
				</div>
			</div>		
		</div>
	</body>
</html>