//$scope ==> $s
//$rootScope ==> $rs
var androidWebView = window.AndroidBridge;
var appHanmaru = angular.module('appHanmaru', ['ngSanitize', 'ngAnimate', 'ngRoute','ngTouch','ngSwipeItem'])
.config(function($sceDelegateProvider, $compileProvider) {
	$sceDelegateProvider.resourceUrlWhitelist(['self']);
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|sms):/);
});


//loginController
appHanmaru.controller('loginController', ['$scope', '$http', '$rootScope', function($s, $http, $rs) {
	$rs.agent = getOS();
	$rs.apiURL = '';
	$rs.dialog_toast = false;
	$s.isAutoLogin = false;

	$rs.apiURL = "http://ep.hd-bsnc.com";
	$s.generalLogin_domain = "http://ep.hd-bsnc.com";
	
	objApiURL.setApiDomain($rs.apiURL);
	objApiURL.initApiDomain();
	/*
	var param = callApiObject('general', 'app', {OS:$rs.agent});
	$http(param).success(function(data) {
		var parsedSiteList = JSON.parse(data.value);
		
		$rs.siteList = parsedSiteList.Site;
		$s.generalLogin_domain = $rs.siteList[0].Domain;
		$s.generalLogin_domain_index = 0;
		$s.simpleLogin_domain = $rs.siteList[0].Domain;
		$s.simpleLogin_domain_index = 0;
		$rs.apiURL = $rs.siteList[0].Url;
		
		objApiURL.setApiDomain($rs.apiURL);
		objApiURL.initApiDomain();
		//console.log($rs.siteList);
//		//console.log(objApiURL);
//		do auto login
		if(sessionStorage.getItem("isAutoLogin") != undefined) {
			//console.log(sessionStorage);
			
			$s.isAutoLogin = sessionStorage.getItem("isAutoLogin") == 'true' ? true : false;
			var type = sessionStorage.isAutoLoginType;
			
			if(type === 'pinCode') {
//				//console.log(sessionStorage.getItem('pinCode'));
				setTimeout(function(){
					var pinCode = sessionStorage.getItem('pinCode');
					var loginData = {
							userID:$s.general_id,
							DeviceID:$s.deviceID,
							PinCode:pinCode,
							AppVersion:$s.appVersion,
							AppType:$s.generalLogin_domain
						};
						var param = callApiObject('login', 'pinLogin', loginData);
						
						$http(param).success(function(data) {
							var code = parseInt(data.Code, 10);
							if(code == 0) {
								alert(data.value);
							} else if(code == 1) {
								$rs.userInfo = JSON.parse(data.value);
								$rs.$broadcast('initMailBox');
							}
						});
				}, 500);
			} else if(type === 'general') {
//				//console.log(sessionStorage.getItem('autoLoginID'));
//				//console.log(sessionStorage.getItem('autoLoginPW'));
				setTimeout(function(){
					var loginData = {
						userID:sessionStorage.getItem("autoLoginID"),
						DeviceID:$s.deviceID,
						PhoneModel:$s.phoneModel,
						PhoneBrand:$s.phoneBrand,
						Password:sessionStorage.getItem("autoLoginPW"),
						AppVersion:$s.appVersion,
						AppType:sessionStorage.getItem("appType")
					};
					
					var param = callApiObject('login', 'generalLogin', loginData);
					
					$http(param).success(function(data) {
						var code = parseInt(data.Code, 10);
						
						if(code == 0) {
							alert(data.value);
						} else if(code == 1) {
							$rs.userInfo = JSON.parse(data.value);
							$rs.$broadcast('initMailBox');

							//set auto login data
							if($s.isAutoLogin) {
//								console.l로그인 저장 프로세싱");
								sessionStorage.clear();
								sessionStorage.setItem("isAutoLogin", $s.isAutoLogin);
								sessionStorage.setItem("isAutoLoginType", "general");
								sessionStorage.setItem("autoLoginID", $s.general_id);
								sessionStorage.setItem("autoLoginPW", $s.general_pw);
								sessionStorage.setItem("appType", $s.generalLogin_domain);
							}
						}
					});
				}, 500);
			}
		} else {
//			//console.log(sessionStorage.getItem("isAutoLogin"));
		}
	});
*/
	
	$s.general_id = '';
	$s.general_pw = '';
	$s.generalLogin_domain = 'hd-bsnc.com';
	$s.simpleLogin_domain = 'hd-bsnc.com';
	

	//ios
	deviceInfo = function (deviceId, model, brand, version){
		$s.deviceID = deviceId;
		$s.phoneModel = model;
		$s.phoneBrand = brand;
		$s.appVersion = version;
//		alert($s.deviceID+"\n"+$s.phoneModel+"\n"+$s.phoneBrand+"\n"+$s.appVersion);
	}
	
	//android bridge result
	window.setMailSearchDate = function(type, value) {
		$s.$apply(function() {
			if(type === 'start') {
				$s.txtSearchStart = value;
			} else if(type === 'end') {
				$s.txtSearchEnd = value;
			}
		});
	}
	
	//Hybrid 기능으로 가져와야 할 부분
	if($rs.agent == 'android') {
		if(androidWebView != undefined) {
			androidWebView.callDeviceInformation();
		} 
	} else if($rs.agent=='ios') {
		webkit.messageHandlers.sendDeviceInfo.postMessage("success");
	} 
	
	window.setDeviceInformation = function(deviceId, phoneModel, phoneBrand, appVersion) {
		$s.deviceID = deviceId;
		$s.phoneModel = phoneModel;
		$s.phoneBrand = phoneBrand;
		$s.appVersion = appVersion;
	}
	
	window.callFocusOut = function(){
		$s.doBlurLayout();
	}
	
	//Login Domain Change
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
			}
		}
	}
	
	//Login Domain Change
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
			}
		}
	}
	/*
	//Auto Login
	$s.btnToggleAutoLogin = function(){
		$s.isAutoLogin = !$s.isAutoLogin;
	};
	
	//Login Tab Change
	$s.login_tab_index = 0;
	$s.switchLoginMode = function(index) {
		$s.login_tab_index = index;
		angular.element('.wrap_login_elem').hide();
		angular.element('.wrap_login_elem').eq(index).show();
	}
	*/
	//General Login
	$s.performGeneralLogin = function() {
		if($s.general_id == undefined) {
			$rs.dialog_progress = false;
			$rs.result_message = '아이디를 입력해주세요';
			$rs.dialog_toast = true;
		}
		
		$rs.dialog_progress = true;
		
		var loginData = {
			userID:$s.general_id,
			DeviceID:$s.deviceID,
			PhoneModel:$s.phoneModel,
			PhoneBrand:$s.phoneBrand,
			Password:$s.general_pw,
			AppVersion:$s.appVersion,
			AppType:$s.generalLogin_domain
		};
		
		//console.log(loginData);
		var param = callApiObject('login', 'generalLogin', loginData);
//		//console.log(param);
		$http(param).success(function(data) {
			var code = parseInt(data.Code, 10);
			if(code == 0) {
				$rs.dialog_progress = false;
				$rs.result_message = '로그인에 실패하였습니다';
				$rs.dialog_toast = true;
			} else if(code == 1) {
				$rs.userInfo = JSON.parse(data.value);
				$rs.$broadcast('initMailBox');
				
				$s.general_id = '';
				$s.general_pw = '';
				//console.log($rs.userInfo);
				/*
				//set auto login data
				if($s.isAutoLogin) {
					//console.log("자동로그인 저장 프로세싱");
					sessionStorage.clear();
					sessionStorage.setItem("isAutoLogin", $s.isAutoLogin);
					sessionStorage.setItem("isAutoLoginType", "general");
					sessionStorage.setItem("autoLoginID", $s.general_id);
					sessionStorage.setItem("autoLoginPW", $s.general_pw);
					sessionStorage.setItem("appType", $s.generalLogin_domain);
				}
				*/
			}else if(code == -1){
				$rs.dialog_progress = false;
				$rs.result_message = '로그인에 실패하였습니다';
				$rs.dialog_toast = true;
			}
		}).then(function(){
			setTimeout(function(){
				$rs.$apply(function(){
					$rs.dialog_toast = false;
				});
			}, 2000);
		});
		
	}
	/*
	//PinCode Login
	$s.arrPinCode = new Array();
	$s.doInputPinCode = function(e) {
		if(e.keyCode == 8) {
			$s.arrPinCode.splice($s.arrPinCode.length-1, 1);
			angular.element('.wrap_login_simple .dot').eq($s.arrPinCode.length).removeClass('full');
		}
		
		if($s.arrPinCode.length < 6 && e.keyCode != 8) {
			$s.arrPinCode.push(e.key);
			angular.element('.wrap_login_simple .dot').eq($s.arrPinCode.length-1).addClass('full');
		}
		
		if($s.arrPinCode.length == 6) {
			var pinCode = $s.arrPinCode.join('');
			var loginData = {
				userID:$s.general_id,
				DeviceID:$s.deviceID,
				PinCode:pinCode,
				AppVersion:$s.appVersion,
				AppType:$s.generalLogin_domain
			};
			var param = callApiObject('login', 'pinLogin', loginData);
			
			$http(param).success(function(data) {
				var code = parseInt(data.Code, 10);

				if(code == 0) {
					
				} else if(code == 1) {
					$rs.userInfo = JSON.parse(data.value);
					$rs.$broadcast('initMailBox');
					
					//set auto login data
					if($s.isAutoLogin) {
//						//console.log("자동로그인 저장 프로세싱");
						sessionStorage.clear();
						sessionStorage.setItem("isAutoLogin", $s.isAutoLogin);
						sessionStorage.setItem("isAutoLoginType", "pinCode");
						sessionStorage.setItem("pinCode", pinCode);
					}
				}
			});
		}
	};
	
	//SimpleLogin Setting
	$s.showSimpleLoginDialog = function(e) {
		angular.element('.wrap_simpleLogin').show();
	};
	$s.hideSimpleLoginDialog = function(e) {
		angular.element('.wrap_simpleLogin').hide();
	};
	
	$s.btnFindUserAccount = function(e) {
		angular.element('.wrap_simpleLogin').hide();
		
		var loginData = {
			userID:$s.simpleLogin_id,
			DeviceID:$s.deviceID,
			PhoneModel:$s.phoneModel,
			PhoneBrand:$s.phoneBrand,
			Password:$s.simpleLogin_pw,
			AppVersion:$s.appVersion,
			AppType:$s.generalLogin_domain
		};
		
		var param = callApiObject('login', 'generalLogin', loginData);
		
		$http(param).success(function(data) {
			//console.log(data);
			var code = parseInt(data.Code, 10);
			
			if(code == 1) {
				var userInfo = JSON.parse(data.value);
				$s.simpleLoginSettingLoginKey = userInfo.LoginKey;
				angular.element('.wrap_simpleLoginSetting').show();
			} else {
				alert(data.value);
			}
		});
	};
	
	$s.arrSetPinCode = new Array();
	$s.doInputSetPinCode = function(e) {
		if(e.keyCode == 8) {
			$s.arrSetPinCode.splice($s.arrSetPinCode.length-1, 1);
			angular.element('.wrap_simpleLoginSetting_dot .dot').eq($s.arrSetPinCode.length).removeClass('full');
		}
		
		if($s.arrSetPinCode.length < 6 && e.keyCode != 8) {
			$s.arrSetPinCode.push(e.key);
			angular.element('.wrap_simpleLoginSetting_dot .dot').eq($s.arrSetPinCode.length-1).addClass('full');
		}
	};
	
	$s.btnSetSimpleLogin = function(e) {
		angular.element('.wrap_simpleLoginSetting').hide();
		var pinData = {
			LoginKey:$s.simpleLoginSettingLoginKey,
			PinCode:$s.arrSetPinCode.join('')
		};
		var param = callApiObject('login', 'pinCodeChg', pinData);
		
		$http(param).success(function(data) {
			var code = parseInt(data.Code, 10);
			
			if(code == 0) {
				alert(data.value);
			} else if(code == 1) {
				var resultMent = JSON.parse(data.value);
				alert(resultMent.Ment);
			}
		});
	}
	*/
	
	//LOGIN FOCUS
	$s.doFocusLayout = function(){
		setTimeout(function(){
			if($rs.agent=='android') {
				angular.element('.wrap_login_area').addClass('focused');
			}
			
		}, 200);
	};
	
	$s.doBlurLayout = function(){
		setTimeout(function(){
			if($rs.agent=='android') {
				angular.element('.wrap_login_area').removeClass('focused');
			}
		}, 200);
	};
	
	//back button
	window.checkCanGoBack = function(){
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id'); // 가장 위에 출력된 화면
		
		if(currPage.length > 1){
			if(androidWebView != undefined) {
				androidWebView.isCanGoBack(true);
				$s.popPage(pageName);
			}			
		}else{
			if(androidWebView != undefined) {
				androidWebView.isCanGoBack(false);
			}
		}
	}
}]);

//mainController
appHanmaru.controller('mainController', ['$scope', '$http', '$rootScope', '$sce', function($s, $http, $rs, $sce) {
	$s.slideProfileImgShow = true;		//슬라이드 메뉴 프로필 이미지 영역
	$rs.slideMenuShow = false;			//슬라이드 메뉴
	$rs.currMenuSlide = false;
	
//	setTimeout(function(){
//		angular.element('.login').addClass('current');
//	}, 1000);
	
	$rs.pushPage = function(prevPageName, currPageName) {
		pushPage(prevPageName, currPageName)
	};
	
	//슬라이드 메뉴 열기
	$s.slideMenuClick = function() {
		if ($rs.slideMenuShow == true) {
			//닫기
			$rs.slideMenuShow = false;
			$rs.currMenuSlide = false;
		} else {
			//열기
//			$s.mailOptionShow = false;
			$rs.slideMenuShow = true;
			$rs.currMenuSlide = true;
			
			//snb submenu set height
			setTimeout(function(){
				var userAreaHeight = angular.element('.slideMenuTop').outerHeight();
				var menuAreaHeight = angular.element('.slideMenuList').outerHeight();
				angular.element('.slideMenuMailList').css({
					'height':'calc(100vh - ' + (userAreaHeight+menuAreaHeight) + 'px - 4%)'
				});
			}, 500);
		}
		
		//메뉴 초기화
		$rs.isApprovalSearchDDShow = false;
	};
	
	//슬라이드 메뉴 프로필 영역 접기
	$s.slideProfileTopFold = function() {
		if ($s.slideProfileImgShow == true) {
			$s.slideProfileImgShow = false;
		} else {
			$s.slideProfileImgShow = true;
		}
	};
	
	$rs.loadMenu = function(menuName) {
		var capitalMenuName = toFirstCapitalLetter(menuName); 
		var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
		pushPage(pageName, 'pg_' + menuName + '_list');
		
		$rs.subMenuType = menuName;
		
		if(menuName != 'insa'){
			$rs.slideMenuShow = false;
			$rs.currMenuSlide = false;
		}
		
		var param = callApiObject(menuName, menuName+'Boxs', {LoginKey:$rs.userInfo.LoginKey});
		$http(param).success(function(data) {
			var boxList = JSON.parse(data.value);
			$rs.subMenuList = boxList;
			
			if(menuName === 'approval') {
				initMailTree(boxList);
				for(idx in boxList) {
					if(boxList[idx].FolderId === 'ARRIVE') {
						//console.log('init'+capitalMenuName+'List');
						
						$rs.currSubMenu = boxList[idx].FolderId;
						$rs.$broadcast('init'+capitalMenuName+'List', boxList[idx].DisplayName);
						break;
					} 
				}
			} else if (menuName === 'mail'){
				$rs.currSubMenu = boxList[0].FolderId;
				initMailTree(boxList);
				
				$rs.$broadcast('init'+capitalMenuName+'List', boxList[0].DisplayName);
			} else if(menuName === 'insa'){
//				//console.log($rs.subMenuList);
				$rs.$broadcast('init'+capitalMenuName+'List');
			}
		});
	}
	
	//하부메뉴 리스트 클릭 -> 해당 메뉴 리스트업
	$rs.loadSubMenuList = function(type, elem) {
		var capitalMenuName = toFirstCapitalLetter(type);
		$rs.slideMenuShow = false;
		$rs.currMenuSlide = false;
		$rs.currSubMenu = elem.FolderId;
		$rs.$broadcast('init'+capitalMenuName+'List', elem.DisplayName);
	}
	
	$rs.btnDoLogout = function(){
		var chkDoLogout = confirm("로그아웃 하시겠습니까?");
		
		if(chkDoLogout) {
			$rs.userInfo = undefined;
			$rs.slideMenuShow = false;
			$rs.currMenuSlide = false;
			
			var currPage = angular.element('[class^="panel"][class*="current"]');
			var pageName = currPage.eq(currPage.length-1).attr('id'); // 가장 위에 출력된 화면
			pushPage(pageName, 'pg_login');
		}
	}
	
	
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
		
		$rs.subMenuList = rtnSubMenu;
	}

}]);

//mailController
appHanmaru.controller('mailController', ['$scope', '$http', '$rootScope', '$sce', '$timeout', function($s, $http, $rs, $sce, $timeout) {
	$s.mailOptionShow = false;			//받은 편지함 필터메뉴
	$s.mailSearchnShow = false;			//메일 검색 메뉴
	$s.searchOptionShow = false;		//메일 검색 옵션 메뉴
	$s.mailListEditShow = false;		//메일 편집
	$s.mailBtnShow = true;				//메일 작성 bottom 버튼
	$s.mailEditShow = false;			//메일 편집 bottom 버튼
	$s.mailEditHide = false;			//메일 편집시 가려지는 요소들
	$s.mailEditClick = false;			//메일 선택 시 백그라운드 변경
	$s.noneRead = false;
	$s.flagMail = false;
	$s.todayMail = false;
	$s.isDlgMailPopupMenu = false;
//	$s.searchSel = '제목';
	$s.editTxt = '편집';
	$s.mailListPage = 1;
	
	
	
	$rs.$on('displayMailName', function(event, data){
		$s.displayName = data;
	});
	
	$rs.$on('initMailBox', function(event) {
		var param = callApiObject('mail', 'mailBoxs', {LoginKey:$rs.userInfo.LoginKey});
		$http(param).success(function(data) {
			var mailBoxList = JSON.parse(data.value);
			$rs.subMenuType = 'mail';
			$rs.subMenuList = mailBoxList;
			$rs.currSubMenu = mailBoxList[0].FolderId;
			
			initMailTree(mailBoxList);
			
			$rs.$broadcast('initMailList', mailBoxList[0].DisplayName);
		});
	});
	
	$rs.$on('initMailList', function(event, data) {
		//data => menuName
		$s.mailListPage = 1;
		
		if(data != '') {
			$s.displayName = data;
		}
		
		var reqMailListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:30, // 기존 30, 테스트로 90개 
			PageNumber:$s.mailListPage,
			FolderID:$rs.currSubMenu
		};
		
		var param = callApiObject('mail', 'mailList', reqMailListData);
		$http(param).success(function(data) {
			var mailList = JSON.parse(data.value);
			$rs.mailList = mailList.Mails;
			
			pushPage('pg_login', 'pg_mail_list');
			//console.log('mail list : ' , mailList);
			
			$rs.dialog_progress = false;
		});
		
		/*
		var reqMailListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:10,
			PageNumber:1,
			FolderID:,
			SearchType:,
			SearchValue:,
			IsUnRead:,
			IsFlag,
			IsToDay:,
			FolderType:,
			StartDate:,
			EndDate:
		};
		*/
	});
	
	$s.hideMailVisibleOption = function(e){
		var el = angular.element(e.target);
		var clzNm = el.attr('class');
		
		if(clzNm === 'btnMailOption') {
		} else if(clzNm == 'btnMailSearch' || el.parents('div.mailSearchDiv').attr('class') == 'mailSearchDiv') {
		} else {
			$s.mailOptionShow = false;
			$s.mailSearchnShow = false;
		}
	};
	
	//받은 메일 옵션메뉴
	$s.expandMailDDOption = function(){
		if ($s.mailOptionShow == true) {
			$s.mailOptionShow = false;
		} else {
			$s.mailOptionShow = true;
			$s.mailSearchnShow = false;
		}
	}
	
	$s.mailOption = function() {
		$s.mailOptionShow = false;
		$s.mailBtnShow = true;
		
		var reqMailListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:30,
			PageNumber:$s.mailListPage,
			FolderID:$rs.currSubMenu,
			IsUnRead:$s.noneRead,
			IsFlag:$s.flagMail,
			IsToDay:$s.todayMail
		};
		
		var param = callApiObject('mail', 'mailList', reqMailListData);

		$http(param).success(function(data) {
			var mailList = JSON.parse(data.value);
			$rs.mailList = mailList.Mails;
		});
	};
	
	//메일 검색 메뉴
	$s.mailSearch = function() {
		if ($s.mailSearchnShow == true) {
			$s.mailSearchnShow = false;
		} else {
			$s.mailOptionShow = false;
			$s.mailSearchnShow = true;
		}
	};
	
	//메일 검색 메뉴 체크 이미지
	$s.noneReadMailClick = function() {
		$s.noneRead = !$s.noneRead;
	};
	
	//메일 검색 메뉴 체크 이미지
	$s.FlagMailClick = function() {
		$s.flagMail = !$s.flagMail;
	};
	
	//메일 검색 메뉴 체크 이미지
	$s.todayMailClick = function() {
		$s.todayMail = !$s.todayMail;
	};
	
	//메일 검색 옵션 메뉴(제목, 본문...)
	$s.searchOption = function() {
		if ($s.searchOptionShow == true) {
			$s.searchOptionShow = false;
		} else {
			$s.searchOptionShow = true;
		}
	};
	
	//메일 검색 옵션 선택시 텍스트 변경
	$s.searchOptionSel = function(e) {
		if ($s.searchOptionShow == true) {
			$s.searchOptionShow = false;
			$s.searchSel = e.srcElement.innerHTML;
		} else {
			$s.searchOptionShow = true;
		}
	};
	
	//메일 검색
	$s.btnSearchMail = function(){
		$rs.dialog_progress = true;
		$s.mailSearchnShow = false;
		$s.mailOptionShow = false;
		$s.mailBtnShow = true;
		$s.mailListPage = 1;
		
		var reqMailListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:30,
			PageNumber:$s.mailListPage,
			FolderID:$rs.currSubMenu,
			SearchType:$s.SearchType,
			SearchValue:$s.SearchValue != undefined ? $s.SearchValue : '',
			IsUnRead:$s.noneRead,
			IsFlag:$s.flagMail,
			IsToDay:$s.todayMail
		};
		
		reqMailListData.StartDate = $s.txtSearchStart != undefined ? $s.txtSearchStart : '';
		reqMailListData.EndDate = $s.txtSearchEnd != undefined ? $s.txtSearchEnd : '';
		
		var param = callApiObject('mail', 'mailList', reqMailListData);

		$http(param).success(function(data) {
			var mailList = JSON.parse(data.value);
			$rs.mailList = mailList.Mails;
			$s.isPreviousDateShownCount = 0;
			$s.isPreviousDateShow = false;
			$s.isPreviousDateShowIndex = 0;
		}).then(function(){
			$rs.dialog_progress = false;
		});
		
	}
	
	//메일 편집
	$s.mailEdit = function(e) {
		if ($s.mailListEditShow == true) {
			$s.mailListEditShow = false;
			$s.mailEditShow = false;
			$s.mailOptionShow = false;
			$s.mailSearchnShow = false;
//			$s.mailBtnShow = true;
			$s.mailEditHide = false;			
			$s.editTxt = '편집';
		} else {
			$s.mailListEditShow = true;
			$s.mailOptionShow = false;
			$s.mailSearchnShow = false;
			$s.mailEditShow = true;
//			$s.mailBtnShow = false;
			$s.mailEditHide = true;			
			$s.editTxt = '취소';
		}
	};
	
	//메일 리스트 클릭 시 상세 또는 리스트 선택
	$s.mailEditList = new Array();
	$s.mailListBoxSelect = function(e, index, mail) {
		var currSelectedElement = angular.element('.mailListBox').eq(index).find('.swiper-content');
		
		if ($s.mailListEditShow == false) {
			$rs.CURR_MAIL_ID = mail.ItemId;
			
//			//console.log($rs.CURR_MAIL_ID);
			
			//메일 상세
			var reqMailDetailData = {
				LoginKey:$rs.userInfo.LoginKey,
				Offset:mail.OffSet,
				FolderID:$rs.currSubMenu,
				MailId:mail.ItemId
			};
			
			var param = callApiObject('mail', 'mailDetail', reqMailDetailData);
			$http(param).success(function(data) {
				var mailData = JSON.parse(data.value);
				//console.log(JSON.parse(data.value));
				
				$rs.mailData = mailData;
				parseCIDAttachMailData($rs.mailData);
				
				//메일 읽음
				var arrMail = new Array();
				arrMail.push(mail.ItemId);
				
				var readMailData = {
					LoginKey:$rs.userInfo.LoginKey,
					States:true,
					MailId:arrMail
				}
				var readParam = callApiObject('mail', 'mailDoRead', readMailData);
				$http(readParam).success(function(readResultData) {
//					//console.log(readResultData);
					mail.IsRead = true;
					//console.log($s.mailList[index].isRead);
				}).then(function(){
					$rs.pushOnePage('pg_mail_view');
					$rs.$broadcast('initMailDetail');
				});
			});
		} else {
			//메일 편집
			$s.mailEditClick = !$s.mailEditClick;
			var email = $s.mailList[index];
			
			if(email.EditSelected == undefined || email.EditSelected == false) {
				mail.EditSelected = true;
				$s.mailEditList.push(mail);
			} else if(email.EditSelected == true){
				for(var idx in $s.mailEditList) {
					var toUncheckEmail = $s.mailEditList[idx];
					
					if(toUncheckEmail.ItemId == email.ItemId) {
						$s.mailEditList.splice(idx, 1);
						mail.EditSelected = false;
						break;
					}
				}
			}
		}
	}
	
	$s.btnShowMailWrite = function() {
		$rs.pushOnePage('pg_mail_write');
		$rs.$broadcast('mailContentsReset');
	}
	
	$rs.pushOnePage = function(currPageName) {
		pushOnePage(currPageName)
	};
	
	$rs.pushPage = function(prevPageName, currPageName) {
		pushPage(prevPageName, currPageName)
	};
	
	$rs.popPage = function(currPageName) {
		popPage(currPageName);
	}
	
	//다음페이지 읽기
	$s.readMailNextPage = function(){
//		//console.log($rs.currSubMenu);
		$s.mailListPage++;
		
		var reqMailListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:30,
			PageNumber:$s.mailListPage,
			FolderID:$rs.currSubMenu,
			IsUnRead:$s.noneRead,
			IsFlag:$s.flagMail,
			IsToDay:$s.todayMail
		};
		
		reqMailListData.StartDate = $s.txtSearchStart != undefined ? $s.txtSearchStart : '';
		reqMailListData.EndDate = $s.txtSearchEnd != undefined ? $s.txtSearchEnd : '';
		
		if($s.SearchValue != undefined) {
			reqMailListData.SearchType = $s.SearchType;
			reqMailListData.SearchValue = $s.SearchValue;
		}
		
		var param = callApiObject('mail', 'mailList', reqMailListData);
		$http(param).success(function(data) {
			var mailList = JSON.parse(data.value);
			
			$timeout(function(){
				if(mailList.Mails.length > 0) {
					for(idx in mailList.Mails) {
						$rs.mailList.push(mailList.Mails[idx]);
					}
				} else {
					$s.mailListPage--;
				}
			}, 500);
		}).then(function(){
			$rs.dialog_progress = false;
		});
	};
	
	//일자 계산(오늘/어제/요일/오래 전 등)
	$s.diffDateFromToday = function(index, date){
		var today = moment(new Date(), 'YYYY-MM-DD');
		var compDate = moment(date, 'YYYY-MM-DD');
		var dateDiff = today.diff(compDate, 'days')+1;

		if(dateDiff > 7 && $s.isPreviousDateShownCount == 0) {
			$s.isPreviousDateShownCount++;
			$s.isPreviousDateShow = true;
			$s.isPreviousDateShowIndex = index;
		} 
        return dateDiff;
	};
  
  //오래전 표시 여부
  $s.isPreviousDateShowIndex = 0;
  $s.isPreviousDateShownCount = 0;
  
  $s.SearchTypeOptions = [
	{'name':'subject','value':'제목'},
	{'name':'body','value':'본문'},
	{'name':'sender','value':'발신자'},
	{'name':'receive','value':'수신자'},
	{'name':'subjectbody','value':'제목+본문'},
  ];
  
  $s.SearchType = $s.SearchTypeOptions[0].name;
	$s.chooseSearchDate = function(type){
		if($rs.agent == 'android') {
			if(androidWebView != undefined) androidWebView.callMailDatePickerDialog(type);	
		} 
	}
	
	//android bridge result
	window.setMailSearchDate = function(type, value) {
		$s.$apply(function() {
			if(type === 'start') {
				$s.txtSearchStart = value;
			} else if(type === 'end') {
				$s.txtSearchEnd = value;
			}
		});
	}

	//메일 플래그
	$s.btnToggleFlag = function(e){
		var arrMail = new Array();
		var trueCount = 0;
		var state = false;
		
		for(var idx in $s.mailEditList) {
			var email = $s.mailEditList[idx];
			arrMail.push(email.ItemId);
		}
		
		for(var idx in $s.mailEditList) {
			var email = $s.mailEditList[idx];

			if(email.FlagStatus) {
				trueCount++;
			}
		}
		
		if(trueCount == $s.mailEditList.length) {
			state = false;
		} else {
			state = true;
		}
		
		var flagMailData = {
			LoginKey:$rs.userInfo.LoginKey,
			States:state,
			MailId:arrMail
		}
		
		var flagParam = callApiObject('mail', 'mailDoFlag', flagMailData);
		$http(flagParam).success(function(flagResultData) {
			for(var idx in $s.mailEditList) {
				var email = $s.mailEditList[idx];
				email.FlagStatus = state;
				email.EditSelected = false;
			}
			
			$s.mailEdit();
		}).then(function(){
			$s.mailEditList.splice(0, $s.mailEditList.length);
		});
	}
	
	//메일 이동 start 
	$s.isDlgMailMove = false;
	$s.btnDlgMailMove = function(e) {
		$s.isDlgMailMove = !$s.isDlgMailMove;
		
		var param = callApiObject('mail', 'mailBoxs', {LoginKey:$rs.userInfo.LoginKey});
		$http(param).success(function(data) {
			var boxList = JSON.parse(data.value);
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
			
			$s.moveMailBoxList = rtnSubMenu;
		});
	};
	
	/*
	// 메일이동 > 메일함 트리구조로 변경
	function initMailTree(boxList) {
		//console.log("!!!!!");
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
		
		$s.moveMailBoxList = rtnSubMenu;
		//console.log($s.moveMailBoxList);
	}  
	*/
	 
	$s.dismissDlgMailMove = function(e){
		var target = angular.element(e.target);
		
		if(target.hasClass('dlgMailMove')) {
			$s.isDlgMailMove = false;
		} else {
			return;
		}
	};
	
	$s.btnSelectMoveMailFolder = function(e, folderId) {
		var target = angular.element(e.target);
		if(!target.hasClass('disabled')) {
			$s.targetFolderId = folderId;
		} else {
			return;
		}
	}
	
	$s.btnConfirmMoveMail = function(){
		if($s.targetFolderId != undefined) {
			var arrMail = new Array();
			
			for(var idx in $s.mailEditList) {
				var email = $s.mailEditList[idx];
				arrMail.push(email.ItemId);
			}
			
			var mailMoveData = {
				LoginKey:$rs.userInfo.LoginKey,
				TargetID:$s.targetFolderId,
				MailId:arrMail
			};
			
			var param = callApiObject('mail', 'mailDoMove', mailMoveData);
			$http(param).success(function(data) {
				var code = parseInt(data.Code);
				if(code == 1) {
					$rs.result_message = '메일을 이동했습니다.';
					$rs.dialog_toast = true;
				} else {
					$rs.result_message = '메일이동 실패했습니다.';
					$rs.dialog_toast = true;
				}
				
				//console.log(data);
				$s.targetFolderId = undefined;
				$s.isDlgMailMove = false;
				$s.mailEdit();
			}).then(function(){
				setTimeout(function(){
					$rs.$apply(function(){
						$rs.dialog_toast = false;
					});
				}, 1000);
				
				$s.mailEditList.splice(0, $s.mailEditList.length);
			});
		} else {
			$s.isDlgMailMove = false;
		}
	}
	//메일 이동 end
	
	//메일 삭제 start
	$s.btnDlgMailDelete = function(e) {
		var folderType;
		for(idx in $rs.subMenuList) {
			var folderID = $rs.subMenuList[idx].FolderId;
			if(folderID === $rs.currSubMenu) {
				folderType = $rs.subMenuList[idx].FolderType;
				break;
			}
		}
		
		var arrMail = new Array();
		for(var idx in $s.mailEditList) {
			var email = $s.mailEditList[idx];
			arrMail.push(email.ItemId);
		}
		
		var mailDeleteData = {
			LoginKey:$rs.userInfo.LoginKey,
			States:(folderType === 'DELETEDITEMS' ? true : false ),
			MailId:arrMail
		};
		
		var param = callApiObject('mail', 'mailDoDelete', mailDeleteData);
		$http(param).success(function(data) {
			$s.isDlgMailDelete = false;
			
			//삭제된 파일이 있기때문에 리스트 가져옴
			var reqMailListData = {
				LoginKey:$rs.userInfo.LoginKey,
				PageSize:20,
				PageNumber:1,
				FolderID:$rs.currSubMenu
			};
			
			var param = callApiObject('mail', 'mailList', reqMailListData);
			$http(param).success(function(data) {
				var mailList = JSON.parse(data.value);
				$rs.mailList = mailList.Mails;

				$s.mailEdit();
			});
		}).then(function(){
			$s.mailEditList.splice(0, $s.mailEditList.length);
		});
		
	};
	//메일 삭제 end
	
	//결재아이디 파싱해서 보내기
	window.btnToApprovalDetail = function(docID) {
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id'); // 가장 위에 출력된 화면
		var approval = {};
		approval.ApprovalID = docID;
		
		popPage(pageName);
		$rs.approvalDetail('', approval, '온라인 문서고');
	}
	
	//CID 내용이 있으면 파싱, 없으면 일반내용 표시
	function parseCIDAttachMailData(mail) {
		//console.log(mail);
		var mailBodyObj = angular.element(mail.Body);
		var img = mailBodyObj.find('img[src^="cid:"]');
		var tmpAttachMap = new Map();
		
		//console.log('img length ::: ' + img.length);
		
		var toParseMailBody = mail.Body;
		if(img.length > 0) {
			for(var i = 0; i < img.length; i++) {
				var src = img.eq(i).attr('src');
				if(src != undefined) {
					//console.log(src);
					
					//toParseMailBody = toParseMailBody.replace(/(cid(.*?\"))/, "[[CID::ATTACH_"+ attachIdx + "]]\""); // ==> [[CID::ATTACH_1]]
					var fileName = src.replace("cid:", "").split('@')[0];
					//console.log(tmpAttachMap.get(fileName));
					
					
					if(tmpAttachMap.get(fileName) != undefined) {
						toParseMailBody = toParseMailBody.replace(src, "[[CID::ATTACH_"+ tmpAttachMap.get(fileName).index + "]]");
					} else {
						for(fileIdx in mail.Attachments) {
							var attachFileName = mail.Attachments[fileIdx].FileName;
							if(attachFileName === fileName) {
								if(tmpAttachMap.get(fileName) == undefined) {
									tmpAttachMap.put(fileName, {index:i, attach:mail.Attachments[fileIdx]});
									toParseMailBody = toParseMailBody.replace(src, "[[CID::ATTACH_"+ i + "]]");
								} 
							}
						}
					}
					
					
				}
			}
			mail.Body = toParseMailBody;
			mail.tmpAttachMap = tmpAttachMap;
			mail.Attachments = new Array();
			
			/* -> array
			 * var tmpAttachArray = new Array();
			for(var attachIdx in mail.Attachments) {
				var attach = mail.Attachments[attachIdx];
				
				if(mail.Body.indexOf('cid:'+attach.FileName) != -1) {
					tmpAttachArray.push(attachIdx);
				}
			}
			*/
//			mail.Body = toParseMailBody;
			
//			//console.log(tmpAttachArray);
			
		
			/*
			var imgLoadURL = '';
			var removeImgIdx = -1;
			var removeIdxArray = new Array();
			
			for(var attachIdx in mail.Attachments) {
				var attach = mail.Attachments[attachIdx];
				
				if(mail.Body.indexOf('cid:'+attach.FileName) != -1) {
					removeIdxArray.push(attachIdx);
				}
			}
			
			if(removeIdxArray.length > 0) {
				recursiveImageDeleteLoad(0, mail, removeIdxArray);
			} else {
				//본문에 cid가 포함됐을때
				recursiveImageLoad(0, mail, img);
				
				for(var attachIdx in mail.Attachments) {
					mail.Attachments.splice(attachIdx, 1);
				}
			}
			*/
			//mail.HTMLBody = $sce.trustAsHtml(mail.Body);
		} else {
			//console.log("image not exists");
//			//console.log(mail.Body);
			var mailBody = angular.element(mail.Body);
			var approvalLink = mailBody.find('a[href*="/Workflow/Page/Link.aspx"]');
			var approvalLinkIndex = mail.Body.indexOf("/Workflow/Page/Link.aspx");
			
			if(approvalLinkIndex != -1) {
				var docID = approvalLink.attr('href').split('?')[1].split('=')[1];
				
				setTimeout(function(){
					var script = "javascript:btnToApprovalDetail('"+docID.trim()+"');";
					mail.Body = mail.Body.replace($rs.apiURL+"/Workflow/Page/Link.aspx?docId="+docID, script);
					mail.HTMLBody = $sce.trustAsHtml(mail.Body);
				}, 200);
			} else {
				mail.HTMLBody = $sce.trustAsHtml(mail.Body);			
			}
		}
	}
	
	function recursiveImageDeleteLoad(index, mail, removeIdxArray) {
//		//console.log(removeIdxArray[index]);
//		//console.log(index);
		if(removeIdxArray[index] != undefined) {
			var toDeleteMail = mail.Attachments[removeIdxArray[index]];
			var extension = toDeleteMail.FileName.split('.').pop(); 
			
			$http.get(toDeleteMail.FileURL, {responseType:'arraybuffer'}).success((function(index) {
			    return function(data) {
					var base64Data = 'data:image/' + extension + ';base64,'+ _arrayBufferToBase64(data);
					mail.Body = mail.Body.replace('cid:'+toDeleteMail.FileName, base64Data);
					mail.HTMLBody = $sce.trustAsHtml(mail.Body);
					
					if(index < removeIdxArray.length) recursiveImageDeleteLoad(++index, mail, removeIdxArray);
			    }
			})(removeIdxArray[index]));
		} else {
			
			for(var idx = removeIdxArray.length-1; idx >= 0; idx--) {
				mail.Attachments.splice(removeIdxArray[idx], 1);
			}
		}
	}
	
	function recursiveImageLoad(index, mail, img) {
		var toReplaceMail = mail.Attachments[index];
		var extension = toReplaceMail.FileName.split('.').pop(); 
		
		$http.get(toReplaceMail.FileURL, {responseType:'arraybuffer'}).success((function(idx) {
		    return function(data) {
				var base64Data = 'data:image/' + extension + ';base64,'+ _arrayBufferToBase64(data);
				mail.Body = mail.Body.replace(img.eq(index).attr('src'), base64Data);
				mail.HTMLBody = $sce.trustAsHtml(mail.Body);
				if(index < mail.Attachments.length) recursiveImageLoad(++index, mail, img); 
		    }
		})(index));
	}
	
	
	$s.currSelectedMail;
	$s.itemOnLongPress = function(mail) {
		$s.currSelectedMail = mail;
		$s.isDlgMailPopupMenu = true;
	}
	
	$s.itemOnTouchEnd = function(mail) {
		
	}
	
	//롱클릭 팝업메뉴 닫기
	$s.dismissDlgMailPopupMenu = function(e) {
		$s.isDlgMailPopupMenu = false;
	}
	
	//답장
	$s.btnMailPopupReply = function(){
		var reqMailDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			Offset:$s.currSelectedMail.OffSet,
			FolderID:$rs.currSubMenu,
			MailId:$s.currSelectedMail.ItemId
		};
		
		var param = callApiObject('mail', 'mailDetail', reqMailDetailData);
		$http(param).success(function(data) {
			var mailData = JSON.parse(data.value);
			$rs.mailData = mailData;
			parseCIDAttachMailData($rs.mailData);
			
			var recipientArray = new Array();
			var recipients = {};
			recipients.DisplayName = $rs.mailData.FromName;
			recipients.EMailAddress = $rs.mailData.FromEmailAddress;
			recipientArray.push(recipients);
			
			$rs.pushOnePage('pg_mail_write');
			$rs.$broadcast('initReplyForwardMailData', $s.currSelectedMail, true, recipientArray, 2);
			$s.dismissDlgMailPopupMenu();
			$s.currSelectedMail = undefined;
		});
	}
	
	//전달
	$s.btnMailPopupForward = function(){
		var reqMailDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			Offset:$s.currSelectedMail.OffSet,
			FolderID:$rs.currSubMenu,
			MailId:$s.currSelectedMail.ItemId
		};
		
		var param = callApiObject('mail', 'mailDetail', reqMailDetailData);
		$http(param).success(function(data) {
			var mailData = JSON.parse(data.value);
			$rs.mailData = mailData;
			parseCIDAttachMailData($rs.mailData);

			var recipientArray = new Array();
			
			$rs.pushOnePage('pg_mail_write');
			$rs.$broadcast('initReplyForwardMailData', $s.currSelectedMail, true, recipientArray, 4);
			$s.dismissDlgMailPopupMenu();
			$s.currSelectedMail = undefined;
		});
	}
	
	//메일 이동
	$s.btnMailPopupMove = function(){
		$s.mailListEditShow = true;
		$s.mailEditList = new Array();
		$s.mailEditList.push($s.currSelectedMail);
		$s.btnDlgMailMove();
	}
	
	//깃발 표시
	$s.btnMailPopupFlag = function(){
		var arrMail = new Array();
		arrMail.push($s.currSelectedMail.ItemId);
		
		var flagMailData = {
			LoginKey:$rs.userInfo.LoginKey,
			States:true,
			MailId:arrMail
		}
		var flagParam = callApiObject('mail', 'mailDoFlag', flagMailData);
		$http(flagParam).success(function(flagResultData) {
			$s.currSelectedMail.FlagStatus = true;
			$s.currSelectedMail = undefined;
		});
	}
	
	//읽지않음으로 표시
	$s.btnMailPopupUnRead = function(){
		//메일 읽음
		var arrMail = new Array();
		arrMail.push($s.currSelectedMail.ItemId);
		
		var readMailData = {
			LoginKey:$rs.userInfo.LoginKey,
			States:false,
			MailId:arrMail
		}
		var readParam = callApiObject('mail', 'mailDoRead', readMailData);
		$http(readParam).success(function(readResultData) {
			$s.currSelectedMail.IsRead = false;
			$s.currSelectedMail = undefined;
		});
	}
	
	$s.onReload = function(){
		//console.log('onReload');
	};
	
	//swipe
    //삭제
	$s.isDlgMailDelete = false;
	$s.callLeftFunction = function(obj, index, event) {
		$s.isDlgMailDelete = !$s.isDlgMailDelete;
		$s.dismissDlgMailDelete = function(e){
			var target = angular.element(e.target);
			if(target.hasClass('dlgMailDelete')) {
				$s.isDlgMailDelete = false;
			} else {
				return;
			}
		};
		
		$s.btnCancelDeleteMail = function(){
			$s.isDlgMailDelete = false;
			
			var currSelectedElement = angular.element('.mailListBox').eq(index).find('.swiper-content');
			//console.log(currSelectedElement.prev());
			currSelectedElement.css({
				'opacity':1,
				'left':0
			});
			
			currSelectedElement.prev().removeClass('ng-show');
			currSelectedElement.prev().addClass('ng-hide');
		}
		
		$s.btnConfirmDeleteMail = function(){
			
			$rs.CURR_MAIL_ID = obj.mail.ItemId;
			var folderType;
			for(idx in $rs.subMenuList) {
				var folderID = $rs.subMenuList[idx].FolderId;
				if(folderID === $rs.currSubMenu) {
					folderType = $rs.subMenuList[idx].FolderType;
					break;
				}
			}
			
			var arrMail = new Array();
			arrMail.push($rs.CURR_MAIL_ID);
			
			var mailDeleteData = {
				LoginKey:$rs.userInfo.LoginKey,
				States:(folderType === 'DELETEDITEMS' ? true : false ),
				MailId:arrMail
			};
			
			var param = callApiObject('mail', 'mailDoDelete', mailDeleteData);
			$http(param).success(function(data) {
				//console.log(data);
				$s.isDlgMailDelete = false;
				
				var code = parseInt(data.Code);
				if(code == 1) {
					$rs.result_message = '메일을 삭제했습니다.';
					$rs.dialog_toast = true;
				} else {
					$rs.result_message = '메일삭제를 실패했습니다.';
					$rs.dialog_toast = true;
				}
				
				//삭제된 파일이 있기때문에 리스트 가져옴
				var reqMailListData = {
						LoginKey:$rs.userInfo.LoginKey,
						PageSize:30,
						PageNumber:$s.mailListPage,
						FolderID:$rs.currSubMenu,
						SearchType:$s.SearchType,
						SearchValue:$s.SearchValue != undefined ? $s.SearchValue : '',
						IsUnRead:$s.noneRead,
						IsFlag:$s.flagMail,
						IsToDay:$s.todayMail,
				};
				
				reqMailListData.StartDate = $s.txtSearchStart != undefined ? $s.txtSearchStart : '';
				reqMailListData.EndDate = $s.txtSearchEnd != undefined ? $s.txtSearchEnd : '';
				
				var param = callApiObject('mail', 'mailList', reqMailListData);
				$http(param).success(function(data) {
					var mailList = JSON.parse(data.value);
					$rs.mailList = mailList.Mails;
				});
			}).then(function(){
				setTimeout(function(){
					$rs.$apply(function(){
						$rs.dialog_toast = false;
					});
				}, 1000);
			});
		}
	};
	//읽지않음
	$s.callRightFunction = function(obj, index, event) {
		$s.currSelectedMail = obj.mail;
		$s.isReadMail = false;
		
		var arrMail = new Array();
		arrMail.push($s.currSelectedMail.ItemId);
		
		var readMailData = {
			LoginKey:$rs.userInfo.LoginKey,
			States:$s.isReadMail,
			MailId:arrMail
		}
		var readParam = callApiObject('mail', 'mailDoRead', readMailData);
		$http(readParam).success(function(readResultData) {
			//console.log(readResultData);
			$s.currSelectedMail.IsRead = $s.isReadMail;
			$s.currSelectedMail = undefined;
			
			var currSelectedElement = angular.element('.mailListBox').eq(index).find('.swiper-content');
			currSelectedElement.css({
				'opacity':1,
				'left':0
			});
			
			currSelectedElement.prev().prev().removeClass('ng-show');
			currSelectedElement.prev().prev().addClass('ng-hide');
			
		});

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
		
		$rs.subMenuList = rtnSubMenu;
	}
	
	$rs.$on('applyMailStatus', function(event, mail, mailID){
		for(i in $s.mailList) {
			var m = $s.mailList[i];
			if(m.ItemId === mailID) {
				m.FlagStatus = mail.FlagStatus;
				break;
			}
		}
	});
}])
.directive('execOnScrollToBottom', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var fn = scope.$eval(attrs.execOnScrollToBottom),
			clientHeight = element[0].clientHeight;
			element.on('scroll', function (e) {
				var el = e.target;
				var rate = 0.07;
				
				if ((el.scrollHeight - el.scrollTop) === clientHeight) { // fully scrolled
					scope.$root.dialog_progress = true;
					scope.$apply(fn);
				}
			});
		}
	};
})
.directive('onLongPress',function($timeout){
	return {
		restrict: 'A',
		link: function($scope, $elm, $attrs) {
			var swiperContent = $elm.find('.swiper-content');
			var timeout;
			$elm.bind('touchstart', function(evt) {
				var curr_left = parseInt(swiperContent.css('left').replace('px', ''), 10);
				
				$scope.longPress = true;
				$elm.addClass('pressed');
				
//				$timeout(function() {
				timeout = setTimeout(function() {
					if ($scope.longPress) {
						var future_left = parseInt(swiperContent.css('left').replace('px', ''), 10);
						
						if(Math.abs(curr_left - future_left) > 50) {
							$scope.longPress = false;
							$elm.removeClass('pressed');
						} else {
							$scope.$apply(function() {
								$scope.$eval($attrs.onLongPress)
							});
						}
					}
				}, 600);
			});
			
			$elm.bind('touchmove', function(e) {
				$scope.longPress = false;
				clearTimeout(timeout);
			});

			$elm.bind('touchend', function(evt) {
				$scope.longPress = false;
				$elm.removeClass('pressed');
				if ($attrs.onTouchEnd) {
					$scope.$apply(function() {
						$scope.$eval($attrs.onTouchEnd)
					});
				}
			});
		}
	  };
}).directive("mailXpull", function() {
	return function(scope, elm, attr) {
	    return $(elm[0]).xpull({
	    	pullThreshold: 80,
	        maxPullThreshold: 80,
	        'onPullThreshold' : function(){
	        	angular.element('.pull-indicator.mail').show();
	        },
	        'callback': function(e) {
	        	angular.element('.pull-indicator.mail').hide();
	        	scope.$apply(attr.ngXpull);
	        	scope.$root.$broadcast('initMailList', scope.displayName);
	        	return;
	        }
	    });
	};
});

//mailDetail
appHanmaru.controller('hallaMailDetailCtrl', ['$scope', '$http', '$rootScope', '$sce', function($s, $http, $rs, $sce) {
	$s.isRecipientShow = false;
	$s.isProfileImgEnlarge = true;
	var worker;
//	var pinchZoom;
	
	$rs.$on('initMailDetail', function(event, data){
		$s.isRecipientShow = false;
		//console.log($rs.mailData);
		
		//pinchzoom
		setTimeout(function(){
			try {
				var elm = document.getElementById('mailDetailHTMLContents');
//				initMailContentsPinchZoom(elm);
				////console.log(angular.element("#mailDetailContents").html());
			} catch(e) {
				//console.log(e);
			}
		}, 500);
		
		//사용자 상세정보
		$s.userDetailData = undefined;
		var reqUserDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			EmailAddress:$rs.mailData.FromEmailAddress 
		};
		
		var param = callApiObject('insa', 'insaUserDetail', reqUserDetailData);
		$http(param).success(function(data) {
			//console.log(data);
			var startStr = data.value.substring(0,1);
			
			if(startStr === '{') {
				setTimeout(function(){
					$s.$apply(function(){
						$s.userDetailData = JSON.parse(data.value);
					});
				}, 500);
			}
		});
		
		//CID ATTACH 가 있을 떄 값 교체
		function downloadCIDFileAS(index, cid) {
			$http.get(cid.FileURL, {responseType:'arraybuffer'}).success((function(index) {
			    return function(data) {
					var base64Data = 'data:image/' + extension + ';base64,'+ _arrayBufferToBase64(data);
					//mail.Body = mail.Body.replace('cid:'+toDeleteMail.FileName, base64Data);
					//[[CID::ATTACH_1]]
					//$rs.mailData.HTMLBody = $sce.trustAsHtml($rs.mailData.Body);
					var cidAttachIndex = '[[CID::ATTACH_'+index+']]';
					$rs.mailData.Body = $rs.mailData.Body.replaceAll(cidAttachIndex, base64Data);
					$rs.mailData.HTMLBody = $sce.trustAsHtml($rs.mailData.Body);
			    }
			})(index));
		}
			
		if($rs.mailData.tmpAttachMap != undefined) {
			var keys = Object.keys($rs.mailData.tmpAttachMap.map);
			for(var i = 0; i < keys.length; i++) {
				var fileName = keys[i];
				var index = $rs.mailData.tmpAttachMap.get(fileName).index;
				var cidAttach = $rs.mailData.tmpAttachMap.get(fileName).attach;
				var extension = cidAttach.FileName.split('.').pop();
				worker = new Worker(
					downloadCIDFileAS(index, cidAttach)
	    		);
			}
			
			////console.log($rs.mailData.Body);
			/*
			for(idx in $rs.mailData.tmpAttachArray) {
				var cidAttach = $rs.mailData.tmpAttachArray[idx];
				var extension = cidAttach.FileName.split('.').pop();
				worker = new Worker(
					downloadCIDFileAS(idx, cidAttach)
	    		);
			}
			*/
			 /*
			if(typeof(Worker) !== "undefined") {
		        if(typeof($s.worker) == "undefined") {
		            $s.worker = new Worker(
			            $.post(download_url, function(data){
			            	//console.log(data);
			            	postMessage(data);
			            })
		    		);
		        }
		        $s.worker.onmessage = function(event) {
		        	//console.log("event");
		        	//console.log(event);
		        };
		    } else {
		    	//console.log(event);
		    } 
		    */
			/*
			$http.get(toDeleteMail.FileURL, {responseType:'arraybuffer'}).success((function(index) {
			    return function(data) {
					var base64Data = 'data:image/' + extension + ';base64,'+ _arrayBufferToBase64(data);
					mail.Body = mail.Body.replace('cid:'+toDeleteMail.FileName, base64Data);
					mail.HTMLBody = $sce.trustAsHtml(mail.Body);
					
					if(index < removeIdxArray.length) recursiveImageDeleteLoad(++index, mail, removeIdxArray);
			    }
			})(removeIdxArray[index]));
			*/
		}
		
//		//console.log("--------mail detail --------");
//		//console.log($rs.mailData);
//		//console.log("--------mail detail --------");
//		//console.log($rs.mailData.Body);
		/*var mailBody = angular.element($rs.mailData.Body);
		var approvalLink = mailBody.find('a[href*="/Workflow/Page/Link.aspx"]');
		if(approvalLink != undefined) {
			var link = approvalLink.attr('href').split('?')[1].split('=')[1];
			approvalLink.attr('href', '');
			approvalLink.click(function(){
				alert("!?");
			});
			//console.log(approvalLink.attr('href'));
			//console.log(link);
		}
		$rs.mailData.HTMLBody = $sce.trustAsHtml($rs.mailData.Body);*/
		
	});
	
	$s.btnToggleRecipientShow = function(e) {
		$s.isRecipientShow = !$s.isRecipientShow;
	}
	
	$s.btnMailNavigation = function(type) {
		var reqMailDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			FolderID:$rs.currSubMenu,
		};
		
		if(type === 'prev') {
			if($rs.mailData.PrevOffset != -1) {
				reqMailDetailData.Offset = $rs.mailData.PrevOffSet,
				reqMailDetailData.MailId = $rs.mailData.Prev
			} else {
				return;
			}
		} else if(type === 'next') {
			if($rs.mailData.NextOffset != -1) {
				reqMailDetailData.Offset = $rs.mailData.NextOffSet,
				reqMailDetailData.MailId = $rs.mailData.Next
			} else {
				return;
			}
		} else {
			return;
		}
		
		var param = callApiObject('mail', 'mailDetail', reqMailDetailData);
		$http(param).success(function(data) {
//			//console.log(data);
			var startStr = data.value.substring(0,1);
			
			if(startStr === '{') {
				var mailData = JSON.parse(data.value);
				setTimeout(function(){
					$s.isRecipientShow = false;
					$rs.mailData = mailData;
					$rs.$apply(function () {
						$rs.mailData.HTMLBody = $sce.trustAsHtml($rs.mailData.Body);
			        });
				}, 100);
				/*			
				//pinchzoom
				setTimeout(function(){
					try {
						var a = angular.element("#mailDetailContents").pinchzoomer();
						//console.log(a);
					} catch(e) {
						//console.log(e);
					}
				}, 3000);
				*/
			}
		});
	}
	
	$s.popPage = function(currPageName) {
		/*
		var reqMailListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:20,
			PageNumber:1,
			FolderID:$rs.currSubMenu
		};
		
		var param = callApiObject('mail', 'mailList', reqMailListData);
		$http(param).success(function(data) {
			var mailList = JSON.parse(data.value);
			$rs.mailList = mailList.Mails;
			//console.log(mailList);
		});
		*/
		
		var el = document.getElementById('mailDetailHTMLContents');
		transform = "translate3d(0, 0, 0) " + "scale3d(1,1,1) ";
		el.style.webkitTransform = transform;
        transform = "";
		$s.currZoom = 1;
		
		
		popPage(currPageName);
	}
	
	$s.btnToggleFlag = function(e){
		//메일 플래그
		var arrMail = new Array();
		arrMail.push($rs.CURR_MAIL_ID);
		
		var flagMailData = {
			LoginKey:$rs.userInfo.LoginKey,
			States:!$rs.mailData.FlagStatus,
			MailId:arrMail
		}
		var flagParam = callApiObject('mail', 'mailDoFlag', flagMailData);
		$http(flagParam).success(function(flagResultData) {
			var code = parseInt(flagResultData.Code);
			
			if(code == 1) {
				$rs.mailData.FlagStatus = !$rs.mailData.FlagStatus;
				
				if($rs.mailData.FlagStatus) {
					$rs.result_message = '깃발 추가 되었습니다';
				} else {
					$rs.result_message = '깃발 해제 되었습니다';
				}
				
				
				$rs.$broadcast('applyMailStatus', $rs.mailData, $rs.CURR_MAIL_ID);
				$rs.dialog_toast = true;
			} else {
				$rs.result_message = '깃발 추가/해제에 실패했습니다.';
				$rs.dialog_toast = true;
			}
		}).then(function(){
			setTimeout(function(){
				$rs.$apply(function(){
					$rs.dialog_toast = false;
				});
			}, 2000);
		});
	}
	
	$s.btnShowMailWrite = function(e) {
		$rs.pushPage('pg_mail_view', 'pg_mail_write');
		//$rs.pushOnePage('pg_mail_write');
	}
	
	//메일 이동 start 
	$s.isDlgMailMove = false;
	$s.btnDlgMailMove = function(e) {
		$s.isDlgMailMove = !$s.isDlgMailMove;
		
		var param = callApiObject('mail', 'mailBoxs', {LoginKey:$rs.userInfo.LoginKey});
		$http(param).success(function(data) {
			var mailBoxList = JSON.parse(data.value);
			initMailTree(mailBoxList);
		});
	};
	
	// 메일이동 > 메일함 트리구조로 변경
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
		$s.moveMailBoxList = rtnSubMenu;
	}  
	
	$s.dismissDlgMailMove = function(e){
		var target = angular.element(e.target);
		
		if(target.hasClass('dlgMailMove')) {
			$s.isDlgMailMove = false;
		} else {
			return;
		}
	};
	
	$s.btnSelectMoveMailFolder = function(e, folderId) {
		var target = angular.element(e.target);
		if(!target.hasClass('disabled')) {
			$s.targetFolderId = folderId;
		} else {
			return;
		}
	}
	
	$s.btnConfirmMoveMail = function(){
		if($s.targetFolderId != undefined) {
			var arrMail = new Array();
			arrMail.push($rs.CURR_MAIL_ID);
			
			var mailMoveData = {
				LoginKey:$rs.userInfo.LoginKey,
				TargetID:$s.targetFolderId,
				MailId:arrMail
			};
			
			var param = callApiObject('mail', 'mailDoMove', mailMoveData);
			$http(param).success(function(data) {
//				//console.log(data);
				var code = parseInt(data.Code);
				if(code == 1) {
					$rs.result_message = '메일을 이동했습니다.';
					$rs.dialog_toast = true;
				} else {
					$rs.result_message = '메일이동 실패했습니다.';
					$rs.dialog_toast = true;
				}
				$s.targetFolderId = undefined;
				$s.isDlgMailMove = false;
			}).then(function(){
				setTimeout(function(){
					$rs.$apply(function(){
						$rs.dialog_toast = false;
					});
				}, 1000);
				
				//삭제된 파일이 있기때문에 리스트 가져옴
				var reqMailListData = {
					LoginKey:$rs.userInfo.LoginKey,
					PageSize:30,
					PageNumber:1,
					FolderID:$rs.currSubMenu
				};
				
				var param = callApiObject('mail', 'mailList', reqMailListData);
				$http(param).success(function(data) {
					var mailList = JSON.parse(data.value);
					$rs.mailList = mailList.Mails;
				}).then(function(){
					popPage('pg_mail_view');
				});
			});
		} else {
			$s.isDlgMailMove = false;
		}
	}
	//메일 이동 end
	
	//메일 삭제 start
	$s.isDlgMailDelete = false;
	$s.btnDlgMailDelete = function(e) {
		$s.isDlgMailDelete = !$s.isDlgMailDelete;
		deleteMail();
	};
	function deleteMail(){
		$s.dismissDlgMailDelete = function(e){
			var target = angular.element(e.target);
			
			if(target.hasClass('dlgMailDelete')) {
				$s.isDlgMailDelete = false;
			} else {
				return;
			}
		};
		
		$s.btnCancelDeleteMail = function(){
			$s.isDlgMailDelete = false;
		}
		
		$s.btnConfirmDeleteMail = function(){
//			$rs.currSubMenu = boxList[0].FolderId;
			var folderType;
			for(idx in $rs.subMenuList) {
				var folderID = $rs.subMenuList[idx].FolderId;
				if(folderID === $rs.currSubMenu) {
					folderType = $rs.subMenuList[idx].FolderType;
					break;
				}
			}
			
			var arrMail = new Array();
			arrMail.push($rs.CURR_MAIL_ID);
			
			var mailDeleteData = {
				LoginKey:$rs.userInfo.LoginKey,
				States:(folderType === 'DELETEDITEMS' ? true : false ),
				MailId:arrMail
			};
			
			var param = callApiObject('mail', 'mailDoDelete', mailDeleteData);
			$http(param).success(function(data) {
				//console.log(data);
				$s.isDlgMailDelete = false;
				
				var code = parseInt(data.Code);
				if(code == 1) {
					$rs.result_message = '메일을 삭제했습니다.';
					$rs.dialog_toast = true;
				} else {
					$rs.result_message = '메일삭제를 실패했습니다.';
					$rs.dialog_toast = true;
				}
				
				//삭제된 파일이 있기때문에 리스트 가져옴
				var reqMailListData = {
					LoginKey:$rs.userInfo.LoginKey,
					PageSize:30,
					PageNumber:1,
					FolderID:$rs.currSubMenu
				};
				
				var param = callApiObject('mail', 'mailList', reqMailListData);
				$http(param).success(function(data) {
					var mailList = JSON.parse(data.value);
					$rs.mailList = mailList.Mails;
				}).then(function(){
					popPage('pg_mail_view');
				});
			}).then(function(){
				setTimeout(function(){
					$rs.$apply(function(){
						$rs.dialog_toast = false;
					});
				}, 1000);
			});
		}
	}
	//메일 삭제 end
	
	//답장/전달 start
	$s.isShowReplyForward = false;
	$s.detectReplyForward = function(e) {
		var currTarget = angular.element(e.target);
		var parentTarget = angular.element(e.target).parent();
//		//console.log(currTarget);
//		//console.log(parentTarget);
		if(!currTarget.hasClass('reply') && !parentTarget.hasClass('reply')) {
			$s.isShowReplyForward = false;
		} else {
			return;
		}
	}
	
	$s.btnShowReplyForwardMenu = function(e) {
		$s.isShowReplyForward = !$s.isShowReplyForward;
	}
	
	//메일유형 
	//1 : 일반, 2 : 회신, 3 : 전체회신, 4 : 전달
	$s.btnReply = function(e) {
//		//console.log('btnReply');
//		//console.log($rs.mailData);
		var recipientArray = new Array();
		var recipients = {};
		recipients.DisplayName = $rs.mailData.FromName;
		recipients.EMailAddress = $rs.mailData.FromEmailAddress;
		recipientArray.push(recipients);
		
		$rs.mailData.ItemId = $rs.CURR_MAIL_ID;
		$rs.pushPage('pg_mail_view', 'pg_mail_write');
		$rs.$broadcast('initReplyForwardMailData', $rs.mailData, true, recipientArray, 2);
	}
	
	$s.btnReplyAll = function(e) {
//		//console.log('btnReplyAll');
//		//console.log($rs.mailData);
		var recipientArray = new Array();
		var recipients = {};
//		recipients.DisplayName = $rs.mailData.FromName;
//		recipients.EMailAddress = $rs.mailData.FromEmailAddress;
//		recipientArray.push(recipients);
		
		for(var idx in $rs.mailData.ToRecipients) {
			var mail = $rs.mailData.ToRecipients[idx];
			var recipient = {};
			recipient.DisplayName = mail.DisplayName;
			recipient.EMailAddress = mail.EMailAddress;
			recipientArray.push(recipient);
		}
		
		$rs.mailData.ItemId = $rs.CURR_MAIL_ID;
		$rs.pushPage('pg_mail_view', 'pg_mail_write');
		$rs.$broadcast('initReplyForwardMailData', $rs.mailData, true, recipientArray, 3);
	}
	
	$s.btnForward = function(e) {
//		//console.log('btnReplyForward');
		var recipientArray = new Array();
		
		$rs.mailData.ItemId = $rs.CURR_MAIL_ID;
		$rs.pushPage('pg_mail_view', 'pg_mail_write');
		$rs.$broadcast('initReplyForwardMailData', $rs.mailData, true, recipientArray, 4);
	}
	//답장/전달 end
	
	$s.getFileSizeUnit = function(value){
		return getFileSizeUnit(value);
	}
	
	//(공통)첨부파일 다운로드
	$s.btnDownloadAttachFile = function(index, fileURL, fileName) {
		//여기에 하이브리드 기능 기술
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.downloadAttachFile(fileURL, fileName);
			}
		} else if($rs.agent == 'ios') {
			webkit.messageHandlers.iosDownloadAttachFile.postMessage({fileURL:fileURL,fileName:fileName});
		}
	}
	
	//ios file download success return
	iosDownloadSuccess = function() {
		$rs.result_message = '다운로드가 완료 되었습니다.';
		$rs.dialog_toast = true;
		
		setTimeout(function(){
			$rs.$apply(function(){
				$rs.dialog_toast = false;
			});
		}, 10000);
	};
	
	//사용자 상세조회
	$s.selectOrganUser = function(emailAddr) {
		//사용자 상세정보
		var reqUserDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			EmailAddress:emailAddr 
		};
		
		var param = callApiObject('insa', 'insaUserDetail', reqUserDetailData);
		$http(param).success(function(data) {
			var result = JSON.parse(data.value);
			$s.selectedOrganUser = result;
			$s.determineProfileImg($s.selectedOrganUser);
		});
	}
	
	$s.closeOrganUserDialog = function(){
		$s.selectedOrganUser = undefined;
		$s.isProfileImgEnlarge = true;
	}
	
	$s.determineProfileImg = function(user) {
		var rtnUrl = '';
//		//console.log(user.MyPhotoUrl);
		
		if(user.MyPhotoUrl.indexOf('//https') != -1) {
			rtnUrl = 'https://' + user.MyPhotoUrl.substring(user.MyPhotoUrl.indexOf('//https')+10, user.MyPhotoUrl.length);
			try {
				$http.get(rtnUrl).error(function(data){
					//console.log(data);
					user.MyPhotoUrl = '/resources/image/organization/org_user.png';
				});
			} catch(e) {
				user.MyPhotoUrl = '/resources/image/organization/org_user.png';
			}
		} else if(user.MyPhotoUrl.indexOf('http://') != -1) {
			rtnUrl = user.MyPhotoUrl.replace('http', 'https');
			user.MyPhotoUrl = rtnUrl;
		}
	}
	
	$s.toggleProfileEnlarge = function() {
		$s.isProfileImgEnlarge = !$s.isProfileImgEnlarge;
	}
	

	//전화걸기
	$s.doExecCallPhone = function(num) {
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.callDial(num);
			} 
		} else if($rs.agent=='ios') {
			
		}
		
		$s.closeOrganUserDialog();
	}
	
	//SMS
	$s.doExecSMSPhone = function(num) {
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.callSMSSend(num);
			} 
		} else if($rs.agent=='ios') {
			
		}
		
		$s.closeOrganUserDialog();
	}
	
	//이메일
	$s.doExecEmail = function(user) {
		var arr = new Array();
		arr.push(user);
		
		$rs.$broadcast("mailApplySelectedUser", arr, new Array(), new Array());
		pushOnePage('pg_mail_write');
		
		$s.closeOrganUserDialog();
	}
	
	var hammertime;
	function initMailContentsPinchZoom(elm) {
		if(hammertime == undefined) {
			hammertime = new Hammer(elm, {});
		    var posX = 0, posY = 0, scale = 1, last_scale = 1, last_posX = 0, last_posY = 0, max_pos_x = 0, max_pos_y = 0, transform = "", el = elm;

		    hammertime.on('doubletap pan panend pinch pinchend', function(ev) {
		        if (ev.type == "doubletap") {
		            transform = "translate3d(0, 0, 0) " + "scale3d(2, 2, 1) ";
		            scale = 2;
		            last_scale = 2;
		            try {
		                if (window.getComputedStyle(el, null).getPropertyValue('-webkit-transform').toString() != "matrix(1, 0, 0, 1, 0, 0)") {
		                    transform = "translate3d(0, 0, 0) " + "scale3d(1, 1, 1) ";
		                    scale = 1;
		                    last_scale = 1;
		                }
		            } catch (err) {}
		            el.style.webkitTransform = transform;
		            transform = "";
		        }

		        //pan    
		        if (ev.type == 'pan') {
		            posX = last_posX + ev.deltaX;
		            posY = last_posY + ev.deltaY;
		            max_pos_x = Math.ceil((scale - 1) * el.clientWidth / 2);
		            max_pos_y = Math.ceil((scale - 1) * el.clientHeight / 2);
		            if (posX > max_pos_x) posX = max_pos_x;
		            if (posX < -max_pos_x) posX = -max_pos_x;
		            if (posY > max_pos_y) posY = max_pos_y;
		            if (posY < -max_pos_y) posY = -max_pos_y;
		        }

		        //pinch
		        if(ev.type == "pinch") scale = Math.max(.999, Math.min(last_scale * (ev.scale), 4));
		        if(ev.type == "pinchend") last_scale = scale;

		        //panend
		        if(ev.type == "panend") {
		            last_posX = posX < max_pos_x ? posX : max_pos_x;
		            last_posY = posY < max_pos_y ? posY : max_pos_y;
		        }

		        if (scale != 1) transform = "translate3d(" + posX + "px," + posY + "px, 0) " + "scale3d(" + scale + ", " + scale + ", 1)";
		        if (transform) el.style.webkitTransform = transform;
		    });
		}
	}
	
	$rs.determineExtension = function(file) {
		var extension = file.FileName.split('.').pop();
		if(
			extension === 'avi' ||
			extension === 'doc' ||
			extension === 'html' ||
			extension === 'hwp' ||
			extension === 'jpg' ||
			extension === 'jpeg' ||
			extension === 'mov' ||
			extension === 'pdf' ||
			extension === 'png' ||
			extension === 'ppt' ||
			extension === 'pptx' ||
			extension === 'rar' ||
			extension === 'tiff' ||
			extension === 'xls' ||
			extension === 'xlsx' ||
			extension === 'zip') {
		} else {
			extension = 'etc'
		}
		
		return '/resources/image/extension/ic_file_' + extension + '.png'; 
	}
	
	// pinchzoom setting
	var transform = '';
	$s.minZoom = 1;
	$s.maxZoom = 4;
	$s.currZoom = 1;
	$s.btnMailContentsZoomPlus = function() {
		$s.currZoom++;
		if($s.currZoom <= $s.maxZoom) {
			var el = document.getElementById('mailDetailHTMLContents');
			transform = "translate3d(0, 0, 0) " + "scale3d(" + $s.currZoom + "," + $s.currZoom + ", 1) ";
	        el.style.webkitTransform = transform;
	        transform = "";
		} else {
			$s.currZoom = $s.maxZoom;
		}
	};
	
	$s.btnMailContentsZoomMinus = function() {
		var el = document.getElementById('mailDetailHTMLContents');
		$s.currZoom--;
		if($s.currZoom >= $s.minZoom) {
			var el = document.getElementById('mailDetailHTMLContents');
			transform = "translate3d(0, 0, 0) " + "scale3d(" + $s.currZoom + "," + $s.currZoom + ", 1) ";
	        el.style.webkitTransform = transform;
	        transform = "";
		} else {
			$s.currZoom = $s.minZoom;
		}
	};
}]);
//mailWrite
//메일유형 
//1 : 일반, 2 : 회신, 3 : 전체회신, 4 : 전달
appHanmaru.controller('hallaMailWriteCtrl', ['$scope', '$http', '$rootScope', function($s, $http, $rs) {
	$s.hasMailData = false;
	$s.isFlagMailMe = false;
	$s.attach_list = new Array();
	$s.recipient_user_list = new Array();
	$s.cc_user_list= new Array();
	$s.hcc_user_list = new Array();
	$s.TOrecipient_user_list = new Array();
	$s.CCrecipient_user_list = new Array();
	$s.BCCrecipient_user_list = new Array();
	$s.uploadFileList = new Array();
	$s.deleteFileList = new Array();
	$s.mailType = 1; //기본 메일타입
	$s.isMailSend = false;
	
	var mailContents = angular.element('.wrap_contents');
	mailContents.on('click', function(){
		mailContents.find('iframe').focus();
	});
	
	$rs.$on('mailContentsReset', function(event){
		//에디터 내용 리셋
		var mailContents = angular.element('#mailContents');
		var frameMailContents = angular.element(mailContents.contents());
		frameMailContents.find('#btnResetBodyValue').trigger('click');
	})
	
	$s.popPage = function(currPageName) {
		popPage(currPageName);
		$s.hasMailData = false;
		$s.attach_list = new Array();
		$s.isFlagMailMe = false;
		$s.mailSubject = '';
		$s.mailContents = '';
		$s.recipient_user_list = new Array();
		$s.cc_user_list= new Array();
		$s.hcc_user_list = new Array();
		$s.TOrecipient_user_list = new Array();
		$s.CCrecipient_user_list = new Array();
		$s.BCCrecipient_user_list = new Array();
		$s.uploadFileList = new Array();
		$s.deleteFileList = new Array();
		$s.mailType = 1; //기본 메일타입
		$s.txt_rcv_name = '';
		$s.txt_cc_name = '';
		$s.txt_hcc_name = '';
		
		/*
		var reqMailListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:20,
			PageNumber:1,
			FolderID:$rs.currSubMenu
		};
		
		var param = callApiObject('mail', 'mailList', reqMailListData);
		$http(param).success(function(data) {
			var mailList = JSON.parse(data.value);
			$rs.mailList = mailList.Mails;
			//console.log(mailList);
		});
		*/
	}
	
	$rs.$on('initReplyForwardMailData', function(event, mail, data, list, mailType){
		$s.replyForwardMail = mail;
		$s.hasMailData = data;
		$s.mailType = mailType;
		
		if(mailType == 2 || mailType == 3) {
			$s.mailSubject = 'RE : ' + $rs.mailData.Subject;
		} else if(mailType == 4) {
			$s.mailSubject = 'FW : ' + $rs.mailData.Subject;
		}
		
		if(mailType == 3){
			var ccList = mail.CcRecipients;
			if(list.length > 0) {
				$s.cc_user_list = ccList;
			}
			
			for(idx in ccList) {
				var recipients = {};
				var user = ccList[idx];
				
				if(user.UserName != undefined) {
					recipients.DisplayName = user.DisplayName;
					recipients.EMailAddress = user.EMailAddress;
				} else {
					recipients.DisplayName = user.DeptName;
					recipients.EMailAddress = user.Address;
				}
				$s.CCrecipient_user_list.push(recipients);
			}
		}
		
		if(mailType == 2 || mailType == 3){
			if(list.length > 0) {
				$s.recipient_user_list = list;
			}
			for(idx in list) {
				var recipients = {};
				var user = list[idx];
				
				if(user.UserName != undefined) {
					recipients.DisplayName = user.UserName;
					recipients.EMailAddress = user.EmailAddress;
				} else {
					recipients.DisplayName = user.DeptName;
					recipients.EMailAddress = user.Address;
				}
				
				$s.TOrecipient_user_list.push(recipients);
			}
		}
		
		
		$s.attach_list = new Array();
		if(mailType == 4){
			for(idx in mail.Attachments) {
				var att = mail.Attachments[idx];
				$s.attach_list.push(att);
			}
		}
		var mailContents = angular.element('#mailContents');
		var frameMailContents = angular.element(mailContents.contents());
		frameMailContents.find('#tmpMailContents').val($rs.mailData.Body);
		frameMailContents.find('#btnSetBodyValue').trigger('click');

		if(mailType == 1){
			//에디터 내용 리셋
			var mailContents = angular.element('#mailContents');
			var frameMailContents = angular.element(mailContents.contents());
			frameMailContents.find('#btnResetBodyValue').trigger('click');	
		}
		
	});
	
	//조직도 사용자 선택 반영
	$rs.$on("mailApplySelectedUser", function(e, rcv, cc, bcc) {
		//console.log(rcv);
		//console.log(cc);
		//console.log(bcc);
		
		if(rcv.length > 0) {
			for(idx in rcv) {
				//console.log($s.recipient_user_list.indexOf(rcv[idx]));
				if($s.recipient_user_list.indexOf(rcv[idx]) == -1) {
					$s.recipient_user_list.push(rcv[idx]);
				}
			}
		}
		
		if(cc.length > 0) {
			for(idx in cc) {
				//console.log($s.cc_user_list.indexOf(cc[idx]));
				if($s.cc_user_list.indexOf(cc[idx]) == -1) {
					$s.cc_user_list.push(cc[idx]);
				}
				
			}
		}
		
		if(bcc.length > 0) {
			for(idx in bcc) {
				//console.log($s.hcc_user_list.indexOf(bcc[idx]));
				if($s.hcc_user_list.indexOf(bcc[idx]) == -1) {
					$s.hcc_user_list.push(bcc[idx]);
				}
			}
		}
		
		for(idx in rcv) {
			var recipients = {};
			var user = rcv[idx];
			
			if(user.UserName != undefined) {
				recipients.DisplayName = user.UserName;
				recipients.EMailAddress = user.EmailAddress;
			} else {
				recipients.DisplayName = user.DeptName;
				recipients.EMailAddress = user.Address;
			}
			
			$s.TOrecipient_user_list.push(recipients);
		}
		
		for(idx in cc) {
			var recipients = {};
			var user = cc[idx];
			
			if(user.UserName != undefined) {
				recipients.DisplayName = user.UserName;
				recipients.EMailAddress = user.EmailAddress;
			} else {
				recipients.DisplayName = user.DeptName;
				recipients.EMailAddress = user.Address;
			}
			
			$s.CCrecipient_user_list.push(recipients);
		}
		
		for(idx in bcc) {
			var recipients = {};
			var user = bcc[idx];
			
			if(user.UserName != undefined) {
				recipients.DisplayName = user.UserName;
				recipients.EMailAddress = user.EmailAddress;
			} else {
				recipients.DisplayName = user.DeptName;
				recipients.EMailAddress = user.Address;
			}
			
			$s.BCCrecipient_user_list.push(recipients);
		}
		/*
		$s.TOrecipient_user_list = new Array();
		$s.CCrecipient_user_list = new Array();
		$s.BCCrecipient_user_list = new Array();
		*/
	});
	
	/*
	$s.initAttachFile = function(){
		//여기에 하이브리드 기능 기술
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				
			}
		} else if($rs.agent == 'ios') {
			
		} else {
			
		}
	};
	*/
	$s.changeAttachFile = function(e){
		var files = e.target.files; // FileList 객체
		
		$s.$apply(function(){
			$s.attach_list.push(files[0]);
			$s.chooser_attach_file = undefined;

			var fd = new FormData();
			fd.append('LoginKey', $rs.userInfo.LoginKey);
			fd.append('file', files[0]);
						
			var param = callApiObjectNoData('mail', 'mailUploadFile');
			
			$http.post(param.url, fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			}).success(function(data) {
				var code = parseInt(data.Code, 10);
				
				if(code === 1) {
					$s.uploadFileList.push(files[0].name);
				}
			}).error(function(data){
				//console.log(data);
			});
		});
//		//console.log($s.attach_list);
	}
	
	$s.btnRemoveRecipient = function(index) {
		var user = $s.recipient_user_list[index];
		
		if(user.UserKey != undefined) {
			if(user.UserKey == $rs.userInfo.UserKey) {
				$s.isFlagMailMe = !$s.isFlagMailMe;
				$s.recipient_user_list.splice(index, 1);
			} else {
				$s.recipient_user_list.splice(index, 1);
				$s.TOrecipient_user_list.splice(index, 1);
			}
		} else {
			$s.recipient_user_list.splice(index, 1);
			$s.TOrecipient_user_list.splice(index, 1);
		}
	}
	
	$s.btnRemoveCC = function(index) {
		var user = $s.cc_user_list[index];
		
		if(user.UserKey != undefined) {
			if(user.UserKey == $rs.userInfo.UserKey) {
				$s.isFlagMailMe = !$s.isFlagMailMe;
				$s.cc_user_list.splice(index, 1);
			} else {
				$s.cc_user_list.splice(index, 1);
				$s.CCrecipient_user_list.splice(index, 1);
			}
		} else {
			$s.cc_user_list.splice(index, 1);
			$s.CCrecipient_user_list.splice(index, 1);
		}
	}
	
	$s.btnRemoveHCC = function(index) {
		var user = $s.hcc_user_list[index];
		
		if(user.UserKey != undefined) {
			if(user.UserKey == $rs.userInfo.UserKey) {
				$s.isFlagMailMe = !$s.isFlagMailMe;
				$s.hcc_user_list.splice(index, 1);
			} else {
				$s.hcc_user_list.splice(index, 1);
				$s.BCCrecipient_user_list.splice(index, 1);
			}
		} else {
			$s.hcc_user_list.splice(index, 1);
			$s.BCCrecipient_user_list.splice(index, 1);
		}
	}
	
	$s.btnRemoveAttach = function(index) {
		$s.deleteFileList.push($s.attach_list[index].name);
		$s.attach_list.splice(index, 1);
	}
	
	$s.btnToggleMailMe = function(e) {
		if(!$s.isFlagMailMe) {
			var user = {};
			var recipients = {};
			
			if($s.mailType == 1) {
				user.UserKey = $rs.userInfo.UserKey;
				user.UserName = $rs.userInfo.UserName;
				user.PositionName = $rs.userInfo.PositionName;
				user.DeptName = $rs.userInfo.DeptName;
				user.CompName = $rs.userInfo.CompName;
				$s.recipient_user_list.push(user);
			} else {
				user.UserKey = $rs.userInfo.UserKey;
				user.DisplayName = $rs.userInfo.UserName + '/(' + $rs.userInfo.UserName + ')/' + $rs.userInfo.PositionName + '/' + $rs.userInfo.DeptName + '/' + $rs.userInfo.CompName;
				$s.recipient_user_list.push(user);
			}
			
			recipients.DisplayName = $rs.userInfo.UserName;
			recipients.EMailAddress = $rs.userInfo.EmailAddress;
			
			$s.TOrecipient_user_list.push(recipients);
//			//console.log($s.TOrecipient_user_list);
		} else {
			for(idx in $s.recipient_user_list) {
				var user = $s.recipient_user_list[idx];
				if(user.UserKey == $rs.userInfo.UserKey) {
					$s.recipient_user_list.splice(idx, 1);
					break;
				}
			}
		}
		
		$s.isFlagMailMe = !$s.isFlagMailMe;
	}
	
	$s.btnSendEmail = function(){
		if($s.isMailSend) {
			alert("메일을 보내는 중입니다.\n잠시만 기다려 주세요");
			return;
		}
		
		$s.isMailSend = true;
		var mailContents = angular.element('#mailContents');
		var frameMailContents = angular.element(mailContents.contents());
		frameMailContents.find('#btnGetBodyValue').trigger('click');
		var mailContents = frameMailContents.find('#tmpMailContents').val();
		$s.mailContents = mailContents;
		
		if($s.mailSubject == '' || $s.mailSubject == undefined) {
			alert("제목을 입력해주세요");
			$s.isMailSend = false;
			return;
		}
		/*
		if($s.mailContents == '' || $s.mailContents == undefined) {
			alert("내용을 입력해주세요");
			return;
		}
		*/
		
		if($s.TOrecipient_user_list.length == 0 && ($s.txt_rcv_name == undefined || $s.txt_rcv_name == '')) {
			alert("수신자를 입력해주세요");
			$s.isMailSend = false;
			return;
		}
		
		if($s.TOrecipient_user_list.length == 0 && ($s.txt_rcv_name != '')) {
			var recipients = {};
			recipients.DisplayName = $s.txt_rcv_name;
			recipients.EMailAddress = $s.txt_rcv_name;
			
			$s.TOrecipient_user_list.push(recipients);
		}
		
		if($s.CCrecipient_user_list.length == 0 && ($s.txt_cc_name != '')) {
			var recipients = {};
			recipients.DisplayName = $s.txt_cc_name;
			recipients.EMailAddress = $s.txt_cc_name;
			$s.CCrecipient_user_list.push(recipients);
		}
		
		if($s.BCCrecipient_user_list.length == 0 && ($s.txt_bcc_name != '')) {
			var recipients = {};
			recipients.DisplayName = $s.txt_bcc_name;
			recipients.EMailAddress = $s.txt_bcc_name;
			$s.BCCrecipient_user_list.push(recipients);
		}
		
		var mailSendData = {
			LoginKey:$rs.userInfo.LoginKey,
			MailType:$s.mailType,
			Subject : $s.mailSubject,
			Body : $s.mailContents,
			ToRecipients:$s.TOrecipient_user_list,
			CcRecipients:$s.CCrecipient_user_list,
			BccRecipients:$s.BCCrecipient_user_list,
			NewFileList:$s.uploadFileList,
			DeleteFileList:$s.deleteFileList
		};
		
		if($s.replyForwardMail != undefined) {
			mailSendData.MailId = $s.replyForwardMail.ItemId; 
		}
		
		var param = callApiObject('mail', 'mailDoSend', mailSendData);
//		//console.log('던지는 메일 param : ',param);
		$http(param).success(function(data) {
			//console.log(data);
			try {
				var code = parseInt(data.Code, 10);
				if(code === 1) {
					$rs.result_message = '메일발송 완료';
					$rs.dialog_toast = true;
					
					setTimeout(function(){
						$rs.$apply(function(){
							$rs.dialog_toast = false;
						});
						
						$s.popPage('pg_mail_write');
						$s.isMailSend = false;
					}, 1000);
					
				} else if(code === -1) {
					alert(data.value);
				}
			} catch(e){}
		});
	}
	
	$s.getFileSizeUnit = function(value){
		return getFileSizeUnit(value);
	}
	
	//포커스 닿으면 이전에 입력했던 목록 나오기
	//insaAutoCompleteList
	angular.element('.txt_rcv_name, .txt_cc_name, .txt_hcc_name').focusin(function(){
		var clzNm = angular.element(this).attr('class');
		var idx = 0;
		var srch_keyword = '';
		
		if(clzNm.indexOf('_rcv_') != -1) {
			idx = 0;
			srch_keyword = $s.txt_rcv_name;
		} else if(clzNm.indexOf('_cc_') != -1) {
			idx = 1;
			srch_keyword = $s.txt_cc_name;
		} else if(clzNm.indexOf('_hcc_') != -1) {
			idx = 2;
			srch_keyword = $s.txt_hcc_name;
		}
		
		if(srch_keyword == undefined) {
			var reqAutoFillInsaData = {
				LoginKey:$rs.userInfo.LoginKey
			};
			
			var param = callApiObject('insa', 'insaAutoCompleteList', reqAutoFillInsaData);
			$http(param).success(function(data) {
				var userList = JSON.parse(data.value);
				
				if(idx == 0) {
					$s.search_rcv_result = userList;
				} else if(idx == 1) {
					$s.search_cc_result = userList;
				} else if(idx == 2) {
					$s.search_hcc_result = userList;
				}
				
				var lyrAutoComplete = angular.element('.search_user_list').eq(idx);
				if(!lyrAutoComplete.is(':visible')) {
					lyrAutoComplete.show();
					return;
				}
			});
		}
	});
	/*
	.blur(function(){
		var lyrAutoComplete = angular.element('.search_user_list');
		lyrAutoComplete.hide();
	});
	*/
	
	var autoFindTimeout;
	$s.btnDetectSearch = function(type, e) {
		var keyCode = e.keyCode;
		
		if(keyCode == 13) {
			var srch_keyword = '';
			
			if(type === 'rcv') {
				srch_keyword = $s.txt_rcv_name;
			} else if(type === 'cc') {
				srch_keyword = $s.txt_cc_name;
			} else if(type === 'hcc') {
				srch_keyword = $s.txt_hcc_name;
			} else {
				return;
			}
			
			//fire find person api
			var insaAutoCompleteData = {
				LoginKey:$rs.userInfo.LoginKey,
				Search:srch_keyword
			};
			
			var param = callApiObject('insa', 'insaAutoCompleteFind', insaAutoCompleteData);
			$http(param).success(function(data) {
//				//console.log(data);
				var code = data.Code;
				var startStr = data.value.substring(0,1);
				
				if(code == '1' && (startStr === '{' || startStr === '[')) {
					var userData = JSON.parse(data.value);
					var idx = 0;
					
					if(type === 'rcv') {
						idx = 0;
						$s.search_rcv_result = userData;
//						angular.element('.txt_rcv_name').trigger('blur');
					} else if(type === 'cc') {
						idx = 1;
						$s.search_cc_result = userData;
//						angular.element('.txt_cc_name').trigger('blur');
					} else if(type === 'hcc') {
						idx = 2;
						$s.search_hcc_result = userData;
//						angular.element('.txt_hcc_name').trigger('blur');
					}

					var lyrAutoComplete = angular.element('.search_user_list');
					lyrAutoComplete.hide();
					lyrAutoComplete.eq(idx).show();
					return;
				}
			});
		} else {
			var srch_keyword = '';
			
			if(type === 'rcv') {
				srch_keyword = $s.txt_rcv_name;
			} else if(type === 'cc') {
				srch_keyword = $s.txt_cc_name;
			} else if(type === 'hcc') {
				srch_keyword = $s.txt_hcc_name;
			} else {
				return;
			}
			
			if(srch_keyword.length >= 2) {
				if(autoFindTimeout != undefined) {
					clearTimeout(autoFindTimeout);
				}
				
				//입력한 이름으로 검색하기
				autoFindTimeout = setTimeout(function(){
					var reqAutoFillInsaData = {
						LoginKey:$rs.userInfo.LoginKey,
						Search:srch_keyword
					};
					
					var param = callApiObject('insa', 'insaAutoCompleteFind', reqAutoFillInsaData);
					$http(param).success(function(data) {
						var code = data.Code;
						var startStr = data.value.substring(0,1);
						
						if(code == '1' && (startStr === '{' || startStr === '[')) {
							var userData = JSON.parse(data.value);
							var idx = 0;
							
							if(type === 'rcv') {
								idx = 0;
								$s.search_rcv_result = userData;
								//angular.element('.txt_rcv_name').trigger('blur');
							} else if(type === 'cc') {
								idx = 1;
								$s.search_cc_result = userData;
								//angular.element('.txt_cc_name').trigger('blur');
							} else if(type === 'hcc') {
								idx = 2;
								$s.search_hcc_result = userData;
								//angular.element('.txt_hcc_name').trigger('blur');
							}

							var lyrAutoComplete = angular.element('.search_user_list').eq(idx);
							if(!lyrAutoComplete.is(':visible')) {
								lyrAutoComplete.show();
								return;
							}
						}
					});
				}, 1000);
			}
		}
	}
	

	$s.detectAutoComplete = function(e) {
		var lyrAutoComplete = angular.element('.search_user_list');

		if(lyrAutoComplete.is(':visible')) {
			lyrAutoComplete.hide();
			return;
		}
	}
	
	$s.addRcvSelectedUser = function(user) {
		var recipients = {};
		
		if(user.Type == undefined) {
			var arrUserInfo = user.Name.split("/");
			user.UserName = arrUserInfo[0];
			user.PositionName = arrUserInfo[2];
			user.DeptName = arrUserInfo[1];
			user.CompName = arrUserInfo[3];
			$s.recipient_user_list.push(user);
			
			recipients.DisplayName = user.UserName;
			recipients.EMailAddress = user.EmailAddress;
		} else if(user.Type != undefined) {
			$s.recipient_user_list.push(user);
			
			recipients.DisplayName = user.Name;
			recipients.EMailAddress = user.EmailAddress;
		}
		
		$s.TOrecipient_user_list.push(recipients);
		$s.txt_rcv_name = '';
		angular.element('.search_user_list').eq(0).hide();
	}
	
	$s.addCCSelectedUser = function(user) {
		var recipients = {};
		
		if(user.Type == undefined) {
			var arrUserInfo = user.Name.split("/");
			user.UserName = arrUserInfo[0];
			user.PositionName = arrUserInfo[2];
			user.DeptName = arrUserInfo[1];
			user.CompName = arrUserInfo[3];
			$s.cc_user_list.push(user);
			
			recipients.DisplayName = user.UserName;
			recipients.EMailAddress = user.EmailAddress;
		} else if(user.Type != undefined) {
			$s.cc_user_list.push(user);
			
			recipients.DisplayName = user.Name;
			recipients.EMailAddress = user.EmailAddress;
		}
		
		$s.CCrecipient_user_list.push(recipients);
		$s.txt_cc_name = '';
		$s.search_cc_result.splice(0, $s.search_cc_result.length);
		angular.element('.search_user_list').eq(1).hide();
	}
	
	$s.addHCCSelectedUser = function(user) {
		var recipients = {};
		
		if(user.Type == undefined) {
			var arrUserInfo = user.Name.split("/");
			user.UserName = arrUserInfo[0];
			user.PositionName = arrUserInfo[2];
			user.DeptName = arrUserInfo[1];
			user.CompName = arrUserInfo[3];
			$s.hcc_user_list.push(user);
			
			recipients.DisplayName = user.UserName;
			recipients.EMailAddress = user.EmailAddress;
		} else if(user.Type != undefined) {
			$s.hcc_user_list.push(user);
			
			recipients.DisplayName = user.Name;
			recipients.EMailAddress = user.EmailAddress;
		}
		
		$s.BCCrecipient_user_list.push(recipients);
		$s.txt_hcc_name = '';	
		angular.element('.search_user_list').eq(2).hide();
	}
	
	$s.btnCallOrganSelect = function(e) {
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id');
		$rs.$broadcast('initInsaAltList');
		pushOnePage('pg_insa_list_alt');
	}
	
	/*
	window.callMailEditorFocus = function() {
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id');

		//console.log(pageName);
		
		if(pageName === 'pg_mail_write') {
			window.scrollTo(0, 300);
		}
	}
	*/
}]).directive('mailAttachFileChange', function() {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var onChangeHandler = scope.$eval(attrs.mailAttachFileChange);
			element.on('change', onChangeHandler);
			element.on('$destroy', function() {
				element.off();
			});
		}
	};
});

//approval List
appHanmaru.controller('approvalController', ['$scope', '$http', '$rootScope', '$timeout', '$location', '$anchorScroll', '$window', function($s, $http, $rs, $timeout, $location, $anchorScroll, $window) {
//	$s.popPage = function(currPageName) {
//		popPage(currPageName);
//	}
	$s.isApprovalSortDDShow = false;
	$s.chkSortOrder = 'R';
//	ios datepicker webview 
	if ($rs.agent=='ios'){
		var elems = document.getElementsByClassName("txtDateSearch");

		for (var i = 0; i < elems.length; i++) {
		    elems[i].setAttribute("type", "date");
		}
	}
	
	$rs.$on('displayApprovalName', function(event, data){
		$s.displayName = data;
	});
	
	$rs.$on('initApprovalBox', function(event) {
		var param = callApiObject('mail', 'mailBoxs', {LoginKey:$rs.userInfo.LoginKey});
		$http(param).success(function(data) {
			var mailBoxList = JSON.parse(data.value);
			//console.log(mailBoxList);
			
			$rs.subMenuType = 'approval';
			$rs.subMenuList = mailBoxList;
			$rs.currSubMenu = mailBoxList[0].FolderId; 
			$rs.$broadcast('initApprovalList', mailBoxList[0].DisplayName);
		});
	});
	
	$rs.$on('initApprovalList', function(event, data) {
		//data => menuName
		$s.approvalListPage = 1;
		$s.displayName = data;
		
		var reqApprovalListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:20,
			PageNumber:$s.approvalListPage,
			FolderID:$rs.currSubMenu,
			SearchType1:'',
			SearchValue1:'',
			SearchType2:'',
			SearchValue2:'',
			DraftDeptSearch:'',
			StartDate:'',
			EndDate:'',
			Sort:$s.chkSortOrder
		};
		
		var param = callApiObject('approval', 'approvalList', reqApprovalListData);
		$http(param).success(function(data) {
			var approvalList = JSON.parse(data.value);
			$rs.approvalList = approvalList.Approvals;
			//console.log($rs.approvalList);
		});
	});
	
	//결재 리스트 클릭 시 상세 또는 리스트 선택
	$rs.approvalDetail = function(e, approval, displayName) {
		$rs.CURR_APPROVAL_ID = approval.ApprovalID;
		
		//결재 상세
		var reqApprovalData = {
			LoginKey:$rs.userInfo.LoginKey,
			ApprovalID:approval.ApprovalID
		};
		var param = callApiObject('approval', 'approval', reqApprovalData);
		$http(param).success(function(data) {
			var approvalData = JSON.parse(data.value);
//			//console.log(approvalData);
//			$rs.approvalData = approvalData; 
//			$rs.approvalData.HTMLBody = $sce.trustAsHtml($rs.approvalData.Body);
			$rs.pushOnePage('pg_approval_view');
			$rs.$broadcast('initApprovalDetail', approvalData, displayName);
//			//console.log(approvalData);
		});
	}
	
	//검색 다이얼로그
	$s.toggleApprovalSearchDD = function(e){
		
		$rs.isApprovalSearchDDShow = !$rs.isApprovalSearchDDShow;
	};
	
	$s.btnSearchApproval = function(e){
		$rs.isApprovalSearchDDShow = false;
		$s.approvalListPage = 1;
		$s.displayName = data;
		
		var reqApprovalListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:20,
			PageNumber:$s.approvalListPage,
			FolderID:$rs.currSubMenu,
			SearchType1:'',
			SearchValue1:'',
			SearchType2:'',
			SearchValue2:'',
			DraftDeptSearch:'',
			StartDate:'',
			EndDate:'',
			Sort:$s.chkSortOrder
		};
		
		var param = callApiObject('approval', 'approvalList', reqApprovalListData);
		$http(param).success(function(data) {
			var approvalList = JSON.parse(data.value);
			$rs.approvalList = approvalList.Approvals;
		});
	}
	
	$s.btnSortApproval = function(e, value){
		$s.approvalListPage = 1;
		$s.chkSortOrder = value;
		
		var reqApprovalListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:20,
			PageNumber:$s.approvalListPage,
			FolderID:$rs.currSubMenu,
			SearchType1:'',
			SearchValue1:'',
			SearchType2:'',
			SearchValue2:'',
			DraftDeptSearch:'',
			Sort:$s.chkSortOrder
		};
		
		reqApprovalListData.StartDate = $s.txtSearchStart != undefined ? $s.txtSearchStart : '';
		reqApprovalListData.EndDate = $s.txtSearchEnd != undefined ? $s.txtSearchEnd : '';
		
		var param = callApiObject('approval', 'approvalList', reqApprovalListData);
		$http(param).success(function(data) {
			var approvalList = JSON.parse(data.value);
			$rs.approvalList = approvalList.Approvals;
		});
	}
	
	//제목/본문 선택박스 적용
	$s.applySearchType1 = function(value) {
		$s.SearchType1 = value;
	}
	
	$s.applySearchType2 = function(value) {
		$s.SearchType2 = value;
	}
	
	$s.SearchType1Options = [
		{'name':'TITLE','value':'제목'},
		{'name':'BODY','value':'내용'}
	];
	$s.SearchType2Options = [
		{'name':'DRAFT','value':'기안자'},
		{'name':'REVIEW','value':'결재/합의자'},
		{'name':'CONTROL','value':'통제'},
		{'name':'ACCEPT','value':'담당'},
		{'name':'APPROVAL','value':'승인자'}
	];
	
	$s.chooseSearchDate = function(type){
		if($rs.agent == 'android') {
			androidWebView.callDatePickerDialog(type);	
		} 
	}
	
	//android bridge result
	window.setSearchDate = function(type, value) {
		$s.$apply(function() {
			if(type === 'start') {
				$s.txtSearchStart = value;
			} else if(type === 'end') {
				$s.txtSearchEnd = value;
			}
		});
	}

	
	$s.SearchType1 = $s.SearchType1Options[0].name;
	$s.SearchType2 = $s.SearchType2Options[0].name;
	
	//검색
	$s.btnSearchApproval = function(type) {
		$s.approvalListPage = 1;
		
		var reqApprovalListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:20,
			PageNumber:$s.approvalListPage,
			FolderID:$rs.currSubMenu,
			Sort:$s.chkSortOrder
		};
		
		reqApprovalListData.StartDate = $s.txtSearchStart != undefined ? $s.txtSearchStart : '';
		reqApprovalListData.EndDate = $s.txtSearchEnd != undefined ? $s.txtSearchEnd : '';
		
		if(type === 'type') {
			reqApprovalListData.SearchType1 = $s.SearchType1;
			reqApprovalListData.SearchValue1 = $s.SearchValue1 != undefined ? $s.SearchValue1 : '';
			reqApprovalListData.SearchType2 = $s.SearchType2;
			reqApprovalListData.SearchValue2 = $s.SearchValue2 != undefined ? $s.SearchValue2 : '';
		} else if(type === 'all') {
			reqApprovalListData.DraftDeptSearch = $s.DraftDeptSearch;
		}
		
		var param = callApiObject('approval', 'approvalList', reqApprovalListData);
		$http(param).success(function(data) {
			var approvalList = JSON.parse(data.value);
			$rs.approvalList = approvalList.Approvals;
			//console.log($rs.approvalList);
			
			var contents = angular.element('.viewContents');
			contents.animate({scrollTop : 0}, 200);
		});
		
		$rs.isApprovalSearchDDShow = false;
	}
	
	//정렬 열렸는지 확인 
	$s.chkSortVisible = function(e){
		var target = angular.element(e.target);
//		//console.log(target);
		
		if(target.hasClass('ic_sort') || target.hasClass('approval_sort')) {
			$s.isApprovalSortDDShow = true;
		} else {
			$s.isApprovalSortDDShow = false;
		}
	}
	
	//다음페이지 읽기
	$s.readApprovalNextPage = function(){
//		//console.log($rs.currSubMenu);
		$s.approvalListPage++;
		
		var reqApprovalListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:20,
			PageNumber:$s.approvalListPage,
			FolderID:$rs.currSubMenu,
			Sort:$s.chkSortOrder
		};
		
		reqApprovalListData.StartDate = $s.txtSearchStart != undefined ? $s.txtSearchStart : '';
		reqApprovalListData.EndDate = $s.txtSearchEnd != undefined ? $s.txtSearchEnd : '';
		
		if($s.SearchValue1 != undefined) {
			reqApprovalListData.SearchType1 = $s.SearchType1;
			reqApprovalListData.SearchValue1 = $s.SearchValue1;
		}
		
		if($s.SearchValue2 != undefined) {
			reqApprovalListData.SearchType2 = $s.SearchType2;
			reqApprovalListData.SearchValue2 = $s.SearchValue2;
		}
		
		if($s.DraftDeptSearch != undefined) {
			reqDraftDeptSearch = $s.DraftDeptSearch;
		}
		
		var param = callApiObject('approval', 'approvalList', reqApprovalListData);
		$http(param).success(function(data) {
			var approvalList = JSON.parse(data.value);
			
			$timeout(function(){
				if(approvalList.Approvals.length > 0) {
					for(idx in approvalList.Approvals) {
						$rs.approvalList.push(approvalList.Approvals[idx]);
					}
//					//console.log($rs.approvalList);
				} else {
					$s.approvalListPage--;
				}
				$rs.dialog_progress = false;
			}, 500);
			
//			//console.log(approvalList.Approvals);
		});
	}
	
	//event receive after approval process in success
	$rs.$on('applyDeleteApprovalList', function(event, approval) {
		for(idx in $rs.approvalList) {
			var tmpApproval = $rs.approvalList[idx];
			
			//console.log(approval.ApprovalID + " / " + tmpApproval.ApprovalID);
			
			if(approval.ApprovalID === tmpApproval.ApprovalID) {
				$rs.$apply(function(){
					$rs.approvalList.splice(idx, 1);
				});
				break;
			}
		}
	});
}]).directive("approvalXpull", function() {
	return function(scope, elm, attr) {
	    return $(elm[0]).xpull({
	    	pullThreshold: 80,
	        maxPullThreshold: 80,
	        'onPullThreshold' : function(){
	        	angular.element('.pull-indicator.approval').show();
	        },
	        'callback': function(e) {
	        	angular.element('.pull-indicator.approval').hide();
	        	scope.$apply(attr.ngXpull);
	        	scope.$root.$broadcast('initApprovalList', scope.displayName);
	        	return;
	        }
	    });
	};
});

//approval view
appHanmaru.controller('approvalDetailController', ['$scope', '$http', '$rootScope', '$timeout', '$sce', function($s, $http, $rs, $timeout, $sce) {
	$s.processApprovalOpinion = '';
	
	$rs.$on('initApprovalDetail', function(event, approvalData, displayName) {
		$s.displayName = displayName;
		$s.approval = approvalData;
		$s.isApprovalDetailDDShow = false;
		$s.isApprovalProcessDDShow = false;
		$s.isApprovalStatusDDShow = false;
		$s.isApprovalAttachDDShow = false;
		$s.processApprovalData = {};
		$s.processApprovalOpinion = '';

		$http.get(approvalData.BodyUrl).success(function(data) {
			$s.approvalBody = data;
		});
		
		//console.log(approvalData);
		//console.log(approvalData.ProcessUrl);
		
		//결재 하이브리드 기술
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.loadProcessURL(approvalData.ProcessUrl);
				
				setTimeout(function(){
					androidWebView.parseProcessUrl(approvalData.ProcessUrl);
				}, 3000);
				
				//aos callback json object
				window.applyProcessUrl = function(processResultJsonStr) {
					//console.log(processResultJsonStr);
					$s.processApprovalData = JSON.parse(processResultJsonStr);
//					$s.processApprovalData = processResultJsonStr;
					$s.chkApprovalBtnStatus($s.processApprovalData);
					alert.log($s.processApprovalData);
				}
			}
			
		} else if($rs.agent=='ios') { 
			webkit.messageHandlers.loadComponent.postMessage(approvalData.ProcessUrl);
			
			//ios callback json object
			callbackComponent = function (callbackData) {
				$s.processApprovalData = JSON.parse(callbackData);
				$s.chkApprovalBtnStatus($s.processApprovalData);
			}
		}
		
		$s.chkApprovalBtnStatus = function() {
			var arrApprovalStatus = new Map();
			
			for(idx in $s.processApprovalData) {
				var data = $s.processApprovalData[idx];
				
				if(idx == 'iframe') {
					continue;
				} else {
					if(!arrApprovalStatus.containsKey(data)) {
						arrApprovalStatus.put(data, 1);
					} else {
						var tmpVal = arrApprovalStatus.get(data);
						arrApprovalStatus.put(data, ++tmpVal);
					}
				}
			}

			var btnLength = Object.keys($s.processApprovalData).length-1;
			if(arrApprovalStatus.get('0') == btnLength || (JSON.stringify($s.processApprovalData) === JSON.stringify({}))) {
				if($s.displayName == undefined || $s.displayName == '') {
					$s.displayName = '온라인 문서고';	
				}
			} else {
				//온라인 문서고 시 
				if($rs.currSubMenu === 'ARRIVE') {
					angular.element('.btnApproval').removeClass("hide");
					angular.element('.approvalState').removeClass("full");
				}
			}
		};
		
		$s.chkApprovalBtnStatus($s.processApprovalData);
		

		//승인,반려 등 버튼 이벤트
		$s.btnProcessApproval = function(cmd) {
			if(cmd === 'Reject') {
				if($s.processApprovalOpinion == '') {
					alert("의견을 입력하여 주세요");
					return;
				}
			}
			
			var chkConfirm = confirm("결재 처리를 진행 하시겠습니까?");
			if(chkConfirm) {
				doApproval(cmd, $s.processApprovalOpinion);
			}
		}
		
		
		setTimeout(function(){
			var tmpContents = angular.element("#tmpApprovalBodyContents").clone();
			tmpContents.attr('id', 'approvalBodyContents');
			angular.element(".wrapBodyContents").find('*').remove();
			angular.element(".wrapBodyContents").append(tmpContents);
			tmpContents.pinchzoomer();
			
			//결재 본문 높이 조절
			setTimeout(function(){
				var elem = angular.element(".wrapBodyContents");
				var elemFirstDiv = elem.find('div').eq(0);
				var elemSecondDiv = elemFirstDiv.find('div').eq(0);
				var elemThirdDiv = elemSecondDiv.find('div').eq(0);
				var elemDivImg = elemThirdDiv.find('img').eq(0);
				
				elemFirstDiv.css({'user-select':'','-webkit-user-drag':'','touch-action':''});
				elemThirdDiv.css({'overflow':'','user-select':'','-webkit-user-drag':'','touch-action':''});
				elemDivImg.css({'user-select':'','-webkit-user-drag':'','touch-action':''});
				
				var viewContentsTitle = angular.element('.viewContentsTitle');
				var titleWrap = angular.element('.titleWrap');
				var viewContentsDetail = angular.element('.viewContentsDetail');
				viewContentsDetail.height(viewContentsTitle.height() - titleWrap.innerHeight());
			}, 500);
			
//			angular.element("#approvalBodyContents").pinchzoomer();
		}, 1000);
	});
	
	$s.toggleApprovalDetailDD = function(e){
		$s.isApprovalDetailDDShow = !$s.isApprovalDetailDDShow;
	};
	
	$s.toggleApprovalProcessDD = function(e){
		$s.hasProcessApprovalData = !(JSON.stringify($s.processApprovalData) === JSON.stringify({}));
		if(!$s.hasProcessApprovalData) {
			alert("결재 정보를 불러오는 중입니다.");
			return;
		}
		
		$s.isApprovalProcessDDShow = !$s.isApprovalProcessDDShow;
		$s.isApprovalStatusDDShow = false;
		$s.isApprovalAttachDDShow = false;
		//$s.processApprovalOpinion = '';
	};
	
	$s.toggleApprovalStatusDD = function(e){
		$s.isApprovalProcessDDShow = false;
		$s.isApprovalStatusDDShow = !$s.isApprovalStatusDDShow;
		$s.isApprovalAttachDDShow = false;
	};
	
	$s.toggleApprovalAttachDD = function(e){
		$s.isApprovalProcessDDShow = false;
		$s.isApprovalStatusDDShow = false;
		$s.isApprovalAttachDDShow = !$s.isApprovalAttachDDShow;
	};
	
	$s.getFileSizeUnit = function(value){
		return getFileSizeUnit(value);
	}
	
	$s.popPage = function(pageName){
		$s.approval = undefined;
//		$s.displayName = undefined;
		$s.processApprovalData = {};
		
		angular.element(".wrapBodyContents").find('*').remove();
		popPage(pageName);
	}
	
	$s.btnDownloadAttachFile = function(fileURL, fileName) {
		//여기에 하이브리드 기능 기술
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.downloadAttachFile(fileURL, fileName);
			}
		} else if($rs.agent == 'ios') {
			webkit.messageHandlers.iosDownloadAttachFile.postMessage({fileURL:fileURL,fileName:fileName});
		}
	}
	
	//결재 처리부분
	function doApproval(action, opinion) {
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.processApproval(action, opinion);
			}
		} else if($rs.agent=='ios') {
			   webkit.messageHandlers.iosProcessApproval.postMessage({action:action,opinion:opinion});
		}
	}
	
	//결재 처리 후 완료 부분
	window.successAllApproval = function() {
		afterApprovalSuccess();
	}

	iosSuccesApproval = function() {
		afterApprovalSuccess();
	 }
	
	function afterApprovalSuccess() {
		alert("결재 처리가 완료 되었습니다.");
	   var currPage = angular.element('[class^="panel"][class*="current"]');
	   var pageName = currPage.eq(currPage.length-1).attr('id');
	   popPage(pageName);
	   
	   $rs.$broadcast('applyDeleteApprovalList', $s.approval);
	}
	
	//결재 focused, 결재 입력에 용이하게 하단부 스크롤 
	angular.element('.processApprovalOpinion').focus(function(){
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.scrollEnterApprovalEdit();
			}
		} else if($rs.agent=='ios') {
			//필요시 기입
		}
	}).blur(function(){
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.scrollExitApprovalEdit();
			}
		} else if($rs.agent=='ios') {
			//필요시 기입
		}
	});
}]);

appHanmaru.controller('organController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout) {
	$s.org_user_list;
	$s.tab_index = 2;
	$s.search_org_user_list = new Array();
	$s.search_org_addr_list = new Array();
	$s.orgSearchKeyword;
	$s.selectedOrganUser;
	$s.isProfileImgEnlarge = true;
	
	$rs.$on('initInsaList', function(event) {
		$s.tab_index = 2;
		$rs.topDeptCode = $rs.subMenuList.Depts[0];
		searchDept($rs.topDeptCode, 0, $rs.subMenuList.Depts.length);
		var currUserDepts = $rs.subMenuList;
		
		recursiveOrganTree(currUserDepts, currUserDepts.Depts.length, 0);
	});
	
	$rs.findChildDept = function(dept, depth) {
		var maxDepth = parseInt(dept.DeptLevel, 10);
		searchDept(dept, depth, maxDepth);
	}
	
	$s.selectOrgTab = function(index) {
		$s.tab_index = index;
	};
	
	$s.btnDetectSearch = function(e) {
		var keyCode = e.keyCode;
		if(keyCode == 13) {
			$s.btnSearchOrgUserList();
		}
	};
	
	$s.btnSearchOrgUserList = function(e) {
		if($s.orgSearchKeyword != '' && $s.orgSearchKeyword != undefined) {
			setTimeout(function(){
				$s.tab_index = 1;
			}, 500);
			
			var reqInsaListData = {
				LoginKey:$rs.userInfo.LoginKey,
				Search:$s.orgSearchKeyword
			};
			
			var param = callApiObject('insa', 'insaFind', reqInsaListData);
			$http(param).success(function(data) {
				var result = JSON.parse(data.value);
				
				setTimeout(function(){
					$s.$apply(function(){
						$s.search_org_user_list = result.Users;
					});
//					//console.log($s.search_org_user_list);
//					angular.element('.search_user_list').eq().hide();
				}, 500);
				
				angular.element('#organizationSearchKeyword').blur();
			});
		}
	};
	
	$s.determineProfileImg = function(user) {
		var rtnUrl = '';
//		//console.log(user.MyPhotoUrl);
		
		if(user.MyPhotoUrl.indexOf('//https') != -1) {
			rtnUrl = 'https://' + user.MyPhotoUrl.substring(user.MyPhotoUrl.indexOf('//https')+10, user.MyPhotoUrl.length);
			try {
				$http.get(rtnUrl).error(function(data){
					//console.log(data);
					user.MyPhotoUrl = '/resources/image/organization/org_user.png';
				});
			} catch(e) {
				user.MyPhotoUrl = '/resources/image/organization/org_user.png';
			}
		} else if(user.MyPhotoUrl.indexOf('http://') != -1) {
			rtnUrl = user.MyPhotoUrl.replace('http', 'https');
			user.MyPhotoUrl = rtnUrl;
		}
	}
	
	$s.selectOrganUser = function(user) {
		var reqInsaUserData = {
			LoginKey:$rs.userInfo.LoginKey,
			UserKey:user.UserKey,
			CompanyCode:user.CompCode,
			EmailAddress:user.EmailAddress
		};
		
		var param = callApiObject('insa', 'insaUserDetail', reqInsaUserData);
		$http(param).success(function(data) {
			var result = JSON.parse(data.value);
//			//console.log(result);
			$s.selectedOrganUser = result;
			$s.determineProfileImg($s.selectedOrganUser);
		});
	}
	
	$s.closeOrganUserDialog = function(){
		$s.selectedOrganUser = undefined;
		$s.isProfileImgEnlarge = true;
	}
	
	$s.toggleProfileEnlarge = function() {
		$s.isProfileImgEnlarge = !$s.isProfileImgEnlarge;
	}
	
	//전화걸기
	$s.doExecCallPhone = function(num) {
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.callDial(num);
			} 
		} else if($rs.agent=='ios') {
			
		}
	}
	
	//SMS
	$s.doExecSMSPhone = function(num) {
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.callSMSSend(num);
			} 
		} else if($rs.agent=='ios') {
			
		}
	}
	
	//이메일
	$s.doExecEmail = function(user) {
		var arr = new Array();
		arr.push(user);
		
		$rs.$broadcast("mailApplySelectedUser", arr, new Array(), new Array());
		pushOnePage('pg_mail_write');
		
		$s.closeOrganUserDialog();
	}
	
	//현재 로그인한 아이디가 속한 부서와 사용자 찾기
	function recursiveOrganTree(dept, maxDepth, currDepth) {
		if(currDepth < maxDepth) {
			searchDept(dept.Depts[currDepth], currDepth, maxDepth);
			recursiveOrganTree(dept, maxDepth, ++currDepth);
		} else {
			var code = dept.Users[0].DeptCode;
			switch(currDepth - 1) {
				case 0 : break;
				case 1 : $rs.selected_firstDepth_code = code; break;
				case 2 : $rs.selected_secondDepth_code = code; break;
				case 3 : $rs.selected_thirdDepth_code = code; break;
				case 4 : $rs.selected_fourthDepth_code = code; break;
			}
			setTimeout(function(){
				searchDept(dept.Depts[currDepth-1], currDepth, maxDepth);
			}, 1000);
		}
	}
	
	//조직도 수동으로 눌러서 찾기
	function searchDept(deptCode, depth, maxDepth) {
		var reqInsaListData = {
			LoginKey:$rs.userInfo.LoginKey,
			DeptCode:deptCode.DeptCode,
			FindType:0
		};
		
		var param = callApiObject('insa', 'insaDeptChild', reqInsaListData);
		$http(param).success(function(data) {
			var result = JSON.parse(data.value);
			var dept = result.Depts;
//			//console.log(dept);
			
			if(depth == maxDepth) {
				setTimeout(function(){
					$s.$apply(function(){
						$s.org_user_list = result.Users;
					})
				}, 200);
			}
			
			switch(depth) {
				case 0 :
					$rs.first_depth_list = dept;
					break;
				case 1 :
					$rs.second_depth_list = dept;
					$rs.selected_firstDepth_code = deptCode.DeptCode;
//					//console.log($rs.selected_firstDepth_code);
					break;
				case 2 :
					$rs.third_depth_list = dept;
					$rs.selected_secondDepth_code = deptCode.DeptCode;
//					//console.log($rs.selected_secondDepth_code);
					break;
				case 3 :
					$rs.fourth_depth_list = dept;
					$rs.selected_thirdDepth_code = deptCode.DeptCode;
//					//console.log($rs.selected_thirdDepth_code);
					break;
				case 4 :
					$rs.fifth_depth_list = dept;
					$rs.selected_fourthDepth_code = deptCode.DeptCode;
//					//console.log($rs.selected_fourthDepth_code);
					break;
				case 5 :
					$rs.sixth_depth_list = dept;
					break;
			} 
		});
	}
}]);

appHanmaru.controller('organAltController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout) {
	$s.org_alt_user_list;
	$s.tab_index = 2;
	$s.search_org_user_list;
	$s.orgSearchKeyword;
	$s.selectedOrganUser;
	$s.isProfileImgEnlarge = true;
	
	$rs.$on('initInsaAltList', function(event) {
		/*
		var reqInsaListData = {
			LoginKey:$rs.userInfo.LoginKey,
			DeptCode:$rs.userInfo.DeptCode,
			FindType:0
		};
		var param = callApiObject('insa', 'insaDeptChild', reqInsaListData);
		$http(param).success(function(data) {
			var result = JSON.parse(data.value);
			var dept = result.Depts;
			
			setTimeout(function(){
				$s.$apply(function(){
					$s.org_alt_user_list = result.Users;
				});
				//console.log($s.org_alt_user_list);
			}, 1000);
		});
		*/
		$s.tab_index = 2;
		$s.orgSearchKeyword = '';
		$s.search_org_user_list = undefined;
		
		var reqInsaListData = {
			LoginKey:$rs.userInfo.LoginKey
		};
		
		var param = callApiObject('insa', 'insaBoxs', reqInsaListData);
		$http(param).success(function(data) {
			var result = JSON.parse(data.value);
			$s.topDeptCode = result.Depts[0];
			//console.log(result);
			
			searchDept(result.Depts[0], 0);
			recursiveOrganTree(result, 0, result.Depts.length);
			$s.selected_deptCode = $rs.userInfo.DeptCode; 
		});
	});
	
	$s.findChildDept = function(dept, depth) {
		$s.selected_deptCode = dept.DeptCode;
		searchDept(dept, depth);
	}
	
	$s.selectOrgTab = function(index) {
		$s.tab_index = index;
	};
	
	$s.btnDetectSearch = function(e) {
		var keyCode = e.keyCode;
		if(keyCode == 13) {
			$s.btnSearchOrgUserList();
		}
	};
	
	$s.btnSearchOrgUserList = function(e) {
		if($s.orgSearchKeyword != '' && $s.orgSearchKeyword != undefined) {
			setTimeout(function(){
				$s.tab_index = 1;
			}, 500);
			var reqInsaListData = {
					LoginKey:$rs.userInfo.LoginKey,
					Search:$s.orgSearchKeyword
			};
			
			var param = callApiObject('insa', 'insaFind', reqInsaListData);
			$http(param).success(function(data) {
				var result = JSON.parse(data.value);
				
				setTimeout(function(){
					$s.$apply(function(){
						$s.search_org_user_list = result.Users;
					});
					
					//console.log($s.search_org_user_list);
				}, 500);
			});
		}
	};
	
	$s.determineProfileImg = function(user) {
		var rtnUrl = '';
		
		if(user.MyPhotoUrl.indexOf('//https') != -1) {
			rtnUrl = 'https://' + user.MyPhotoUrl.substring(user.MyPhotoUrl.indexOf('//https')+10, user.MyPhotoUrl.length);
			try {
				$http.get(rtnUrl).error(function(data){
					//console.log(data);
					user.MyPhotoUrl = '/resources/image/organization/org_user.png';
				});
			} catch(e) {
				user.MyPhotoUrl = '/resources/image/organization/org_user.png';
			}
		} else if(user.MyPhotoUrl.indexOf('http://') != -1) {
			rtnUrl = user.MyPhotoUrl.replace('http', 'https');
			user.MyPhotoUrl = rtnUrl;
		}
	}
	
	$s.selectOrganUser = function(user) {
		var reqInsaUserData = {
			LoginKey:$rs.userInfo.LoginKey,
			UserKey:user.UserKey,
			CompanyCode:user.CompCode,
			EmailAddress:user.EmailAddress
		};
		
		var param = callApiObject('insa', 'insaUserDetail', reqInsaUserData);
		$http(param).success(function(data) {
			var result = JSON.parse(data.value);
			//console.log(result);
			$s.selectedOrganUser = result;
			$s.determineProfileImg($s.selectedOrganUser);
		});
	}
	
	$s.closeOrganUserDialog = function(){
		$s.selectedOrganUser = undefined;
		$s.isProfileImgEnlarge = true;
	}
	
	$s.toggleProfileEnlarge = function() {
		$s.isProfileImgEnlarge = !$s.isProfileImgEnlarge;
	}
	
	//전화걸기
	$s.doExecCallPhone = function(num) {
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.callDial(num);
			} 
		} else if($rs.agent=='ios') {
			
		}
	}
	
	//SMS
	$s.doExecSMSPhone = function(num) {
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.callSMSSend(num);
			} 
		} else if($rs.agent=='ios') {
			
		}
	}
	
	//이메일
	$s.doExecEmail = function(email) {
		$s.arr_selected_rcv.push(email);
		
		$rs.$broadcast("mailApplySelectedUser", $s.arr_selected_rcv, new Array(), new Array());
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id');
		popPage(pageName);
		
		$s.closeOrganUserDialog();
	}
	
	//현재 로그인한 아이디가 속한 부서와 사용자 찾기
	function recursiveOrganTree(dept, currDepth, maxDepth) {
		if(currDepth < maxDepth) {
			searchDept(dept.Depts[currDepth], currDepth);
			recursiveOrganTree(dept, ++currDepth, maxDepth);
		} else {
			var code = dept.Users[0].DeptCode;
			switch(currDepth - 1) {
				case 0 : break;
				case 1 : $rs.selected_firstDepth_code = code; break;
				case 2 : $rs.selected_secondDepth_code = code; break;
				case 3 : $rs.selected_thirdDepth_code = code; break;
				case 4 : $rs.selected_fourthDepth_code = code; break;
			}
			setTimeout(function(){
				searchDept(dept.Depts[currDepth-1], currDepth, maxDepth);
			}, 1000);
		}
	}
	
	//조직도 수동으로 눌러서 찾기
	function searchDept(deptCode, currDepth) {
		var reqInsaListData = {
			LoginKey:$rs.userInfo.LoginKey,
			DeptCode:deptCode.DeptCode,
			FindType:0
		};
		
		var param = callApiObject('insa', 'insaDeptChild', reqInsaListData);
		$http(param).success(function(data) {
			var result = JSON.parse(data.value);
			var dept = result.Depts;
			
			if(dept.length > 0) {
				switch(currDepth) {
					case 0 :
						$s.first_depth_list = dept;
//						$s.org_first_alt_user_list = result.Users;
						break;
					case 1 :
						$s.second_depth_list = dept;
						$s.selected_firstDepth_code = deptCode.DeptCode;
	//					//console.log($s.selected_firstDepth_code);
						break;
					case 2 :
						$s.third_depth_list = dept;
						$s.selected_secondDepth_code = deptCode.DeptCode;
	//					//console.log($s.selected_secondDepth_code);
						break;
					case 3 :
						$s.fourth_depth_list = dept;
						$s.selected_thirdDepth_code = deptCode.DeptCode;
	//					//console.log($s.selected_thirdDepth_code);
						break;
					case 4 :
						$s.fifth_depth_list = dept;
						$s.selected_fourthDepth_code = deptCode.DeptCode;
	//					//console.log($s.selected_fourthDepth_code);
						break;
					case 5 :
						$s.sixth_depth_list = dept;
						break;
				}
				
				$s.org_alt_user_list = result.Users;
			} else {
				$s.org_alt_user_list = result.Users;
			}
			
			//console.log($s.org_alt_user_list);
		});
	}

	$s.isUserDeptSelected = false;
	$s.userDeptSelectType = '';
	$s.rcv_count = 0;
	$s.cc_count = 0;
	$s.bcc_count = 0;
	$s.arr_selected_rcv = new Array();
	$s.arr_selected_cc = new Array();
	$s.arr_selected_bcc = new Array();
	$s.arr_selected_userDept = new Array();
	
	$s.userDeptChecked = function(obj) {
		return $s.arr_selected_userDept.indexOf(obj) != -1 ? true : false;
	}
	
	$s.toggleUserDeptChecked = function(type, obj){
		if(type === 'dept') {
			var addr = obj.Address;
			if($s.arr_selected_userDept.indexOf(obj) != -1) {
				$s.arr_selected_userDept.splice($s.arr_selected_userDept.indexOf(obj), 1);
			} else {
				$s.arr_selected_userDept.push(obj);
			}
		} else if(type === 'user'){
			var addr = obj.EmailAddress;
			if($s.arr_selected_userDept.indexOf(obj) != -1) {
				$s.arr_selected_userDept.splice($s.arr_selected_userDept.indexOf(obj), 1);
			} else {
				$s.arr_selected_userDept.push(obj);
			}
		}
	}
	
	$s.btnAddRcvUserList = function(e) {
		if($s.arr_selected_userDept.length == 0) {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = '받는 사람';
			$s.userDeptSelectType = 'rcv';
		} else {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = '받는 사람';
			$s.userDeptSelectType = 'rcv';
			
			for(idx in $s.arr_selected_userDept) {
				var userDept = $s.arr_selected_userDept[idx];
				
				if($s.arr_selected_rcv.indexOf(userDept) == -1) {
					$s.arr_selected_rcv.push(userDept);
				} else {
					continue;
				}
			}
			
			$s.rcv_count = $s.arr_selected_rcv.length;
			$s.arr_selected_userDept.splice(0, $s.arr_selected_userDept.length);
		}
	}
	
	$s.btnAddCCUserList = function(e) {
		if($s.arr_selected_userDept.length == 0) {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = '참조';
			$s.userDeptSelectType = 'cc';
		} else {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = '참조';
			$s.userDeptSelectType = 'cc';
			
			for(idx in $s.arr_selected_userDept) {
				var userDept = $s.arr_selected_userDept[idx];

				//console.log(userDept);
				
				if($s.arr_selected_cc.indexOf(userDept) == -1) {
					$s.arr_selected_cc.push(userDept);
				} else {
					continue;
				}
			}
			
			$s.cc_count = $s.arr_selected_cc.length;
			$s.arr_selected_userDept.splice(0, $s.arr_selected_userDept.length);
		}
	}
	
	$s.btnAddBCCUserList = function(e) {
		if($s.arr_selected_userDept.length == 0) {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = '숨은 참조';
			$s.userDeptSelectType = 'bcc';
		} else {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = '숨은 참조';
			$s.userDeptSelectType = 'bcc';
			

			for(idx in $s.arr_selected_userDept) {
				var userDept = $s.arr_selected_userDept[idx];

				//console.log(userDept);
				
				if($s.arr_selected_bcc.indexOf(userDept) == -1) {
					$s.arr_selected_bcc.push(userDept);
				} else {
					continue;
				}
			}
			
			$s.bcc_count = $s.arr_selected_bcc.length;
			$s.arr_selected_userDept.splice(0, $s.arr_selected_userDept.length);
		}
	}
	
	$s.btnCloseSelectedDialog = function(e) {
		$s.isUserDeptSelected = false;
	}
	
	$s.btnRemoveRCV = function(index) {
		$s.arr_selected_rcv.splice(index, 1);
		$s.rcv_count = $s.arr_selected_rcv.length;
	}
	
	$s.btnRemoveCC = function(index) {
		$s.arr_selected_cc.splice(index, 1);
		$s.cc_count = $s.arr_selected_cc.length;
	}
	
	$s.btnRemoveBCC = function(index) {
		$s.arr_selected_bcc.splice(index, 1);
		$s.bcc_count = $s.arr_selected_bcc.length;
	}
	
	$s.btnApplySelectedUser = function(e){
		$rs.$broadcast("mailApplySelectedUser", $s.arr_selected_rcv, $s.arr_selected_cc, $s.arr_selected_bcc);
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id');
		popPage(pageName);
		
		$s.rcv_count = 0;
		$s.cc_count = 0;
		$s.bcc_count = 0;
		$s.arr_selected_rcv.splice(0, $s.arr_selected_rcv.length);
		$s.arr_selected_cc.splice(0, $s.arr_selected_cc.length);
		$s.arr_selected_bcc.splice(0, $s.arr_selected_bcc.length);
		$s.arr_selected_userDept.splice(0, $s.arr_selected_userDept.length);
	}
	
	$s.popPage = function(){
		$rs.$broadcast("mailApplySelectedUser", $s.arr_selected_rcv, $s.arr_selected_cc, $s.arr_selected_bcc);
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id');
		popPage('pg_insa_list_alt');
		
		$s.rcv_count = 0;
		$s.cc_count = 0;
		$s.bcc_count = 0;
	}
}]);


function callApiObject(apiType, apiName, data) {
	var param = {
		headers:{'Content-Type': 'application/json'},
		method:'POST',
		url:objApiURL[apiType][apiName].url,
		data:data
	};
	
//	//console.log(param);
	return param;
}

function callApiObjectNoData(apiType, apiName) {
	var param = {
		url:objApiURL[apiType][apiName].url
	};
	
//	//console.log(param);
	return param;
}

function pushOnePage(currPageName) {
	angular.element('#'+currPageName).addClass('current');
};

function pushPage(prevPageName, currPageName) {
	angular.element('#'+prevPageName).removeClass('current');
	angular.element('#'+currPageName).addClass('current');
	
//	setTimeout(function(){
//		angular.element('#'+prevPageName).removeClass('current');
//	}, 500);
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