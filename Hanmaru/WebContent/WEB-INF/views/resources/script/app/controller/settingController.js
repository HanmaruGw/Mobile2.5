
// settingController
appHanmaru.controller('settingController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.timeZone = 9;
	$s.approvalPush = false;
	$s.documentPush = false;
	$s.schedulePush = false;
	$s.workPush = false;
	$s.reportPush = false;
	$s.companyList = new Array();
	$s.myCompanyCode;
	$s.myCompanyName;
	$s.appVersion;
	
//	$rs.$on('updateSettingList',function(){
//		
//	});
	
	$rs.$on('initSetting',function(){
		$s.appVersion = $rs.appVersion;
		
		$s.languageList = [
			{'code':'KOR','name': $rs.translateLanguage('lang_kor')},
			{'code':'ENG','name': $rs.translateLanguage('lang_eng')},
			{'code':'CHN','name': $rs.translateLanguage('lang_chn')}
		];
		
		$s.mainPageList = [
			{'code':'NEWS','name':$rs.translateLanguage('news')},
			{'code':'MAIL','name':$rs.translateLanguage('mail')},
			{'code':'APPROVAL','name':$rs.translateLanguage('approval')},
			{'code':'ORG','name':$rs.translateLanguage('organ')},
			{'code':'BOARD','name':$rs.translateLanguage('board')},
		];
		
		//폰트크기
		$s.fontsizeList = [
			{'code':'BIG','name':'크게'},
			{'code':'DEFAULT','name':'보통'},
			{'code':'SMALL','name':'작게'},
			];
		
		$s.myLanguageCode = $s.languageList[0].code;
		$s.myLanguageName = $s.languageList[0].name;
		$s.myMainpageCode = $s.mainPageList[0].code;
		$s.myMainpageName = $s.mainPageList[0].name;
		
		//폰트크기
		$s.myFontSizeCode = $s.fontsizeList[0].code;
		$s.myFontSizeName = $s.fontsizeList[0].name;
		
		var param = callApiObject('setting', 'getSetting', {LoginKey:$rs.userInfo.LoginKey});
		$http(param).success(function(data) {
			var settingData = JSON.parse(data.value);
			
			// 사이드 메뉴에서의 회사코드에 따른 '근태관리' 메뉴 보이기/숨김 처리
			for(idx in settingData.companys){
				if(settingData.companys[idx].code === settingData.SetCompcode){
					$rs.userInfo.CompCode = settingData.companys[idx].code; 
					$rs.userInfo.CompName = settingData.companys[idx].name; 
				}
			}
			
			localStorage.setItem("language", settingData.Lang); // 로그인 화면에서의 언어변환을 위한 App 내 로컬스토리지에 저장
//			sessionStorage.setItem("language", settingData.Lang); // 로그인 화면에서의 언어변환을 위한 App 내 로컬스토리지에 저장
			$rs.userInfo.Lang = settingData.Lang; // 로그인 이외 화면에서의 언어변환을 위한 rootScope 변수 내 저장
			$s.companyList = settingData.companys;
			$s.myCompanyCode = settingData.SetCompcode;
			$s.myLanguageCode = settingData.Lang;
			$s.myMainpageCode = settingData.MainView;
			
			
			// 회사 초기화
			for(idx in $s.companyList){
				if($s.companyList[idx].code == $s.myCompanyCode){
					$s.myCompanyName = $s.companyList[idx].name; 
				}
			};
			// 언어 초기화
			for(idx in $s.languageList){
				if($s.languageList[idx].code == $s.myLanguageCode){
					$s.myLanguageName = $s.languageList[idx].name; 
				}
			};
			// 메인화면 초기화
			for(idx in $s.mainPageList){
				if($s.mainPageList[idx].code == $s.myMainpageCode){
					$s.myMainpageName = $s.mainPageList[idx].name; 
				}
			};
			
			
			$s.approvalPush = settingData.ApprovalPush === 'true' ? true : false;
			$s.documentPush = settingData.ApprovalccPush === 'true' ? true : false;
			
			var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
			pushPage(pageName, 'pg_setting');
			
		});
	});
	
		
	// 언어설정 페이지 이동
	$s.btnLanguageSetting = function(event){
		$rs.pushOnePage('pg_setting_language');
		$rs.$broadcast('initLanguageList',$s.myLanguageCode,$s.languageList);
	};
	
	// 회사설정 페이지 이동
	$s.btnCompanySetting = function(event){
		$rs.pushOnePage('pg_setting_company');
		$rs.$broadcast('initCompanySetting',$s.myCompanyCode,$s.companyList);
	}
	
	// 메인페이지 설정 이동
	$s.btnMainpageSetting = function(event){
		$rs.pushOnePage('pg_setting_mainpage');
		$rs.$broadcast('initMainpageList',$s.myMainpageCode,$s.mainPageList);
	}
	
	//폰트 사이즈 설정 이동
	$s.btnFontsSetting = function(event){
		$rs.pushOnePage('pg_setting_fonts');
		$rs.$broadcast('initFontList',$s.myFontSizeCode,$s.fontsizeList);
	}
	
	// 결재처리 알림
	$s.btnApprovalPush = function(event){
		
		$s.approvalPush = !$s.approvalPush;
		requestPushSetting();
	} 
	// 수신문서 알림
	$s.btnDocumentPush = function(event){
		$s.documentPush = !$s.documentPush;
		requestPushSetting();
	} 
	/*
	 * //일정 알림 $s.btnSchedulePush = function(event){ $s.schedulePush =
	 * !$s.schedulePush; }; //작업알림 $s.btnWorkPush = function(event){ $s.workPush =
	 * !$s.workPush; }; //보고서 알림 $s.btnReportPush = function(event){
	 * $s.reportPush = !$s.reportPush; };
	 */

	// 푸시설정
	function requestPushSetting(){
		
		var approvalPush = $s.approvalPush ? 1 : 0;
		var documentPush = $s.documentPush ? 1 : 0;
		var reqPushData = {
			LoginKey : $rs.userInfo.LoginKey,
			ApprovalPush : approvalPush,
			ApprovalccPush : documentPush,
			PushToken : $rs.gcmToken
		};
		var param = callApiObject('setting', 'setPush',reqPushData);
		$http(param).success(function(data) {
			
		});
	};
	
	// 설정 하기
	function requestSettings(){
		var reqData = {
			LoginKey : $rs.userInfo.LoginKey,
			Lang : $s.myLanguageCode,
			MainView : $s.myMainpageCode,
			CompanyCode : $s.myCompanyCode,
			TimeZone : $s.timeZone	
		};
		var param = callApiObject('setting', 'setSetting',reqData);
		$http(param).success(function(data) {
			var resData = JSON.parse(data.value);
			
			//2019.12.10 변경
			//메일함, 결재함 등 목록 갱신을 위하여 로그인키 업데이트
			$rs.userInfo.LoginKey = resData.LoginKey;
			//메일박스 동기화
			$rs.syncMailBoxButton();
			$rs.userInfo.Lang = resData.Lang;
			
			$rs.result_message = $rs.translateLanguage('toast_setting_result');
			$rs.dialog_toast = true;
			
			//2020.03.09 추가 - 메인화면 갱신
			//계열사별 메인화면 개편
			switch(resData.CompCode){
				case '00001' : //(주)한라
					$rs.userCompMainView = 'halla';
					break;
				case '00002' : //한라홀딩스
					$rs.userCompMainView = 'holdings';
					break;
				case '00005' : //만도
					$rs.userCompMainView = 'mando';
					break;
			}
			$rs.$broadcast('initSetting');
			
		}).then(function(){
			setTimeout(function(){
				$rs.dialog_toast = false;
				$rs.$apply();
			},1500);
		});
	};
	
	// 언어설정
	$s.langChanged = function(selectedData){
		var reqPushData = {
			LoginKey : $rs.userInfo.LoginKey,
			Lang : selectedData.code,
			MainView : $s.selectedView.code,
			CompanyCode : $s.selectedCompany.code,
			TimeZone : $s.timeZone	
		}
		
		var param = callApiObject('setting', 'setSetting',reqPushData);
		$http(param).success(function(data) {
			localStorage.setItem("language", selectedData.code); // 로그인 화면에서의 언어변환을 위한 App 내 로컬스토리지에 저장
//			sessionStorage.setItem("language", selectedData.code); // 로그인 화면에서의 언어변환을 위한 App 내 로컬스토리지에 저장
			$rs.userInfo.Lang = selectedData.code; // 로그인 이외 화면에서의 언어변환을 위한 rootScope 변수 내 저장
		}).then(function(){

		});
	}
	
	// 회사설정
	$rs.$on('setCompany',function(event,companyCode,companyName){
		$s.myCompanyCode = companyCode; 
		$s.myCompanyName = companyName;
		requestSettings();
	});
	
	// 초기화면
	$rs.$on('setMainpage',function(event,mainpageCode,mainpageName){
		$s.myMainpageCode = mainpageCode;
		$s.myMainpageName = mainpageName;
		requestSettings();
	});
	
	// 언어 설정
	$rs.$on('setLanguage',function(event,languageCode,languageName){
		$s.myLanguageCode = languageCode;
		$s.myLanguageName = languageName;
		requestSettings();
	});
	
	// 글자크기 설정
	$rs.$on('setFonts',function(event,fontsizeCode,fontsizeName){
		$s.myFontSizeCode = fontsizeCode;
		$s.myFontSizeName = fontsizeName;
		
		
	});
	
	// 로그아웃
	$rs.btnDoLogout = function(){
		var chkDoLogout = confirm($rs.translateLanguage('logout_question_text'));
		if(chkDoLogout) {
			logout();
		}
	}
	
	function logout(){
		$rs.showSttIcon(false,'','');
		var loginData = {
			userID:$rs.userInfo.EmailAlias,
			autoLogin:'N'
		};
		
		$rs.userInfo = undefined;
		$rs.slideMenuShow = false;
		$rs.currMenuSlide = false;
		
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id'); // 가장 위에 출력된
		
		var param=callApiObject('login', 'autoLoginSetting', loginData);	
		$http(param).success(function(data) {
		});
		
		localStorage.removeItem("account");
		
		$rs.$broadcast('initLoginPage');
//		pushPage(pageName, 'pg_login');
	};
	
}]);

appHanmaru.controller('settingCompanyController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.companyList;
	$s.selectedCompanyName;
	$s.selectedCompanyCode;
	$s.curIdx;
	
	$rs.$on('initCompanySetting',function(event,myCompany,companyList){
		$s.companyList = companyList;
		for(idx in companyList){
			if(companyList[idx].code == myCompany){
				$s.curIdx = idx;
			}
		}
	});
	
	$s.btnSelectCompany = function(idx){
		$s.curIdx = idx;
	};
	
	$s.setCompany = function(){
		$s.selectedCompanyCode = $s.companyList[$s.curIdx].code;
		$s.selectedCompanyName = $s.companyList[$s.curIdx].name;
		
		$rs.$broadcast('setCompany',$s.selectedCompanyCode,$s.selectedCompanyName);
		$rs.popPage('pg_setting_company');
	};
	
}]);
appHanmaru.controller('settingLanguageController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.languageList;
	$s.languageCode;
	$s.languageName;
	$s.curIdx;
	
	$rs.$on('initLanguageList',function(event, myLanguage, languageList){
		$s.languageList = languageList;
		for(idx in languageList){
			if(languageList[idx].code === myLanguage){
				$s.curIdx = idx;
			}
		};
	});
	
	$s.btnSelectLanguage = function(idx){
		$s.curIdx = idx;
	};
	
	$s.setLanguage = function(){
		$s.languageCode = $s.languageList[$s.curIdx].code;
		$s.languageName = $s.languageList[$s.curIdx].name;
		
		$rs.$broadcast('setLanguage',$s.languageCode,$s.languageName);
		$rs.popPage('pg_setting_language');
	};
	
}]);
appHanmaru.controller('settingFontsController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.fontsizeList;
	$s.fontSizeCode;
	$s.fontSizeName;
	$s.curIdx;
	
	$rs.$on('initFontList',function(event, myLanguage, fontsizeList){
		$s.fontsizeList = fontsizeList;
		for(idx in fontsizeList){
			if(fontSizeList[idx].code === myLanguage){
				$s.curIdx = idx;
			}
		};
	});
	
	$s.btnSelectFont = function(idx){
		$s.curIdx = idx;
	};
	
	$s.setFonts= function(){
		$s.fontSizeCode = $s.fontsizeList[$s.curIdx].code;
		$s.fontSizeName = $s.fontsizeList[$s.curIdx].name;
		
		$rs.$broadcast('setFonts',$s.fontSizeCode,$s.fontSizeName);
		$rs.popPage('pg_setting_fonts');
	};
	
}]);
appHanmaru.controller('settingMainpageController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.mainpageList;
	$s.mainpageCode;
	$s.mainpageName;
	$s.curIdx;
	
	$rs.$on('initMainpageList',function(event, myMainpage, mainpageList){
		$s.mainpageList = mainpageList;
		for(idx in mainpageList){
			if(mainpageList[idx].code === myMainpage){
				$s.curIdx = idx;
			};
		};
	});
	
	$s.btnSelectMainpage = function(idx){
		$s.curIdx = idx;
	};
	
	$s.setMainpage = function(){
		$s.mainpageCode = $s.mainpageList[$s.curIdx].code;
		$s.mainpageName = $s.mainpageList[$s.curIdx].name;
		
		$rs.$broadcast('setMainpage',$s.mainpageCode,$s.mainpageName);
		$rs.popPage('pg_setting_mainpage');
	};
}]);