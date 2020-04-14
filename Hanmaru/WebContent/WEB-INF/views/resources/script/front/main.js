$(function(){
	var download_area = $('#div_download_area');
	var login_area = $('#div_login_area');
	var input_user_id = $('#input_user_id');
	var domain_list = $('#ul_domain_list');
	
	var android_domain = 'https://m.halla.com/download';
	var ios_domain = 'https://m.halla.com/download';
    var userLoginKey = '';
    
    var agent = '';
 // 모바일 에이전트 구분
	var isMobile = {
	        Android: function () {
	                 return navigator.userAgent.match(/Android/i) == null ? false : true;
	        },
	        BlackBerry: function () {
	                 return navigator.userAgent.match(/BlackBerry/i) == null ? false : true;
	        },
	        IOS: function () {
	                 return navigator.userAgent.match(/iPhone|iPad|iPod/i) == null ? false : true;
	        },
	        Opera: function () {
	                 return navigator.userAgent.match(/Opera Mini/i) == null ? false : true;
	        },
	        Windows: function () {
	                 return navigator.userAgent.match(/IEMobile/i) == null ? false : true;
	        },
	        any: function () {
	                 return (isMobile.Android() || isMobile.BlackBerry() || isMobile.IOS() || isMobile.Opera() || isMobile.Windows());
	        },
	        Naver : function() {
	        		return navigator.userAgent.indexOf('NAVER(inapp') !== -1  ? true : false;
	        }
	};
	
	if(isMobile.any()){
	    if(isMobile.Android()){
	    	$('#download_btn_img').attr('src','/resources/image/download/btn_android.png');
	    	agent = 'android'
	    }else if(isMobile.IOS()){
	    	$('#download_btn_img').attr('src','/resources/image/download/btn_ios.png');
	    	agent = 'ios'
	    }else if(isMobile.BlackBerry()){
	    	$('#download_btn_img').attr('src','/resources/image/download/btn_android.png');
	    	agent = 'android'
	    }else if(isMobile.Opera()){
	    	$('#download_btn_img').attr('src','/resources/image/download/btn_android.png');
	    	agent = 'android'
	    }else if(isMobile.Windows()){
	    	$('#download_btn_img').attr('src','/resources/image/download/btn_ios.png');
	    	agent = 'ios'
	    }else if(isMobile.Naver()){
	    	$('#download_btn_img').attr('src','/resources/image/download/btn_android.png');
	    	agent = 'android'
	    }
	}else{
//		console.log('Not Mobile!');
		$('#download_btn_img').attr('src','/resources/image/download/btn_ios.png');
	}
//	console.log(agent);

	//init UI
	domain_list.hide();
	download_area.hide();
	login_area.show(2000,input_user_id.focus());
	
	//domain list load
	loadDomainUrl(agent);
	
	//download button
	$('#download_btn_img').click(function(){
		if(agent == 'android'){
			$(location).attr('href', android_domain+'/hanmaru-release.apk');
			sendToDownloadLog(userLoginKey);
		}else{
			$(location).attr('href', 'itms-services://?action=download-manifest&url='+ios_domain+'/hanmaru.plist');
			sendToDownloadLog(userLoginKey);
		}
	});
	
	//로그인
	$('#btn_login').on('click',function(){
		checkUserInfo(function(data){
			var code = data.Code;
			if(code == 1){
				var userInfo = JSON.parse(data.value);
				userLoginKey = userInfo.LoginKey;
				
				$('#pg_login').addClass('success'); 	
				$('#div_login_area').hide();
				$('#btn_login').hide();
				$('#div_download_area').show();
//				$('#div_download_area').fadeIn(500,input_user_id.focus());
			}
			else if(code == -5){ //비밀번호 변경 3개월 경과
				alert('간편 비밀번호 변경 후 이용 가능합니다');
			}
			else if(code == -4){ //계정 잠금.
				alert('계정이 잠겼습니다. 한마루 사이트에서 잠금해제 후 사용 가능합니다\n[setting > 모바일앱 탭에서 변경]');
			}
			else if(code == -6){//기기 잠금.
				alert('해당 디바이스는 접속차단 상태입니다. 한마루 사이트에서 차단해제후 사용가능합니다.\n[setting > 모바일앱 탭에서 변경]');
			}
			else{
				alert('아이디 혹은 비밀번호를 확인해 주세요');
			}
		});
	});
	
	//도메인 선택
	$('#user_domain').on('click',function(){
		$('#ul_domain_list').toggle();
	});
	
});

function sendToDownloadLog(userLoginKey){
	$.post('https://ep.halla.com/nmobile/login/AppDownload',
			{LoginKey:userLoginKey},
			function(data){
			}
	);
}

function checkUserInfo(checkCallback){
	var userID = $('#input_user_id').val();
	var userPASS = $('#input_user_pass').val();
	var userDomain = $('#user_domain').html().replace('@ ','');
	
	if(userID === '' || userPASS === '' ){
		alert('아이디 혹은 비밀번호를 확인해 주세요');
		return;
	}
	var loginData = {
			userID: userID, 
			DeviceID:'',
			PhoneModel:'',
			PhoneBrand:'',
			Password:userPASS,
			AppVersion:'',
			AppType:userDomain
		};
	$.post('https://ep.halla.com/nmobile/login/Login',
			loginData,
			function(data){
				checkCallback(data);
			}
	);
}

function loadDomainUrl(agent){
	var domain = '';
	
	$.post('https://ep.halla.com/nmobile/login/Apptype',
			agent,
			function(data,state){
				var resData = JSON.parse(data.value);
				var domainList = resData.Domain;
				for(var i in domainList){
					$('#ul_domain_list').append('<li class="selectDomainList">' + 
						'<span class="selectDomainListTxt">' + domainList[i] + '</span>' +
					    '</li>');
				}
			}
	);
	
	$('#ul_domain_list').on('click','li', function(){
        $('#user_domain').text('@ '+$(this).text());
        $('#ul_domain_list').toggle();
	});
	
}
