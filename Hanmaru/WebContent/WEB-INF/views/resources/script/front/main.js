$(function(){
	var download_area = $('#div_download_area');
	var login_area = $('#div_login_area');
	var input_user_id = $('#input_user_id');
	var domain_list = $('#ul_domain_list');
	
	var android_domain = 'https://m.halla.com/download';
	var ios_domain = 'https://m.halla.com/download';
    var userLoginKey = '';

	//init UI
	domain_list.hide();
	download_area.hide();
	login_area.show(2000,input_user_id.focus());
	
	//domain list load
	loadDomainUrl();
	
	//download button
	$('.btn_download.android').click(function(){
		sendToDownloadLog(userLoginKey);
		$(location).attr('href', android_domain+'/hanmaru-release.apk');
	});
	
	$('.btn_download.ios').click(function(){
		sendToDownloadLog(userLoginKey);
		$(location).attr('href', 'itms-services://?action=download-manifest&url='+ios_domain+'/hanmaru.plist');
	});
	
	//로그인
	$('#btn_login').on('click',function(){
		checkUserInfo(function(data){
			if(data.Code == 1){
				var userInfo = JSON.parse(data.value);
				userLoginKey = userInfo.LoginKey;
				
				$('#pg_login').addClass('success'); 	
				$('#div_login_area').hide();
				$('#btn_login').hide();
				$('#div_download_area').show();
//				$('#div_download_area').fadeIn(500,input_user_id.focus());
			}else{
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
	//여기서 로그 남기는 API 추가할것.
	console.log(userLoginKey);
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

function loadDomainUrl(){
	var userAgent = navigator.userAgent.toLowerCase();
	var agent = '';
	var domain = '';
	if (userAgent.match('android') != null) { 
		agent = 'android'
	} else if (userAgent.indexOf("iphone")>-1||userAgent.indexOf("ipad")>-1||userAgent.indexOf("ipod")>-1) { 
		agent = 'ios'
	};
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

//$(function(){
// var android_domain = 'https://hanmaru.exs-mobile.com:38080/download';
//// var ios_domain = 'https://hanmaru.exs-mobile.com:38080/download';
// var ios_domain = 'https://www.exs-mobile.com/wp-content/uploads/app'
//  
// $('.btn_download.android').click(function(){
//	 $(location).attr('href', android_domain+'/hdbsncM-android.apk');
// });
// 
// $('.btn_download.ios').click(function(){
//	 $(location).attr('href', 'itms-services://?action=download-manifest&url='+ios_domain+'/hdbsncM.plist');
// });
//});