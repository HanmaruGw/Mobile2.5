//$scope ==> $s
//$rootScope ==> $rs
var androidWebView = window.AndroidBridge;
//모듈 구분 (순서대로)
//'oc.lazyLoad' : 스크립트 로드 딜레이
//'slip' : 메일 스와이프 삭제
//'angular-carousel' : 배너이미지 슬라이더
//'angularLazyImg' : 이미지 로딩 처리
var appHanmaru = angular.module('appHanmaru', ['ngSanitize','ngRoute','ngAnimate','oc.lazyLoad','slip','angular-carousel'])//,'angularLazyImg'
.config(function($sceDelegateProvider, $compileProvider) {
	$sceDelegateProvider.resourceUrlWhitelist(['self','http://play.smartucc.kr','http://m.mvod.gabia.com']);
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|sms):/);
});
var globalTest;
var mailBody='';
///TEST MODE on / off
var isTest = true; 
var LoginCountID = '';
var LoginLockCnt = 0;


//2019.12.20 - 메인화면 가로 배너 스크롤시 스와이프 안되도록 체크하는 변수
appHanmaru.value('shouldFire', function(element){
    var update = true;
    var current = element;
    while(current && current != document.body){
       if(current.getAttribute('sideMenuswipe')=='cancel'){
	       update = false;
	       break;
       }
       current = current.parentElement;
    }	
    return update;
});

//splash controller
appHanmaru.controller('splashController', ['$scope', '$http', '$rootScope','$timeout','$ocLazyLoad', function($s, $http, $rs, $timeout,$ocLazyLoad) {
	$rs.checkAutoLogin = function(){
		var loginData = { userID:$rs.appUserId, DeviceID:$rs.deviceID,
				AppVersion:$rs.appVersion, AppType:'' };

		//TEST MODE
		if(isTest){
//			$rs.appVersion = '257';
			$rs.appUserId = 'jh1.jang';
			$rs.appPinNumber = '147258';
			loginData = { userID:'jh1.jang', DeviceID:'3e13471838b3c810',
					AppVersion:'257', AppType:'android' };
		}

		var param = callApiObject('login', 'autoLogin', loginData);
		$http(param).success(function(data) {
			var code = parseInt(data.Code, 10);
			
			if(code == 1){
				var autoLoginInfo = JSON.parse(data.value);
				
				var accessInfoData = {
					userID : $rs.appUserId,
					userPwd : autoLoginInfo.Password,
					isPinLogin : true,
					inputPinNumber : $rs.appPinNumber,
					generalLogin_domain : '',
				};
				
				
				// 언어설정.
				$rs.translateLanguageLoginPage = function(htmlID) {
					var localLang = localStorage.getItem("language");
					var langType = localLang == undefined || localLang === null ? "KOR" : autoLoginInfo.Lang;
					var str = language[langType][htmlID];
					return str;
				};
				
				if(autoLoginInfo.AutoLogin=='Y'){
					$rs.accessUser(accessInfoData);
				}else{
					$rs.$broadcast('initLoginPage');
				};
			}else{
				// 언어설정.
				$rs.translateLanguageLoginPage = function(htmlID) {
					var localLang = localStorage.getItem("language");
					var langType = "KOR";
					var str = language[langType][htmlID];
					return str;
				};
				$rs.$broadcast('initLoginPage');
			};
			
		});
	};
	
	//버전체크
	$s.isVersionUpdate = false;
	$s.versionCheck = function(){
//		console.log('앱 버전 : ',$rs.appVersion);
		//ios 앱 버전 못들고 오는 현상
		if($rs.appVersion == '' || $rs.appVersion == undefined || $rs.appVersion == null){
			if($rs.agent=='ios') {
				webkit.messageHandlers.sendDeviceInfo.postMessage("success");
			};	
		}
		
		var param = callApiObject('login', 'versionCheck', {OS : $rs.agent});
		$http(param).success(function(data) {
			var resData = JSON.parse(data.value);

			//ios 앱 버전 못들고 오는 현상
			if($rs.appVersion == '' || $rs.appVersion == undefined || $rs.appVersion == null){
				if($rs.agent=='ios') {
					$rs.appVersion = resData.Version;
				}
			}
			
			console.log('Response app version : ',resData.Version);
			console.log('Current app version : ',$rs.appVersion);
			
			if(resData.Version == $rs.appVersion){ // 최신버전
				$s.isVersionUpdate = false;
				$rs.checkAutoLogin();
			}else{
				$rs.dialog_progress = false;
				$s.isVersionUpdate = true;
				
//				var curVersion = '[현재버전 : ' + $rs.appVersion + ' / '; 
//				var svVersion = '최신버전 : ' + resData.Version + ']';
//				alert(curVersion + svVersion + '\n새로운 버전이 존재합니다.\n다운로드 페이지로 이동합니다\n[A new version exists. Go to the download page]');
//				
//				if($rs.agent == 'android'){
//					window.open('https://m.halla.com','_blank');
//				}else if($rs.agent=='ios') {
//					webkit.messageHandlers.sendDownloadUrl.postMessage('https://m.halla.com');
//				};
				
				showUpdatePopup(resData);
			}; 
		});
	};
	
	$s.updateMessageList = new Array();
	function showUpdatePopup(resData){
		var message = getVersionHistory($rs.agent);
//		var message = getVersionHistory($rs.agent);
		var curVersion = '[현재버전 : ' + $rs.appVersion + ' / '; 
		var svVersion = '최신버전 : ' + resData.Version + ']';
		$s.updateHeaderMessage = curVersion + svVersion;
		
		$s.updateMessageList = message.split(',')
	}
	
	$s.appDownloadBtn = function(){
		if($rs.agent == 'android'){
			window.open(getAndroidDownloadUrl(),'_blank');
		}else{
			webkit.messageHandlers.sendDownloadUrl.postMessage(getIosDownloadUrl());
		}
	}
	
	// ios
	deviceInfo = function (deviceId, model, brand, version, gcmToken){
		$rs.deviceID = deviceId;
		$rs.phoneModel = model;
		$rs.phoneBrand = brand;
		$rs.appVersion = version;
		$rs.gcmToken = gcmToken;
	};
	
	//lazy load
	$ocLazyLoad.load([
	  '/resources/script/lib/calendar/moment.min.js',
	  '/resources/script/lib/pinchZoom/jquery.pinchzoomer.min.js',
	  '/resources/script/lib/pinchZoom/pinch-zoom.umd.js',
	]).then(function(){
		$timeout(function(){
			if(isTest)$rs.checkAutoLogin();
			else{
				if($rs.agent == 'other' || $rs.agent == '')$rs.checkAutoLogin();
				else{
//					console.log('version check!');
					$s.versionCheck();
				}
			}
		},1000);
	});
	
}]);

// loginController
appHanmaru.controller('loginController', ['$scope', '$http', '$rootScope', function($s, $http, $rs) {
	$rs.apiURL = '';
	// 간편 로그인을 위한 AOS / IOS 저장 id
//	$rs.appUserId = ''; //2019.10.24 수정 - jh.j
	$s.pin_input_id = '';
	$s.pin_input_pwd = '';
	$s.isPinLogin = true; // 간편 핀번호 로그인 여부
	$s.isShowLoginPopup = false; // 간편 핀번호 설정 로그인창 팝업.
	$s.isShowPinInputPopup = false; // 간편 핀번호 설정 번호입력 팝업.
	$s.settingPinNumber = ''; // 핀번호 설정시 입력하는 핀번호.
	$s.inputPinNumber = ''; // 로그인시 입력하는 핀번호
	$s.domainList = new Array();
	$s.isOpenDomainPopup = false;
	$s.curDomainIdx = 0;
	$s.loginImageUrl = '';
	
	$rs.$on('initLoginPage', function(event) {
		$s.general_id = '';
		$s.general_pw = '';
		LoginLockCnt = 0;
		
		initPinCss();
		
		var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
		pushPage(pageName, 'pg_login');
//		$rs.dialog_progress = true;
//		
//		setTimeout(function(){
//			$rs.$apply(function(){
//				$rs.dialog_progress = false;
//			});
//		}, 500);
		
		// 최초 로딩(editor load)
		var autoLoginCheck = false;
		
		callLoginImage();
		callDomainList();
		
		$s.toggleDomainPopup = function(){
			$s.isOpenDomainPopup = !$s.isOpenDomainPopup;
		};
		$s.applyDomain = function(idx){
			$s.generalLogin_domain = $s.domainList[idx];
			$s.isOpenDomainPopup = false;
			$s.curDomainIdx = idx;
		};
		
		// 도메인 리스트 호출
		function callDomainList(){
			var param = callApiObject('login', 'callDomainList', {'OS': $rs.agent});
			$http(param).success(function(data) {
				var code = parseInt(data.Code, 10);
				if(code == 1){
					var resData = JSON.parse(data.value);
					$s.domainList = resData.Domain;
					
					$s.generalLogin_domain = $s.domainList[0];// halla.com //hd-bsnc.com
					$s.simpleLogin_domain = $s.domainList[0];// halla.com
				};
			});
		};
		
		// 로그인페이지 이미지 호출
		function callLoginImage(){
			var param = callApiObject('login', 'callLoginImage', {'MenuType':'LOGIN'});
			$http(param).success(function(data) {
				var code = parseInt(data.Code, 10);
				if(code == 1){
					$s.loginImageUrl = data.path;
				}
			});
		};
		
		// Login Domain Change
		$s.applyDomainChange = function(domain) {
			for(idx in $rs.siteList) {
				var site = $rs.siteList[idx];
				
				if(site.Domain === domain) {
					$s.generalLogin_domain = site.Domain;
					$s.generalLogin_domain_index = idx;
					$rs.apiURL = site.Url;
					
					objApiURL.setApiDomain($rs.apiURL);
					objApiURL.initApiDomain();
					break;
				};
			};
		};
		
		$s.LoginCheckChange = function() {
			if(autoLoginCheck==false){
				autoLoginCheck=true;
			}else{
				autoLoginCheck=false;
			};
		};
		
		$s.AutoLoginCheckChange = function(changeIf) {
				autoLoginCheck=changeIf;
		};
		
		// Login Domain Change
		$s.applySimpleLoginDomainChange = function(domain) {
			for(idx in $rs.siteList) {
				var site = $rs.siteList[idx];
				if(site.Domain === domain) {
					$s.simpleLogin_domain = site.Domain;
					$s.simpleLogin_domain_index = idx;
					$rs.apiURL = site.Url;
					
					objApiURL.setApiDomain($rs.apiURL);
					objApiURL.initApiDomain();
					break;
				};
			};
		};
		
		// PinNumber Login
		$s.selectPinLoginBtn = function(isPinLogin){
			$s.isPinLogin = isPinLogin;
		};
		
		$s.togglePinLoginPopup = function(){
			$s.isShowLoginPopup = !$s.isShowLoginPopup;
			if($s.isShowLoginPopup){
				$s.pin_input_id = '';
				$s.pin_input_pwd = '';
			};
		};
		
		$s.togglePinInputPopup = function(){
			$s.isShowPinInputPopup = !$s.isShowPinInputPopup;
			initPinCss();
		};
		
		// 핀번호 설정을 위한 id / pw 체크
		$s.checkPinLoginValidate = function(){
			var loginData = {
				userID:$s.pin_input_id, 
				DeviceID:$rs.deviceID,
				PhoneModel:$rs.phoneModel,
				PhoneBrand:$rs.phoneBrand,
				Password:$s.pin_input_pwd,
				AppVersion:$rs.appVersion,
				AppType:$s.generalLogin_domain
			};
			var param = callApiObject('login', 'generalLogin', loginData);		
			$http(param).success(function(data) {
				var code = parseInt(data.Code, 10);
				if(code == 1){
					$rs.userInfo = JSON.parse(data.value);
					
					if($rs.agent == 'android'){
						if(androidWebView != undefined) {
							androidWebView.setAndroidPinLoginUserId($s.pin_input_id);
						} 
					}else if($rs.agent=='ios') {
						webkit.messageHandlers.setIosPinLoginUserId.postMessage($s.pin_input_id);
	// alert($s.pin_input_id);
					}
					$rs.appUserId = $s.pin_input_id;
					$s.isShowPinInputPopup = true;
				}else{
					$rs.result_message = $rs.translateLanguageLoginPage('toast_login_fail');
					$rs.dialog_toast = true;
					$rs.dialog_progress = false;
					
					$s.isShowPinInputPopup = false;
				}
				
				$s.isShowLoginPopup = false;
			}).then(function(){
				$rs.loginFailResult();
			});
		};
		
		// 핀번호 세팅 강제 클릭
		$s.performClickPinInput = function () { 
			setTimeout(()=>{ 
				angular.element('#input_pin_number').focus();
		  },50);
		};
		
		// 핀번호 세팅 input change
		$s.settingPinChanged = function(e){
		  var regexp = /[0-9]/;
		  var tmp = $(this).val();
		  
		  if(!(regexp).test(tmp) && e.keyCode != 8) {
	  		alert($rs.translateLanguageLoginPage('Just enter the numbers.'));
	  		$(this).val(tmp.replace(/[0-9]/,''));
	  	  }else{
	  		  var length = tmp.length;
	  		  var _value = tmp;
		  	  
		  	  if (tmp.length > 6 && e.keyCode != 8){
		  	        $(this).val(tmp.substring(0, 6));
		  	        return false;
		  	  } 
		  	  $('.passwd_settings_six_write').each(function(i,v) { 
		  	       if(length > i) $(this).find('.passwd_write_circle').length < 0 ? '' : $(this).append('<span class="passwd_write_circle"></span>');
		  	       else $(this).empty();
		  	   });
		
		  	  $s.settingPinNumber = _value;  
	  	  }
		};
		angular.element('#input_pin_number').on('keyup', $s.settingPinChanged);
		
		
		// 핀번호 입력 강제 클릭
		$s.performClickPinLogin = function (e) {
			e.preventDefault();
			setTimeout(()=>{ 
				angular.element('#login_pin_number').focus();				
		  },50);
		};
		
		// 핀번호 입력 input change
		$s.loginPinChanged = function(e){
			var regexp = /[0-9]/;
		    var tmp = $(this).val();
		    
	    	if(!(regexp).test(tmp) && e.keyCode != 8) {
	    		alert($rs.translateLanguageLoginPage('input_only_number_text'));
	    		$(this).val(tmp.replace(/[0-9]/,''));
	    	}else{
	    	    
	    	    var length = tmp.length;
	    	    var _value = tmp;
	    	    
	    	    if (tmp.length > 6 && e.keyCode != 8){
	    	        $(this).val(tmp.substring(0, 6));
	    	        return false;
	    	    } 

	    	    $('.simple_passwd_write_circle').each(function(i,v) { 
	    	        if(length > i) $(this).hasClass('check_write_circle') ? '' : $(this).addClass('check_write_circle');
	    	        else $(this).removeClass('check_write_circle');
	    	    });

	    	    $s.inputPinNumber = _value;   
	    	    
	    	    if($s.inputPinNumber.length == 6) {
	    	    	$s.performGeneralLogin(); //핀번호 6자리 입력하면 바로 로그인
	    	    	
	    	    	if($rs.agent == 'android') {
	    	    		if(androidWebView != undefined) {
	    	    			androidWebView.popupKeyboardClose();	    	    			
	    	    		};
	    	    	} else if($rs.agent=='ios') {
	    	    		angular.element('#login_pin_number').blur();
	    	    	};
	    	    	
	    	    }
	    	}
		};
		angular.element('#login_pin_number').on('keyup', $s.loginPinChanged);
		
		
		// 실제 핀번호 세팅
		$s.setPinNumber = function(){
			var pinData = {
				LoginKey:$rs.userInfo.LoginKey,
				PinCode:$s.settingPinNumber,
			};
			
		    if($s.settingPinNumber.length < 6 ){
		    	$rs.result_message = $rs.translateLanguageLoginPage('setting_pin_password');
				$rs.dialog_toast = true;
				initPinCss();
				
				setTimeout(function(){
					$rs.dialog_toast = false;
					$rs.$apply();
				},1500);
				
		    }else if(!PWDCheck($s.settingPinNumber)) {
		    	$rs.result_message = $rs.translateLanguageLoginPage('toast_setting_pin_number_error');
				$rs.dialog_toast = true;
				initPinCss();
				
				setTimeout(function(){
					$rs.dialog_toast = false;
					$rs.$apply();
				},1500);
				
		    }else{
		    	var param = callApiObject('login', 'pinCodeChg', pinData);
		    	$http(param).success(function(data) {
		    		var code = parseInt(data.Code, 10);
		    		if(code == 1){
		    			$rs.result_message = $rs.translateLanguageLoginPage('toast_setting_pin_number_complete');
		    			$rs.dialog_toast = true;
		    			$rs.dialog_progress = false;
		    		}else{
		    			$rs.result_message = $rs.translateLanguageLoginPage('toast_setting_pin_number_fail');
		    			$rs.dialog_toast = true;
		    			$rs.dialog_progress = false;
		    		}
		    		
		    		$s.isShowPinInputPopup = false;
		    	}).then(function(){
		    		initPinCss();
		    		$rs.loginFailResult();
		    	});	
		    }
		};
		
		// General Login
		$s.performGeneralLogin = function() {
			var loginData;
			if($s.isPinLogin){
			// todo 핀번호 validation
				
			console.log('핀번호 로그인시 아이디 : ',$rs.appUserId);
			
			if($rs.appUserId == ''){
				$rs.result_message = $rs.translateLanguageLoginPage('toast_setting_pin_number_warn');
				$rs.dialog_toast = true;
				$rs.dialog_progress = false;
				$rs.loginFailResult();
				return false;
				}
			}else{
				if($s.general_id == '') {
					$rs.result_message = $rs.translateLanguageLoginPage('hallam_require_user_id');
					$rs.dialog_toast = true;
					$rs.dialog_progress = false;
					$rs.loginFailResult();
					return false;
				}
			};
			
			if(autoLoginCheck==true){
				loginData = {
					userID: $s.isPinLogin ? $rs.appUserId : $s.general_id,
					autoLogin:'Y'
				};
			}else{
				loginData = {
					userID: $s.isPinLogin ? $rs.appUserId: $s.general_id,
					autoLogin:'N'
				};
			};
			var param=callApiObject('login', 'autoLoginSetting', loginData);	
			$http(param).success(function(data) {
			});
			$rs.dialog_progress = true;
			
			var accessInfoData = {
				userID : $s.isPinLogin ? $rs.appUserId : $s.general_id,//$rs.appUserId== '' ? $s.general_id : $rs.appUserId, //2019.10.28 수정
				userPwd :  $s.general_pw,
				isPinLogin : $s.isPinLogin,
				inputPinNumber : $s.inputPinNumber,
				generalLogin_domain : $s.generalLogin_domain
			};
			$rs.accessUser(accessInfoData);
			
			// chatbotLogin();
		};
		
		$rs.$on('initPinCss',function(){
			initPinCss();
		});
		
		function initPinCss(){
			$('.simple_passwd_write_circle').each(function(i,v) { 
				$(this).removeClass('check_write_circle');
		    });
			
			$('.passwd_settings_six_write').each(function(i,v) { 
			    $(this).empty();
		    });
			
			angular.element('#input_pin_number').val('');
			angular.element('#login_pin_number').val('');
			$s.settingPinNumber = ''; 
			$s.inputPinNumber = ''; 
		};
		
		
	// function chatbotLogin(){
	// var loginData = {
	// CertificationType:'',
	// User:$s.appUserId,
	// Key:$rs.general_pw,
	// };
	// var param = callApiObject('chabotLogin', 'login', loginData);
	// $http(param).success(function(data) {
//				
	// });
	// };
		
		// LOGIN FOCUS
		$s.doFocusLayout = function(){
			setTimeout(function(){
				if($rs.agent=='android') {
	// angular.element('.wrap_login_area').addClass('focused');
					if(androidWebView != undefined) {
						androidWebView.scrollToLoginScreen();
					};
				};
				
			}, 200);
		};
		
	});
}]);

// mainController
appHanmaru.controller('mainController', ['$scope', '$http', '$rootScope', '$sce','$ocLazyLoad','shouldFire',function($s, $http, $rs, $sce,$ocLazyLoad,shouldFire) {
	$rs.agent = getOS();
	
	$rs.isTamplateLoad = false;
	$rs.isEditorLoaded = false;
	
	$rs.deviceID = '';
	$rs.gcmToken = '';
	$rs.appVersion = '';
	
	$s.slideProfileImgShow = false;		// 슬라이드 메뉴 프로필 이미지 영역 //2019-09-17 김현석
										// [슬라이드 메뉴 프로필 이미지 false가 기본으로 변경]
	$rs.slideMenuShow = false;			// 슬라이드 메뉴
	$rs.currMenuSlide = false;
	$rs.pushPage = function(prevPageName, currPageName) {
		pushPage(prevPageName, currPageName)
	};
	
	$rs.apiURL = "http://eptest.halla.com";
//	$rs.apiURL = "https://ep.halla.com";
//	$rs.apiURL = "http://self.halla.com";
	
	objApiURL.setApiDomain($rs.apiURL);
	objApiURL.initApiDomain();
	
	// Hybrid 기능으로 가져와야 할 부분
	if($rs.agent == 'android') {
		if(androidWebView != undefined) {
			// 핀번호 로그인을 위한 아이디 불러오기
			androidWebView.getAndroidUserId();
			androidWebView.callDeviceInformation();
		};
	} else if($rs.agent=='ios') {
		//핀번호 로그인을 위한 아이디 불러오기
		webkit.messageHandlers.getIosUserId.postMessage("success");
		webkit.messageHandlers.sendDeviceInfo.postMessage("success");
	};
	
	// aos
	window.setDeviceInformation = function(deviceId, phoneModel, phoneBrand, appVersion,gcmToken) {
		$rs.deviceID = deviceId;
		$rs.phoneModel = phoneModel;
		$rs.phoneBrand = phoneBrand;
		$rs.appVersion = appVersion;
		$rs.gcmToken = gcmToken;
	};
	
	// ios
	deviceInfo = function (deviceId, model, brand, version, gcmToken){
		$rs.deviceID = deviceId;
		$rs.phoneModel = model;
		$rs.phoneBrand = brand;
		$rs.appVersion = version;
		$rs.gcmToken = gcmToken;
	};

	
	//2019.10.24 자동 로그인 관련 로직 추가 - jh.j
	// 핀번호 로그인을 위한 아이디 불러오기
	window.getAndroidPinLoginUserId = function(userId,pinNumber){
		$rs.appUserId = userId;
		$rs.appPinNumber = pinNumber;
	};
	//ios
	getIosPinLoginUserId = function(userId,pinNumber){
		$rs.appUserId = userId;
		$rs.appPinNumber = pinNumber;
	};
	
	//2019.12.03 추가
	//그룹실적 보고 메뉴 show, hide 처리
	$rs.isMidasHelpMenu = false;
	window.checkMidasHelpResult = function(result,pmSabun2){
		$rs.isMidasHelpMenu = result;
		$rs.pmSabun2 = pmSabun2;
	};
	//ios
	checkIosMidasHelpResult = function(result,pmSabun2){
		$rs.isMidasHelpMenu = result;
		$rs.pmSabun2 = pmSabun2;
	};
	
	$rs.accessUser = function(accessInfoData){
//		lazy loading
		$rs.isTamplateLoad = true;
		
		if(accessInfoData.isPinLogin){//$s.isPinLogin //변경
			var loginData = {
				userID:$rs.appUserId,
				DeviceID:$rs.deviceID,
				PinCode : accessInfoData.inputPinNumber, //$s.inputPinNumber, //변경
				AppVersion:$rs.appVersion,
				AppType:accessInfoData.generalLogin_domain//$s.generalLogin_domain //변경
			};
			
			//TEST MODE
//			if(isTest){
//				loginData = {
//					userID:'jh1.jang',
//					DeviceID:'3e13471838b3c810',
//					PinCode : '147258', //$s.inputPinNumber, //변경
//					AppVersion:'256',
//					AppType:'Halla.com'//$s.generalLogin_domain //변경
//				};
//			}
			
			var param = callApiObject('login', 'pinLogin', loginData);
		}else{
			var loginData = {
				userID:accessInfoData.userID, //$rs.general_id //변경
				DeviceID:$rs.deviceID,
				PhoneModel:$rs.phoneModel,
				PhoneBrand:$rs.phoneBrand,
				Password:accessInfoData.userPwd, //$rs.general_pw //변경
				AppVersion:$rs.appVersion,
				AppType:accessInfoData.generalLogin_domain//$s.generalLogin_domain //변경
			};
			var param = callApiObject('login', 'generalLogin', loginData);
		};
		
		$http(param).success(function(data) {
			var code = parseInt(data.Code, 10);
			if(code == 1){
//				lazy loading
				$rs.isEditorLoaded = true;
				$rs.userInfo = JSON.parse(data.value);
//				console.log('유저정보 : ',$rs.userInfo );
				
				//계열사별 메인화면 변경
				if($rs.userInfo.CompCode === '00001'){
					$rs.userCompMainView = 'halla';
				}
				else if($rs.userInfo.CompCode === '00002'){
					$rs.userCompMainView = 'holdings';
				}
				else if($rs.userInfo.CompCode === '00005'){
					$rs.userCompMainView = 'mando';
				}
				else{
					$rs.userCompMainView = 'mando';
				}
				
				var userData = accessInfoData.isPinLogin ? $rs.appUserId : accessInfoData.userID;
//				var param2 = callApiObjectGET('https://eptest.halla.com/mail/ApiPage.aspx',{param : userData}); //추후 변경해야됨(ep.halla)
				var param2 = callApiObjectGET('https://eptest.halla.com/mail/api/GetMailBoxUrl',{LoginId : userData}); //추후 변경해야됨(ep.halla)
//				console.log(param2);
				
				$http(param2).success(function(data) {
					var domainArray = data.split('//') ;
					var domain = domainArray[1].split('.');
					var result = domain[0];
					//현재 인도 사용자만 적용중.
					if(result == 'epin'){
						$rs.apiURL = "https://epin.halla.com";
						objApiURL.setApiDomain($rs.apiURL);
						objApiURL.initApiDomain();
					}
				}).error(function (data) {
					console.log('error data : ',data);
					$rs.apiURL = "https://ep.halla.com";
					objApiURL.setApiDomain($rs.apiURL);
					objApiURL.initApiDomain();
				});
				
				if($rs.userInfo.MainView.toUpperCase() === 'NEWS'){
					$rs.$broadcast('initMainBox');
				}else if($rs.userInfo.MainView.toUpperCase() === 'MAIL'){
					$rs.$broadcast('initMailBox');
				}
				else if($rs.userInfo.MainView.toUpperCase() === 'BOARD'){
					$rs.$broadcast('initBoardBox');
				}
				else if($rs.userInfo.MainView.toUpperCase() === 'APPROVAL'){
					$rs.$broadcast('initApprovalBox');
				}
				else if($rs.userInfo.MainView.toUpperCase() === 'ORG'){
					$rs.$broadcast('initInsaBox');
				}
				else if($rs.userInfo.MainView.toUpperCase() === 'WORK'){
					// workDiary 작업이후 추가할것.
					$rs.$broadcast('initWorkBox');
				};
				
				$rs.chatbotUserId = accessInfoData.isPinLogin ? $rs.appUserId+'@'+ accessInfoData.generalLogin_domain : accessInfoData.userID+'@'+accessInfoData.generalLogin_domain; // 소문자
				$rs.chatbotLoginKey = 'f4356076dd634af7a47ea50763dc51bd';
				
				//핀번호 저장
				if($rs.agent == 'android'){
					if(androidWebView != undefined) {
						androidWebView.setAndroidPinLoginNumber(accessInfoData.inputPinNumber);
					} 
				}else if($rs.agent=='ios') {
					webkit.messageHandlers.setIosPinLoginNumber.postMessage(accessInfoData.inputPinNumber);
				}

				//핀 로그인 시도횟수 초기화
				LoginLockCnt = 0;
				
				//2019.12.02 추가
				//GQMS는 comp code 5번이면 전부 노출
				
				//한라 지식인 메뉴 (comp code 1일때)
				var param2 = callApiObject('login', 'hallasearch', {LoginKey:$rs.userInfo.LoginKey});
				$http(param2).success(function(data) {
					var code = data.Code;
					if(code == 1){
						var resData = JSON.parse(data.value);
						$rs.pmSabun = resData.Par;
//						$rs.isMenuHallaIn = true;
					}else{
//						$rs.isMenuHallaIn = false;
					}
				});
				
				//2019.12.02 추가
				//그룹 실적보고 메뉴
//				console.log($rs.userInfo);
				var param3 = callApiObject('login', 'heisso', {LoginKey:$rs.userInfo.LoginKey});
				$http(param3).success(function(data) {
					var code = data.Code;
					if(code == 1){
						var resData = JSON.parse(data.value);
						var pmSabun = resData.Par;
						if($rs.agent == 'android'){
							if(androidWebView != undefined) {
								androidWebView.checkMidasHelpMenu(pmSabun,$rs.userInfo.LoginKey);
							} 
						}else if($rs.agent=='ios') {
							var dic = {
								"pmSabun": pmSabun,
								"loginKey" : $rs.userInfo.LoginKey,
							};
							webkit.messageHandlers.checkIosMidasHelpMenu.postMessage(dic);
						}
					}
				});
			}
			else if(code == -5){ //핀번호 변경 3개월 경과
				$rs.result_message = $rs.translateLanguageLoginPage('toast_pin_number_over_period');
				$rs.dialog_toast = true;
				$rs.dialog_progress = false;
				
				$rs.moveToLoginPage();
			}
			else if(code == -4){
				var loginId=accessInfoData.isPinLogin?$rs.appUserId:accessInfoData.userID;
				$rs.result_message = '['+loginId+']' + $rs.translateLanguageLoginPage('toast_pin_number_over_period');
				$rs.dialog_toast = true;
				$rs.moveToLoginPage();
			}
			else if(code == -6){
				$rs.result_message = $rs.translateLanguageLoginPage('toast_device_lock');
				$rs.dialog_toast = true;
				$rs.moveToLoginPage();
			}
			else{
				var loginId=accessInfoData.isPinLogin ? $rs.appUserId : accessInfoData.userID;
				if(LoginCountID==''){
					LoginCountID=loginId;
					LoginLockCnt=1;
				}else{
					if(loginId==LoginCountID){
						LoginLockCnt=LoginLockCnt+1;
						if(LoginLockCnt==5){
							var loginLock = {
									LoginID:loginId,
									IsLock:'Y',
									AppType:accessInfoData.generalLogin_domain
							};
							var param = callApiObject('login', 'LoginLock', loginLock);
							$http(param).success(function(data) {
								
							})
						}
					}else{
						LoginCountID=loginId;
						LoginLockCnt=1;
					}
				}
				
				$rs.result_message = LoginLockCnt<5 ? $rs.translateLanguageLoginPage('taost_login_fail_msg1') + LoginLockCnt+'/5]':
					'['+loginId+']' + $rs.translateLanguageLoginPage('toast_account_lock');
				
				$rs.dialog_toast = true;
				$rs.dialog_progress = false;
				
				$rs.$broadcast('initPinCss');
				
				setTimeout(function(){
					$rs.dialog_toast = false;
					$rs.dialog_progress = false;
					$rs.$apply();
				},1500);
			};
			
			//lazy load
			$ocLazyLoad.load([
			  '/resources/script/lib/moment/moment-with-locales.min.js',
			  '/resources/script/lib/calendar/fullcalendar.js',
			]);
			
			$rs.translateLanguage = function(htmlID) {
				var localLang = localStorage.getItem("language");
//				var localLang = sessionStorage.getItem("language");
				if($rs.userInfo.Lang == undefined || $rs.userInfo.Lang == null)$rs.userInfo.Lang = 'KOR';
				var langType = localLang == undefined || localLang === null ? "KOR" : $rs.userInfo.Lang;
				var str = language[langType][htmlID];
				return str;
			};
			
		}).then(function(){
			if(androidWebView != undefined) {
				androidWebView.focusToWebView();
			}
		});
	};
	
	$rs.loginFailResult = function(){
		setTimeout(function(){
			$rs.dialog_toast = false;
			$rs.dialog_progress = false;
			$rs.$apply();
		},1500);
	};
	
	//2019.11.22 추가
	$rs.moveToLoginPage = function(){
		setTimeout(function(){
			$rs.dialog_toast = false;
			$rs.dialog_progress = false;
			$rs.$apply();
			$rs.$broadcast('initLoginPage');
		},2000);
	};
	
	//*******************챗봇***************************
	// 챗봇 로그인 처리및 음성인식 init
	$rs.showSttIcon = function(isLogin,userId,userPw){
		if($rs.agent == 'android'){
			if(androidWebView != undefined) {
				androidWebView.isAvailableSTT(isLogin,userId,userPw);
			} 
		}else if($rs.agent=='ios') {
			var dic = {
				"isLogin": isLogin,
				"userId" : userId,
				"userPw" : userPw
			};
			webkit.messageHandlers.isAvailableSTT.postMessage(dic);
		};
	};
	//챗봇 - 메인화면 check 함수.
	$rs.checkMainView = function(isMainView){
		if(isMainView){
			$rs.showSttIcon(true,$rs.chatbotUserId.toLowerCase(),$rs.chatbotLoginKey);
		}else{
			$rs.showSttIcon(false,'','');
		};
	};
	
	// 메뉴이동간 로딩처리
	$rs.loading = function(){
		$rs.dialog_progress = true;
		setTimeout(function(){
			$rs.dialog_progress = false;
		},500);
	};
	
	// 슬라이드 메뉴 열기
	$rs.slideMenuClick = function($event, isShow) {
		//2019.12.20 추가 - 배너 이미지 스크롤시 사이드 메뉴 스크롤 방지
		var element = $event.toElement || $event.srcElement || $event.target;
		if(!shouldFire(element)){
			return;	
		}	
		
		if($rs.isDataLoading){
			$rs.result_message = $rs.translateLanguage('loading_text');
			$rs.dialog_toast = true;
			
			setTimeout(function(){
				$rs.$apply(function(){
					$rs.dialog_toast = false;
				});
			}, 1000);
			return;
		}
		
		
		if (!isShow) {
			// 닫기
			$rs.slideMenuShow = false;
			$rs.currMenuSlide = false;
		} else {
			// 열기
// $s.mailOptionShow = false;
			$rs.slideMenuShow = true;
			$rs.currMenuSlide = true;
			
			// snb submenu set height
			setTimeout(function(){
				var userAreaHeight = angular.element('.slideMenuTop').outerHeight();
				var menuAreaHeight = angular.element('.slideMenuList').outerHeight();
				var menuHide = angular.element('.slideMenuProButtonfile').outerHeight();
				var MailButton = angular.element('.mailSubMenuGroup').outerHeight();
				var length;
				if($rs.subMenuType=='mail'){
					length=userAreaHeight+menuAreaHeight+menuHide+MailButton;
				}else{
					length=userAreaHeight+menuAreaHeight+menuHide;
				}
				angular.element('.slideMenuMailList').css({
					'height':'calc(100vh - ' + (length) + 'px - 4%)'
				});
			}, 500);
			
		};
//		if ($rs.slideMenuShow == true) {
//			// 닫기
//			$rs.slideMenuShow = false;
//			$rs.currMenuSlide = false;
//		} else {
//			// 열기
//// $s.mailOptionShow = false;
//			$rs.slideMenuShow = true;
//			$rs.currMenuSlide = true;
//			
//			// snb submenu set height
//			setTimeout(function(){
//				var userAreaHeight = angular.element('.slideMenuTop').outerHeight();
//				var menuAreaHeight = angular.element('.slideMenuList').outerHeight();
//				var menuHide = angular.element('.slideMenuProButtonfile').outerHeight();
//				var MailButton = angular.element('.mailSubMenuGroup').outerHeight();
//				var length;
//				if($rs.subMenuType=='mail'){
//					length=userAreaHeight+menuAreaHeight+menuHide+MailButton;
//				}else{
//					length=userAreaHeight+menuAreaHeight+menuHide;
//				}
//				angular.element('.slideMenuMailList').css({
//					'height':'calc(100vh - ' + (length) + 'px - 4%)'
//				});
//			}, 500);
//			
//		};
		
		// 메뉴 초기화
		$rs.isApprovalSearchDDShow = false;
	};
	
	//Swipe
	var container = angular.element('#pg_main');
	var hammer = new Hammer(container);
	hammer.on("swiperight", function(e) {
		var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
		if(pageName != 'pg_work_list'){
			setTimeout(function(){
				$rs.slideMenuClick(e,true);
				$rs.$apply();
			}, 50);
		}
	});
	hammer.on("swipeleft", function(e) {
		var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
		if(pageName != 'pg_work_list'){
			setTimeout(function(){
				$rs.slideMenuClick(e,false);
				$rs.$apply();
			}, 50);
		}
	});
	
	// 2019-09-17 김현석 [메뉴 숨기기나 보이게 할때 밑의 리스트 길이조정]
	$s.sideMenuHideClick = function() {
		var userAreaHeight = angular.element('.slideMenuTop').outerHeight();
		var menuAreaHeight = angular.element('.slideMenuList').outerHeight();
		var menuHide = angular.element('.slideMenuProButtonfile').outerHeight();
		var MailButton = angular.element('.mailSubMenuGroup').outerHeight();
		var length;
		if($rs.subMenuType=='mail'){
			length=userAreaHeight+menuAreaHeight+menuHide+MailButton;
		}else{
			length=userAreaHeight+menuAreaHeight+menuHide;
		}
		angular.element('.slideMenuMailList').css({
			'height':'calc(100vh - ' + (length) + 'px - 4%)'
		});
		
	};
	
	// 2019-09-17 김현석 [슬라이드 메뉴 삭제]
	// 슬라이드 메뉴 프로필 영역 접기
// $s.slideProfileTopFold = function() {
// if ($s.slideProfileImgShow == true) {
// $s.slideProfileImgShow = false;
// } else {
// $s.slideProfileImgShow = true;
// }
// };
	$rs.loadMenu = function(menuName) {
		
		var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
		var capitalMenuName = toFirstCapitalLetter(menuName);
		$rs.refreshMenuName = menuName;
		// 2019.01.02 추가 - 자원예약은 메뉴이름을 api로 받아오지 않음.
		$rs.reservSubMenuName = [{MenuKey : 'myReserv',MenuName : $rs.translateLanguage('resource_menu_my')},{MenuKey : 'booking',MenuName : $rs.translateLanguage('resource_menu_reserve')}];
		
//		pushPage(pageName, 'pg_' + menuName + '_list');
		$rs.subMenuType = menuName;
		
		$rs.$broadcast('initSearchValue');// 검색조건 초기화
		if(menuName != 'insa'){
			$rs.slideMenuShow = false;
			$rs.currMenuSlide = false;
		}
		var loginData = {
			LoginKey:$rs.userInfo.LoginKey
		};
		if(menuName === 'work'){
			var now = moment(new Date()).format("YYYY-MM-DD");
			var future = moment(new Date()).add(1,'d').format("YYYY-MM-DD");
			loginData.StartDate = now;
			loginData.EndDate = future;
		}
		if(menuName === 'board'){
			loginData.CompanyCode = $rs.userInfo.CompCode;
		}
		
		//2019.12.02 추가
		if(menuName === 'gqms'){
			if($rs.agent == 'android'){
				if(androidWebView != undefined) { 
					androidWebView.deepLinkGqmsApp($rs.userInfo.Sabun);
				}
			}else if($rs.agent=='ios') {
				webkit.messageHandlers.deepLinkIosGqmsApp.postMessage($rs.userInfo.Sabun);
			}
		}
		else if(menuName === 'hallaIn'){
			if($rs.agent == 'android'){
				if(androidWebView != undefined) { 
					androidWebView.deepLinkHallaInApp($rs.pmSabun);
				}
			}else if($rs.agent=='ios') {
				webkit.messageHandlers.deepLinkIosHallaInApp.postMessage($rs.pmSaxbun);
			}
		}
		else if(menuName === 'midashelp'){
			if($rs.agent == 'android'){
				if(androidWebView != undefined) { 
					androidWebView.deepLinkMidasHelpApp($rs.pmSabun2);
				}
			}else if($rs.agent=='ios') {
				webkit.messageHandlers.deepLinkIosMidasHelpApp.postMessage($rs.pmSabun2);
			}
		}
		//2020.03.31 추가 - EAC 테스트
		//나중에 한마루 국가코드도 넘겨야할듯...
		else if(menuName === 'mando_eac'){
			if(isTest){
				if($rs.agent == 'android'){
					if(androidWebView != undefined) { 
						androidWebView.deepLinkEACApp($rs.userInfo.Sabun, "");
					}
				}else if($rs.agent=='ios') {
					var dic = {
						"pmSabun": $rs.userInfo.Sabun,
						"userAreaCode" : "",
					};
					webkit.messageHandlers.deepLinkIosEACApp.postMessage(dic);
				}
			}
		}
		else{
			if(menuName === 'reserv'){
				$rs.subMenuType = 'reserv';
				$rs.subMenuList = $rs.reservSubMenuName;
				$rs.currSubMenu = $rs.reservSubMenuName[0].MenuKey; 
				$rs.$broadcast('initReservList');
			}
			else if(menuName === 'attendance'){
				var now = moment(new Date()).format("YYYY-MM-DD");
				$rs.subMenuType = 'attendance';
				$rs.$broadcast('initAttendanceList',now);
			}
			
			else if(menuName === 'mail'){
				$rs.loading();
				if($rs.subMenuMailList == undefined){
					//메일박스 새로 가져오기
					$rs.$broadcast('initMailBox');
				}else{
					//기존 mailbox 사용
					$rs.currSubMenu = $rs.subMenuMailList[0].FolderId;
					$rs.$broadcast('initMailList', $rs.subMenuMailList[0].DisplayName);
				}
			}
			else{
				var param = callApiObject(menuName, menuName+'Boxs', loginData);
				$http(param).success(function(data) {
					var code = data.Code
					if(code == 1){
						var boxList = JSON.parse(data.value);
						
						$rs.subMenuList = boxList;
						if(menuName === 'approval') {
							$rs.loading();
							initMailTree(boxList);
							for(idx in boxList) {
								if(boxList[idx].FolderId === 'ARRIVE') {
									$rs.currSubMenu = boxList[idx].FolderId;
									$rs.$broadcast('init'+capitalMenuName+'List', boxList[idx].DisplayName);
									break;
								} 
							}
						} 
						//2019.12.06 주석처리
						//mailbox 초기에 한번 불러오기위함.
//						else if (menuName === 'mail'){
//							$rs.loading();
//							$rs.currSubMenu = boxList[0].FolderId;
//							initMailTree(boxList);
//							$rs.$broadcast('init'+capitalMenuName+'List', boxList[0].DisplayName);
//						}
						else if(menuName === 'insa'){
							$rs.$broadcast('init'+capitalMenuName+'List');
						}else if(menuName === 'work'){
							$rs.subMenuType = 'work';
							$rs.subMenuList = boxList.Menus;
							
							$rs.currSubMenu = boxList.Menus[0].MenuKey; 
							$rs.$broadcast('init'+capitalMenuName+'List',boxList.Menus[0].MenuName);
						}else if(menuName === 'main'){
							
							$rs.$broadcast('initMainBox');
						}else if(menuName === 'board'){
							$rs.loading();
							$rs.subMenuType = 'board';
							$rs.$broadcast('initBoardList',boxList[0].BoardType,boxList[0].MasterID,boxList[0].Name);
							$rs.currSubMenu = boxList[0].MasterID;
						}
					}else{
						$rs.result_message = data.value;
						$rs.dialog_toast = true;
						
						setTimeout(function(){
							$rs.dialog_toast = false;
							$rs.$apply();
							
							$rs.loadMenu('main');
						},1500);
					}
				});
			};
			pushPage(pageName, 'pg_' + menuName + '_list');
		}
	};
	
	//2019.12.09 수정
	$rs.loadSubMenuButtonList = function(type) {
		var subSearch="";
		var elem;
		$rs.slideMenuShow = false;
		$rs.currMenuSlide = false;
		
		for(idx in $rs.subMenuMailList) {
//		for(idx in $rs.subMenuList) {
			var subMenuElem = $rs.subMenuMailList[idx];
			
			if(subMenuElem.FolderId==$rs.currSubMenu) {
				elem=subMenuElem;
				break;
			};
		};
		
		if(type=="mailFlag"){
			type="mail";
			subSearch="Flag"
		}else if(type=="mailUnRead"){
			type="mail";
			subSearch="UnRead"
		}else if(type=="mailFile"){
			type="mail";
			subSearch="File"
		}else if(type=="mailImportance"){
			type="mail";
			subSearch="Importance"
		};
		
		var capitalMenuName = toFirstCapitalLetter(type);
		
		$rs.currSubMenu = elem.FolderId;
		displayName = elem.DisplayName;
		$rs.$broadcast('init'+capitalMenuName+'List'+subSearch, displayName);
	};
	
	//메일박스 동기화
	$rs.syncMailBoxButton = function(){
		$rs.dialog_progress = true;
		var param = callApiObject('mail', 'mailBoxs', {LoginKey:$rs.userInfo.LoginKey,Type:'UPDATE'})
		$http(param).success(function(data) {
			var code = data.Code;
			if(code == 1){
				var mailBoxList = JSON.parse(data.value);
				
				$rs.subMenuType = 'mail';
				$rs.subMenuMailList = mailBoxList;
				//2019.12.09 추가
				//임시 메일박스 리스트
				$rs.tmpMailBoxList = mailBoxList;
				$rs.currSubMenu = mailBoxList[0].FolderId;
				
				initMailTree(mailBoxList);
				
//				$rs.result_message = '메일박스 동기화 완료.';
//				$rs.dialog_toast = true;
				
			}else{
				$rs.result_message = data.value;
//				$rs.dialog_toast = true;
			}
		}).then(function(){
			setTimeout(function(){
//				$rs.dialog_toast = false;
				$rs.dialog_progress = false;
				$rs.$apply();
			},1000);
		});
		
	}
	
	// 하부메뉴 리스트 클릭 -> 해당 메뉴 리스트업
	$rs.loadSubMenuList = function(type, elem) {
		var capitalMenuName = toFirstCapitalLetter(type);
		$rs.slideMenuShow = false;
		$rs.currMenuSlide = false;
		
		if(type==='work'){
			$rs.currSubMenu = elem.FolderId;
			displayName = elem.MenuName;
			var currentPageKey = elem.MenuKey.toLowerCase();
			if(currentPageKey === 'schedule'){
				currentPageKey = 'work';
			}else{
				currentPageKey = elem.MenuKey.toLowerCase();
			}
			var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
						
			if(elem.MenuKey!=$rs.currSubMenu){
				pushPage(pageName, 'pg_' + currentPageKey + '_list');
			}
			$rs.currSubMenu = elem.MenuKey;
			$rs.$broadcast('init'+toFirstCapitalLetter(currentPageKey)+'List', displayName);
			
		}else if(type=='main'){
			$rs.currSubMenu = elem.MasterID;
			var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
			if(elem.MenuKey!=$rs.currSubMenu){
				pushPage(pageName, 'pg_board_list');
			}
			$rs.$broadcast('initBoardList',elem.BoardType,elem.MasterID,elem.Name);
		}else if(type=='board'){
			$rs.currSubMenu = elem.MasterID;
			var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
			//2019.11.26 추가
			if(elem.MenuKey!=$rs.currSubMenu){
				pushPage(pageName, 'pg_board_list');
			}
			$rs.$broadcast('initBoardList',elem.BoardType,elem.MasterID,elem.Name);
		}else if(type=='reserv'){
			$rs.currSubMenu = elem.MenuKey;
			var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
			if(elem.MenuKey =='myReserv'){
				pushPage(pageName, 'pg_reserv_list');
				$rs.$broadcast('initReservList');				
			}else{
				pushPage(pageName, 'pg_reserv_booking_list');
				$rs.$broadcast('initBookingList');
			}
		}
		else if(type='mail'){
			$rs.currSubMenu = elem.FolderId;
			displayName = elem.DisplayName;
			$rs.dialog_progress = true;
			$rs.$broadcast('init'+capitalMenuName+'List', displayName);
		}else{
			$rs.currSubMenu = elem.FolderId;
			displayName = elem.DisplayName;
			$rs.$broadcast('init'+capitalMenuName+'List', displayName);
		}
	};
	$rs.btnSetting = function(){
		$rs.slideMenuShow = false;
		$rs.currMenuSlide = false;
		
		$rs.$broadcast('initSetting');
	};
	
	function initMailTree(boxList) {
		var arrSubMenuParent = new Array();
		var subMenuBox = new Map();
		var rtnSubMenu = new Array();
		
		for(idx in boxList) {
			var box = boxList[idx];

			if(box.Depth == 0) {
				arrSubMenuParent.push(box);
				subMenuBox.put(box.FolderId, new Array());
			} else {
				continue;
			}
		}
		
		for(idx in boxList) {
			var box = boxList[idx];
			
			if(box.Depth == 1) {
				if(subMenuBox.containsKey(box.ParentFolderId)) {
					var arr = subMenuBox.get(box.ParentFolderId);
					box.hasParent = true;
					arr.push(box);
					subMenuBox.put(box.ParentFolderId, arr);
				} else {
					box.hasParent = false;
					arrSubMenuParent.push(box);
				}
			} else {
				continue;
			}
		}
		
		for(idx in arrSubMenuParent) {
			var menu = arrSubMenuParent[idx];
			rtnSubMenu.push(menu);
			
			if(subMenuBox.containsKey(menu.FolderId)) {
				var arr = subMenuBox.get(menu.FolderId);
				if(arr.length > 0) {
					for(subIdx in arr) {
						var subMenu = arr[subIdx];
						rtnSubMenu.push(subMenu);
					}
				}
			}
		}
		
		//2019.12.06 추가
		if($rs.subMenuType == 'mail'){
			$rs.subMenuMailList = rtnSubMenu;
		}else{
			$rs.subMenuList = rtnSubMenu;
		}
	};
	
	
	$s.doBlurLayout = function(){
		setTimeout(function(){
			if($rs.agent=='android') {
			}
		}, 200);
	};
	 
	// back button
	window.checkCanGoBack = function(){
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id'); // 가장 위에 출력된 화면
		
		//슬라이드 메뉴가 열려있으면 닫기
		if ($rs.slideMenuShow) {
			$s.$apply(function(){
				$rs.slideMenuClick(true);	
			});
		}
		else{
			if(currPage.length == 1 && pageName == 'pg_mail_list' && $rs.mailEditClick){ //메일 편집모드 일때 종료
				$rs.$broadcast('editMailListInit');
			}else{
				if(currPage.length > 1){
					
					if(androidWebView != undefined) { 
						androidWebView.isCanGoBack(true);
//						$s.popPage(pageName);
					}			
				}else{
					if(pageName != 'pg_login'){
						if($rs.subMenuType != 'main'){
							$rs.loadMenu('main');
						}
						else if(androidWebView != undefined) {
							androidWebView.isCanGoBack(false);
						}
					}
					else if(androidWebView != undefined) {
						androidWebView.isCanGoBack(false);
					}
				}
			}
		}
	};
	
	window.callPopPage = function(){
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id'); // 가장 위에 출력된 화면
		
		$s.popPage(pageName);
	}
	
	window.callFocusOut = function(){
		$s.doBlurLayout();
	};
	
}]);


function callApiObject(apiType, apiName, data) {
	var param = {
		headers:{'Content-Type': 'application/json'},
		method:'POST',
		url:objApiURL[apiType][apiName].url,
		data:data
	};
	
	return param;
}

//2019.12.02 추가
function callApiObjectGET(url, data) {
	var param = {
		method:'GET',
		url:url,
		params:data
	};
	
	return param;
}

function callApiObjectNoData(apiType, apiName) {
	var param = {
		url:objApiURL[apiType][apiName].url
	};
	
	return param;
}

function pushOnePage(currPageName) {
	angular.element('#'+currPageName).addClass('current');
};


function pushPage(prevPageName, currPageName) {
	angular.element('#'+prevPageName).removeClass('current');
	angular.element('#'+currPageName).addClass('current');
	
	var isMainView = currPageName == 'pg_main_list' ? true : false;
	angular.element(document.getElementById('pg_main')).scope().checkMainView(isMainView);
	
// setTimeout(function(){
// angular.element('#'+prevPageName).removeClass('current');
// }, 500);
};


function popPage(currPageName) {
	angular.element('#'+currPageName).removeClass('current');
}

function toFirstCapitalLetter(value) {
	return value.charAt(0).toUpperCase() + value.slice(1);
}

function getFileSizeUnit(fileSize) {
	return filesize(fileSize);
}

function getOS() {
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;
	
	if (/android/i.test(userAgent)) {
		return "android";
	}

	if (/iPad|iPhone|iPod/.test(userAgent)) {
		return "ios";
	}

    return "other";
}

function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa(binary);
}

String.prototype.replaceAll = function(target, replacement) {
  return this.split(target).join(replacement);
};

function logicTest() {
	var j = 0;
	for (var i = 0; test.Response.Result.PremBnfs[4].ViewData.LC_TotalPremiumPaid.length > i; i++) {
		if (test.Response.Result.PremBnfs[4].ViewData.LC_TotalPremiumPaid[i].Value == "607000.00") {
			j++
		}
	}
}

function PWDCheck(obj) {
	var intI;
	var intJ;
	var intCnt = 0;	
	
	for (intI = 0;intI < obj.length;intI++) {
		for(intJ = intI;intJ < obj.length; intJ++){
			if (obj.substring(intI,intI+1) == obj.substring(intJ,intJ+1)) {
				intCnt = intCnt + 1;
				
				if(intCnt==3)break;
		    }else{
		    	break;
		    }	
		}
		if(intCnt==3)break;
		intCnt=0;
	}
	  
	if (intCnt == 3) {
	    return false;
	}
	  
	for(intI=0;intI<10;intI++){
		var val1=intI+1;
		var val2=(val1==10?0:val1)+1;
		 
		var val3=intI-1;
		var val4=(val3 == -1?9:val3)-1;
		 
		var val=intI+""+(val1==10?0:val1)+""+(val2==10?0:val2);
		var valR = intI+""+(val3==-1?9:val3)+""+(val4==-1?9:val4);
		if (obj.indexOf(val) >= 0 || obj.indexOf(valR) >= 0) {
		    return false;
		}
	}
    return true;
}


//현재월 시작일 종료일 가져오기
function curruntMonth(searchType){ //searchType=start,end    
    var now = new Date();
    var nowYear = now.getYear();
    var firstDate, lastDate;
    
    var formatDate = function(date){
     var myMonth = date.getMonth()+1; 
        var myWeekDay = date.getDate();
        
        var addZero = function(num){
         if (num < 10){
          num = "0"+num;
         }
         return num;
        }
        var md = nowYear+'-'+addZero(myMonth)+'-'+addZero(myWeekDay);
        
        return md;
    }
    
    firstDate = new Date(now.getYear(),now.getMonth(), 1);
    lastDate = new Date(now.getYear(),now.getMonth()+1, 0);
    nowYear += (nowYear < 2000) ? 1900 : 0; 
    return searchType=="start"?formatDate(firstDate):formatDate(lastDate);
}



