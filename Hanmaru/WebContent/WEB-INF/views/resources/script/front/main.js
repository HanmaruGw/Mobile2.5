$(function(){
	
	var download_area = $('#div_download_area');
	var login_area = $('#div_login_area');
	var input_user_id = $('#input_user_id');
	
	download_area.hide();
	login_area.show(2000,input_user_id.focus());
	
	var android_domain = 'https://m.halla.com/download';
	var ios_domain = 'https://m.halla.com/download';
	
	$('.btn_download.android').click(function(){
		$(location).attr('href', android_domain+'/hanmaru-release.apk');
	});
	
	$('.btn_download.ios').click(function(){
		$(location).attr('href', 'itms-services://?action=download-manifest&url='+ios_domain+'/hanmaru.plist');
	});
	
	//로그인
	$('#btn_login').on('click',function(){
		checkUserInfo();
	});
	
	$('#user_domain').on('click',function(){
		
	});
	
	loadDomainUrl();
});

function loginSuccess(){
	login_area.hide();
	download_area.show();
}

function checkUserInfo(){
	
	
	
}

function loadDomainUrl(){
	var userAgent = navigator.userAgent.toLowerCase();
	var agent='';
	if (userAgent.match('android') != null) { 
	    //android
		agent = 'android'
	} else if (userAgent.indexOf("iphone")>-1||userAgent.indexOf("ipad")>-1||userAgent.indexOf("ipod")>-1) { 
	    //ios
		agent = 'ios'
	};
	$.post('https://ep.halla.com/nmobile/login/Apptype',
			agent,
			function(data,state){
				var resData = JSON.parse(data.value);
				var domainList = resData.Domain;
				console.log(domainList);
				
				for(var i in domainList){
					$('#ul_domain_list').append('<li class="selectDomainList">' + 
						'<span class="selectDomainListTxt">' + domainList[i] + '</span>' +
					    '</li>');
				}
			}
	);
	
	$('#ul_domain_list  li').click(function(){
    	//console.log($(this).attr('data-input'));
//	    alert($(this).text('span'));	// this will alert data-input value.
		alert('1111');
		console.log('1111');
	 });

//	$('#ul_domain_list').each(function(){
//		 
//	});
	
//	var param = callApiObject('login', 'callDomainList', {'OS': $rs.agent});
//	$http(param).success(function(data) {
//		var code = parseInt(data.Code, 10);
//		if(code == 1){
//			var resData = JSON.parse(data.value);
//			$s.domainList = resData.Domain;
//			
//			$s.generalLogin_domain = $s.domainList[0];// halla.com //hd-bsnc.com
//			$s.simpleLogin_domain = $s.domainList[0];// halla.com
//		};
//	});
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