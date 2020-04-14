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
						<!-- <img class="ic_login_logo" src="/resources/image/bg/login/login_logo.png"> -->
						<div id="div_download_area" >
							<div class="wrap_login_elem input_idpw">
								<%-- <c:if test="${isAndroid }">
									<a class="btn_download android">
										<img src="/resources/image/download/btn_android.png">
									</a>
								</c:if>
								<c:if test="${isIPhone }">
									<a class="btn_download ios">
										<img src="/resources/image/download/btn_ios.png">
									</a>
								</c:if> --%>
								<a class="btn_download">
									<img id="download_btn_img" src="/resources/image/download/btn_android.png">
								</a>
							</div>
						</div>
	
						<div id="div_login_area">
							<div class="wrap_login_renewal_elem" >
								<div class="wrap_login_renewal_elem_box">
									<p class="login_renewal_elem_box_loginlabel">Login ID</p>
				 					<div class="login_renewal_elem_box_write">
					 					<input id="input_user_id" type="text" placeholder="아이디를 입력하세요." class="login_renewal_box_write">
					 						<span id="user_domain" class="login_renewal_elem_email" >@ Halla.com</span>
						 					<ul id="ul_domain_list" class="selectDomain" >
											</ul>
					 					
				 					</div>
								</div>
								<div class="wrap_login_renewal_elem_box pw_box">
									<p class="login_renewal_elem_box_pwlabel">Password</p>
				 					<div class="login_renewal_elem_box_pw_write">
					 					<input id="input_user_pass" type="password" ng-model="general_pw" placeholder="비밀번호를 입력하세요." class="login_renewal_box_pw_write">
				 					</div>
								</div>
							</div> 
						</div>						
						
					</div> 
					
					<div class="btn_generaLogin_wrapper">
						<button type="button" class="btn_generalLogin" id="btn_login" >회원확인</button>
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