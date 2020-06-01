//$scope ==> $s
//$rootScope ==> $rs
var androidWebView = window.AndroidBridge;
var appHanmaru = angular.module('appHanmaru', ['ngSanitize', 'ngAnimate', 'ngRoute',])
.config(function($sceDelegateProvider, $compileProvider) {
	$sceDelegateProvider.resourceUrlWhitelist(['self']);
	$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel|sms):/);
});
var globalTest;

//loginController
appHanmaru.controller('loginController', ['$scope', '$http', '$rootScope', function($s, $http, $rs) {
	$rs.agent = getOS();
	$rs.apiURL = '';
	$s.isAutoLogin = false;
	$rs.deviceID = '';
			
	//최초 로딩(editor load)
	$rs.dialog_progress = true;
	setTimeout(function(){
		$rs.$apply(function(){
			$rs.dialog_progress = false;
		});
	}, 3000);
	
	$rs.apiURL = "https://ep.hd-bsnc.com";
//	$rs.apiURL = "http://ep.halla.com";
	
	
	objApiURL.setApiDomain($rs.apiURL);
	objApiURL.initApiDomain();
	
	$s.general_id = 'jina';
	$s.general_pw = 'qw123321';
	$s.generalLogin_domain = 'hd-bsnc.com';//halla.com
	$s.simpleLogin_domain = 'hd-bsnc.com';//halla.com
	
	//ios
	deviceInfo = function (deviceId, model, brand, version){
		$rs.deviceID = deviceId;
		$s.phoneModel = model;
		$s.phoneBrand = brand;
		$s.appVersion = version;
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
		$rs.deviceID = deviceId;
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
	
	//General Login
	$s.performGeneralLogin = function() {
		if($s.general_id === '') {
			$rs.result_message = '아이디를 입력해주세요';
			$rs.dialog_toast = true;
			$rs.dialog_progress = false;
			loginFailResult();
			return false;
		}
		$rs.dialog_progress = true;
		
		//version check
		AccessUser();
//		versionCheck();
	}
	
	//버전체크
	function versionCheck(){
		var param = callApiObject('login', 'versionCheck', {OS : $rs.agent});
		$http(param).success(function(data) {
			var resData = JSON.parse(data.value);
			if(resData.Version == $s.appVersion){ //최신버전
				AccessUser();
			}else{
				$rs.dialog_progress = false;
				alert('새로운 버전이 존재합니다. 다운로드 페이지로 이동합니다');
				if($rs.agent == 'android'){
					window.open(resData.Url,'_blank');
				}else if($rs.agent=='ios') {
					webkit.messageHandlers.sendDownloadUrl.postMessage(resData.Url);
				}
			} 
		});
	}
	
	function AccessUser(){
		//언어설정.
		$rs.translateLanguage = function(htmlID) {
			var localLang = sessionStorage.getItem("language");
			var langType = localLang == undefined || localLang === null ? "KOR" : $rs.userInfo.Lang;
			var str = language[langType][htmlID];
			return str;
		};
		
		var loginData = {
			userID:$s.general_id,
			DeviceID:$rs.deviceID,
			PhoneModel:$s.phoneModel,
			PhoneBrand:$s.phoneBrand,
			Password:$s.general_pw,
			AppVersion:$s.appVersion,
			AppType:$s.generalLogin_domain
		};
		var param = callApiObject('login', 'generalLogin', loginData);
		$http(param).success(function(data) {
			var code = parseInt(data.Code, 10);
			if(code == 1){
				$rs.userInfo = JSON.parse(data.value);
				
				//셋팅 초기화면 설정 작업할것.
				if($rs.userInfo.MainView === 'Mail'){
					
				}else{
					//각 초기화면 셋팅해줄것.
				};
				$rs.$broadcast('initMailBox');
				$s.general_id = '';
				$s.general_pw = '';
			}else{
				$rs.result_message = '로그인에 실패하였습니다';
				$rs.dialog_toast = true;
				$rs.dialog_progress = false;
			}
		}).then(function(){
			if(androidWebView != undefined) {
				androidWebView.focusToWebView();
			}
			loginFailResult();
		});
	}
	
	function loginFailResult(){
		setTimeout(function(){
			$rs.dialog_toast = false;
			$rs.$apply();
		},1000);
	}
	
	//LOGIN FOCUS
	$s.doFocusLayout = function(){
		setTimeout(function(){
			if($rs.agent=='android') {
//				angular.element('.wrap_login_area').addClass('focused');
				if(androidWebView != undefined) {
					androidWebView.scrollToLoginScreen();
				}
			}
			
		}, 200);
	};
	
	$s.doBlurLayout = function(){
		setTimeout(function(){
			if($rs.agent=='android') {
//				angular.element('.wrap_login_area').removeClass('focused');
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
	$rs.pushPage = function(prevPageName, currPageName) {
		pushPage(prevPageName, currPageName)
	};
	
	//메뉴이동간 로딩처리
	$rs.loading = function(){
		$rs.dialog_progress = true;
		setTimeout(function(){
			$rs.dialog_progress = false;
		},500);
	}
	
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
		var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
		var capitalMenuName = toFirstCapitalLetter(menuName);
		$rs.refreshMenuName = menuName;
		//2019.01.02 추가 - 자원예약은 메뉴이름을 api로 받아오지 않음.
		$rs.reservSubMenuName = [{MenuKey : 'myReserv',MenuName : '나의 예약 현황'},{MenuKey : 'booking',MenuName : '예약하기'}];
		pushPage(pageName, 'pg_' + menuName + '_list');
		$rs.subMenuType = menuName;
		
		$rs.$broadcast('initSearchValue');//검색조건 초기화
		if(menuName != 'insa'){
			$rs.slideMenuShow = false;
			$rs.currMenuSlide = false;
		}
		var loginData = {
			LoginKey:$rs.userInfo.LoginKey
		};
		//todo 실제 날짜 function 호출하도록 바꿀것.
		if(menuName === 'work'){
			loginData.StartDate = '2018-10-31';
			loginData.EndDate = '2018-11-30';
		}
		if(menuName === 'board'){
			loginData.CompanyCode = $rs.userInfo.CompCode;
		}
//		if(menuName === 'reserv'){
//			$rs.subMenuType = 'reserv';
//			$rs.subMenuList = $rs.reservSubMenuName;
//			$rs.currSubMenu = $rs.reservSubMenuName[0].MenuKey; 
//			$rs.$broadcast('initReservList');
//		}
//		else{
			var param = callApiObject(menuName, menuName+'Boxs', loginData);
			$http(param).success(function(data) {
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
				} else if (menuName === 'mail'){
					$rs.currSubMenu = boxList[0].FolderId;
					initMailTree(boxList);
					$rs.$broadcast('init'+capitalMenuName+'List', boxList[0].DisplayName);
					$rs.loading();
				}else if(menuName === 'insa'){
					$rs.$broadcast('init'+capitalMenuName+'List');
				}else if(menuName === 'work'){
					$rs.subMenuType = 'work';
					$rs.subMenuList = boxList.Menus;
					$rs.currSubMenu = boxList.Menus[0].MenuKey; 
					$rs.$broadcast('init'+capitalMenuName+'List',boxList.Menus[0].MenuName);
				}else if(menuName === 'main'){
					var param = callApiObject('board', 'boardBoxs', {LoginKey:$rs.userInfo.LoginKey,CompanyCode:''});
					$http(param).success(function(data) {
						var boardData = JSON.parse(data.value);
						$rs.subMenuType = 'main';
						$rs.subMenuList = boardData;
						
						$rs.$broadcast('init'+capitalMenuName+'List',boardData);
					});
				}else if(menuName === 'board'){
					$rs.subMenuType = 'board';
					$rs.$broadcast('initBoardList',boxList[0].BoardType,boxList[0].MasterID,boxList[0].Name);
					$rs.currSubMenu = boxList[0].MasterID;
				}
			});
//		}
	}
	
	//하부메뉴 리스트 클릭 -> 해당 메뉴 리스트업
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
		}else{
			$rs.currSubMenu = elem.FolderId;
			displayName = elem.DisplayName;
			$rs.$broadcast('init'+capitalMenuName+'List', displayName);
		}
	}
	$rs.btnSetting = function(){
		$rs.slideMenuShow = false;
		$rs.currMenuSlide = false;
		
		var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
		pushPage(pageName, 'pg_setting');
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
		$rs.subMenuList = rtnSubMenu;
	}
	
//	$s.btnDoLogout = function(){
//		var chkDoLogout = confirm("로그아웃 하시겠습니까?");
//		
//		if(chkDoLogout) {
//			$rs.userInfo = undefined;
//			$rs.slideMenuShow = false;
//			$rs.currMenuSlide = false;
//			
//			var currPage = angular.element('[class^="panel"][class*="current"]');
//			var pageName = currPage.eq(currPage.length-1).attr('id'); // 가장 위에 출력된 화면
//			pushPage(pageName, 'pg_login');
//		}
//	}
	
}]);
//mainController
appHanmaru.controller('mainListController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.headSubject = '';
	$s.headImage = '';
	$s.bannerImage = '';
	$s.hallaInList = new Array();
	$s.noticeList = new Array();
	$s.pressList = new Array();
	$s.mainData;
	$s.boardType = '';
	$s.masterID = '';
	$s.displayName = '';
	
	$rs.$on('initMainList',function(event,boardData){
		var param = callApiObject('main', 'mainBoxs', {LoginKey:$rs.userInfo.LoginKey});
		$http(param).success(function(data) {
			var mainData = JSON.parse(data.value);
			$s.mainData = mainData;
			$s.headSubject = mainData.Head.Subject;
			$s.headImage = mainData.Head.Image;
			$s.hallaInList = mainData.HallaIn;
			$s.noticeList = mainData.Notice;
			$s.pressList = mainData.Press;
			$s.bannerImage = mainData.Banner[0].Image;
		});
	});
	
	$s.btnMainPage = function(){
		$rs.loadMenu('main');
	}
	$s.btnWorkDiaryPage = function(){
		$rs.loadMenu('work');
	}
	$s.btnMailPage = function(){
		$rs.loadMenu('mail');
	}
	$s.btnApprovalPage = function(){
		$rs.loadMenu('approval');
	}
	$s.btnBoardPage = function(){
		$rs.loadMenu('board');
	}
	$s.btnOrganPage = function(){
		$rs.loadMenu('insa');
	}
	$s.btnResourcePage = function(){
		$rs.loadMenu('reserv');
	}
	
	$s.btnPartnerMore = function(){
		$s.boardType = $s.noticeList[0].BoardType;
		$s.masterID = $s.noticeList[0].MasterID;
		var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
		$s.displayName = '사우소식';
		pushPage(pageName, 'pg_board_list');
		$rs.$broadcast('initBoardList',$s.boardType,$s.masterID,$s.displayName);
	}
	$s.btnOrganMore = function(){
		$s.boardType = $s.pressList[0].BoardType;
		$s.masterID = $s.pressList[0].MasterID;
		$s.displayName = '인사발령';
		var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
		pushPage(pageName, 'pg_board_list');
		$rs.$broadcast('initBoardList',$s.boardType,$s.masterID,$s.displayName);
	}
}]);
//자원예약
appHanmaru.controller('ReservListController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout) {
	$s.reservList;
	$s.reservState;
	$s.searchText = '';
	$s.txtSearchStart = '2018-12-01';
	$s.txtSearchEnd = '2019-01-31';
	$s.searchType = 0;
	$s.reservSearchShow = false;
	
	$s.SearchTypeOptions = [
		{'name': '예약자','value': 0},
		{'name': '제목','value': 1},
		{'name': '본문','value': 2}
	];
	
	$rs.$on('initReservList', function(event) {
		$s.SearchType = $s.SearchTypeOptions[0].value;
		$rs.dialog_progress = true;

		var reqReservData = {
			LoginKey : 	$rs.userInfo.LoginKey,
			StartdateTime : $s.txtSearchStart,
			EnddateTime : $s.txtSearchEnd,
			SearchFiled : $s.searchFiled,
			SearchText : $s.searchText,
			PageSize : 20,
			PageNumber : 1	
		};
		
		var param = callApiObject('reserv','reservBoxs',reqReservData);
		$http(param).success(function(data){
			var code = parseInt(data.Code);
			if(code == 1) {
				var reservListData = JSON.parse(data.value);
				$s.reservList = reservListData;
			} 
			$rs.dialog_progress = false;
		});
	});
	
	$s.getReservState = function(reservItem){
		if(reservItem == 0){
			return '7px solid #BCBEC1';
		}else{
			return '7px solid #4E86FF';
		}
	}

	$s.reservCancel = function(seq){
//		var reqReservCancelData = {
//			LoginKey : 	$rs.userInfo.LoginKey,
//			Seq : seq,
//			State : -2	
//		};
//		var param = callApiObject('reserv','reservBoxs',reqReservCancelData);
//		$http(param).success(function(data){
//			//취소 후 flow 정리
//		});
	}
	
	$s.btnReservDetail = function(reservItem){
		$rs.pushOnePage('pg_reserv_view');
		$rs.$broadcast('initReservView',reservItem);
	}
	
	$s.reservSearch = function(event){
		$s.reservSearchShow = !$s.reservSearchShow;
	};
	
	$s.applySearchType = function(value){
		$s.searchType = value;
	};
	
	$s.searchReserv = function(event){
		$s.reservSearchShow = false;
		$rs.dialog_progress = true;
		//검색
		var reqReservData = {
			LoginKey : 	$rs.userInfo.LoginKey,
			StartdateTime : $s.txtSearchStart != undefined ? $s.txtSearchStart : '',
			EnddateTime : $s.txtSearchEnd != undefined ? $s.txtSearchEnd : '',
			SearchFiled : $s.searchType,
			SearchText : $s.searchText,
			PageSize : 20,
			PageNumber : 1	
		};
		console.log(reqReservData);
		var param = callApiObject('reserv','reservBoxs',reqReservData);
		$http(param).success(function(data){
			var reservListData = JSON.parse(data.value);
			$s.reservList = reservListData;
			console.log(data);
			$rs.dialog_progress = false;
		});
	}
	
	$s.reservBtn = function(){
		var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
		pushPage(pageName, 'pg_reserv_booking_list');
		$rs.$broadcast('initBookingList');
	}
	
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
	
}]);
//내 예약 상세
appHanmaru.controller('ReservViewController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	
	$s.reservDetailData;
	$s.reservOrganList = new Array();
	$s.reservFieldName = new Array();

	$rs.$on('initReservView',function(event,reservItem){
		$rs.dialog_progress = true;
		var reqReservDetailData = {
			LoginKey : 	$rs.userInfo.LoginKey,
			Seq : reservItem.SEQ
		};
		var param = callApiObject('reserv','resourceReservation',reqReservDetailData);
		$http(param).success(function(data){
			var resData = JSON.parse(data.value);
			console.log(resData);
			$s.reservDetailData = resData;
			$s.reservOrganList = resData.Users;
			$rs.dialog_progress = false;
		});
	});
	
	$s.btnResourceInfo = function(resourceInfo){
		$rs.pushOnePage('pg_reserv_info');
		$rs.$broadcast('initReservInfo',resourceInfo);
	}
	
	$s.reservCancel = function(seq){
//	var reqReservCancelData = {
//			LoginKey : 	$rs.userInfo.LoginKey,
//			Seq : seq,
//			State : -2	
//	};
//	var param = callApiObject('reserv','reservBoxs',reqReservCancelData);
//	$http(param).success(function(data){
//		//취소 후 flow 정리
//		});
		popPage('pg_reserv_view');
	}
}]);

//예약하기 리스트
appHanmaru.controller('ReservBookingListController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.areaList = new Array();
	$s.reservPossibleList = new Array();
	$s.txtSearchStart;
	$s.txtSearchEnd;
	$s.areaCode; 
	$s.startDateTime = '2019-01-04 14:00';
	$s.endDateTime = '2019-01-04 14:30';
	$s.areaCodeShow = false;
	
	$rs.$on('initBookingList',function(event){
		console.log($s.areaCode);
		var param = callApiObject('reserv','areas',{LoginKey : $rs.userInfo.LoginKey});
		$http(param).success(function(data){
			var resData = JSON.parse(data.value);
			$s.areaCode = resData[0].Value;
			if(resData.length > 0){
				$s.areaList = resData;
			}
		});
		//time spinner 추가할것.
	});
	
	$s.reservFindPossible = function(){
		var reqPossibleData = {
			LoginKey : 	$rs.userInfo.LoginKey,
			AreaCode : 	$s.areaCode,
			StartdateTime : $s.startDateTime,
			EnddateTime : $s.endDateTime
		};
		var param = callApiObject('reserv','resourceFindPossible',reqPossibleData);
		$http(param).success(function(data){
			var resData = JSON.parse(data.value);
			console.log(resData);
			$s.reservPossibleList = resData;
		});
	}
	
//	$s.selectAreaCode = function(){
//		$s.areaCodeShow = !$s.areaCodeShow;
//	}
	
	$s.reservChoiceBtn = function(reservPossibleItem){
		console.log(reservPossibleItem);
		$rs.pushOnePage('pg_reserv_booking_detail');
		$rs.$broadcast('initReservBookingDetail',$s.areaCode,reservPossibleItem,$s.startDateTime,$s.endDateTime);
	}
	
	$s.chooseSearchDate = function(type){
		if($rs.agent == 'android') {
			if(androidWebView != undefined) androidWebView.callMailDatePickerDialog(type);	
		} 
	}
	
	//android bridge result
//	window.setMailSearchDate = function(type, value) {
//		$s.$apply(function() {
//			if(type === 'start') {
//				$s.txtSearchStart = value;
//			} else if(type === 'end') {
//				$s.txtSearchEnd = value;
//			}
//		});
//	}
	
//	$s.popPage = function(){
//	}
	
}]);
//예약 등록 상세
appHanmaru.controller('ReservBookingDetailController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
//	LoginKey : 로그인 인증 키
//	AreaCode : 지역코드
//	ResourceCode : 자원키
//	Attendance : 참석인원 수
//	Phone : 비상연락처
//	Schedule : 스케줄 추가 여부(1:추가, 0:추가 않함)
//	MandatoryUser : 필수 참석자(유저별 메일 주소, 구분자 ;   ex)a@halla.com;b@halla.com)
//	SelectUser : 선택 참석자(유저별 메일 주소, 구분자 ;   ex)a@halla.com;b@halla.com)
//	Rtype : 회의성격(1:의사결정형,2:정보공유형,3:보고형,4:기타)
//	StartTime : 예약 시작 시간(ex:2017-01-01 13:00)
//	EndTime : 예약 종료 시간(ex:2017-01-01 13:00)
//	Purpose : 사용 목적
//	Attendees : 참석업체명
//	Comment : 설명
//	FilePathKey : 첨부파일 업로드시 사용한 키
	$s.mandatoryUserList = new Array();
	$s.selectUserList = new Array();
	$s.startDateTime;
	$s.endDateTime;
	$s.reservDateTime;
	$s.phoneNumber = '';
	$s.purpose = '';
	$s.attendees = '';
	$s.comment = '';
	$s.reservType = 1;
	$s.attendanceCnt = 0;
	$s.attendanceLimit;
	$s.resourceCode;
	$s.areaCode;
	$s.filePathKey = '';//(1개의 자원 예약시 여러 파일 업로드해도 같은 내용,형식 : "YYYYMM/(- 제거된 GUID)"   ex) 201705/A6129783F7F441F5884DC7BE4B556F90
	$s.schedule = 0;
	$s.isSchedule = false; //0 or 1
	$s.isAttendansee = false; //0 or 1
	$s.isReservDecision = false;
	$s.isReservInfo = false;
	$s.isReservReport = false;
	$s.isReservOthers = false;
	$s.attach_list = new Array();
	$s.mandatoryUser = '';
	$s.selectUser = '';
	
	$rs.$on('initReservBookingDetail',function(event,areaCode,reservPossibleItem,startDateTime,endDateTime){
		var reservDateTime = startDateTime + ' ~ ' + endDateTime;
		$s.areaCode = areaCode;
		$s.startDateTime = '2019-01-15 14:00';//받아온 시작 시간 계산할 것.
		$s.endDateTime = '2019-01-15 14:30'; //받아온 종료 시간 계산할 것.
		$s.reservDateTime = reservDateTime;
		$s.resourceCode = reservPossibleItem.Resource_code;
		var attendanceLimit = new Array(parseInt(reservPossibleItem.Attender_limit));
		
		//인원수 수정
		console.log(attendanceLimit);
	});
	
	$s.addScheduleBtn = function(){
		$s.isSchedule = !$s.isSchedule;
	};
	
	$s.selectAttendansee = function(){
		$s.isAttendansee = !$s.isAttendansee;
	};
	
	
	$s.reservBtn = function(){
		$s.schedule = $s.isSchedule ? 1 : 0;
		var reqReserv = {
			LoginKey : 	$rs.userInfo.LoginKey,
			AreaCode : 	$s.areaCode,
			ResourceCode : $s.resourceCode,
			Attendance : $s.attendanceCnt,
			Phone : $s.phoneNumber,
			Schedule : $s.schedule,
			MandatoryUser : $s.mandatoryUser,
			SelectUser : $s.selectUser,
			Rtype : $s.reservType,
			StartTime : $s.startDateTime,
			EndTime : $s.endDateTime,
			Purpose : $s.purpose,
			Comment : $s.comment,
			FilePathKey : $s.filePathKey
		};
		var param = callApiObject('reserv','resourceWriteReservation',reqReserv);
		$http(param).success(function(data){
			popPage('pg_reserv_booking_list');
			pushPage('pg_reserv_booking_detail', 'pg_reserv_list');
			$rs.$broadcast('initReservList');
		});
	}
	
	$s.btnCallOrganSelect = function(e,attendType) {
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id');
		$rs.$broadcast('initInsaReservList',attendType);
		pushOnePage('pg_insa_list_reserv');
	}
	
	//조직도 사용자 선택 반영
	$rs.$on("reservApplySelectedUser", function(e, attendType,rcv,cc) {
		if(rcv.length > 0) {
			for(idx in rcv) {
				if($s.mandatoryUserList.indexOf(rcv[idx]) == -1) {
					$s.mandatoryUserList.push(rcv[idx]);
				}
			}
		}
		
		if(cc.length > 0) {
			for(idx in cc) {
				//console.log($s.cc_user_list.indexOf(cc[idx]));
				if($s.selectUserList.indexOf(cc[idx]) == -1) {
					$s.selectUserList.push(cc[idx]);
				}
				
			}
		}
		
		for(idx in rcv) {
			var recipients = '';
			var user = rcv[idx];
			
			if(user.UserName != undefined) {
				recipients = user.EmailAddress;
			} else {
				recipients = user.Address;
			}
			$s.mandatoryUser += (recipients+';');
		}
		
		for(idx in cc) {
			var recipients = '';
			var user = cc[idx];
			
			if(user.UserName != undefined) {
				recipients = user.EmailAddress;
			} else {
				recipients = user.Address;
			}
			$s.selectUser += (recipients+';');
		}
		
	});
	
	$s.toggleReservDecision = function(){
		$s.isReservDecision = !$s.isReservDecision;
		$s.isReservInfo = false;
		$s.isReservReport = false;
		$s.isReservOthers = false;
		$s.reservType = 1;
	}
	$s.toggleReservInfo = function(){
		$s.isReservInfo = !$s.isReservInfo;
		$s.isReservDecision = false;
		$s.isReservReport = false;
		$s.isReservOthers = false;
		$s.reservType = 2;
	}
	$s.toggleReservReport = function(){
		$s.isReservReport = !$s.isReservReport; 
		$s.isReservInfo = false;
		$s.isReservDecision = false;
		$s.isReservOthers = false;
		$s.reservType = 3;
	}
	$s.toggleReservOthers = function(){
		$s.isReservOthers = !$s.isReservOthers;
		$s.isReservInfo = false;
		$s.isReservDecision = false;
		$s.isReservReport = false;
		$s.reservType = 4;
	}
	
	$s.popPage = function(currentPage){
		$s.mandatoryUser = new Array();
		$s.selectUser = new Array();
		$s.startDateTime;
		$s.endDateTime;
		$s.reservDateTime;
		$s.phoneNumber = '';
		$s.purpose = '';
		$s.attendees = '';
		$s.comment = '';
		$s.reservType;
		$s.attendanceCnt = 0;
		$s.resourceCode;
		$s.areaCode;
		$s.filePathKey = '';//(1개의 자원 예약시 여러 파일 업로드해도 같은 내용,형식 : "YYYYMM/(- 제거된 GUID)"   ex) 201705/A6129783F7F441F5884DC7BE4B556F90
		$s.schedule = 0;
		$s.isSchedule = false; //0 or 1
		$s.isAttendansee = false; //0 or 1
		$s.isReservDecision = false;
		$s.isReservInfo = false;
		$s.isReservReport = false;
		$s.isReservOthers = false;
		$s.attach_list = new Array();
		$s.mandatoryUser = '';
		$s.selectUser = '';
		
		pushPage(currentPage, 'pg_reserv_booking_list');
		$rs.$broadcast('initBookingList');
	}
	
	$s.changeAttachFile = function(e){//
		var files = e.target.files; 
		$s.$apply(function(){
			$s.attach_list.push(files[0]);
			$s.chooser_attach_file = undefined;
			
			var now = moment(new Date()).format("YYYYMM");
			var guid = $rs.deviceID.toString().replace(/-/g,'');
			$s.filePathKey = now + "/" + guid;
			
			var fd = new FormData();
			fd.append('LoginKey', $rs.userInfo.LoginKey);
			fd.append('file', files[0]);
			fd.append('FilePathKey',$s.filePathKey);
			
			var param = callApiObjectNoData('reserv', 'resourceFileUpload');
			$http.post(param.url, fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			}).success(function(data) {
				var code = parseInt(data.Code, 10);
				if(code === 1) {
				}
			}).error(function(data){
//				console.log(data);
			});
		});
	}
	
	
}]).directive('reservAttachFileChange', function() {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var onChangeHandler = scope.$eval(attrs.reservAttachFileChange);
			element.on('change', onChangeHandler);
			element.on('$destroy', function() {
				element.off();
			});
		}
	};
});;

//예약하기 참석인원선택
appHanmaru.controller('organReservController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout) {
	$s.org_alt_user_list;
	$s.tab_index = 2;
	$s.search_org_user_list = new Array();
	$s.search_org_addr_list = new Array();
	$s.orgSearchKeyword;
	$s.selectedOrganUser;
	$s.isProfileImgEnlarge = true;
	$s.addrCnt = 0;
	$s.organCnt = 0;
	$s.attendType = '';
	
	$rs.$on('initInsaReservList', function(event,attendType) {
		$s.tab_index = 2;
		$s.orgSearchKeyword = '';
		$s.search_org_user_list = undefined;
		$s.attendType = attendType;
		console.log(attendType);
		
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
	
	//조직도 임직원 / 주소록 검색 결과
	$s.btnSearchOrgUserList = function(e) {
		if($s.orgSearchKeyword != '' && $s.orgSearchKeyword != undefined) {
			var reqInsaListAddrData = {
				LoginKey:$rs.userInfo.LoginKey,
				PageNumber:1,
				PageSize:20,
				SearchValue:$s.orgSearchKeyword
			};
			
			var addrParam = callApiObject('mail', 'mailAddressBook', reqInsaListAddrData);
			$http(addrParam).success(function(data) {
				
				var code = JSON.parse(data.Code);
				if(code == 1){
					var result = JSON.parse(data.value);
					setTimeout(function(){
						$s.$apply(function(){
							$s.search_org_addr_list = result.Users;
							$s.addrCnt = $s.search_org_addr_list.length;
							
						});
					}, 500);					
				}else{
					$s.addrCnt = 0;
				}
				
			});
			var reqInsaListOrganData = {
				LoginKey:$rs.userInfo.LoginKey,
				Search:$s.orgSearchKeyword
			};
			
			var organParam = callApiObject('insa', 'insaFind', reqInsaListOrganData);
			$http(organParam).success(function(data) {
				var code = JSON.parse(data.Code);
				if(code==1){
					var result = JSON.parse(data.value);
					setTimeout(function(){
						$s.$apply(function(){
							$s.search_org_user_list = result.Users;
							$s.organCnt = $s.search_org_user_list.length;
						});
					}, 500);					
				}else{
					$s.organCnt = 0;
				}
			}).then(function(){
				setTimeout(function(){
					if($s.addrCnt > 0 && $s.organCnt == 0){
						$s.$apply(function(){
							$s.tab_index = 0;
						});
					}else{
						$s.$apply(function(){
							$s.tab_index = 1;
						});					
					}
				},1000);
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
		}else if(user.MyPhotoUrl == ''){
			user.MyPhotoUrl = '/resources/image/organization/org_user.png';
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

			if(result.UserName == '') {
				result.UserName = user.UserName;
				result.CompName = user.CompName;
			}
			
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
						break;
					case 2 :
						$s.third_depth_list = dept;
						$s.selected_secondDepth_code = deptCode.DeptCode;
						break;
					case 3 :
						$s.fourth_depth_list = dept;
						$s.selected_thirdDepth_code = deptCode.DeptCode;
						break;
					case 4 :
						$s.fifth_depth_list = dept;
						$s.selected_fourthDepth_code = deptCode.DeptCode;
						break;
					case 5 :
						$s.sixth_depth_list = dept;
						break;
				}
				
				$s.org_alt_user_list = result.Users;
			} else {
				$s.org_alt_user_list = result.Users;
			}
		});
	}

	$s.isUserDeptSelected = false;
	$s.userDeptSelectType = '';
	$s.rcv_count = 0;
	$s.cc_count = 0;
	$s.arr_selected_rcv = new Array();
	$s.arr_selected_cc = new Array();
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
	
	//필수참석자
	$s.btnAddRcvUserList = function(e) {
		if($s.arr_selected_userDept.length == 0) {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = '추가';
			$s.userDeptSelectType = 'rcv';
		} else {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = '추가';
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
	
	//선택참석자
	$s.btnAddCCUserList = function(e) {
		if($s.arr_selected_userDept.length == 0) {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = '추가';
			$s.userDeptSelectType = 'cc';
		} else {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = '추가';
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
	
	$s.btnApplySelectedUser = function(e){
		$rs.$broadcast("reservApplySelectedUser", $s.attendType, $s.arr_selected_rcv, $s.arr_selected_cc);
		
		$s.attendType = undefined;
		$s.arr_selected_rcv = new Array();
		$s.arr_selected_cc = new Array();
		
		$s.rcv_count = 0;
		$s.cc_count = 0;
		$s.addrCnt = 0;
		$s.organCnt = 0;
		
		popPage('pg_insa_list_reserv');
	}
	
	$s.popPage = function(currentPage){
		//초기화해줄것
		console.log($s.arr_selected_rcv);
		popPage(currentPage);
		
		$s.attendType = undefined;
		
		$s.rcv_count = 0;
		$s.cc_count = 0;
		$s.addrCnt = 0;
		$s.organCnt = 0;
		
		$s.arr_selected_rcv.splice(0, $s.arr_selected_rcv.length);
		$s.arr_selected_cc.splice(0, $s.arr_selected_cc.length);
		$s.arr_selected_userDept.splice(0, $s.arr_selected_userDept.length);
	}
	
}]);


//예약 자원 정보
appHanmaru.controller('reservResourceInfoController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.reservInfo ='';
	$rs.$on('initReservInfo',function(event,resourceInfo){
		$s.reservInfo = resourceInfo;
	});
}]);

//board
appHanmaru.controller('boardListController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$rs.curr_board_id = ''
	$s.displayName = '';
	$s.masterID = '';
	$s.pageSize  = 20;
	$s.pageNumber = 1;
	$s.searchField = '';
	$s.searchKeyword = '';
	$s.boardList = new Array();
	$s.boardType = '';
	$s.isProfileImgEnlarge = true;
	$s.boardSearchShow = false;
	$s.searchOptionShow = false;
	
	$s.SearchTypeOptions = [
		{'value':'SubjectContents','name':'제목+본문'},
		{'value':'Subject','name':'제목'},
		{'value':'Contents','name':'본문'},
		{'value':'RegUserName','name':'작성자'},
	  ];
  	$s.SearchType = $s.SearchTypeOptions[0].value;
  	$s.SearchName = $s.SearchTypeOptions[0].name;
  	$s.curSearchType = 0;
  	$s.searchField = $s.SearchTypeOptions[0].value;
  	
  	$rs.$on('initSearchValue',function(event){
		$s.searchKeyword = '';
		$s.SearchType = $s.SearchTypeOptions[0].value;
	  	$s.SearchName = $s.SearchTypeOptions[0].name;
	  	$s.curSearchType = 0;
	  	$s.searchField = $s.SearchTypeOptions[0].value;
	});
	
	$rs.$on('initBoardList',function(event,boardType,masterID,displayName){
//		LoginKey : 로그인 인증 키
//		BoardType : 게시판종류
//		MasterID : 게시판 키
//		Page : 페이지
//		PageSize : 페이지수
//		SearchField : 검색 필드(SubjectContents : 제목 또는 본문, Subject : 제목, Contents : 본문, RegUserName : 게시자이름)
//		SearchKeyword : 검색어
		
		$rs.dialog_progress = true;
		$s.boardSearchShow = false;
		$s.displayName = displayName;
		$s.boardType = boardType;
		$s.masterID = masterID;
		
		//검색조건 초기화
		$rs.$broadcast('initSearchValue');
		
		var reqBoardData = {
			LoginKey : $rs.userInfo.LoginKey,
			BoardType : $s.boardType,
			MasterID : $s.masterID,
			Page : $s.pageNumber,
			PageSize : $s.pageSize,
			SearchField : $s.searchField,
			SearchKeyword : $s.searchKeyword
		}
		var param = callApiObject('board', 'boardList',reqBoardData);
		$http(param).success(function(data) {
			var boardData = JSON.parse(data.value);
			$s.boardList = boardData.Boards;
			$rs.dialog_progress = false;
		});
	});
	
	
	//다음페이지 읽기
	$s.readBoardNextPage = function(){
		$s.pageNumber++;
		
		var reqMailListData = {
			LoginKey : $rs.userInfo.LoginKey,
			BoardType : $s.boardType,
			MasterID : $s.masterID,
			Page : $s.pageNumber,
			PageSize : $s.pageSize,
			SearchField : $s.searchField,
			SearchKeyword : $s.searchKeyword
		};

		var param = callApiObject('board', 'boardList', reqMailListData);
		$http(param).success(function(data) {
			var boardData = JSON.parse(data.value);
			
			$timeout(function(){
				if(boardData.Boards.length > 0) {
					for(idx in boardData.Boards) {
						$s.boardList.push(boardData.Boards[idx]);
					}
				} else {
					$s.pageNumber--;
				}
			}, 500);
		}).then(function(){
			$timeout(function(){
				$rs.dialog_progress = false;
			}, 1000);
		});
	};
	
	//공지 리스트 중 하나 클릭 시 공지사항 상세 화면 이동 
	$rs.boardDetail = function(e, board, boardType, displayName) {
		if(boardType != ''){ //메인에서 접근할 경우 boardType존재, 게시판에서 접근할 경우 boardType ''
			$s.boardType = boardType;
		}
		$rs.curr_board_id = board.boardID;
		
		//공지사항 Request 정보 세팅 
		var reqBoardData = {
			LoginKey:$rs.userInfo.LoginKey,
			BoardType:$s.boardType,
			BoardID:board.BoardID
		};
		var param = callApiObject('board', 'boardView', reqBoardData);
		$http(param).success(function(data) {
			var boardData = JSON.parse(data.value);
			$rs.pushOnePage('pg_board_view');
			$rs.$broadcast('initBoardDetail', boardData, displayName);
		});
	}
	
	$s.searchOption = function() {
		$s.searchOptionShow = !$s.searchOptionShow;
	};
	
	$s.toggleProfileEnlarge = function() {
		$s.isProfileImgEnlarge = !$s.isProfileImgEnlarge;
	}
	
	$s.toggleBoardSearch = function(event){
		$s.boardSearchShow = !$s.boardSearchShow;
	}
	
	$s.boardSearchToggle = function(){
		$s.boardSearchShow = !$s.boardSearchShow;
	}
	
	$s.applySearchType = function(index){
		$s.curSearchType = index;
		$s.SearchType = $s.SearchTypeOptions[index].value;
		$s.SearchName = $s.SearchTypeOptions[index].name;
		$s.searchField = $s.SearchTypeOptions[0].value;
	}
	
	$s.btnSearchBoard = function(event){
		var reqBoardData = {
			LoginKey : $rs.userInfo.LoginKey,
			BoardType : $s.boardType,
			MasterID : $s.masterID,
			Page : $s.pageNumber,
			PageSize : $s.pageSize,
			SearchField : $s.searchField,
			SearchKeyword : $s.searchKeyword
		}
		console.log(reqBoardData);
		var param = callApiObject('board', 'boardList',reqBoardData);
		$http(param).success(function(data) {
			var boardData = JSON.parse(data.value);
			$s.boardList = boardData.Boards;
			$s.boardSearchShow = false;
		});
}
	
}])
.directive('boardOnScrollToBottom', function () {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var fn = scope.$eval(attrs.boardOnScrollToBottom);
			clientHeight = element[0].clientHeight;

			element.on('scroll', function (e) {
				var el = e.target;
				var rate = 0.07;

				if(scope.agent == 'ios') {
					if ((el.scrollHeight - el.scrollTop) == clientHeight) { // fully scrolled
						scope.$root.dialog_progress = true;
						scope.$apply(fn);
					}
				} else{
					if((el.scrollTop + clientHeight) >= el.scrollHeight){
						scope.$root.dialog_progress = true;
						scope.$apply(fn);
					}
				}
			});
		}
	};
});

appHanmaru.controller('boardDetailController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout) {
	$rs.$on('initBoardDetail', function(event, boardData, displayName) {
		$s.displayName = displayName;
		$s.boardDetailData = boardData;
		$s.selectOrganUser = false;
		$rs.dialog_progress = true;
		$s.isProfileImgEnlarge = true;
		$s.regUserName = '';
		
		var regUserNameArray = boardData.RegUserName.split("/");
		$s.regUserName = regUserNameArray[0];

		//공지사항 상세정보
		$s.userDetailData = undefined;
		var reqUserDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			EmailAddress:$s.boardDetailData.RegUserEmail 
		};
		
		var param = callApiObject('insa', 'insaUserDetail', reqUserDetailData);
		$http(param).success(function(data) {
			var startStr = data.value.substring(0,1);
			
			if(startStr === '{') {
				setTimeout(function(){
					$s.$apply(function(){
						$s.userDetailData = JSON.parse(data.value);
					});
				}, 500);
			}
		}).then(function(){
			$rs.dialog_progress = false;
		});
	})
	
	$s.openUserDetailDialog = function() {
		$s.selectOrganUser = true;
	}
	
	$s.closeUserDetailDialog = function(){
		$s.selectOrganUser = false;
	}
	
	$s.toggleProfileEnlarge = function() {
		$s.isProfileImgEnlarge = !$s.isProfileImgEnlarge;
	}
	
	$s.getFileSizeUnit = function(value){
		return getFileSizeUnit(value);
	}
	
	// pinchzoom setting
	var transform = '';
	$s.minZoom = 1;
	$s.maxZoom = 2;
	$s.currZoom = 1;
	$s.btnBoardContentsZoomPlus = function() {
		$s.currZoom++;
		if($s.currZoom <= $s.maxZoom) {
	        var el = angular.element('#boardDetailContents');
			el.css({
				webkitTransform : "translate3d(0, 0, 0) " + "scale3d(" + $s.currZoom + "," + $s.currZoom + ", 1) ",
				width : 'fit-content'
			});
		} else {
			$s.currZoom = $s.maxZoom;
		}
	};
	
	$s.btnBoardContentsZoomMinus = function() {
		$s.currZoom--;
		if($s.currZoom >= $s.minZoom) {
			var el = angular.element('#boardDetailContents');
			el.css({
				webkitTransform : "translate3d(0, 0, 0) " + "scale3d(" + $s.currZoom + "," + $s.currZoom + ", 1) ",
				width : '100%'
			});
		} else {
			$s.currZoom = $s.minZoom;
		}
	};
	
	$s.resetZoomControl = function(){
		var el = angular.element('#boardDetailContents');
		var domDetailcontents = document.getElementById('boardDetailContents');
		domDetailcontents.scrollTop = 0;
		domDetailcontents.scrollLeft = 0;
		el.css({
			webkitTransform : "translate3d(0, 0, 0) " + "scale3d(1, 1, 1) ",
			width : '100%'
		});
		$s.currZoom = 1;
	}
	$s.popPage = function(currentPage){
		$s.resetZoomControl();
		popPage(currentPage);
	}
	
}]);

//settingController
appHanmaru.controller('settingController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.mainPageList = [
		{'code':'Main','name':'메인'},
		{'code':'NEWS','name':'뉴스'},
		{'code':'MAIL','name':'메일'},
		{'code':'APPROVAL','name':'결재'},
		{'code':'ORG','name':'조직도'},
		{'code':'BOARD','name':'게시판'},
		{'code':'WORK','name':'일정'}
	];
	
	$s.languageList = [
		{'code':'KOR','name':'한글'},
		{'code':'ENG','name':'영어'},
		{'code':'CHN','name':'중문'},
		{'code':'JPN','name':'일어'},
		{'code':'ETC','name':'기타'}
	];
	
//	$s.companyList = [
//		{'code':'00001','name':'현대BS&C'}
//	];
	
	$s.pushToken = '';
	$s.timeZone = 9;
	$s.approvalPush = false;
	$s.documentPush = false;
	$s.schedulePush = false;
	$s.workPush = false;
	$s.reportPush = false;
	$s.companyList = new Array();
	$s.myCompanyCode;
	$s.myCompanyName;
	$s.myLanguageCode = $s.languageList[0].code;
	$s.myLanguageName = $s.languageList[0].name;
	$s.myMainpageCode = $s.mainPageList[0].code;
	$s.myMainpageName = $s.mainPageList[0].name;
	
	$rs.$on('initSetting',function(){
		var param = callApiObject('setting', 'getSetting', {LoginKey:$rs.userInfo.LoginKey});
		$http(param).success(function(data) {
			var settingData = JSON.parse(data.value);
			console.log(settingData);
			
			sessionStorage.setItem("language", settingData.Lang); //로그인 화면에서의 언어변환을 위한 App 내 로컬스토리지에 저장 
			$rs.userInfo.Lang = settingData.Lang; //로그인 이외 화면에서의 언어변환을 위한 rootScope 변수 내 저장
			$s.companyList = settingData.companys;
			$s.myCompanyCode = settingData.SetCompcode;
			$s.myLanguageCode = settingData.Lang;
			$s.myMainpageCode = settingData.MainView;
			
			//회사 초기화
			for(idx in $s.companyList){
				if($s.companyList[idx].code == $s.myCompanyCode){
					$s.myCompanyName = $s.companyList[idx].name; 
				}
			};
			
			//언어 초기화
			for(idx in $s.languageList){
				if($s.languageList[idx].code == $s.myLanguageCode){
					$s.myLanguageName = $s.languageList[idx].name; 
				}
			};
			
			//메인화면 초기화
			for(idx in $s.mainPageList){
				if($s.mainPageList[idx].code == $s.myMainpageCode){
					$s.myMainpageName = $s.mainPageList[idx].name; 
				}
			};
			
			$s.approvalPush = settingData.ApprovalPush === 'true' ? true : false;
			$s.documentPush = settingData.ApprovalccPush === 'true' ? true : false;
		});
	});
	//언어설정 페이지 이동
	$s.btnLanguageSetting = function(event){
		$rs.pushOnePage('pg_setting_language');
		$rs.$broadcast('initLanguageList',$s.myLanguageCode,$s.languageList);
	};
	
	//회사설정 페이지 이동
	$s.btnCompanySetting = function(event){
		$rs.pushOnePage('pg_setting_company');
		$rs.$broadcast('initCompanySetting',$s.myCompanyCode,$s.companyList);
	}
	
	//메인페이지 설정 이동
	$s.btnMainpageSetting = function(event){
		$rs.pushOnePage('pg_setting_mainpage');
		$rs.$broadcast('initMainpageList',$s.myMainpageCode,$s.mainPageList);
	}
	//결재처리 알림
	$s.btnApprovalPush = function(event){
		$s.approvalPush = !$s.approvalPush;
		requestPushSetting();
	} 
	//수신문서 알림
	$s.btnDocumentPush = function(event){
		$s.documentPush = !$s.documentPush;
		requestPushSetting();
	} 
	/*//일정 알림
	$s.btnSchedulePush = function(event){
		$s.schedulePush = !$s.schedulePush;
	};
	//작업알림
	$s.btnWorkPush = function(event){
		$s.workPush = !$s.workPush;
	};
	//보고서 알림
	$s.btnReportPush = function(event){
		$s.reportPush = !$s.reportPush;
	};*/

	//푸시설정
	function requestPushSetting(){
		var approvalPush = $s.approvalPush ? 1 : 0;
		var documentPush = $s.documentPushVal ? 1 : 0;
		var reqPushData = {
			LoginKey : $rs.userInfo.LoginKey,
			AprovalPush : approvalPush,
			ApprovalccPush : documentPush,
			PushToken : $s.pushToken
		}
		var param = callApiObject('setting', 'getSetting',reqPushData);
		console.log(param);
		$http(param).success(function(data) {
			console.log(data);
		});
	};
	
	//설정 하기
	function requestSettings(){
		var reqData = {
			LoginKey : $rs.userInfo.LoginKey,
			Lang : $s.myLanguageCode,
			MainView : $s.myMainpageCode,
			CompanyCode : $s.myCompanyCode,
			TimeZone : $s.timeZone	
		};
		$rs.result_message = '설정을 변경하였습니다.';
		$rs.dialog_toast = true;
		console.log(reqData);
		var param = callApiObject('setting', 'setSetting',reqData);
		$http(param).success(function(data) {
//			console.log(data);
		}).then(function(){
			setTimeout(function(){
				$rs.dialog_toast = false;
				$rs.$apply();
			},1500);
		});
	};
	
	//언어설정
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
			sessionStorage.setItem("language", selectedData.code); //로그인 화면에서의 언어변환을 위한 App 내 로컬스토리지에 저장 
			$rs.userInfo.Lang = selectedData.code; //로그인 이외 화면에서의 언어변환을 위한 rootScope 변수 내 저장
		}).then(function(){
			var loginData = {
				LoginKey:$rs.userInfo.LoginKey
			};
			
			var param = callApiObject($rs.refreshMenuName, $rs.refreshMenuName+'Boxs', loginData);
			console.log($rs.refreshMenuName, param);
//			$http(param).success(function(data) {
//				var boxList = JSON.parse(data.value);
//				console.log("1111 : ", boxList);
//				$rs.subMenuList = boxList;
//				if($rs.refreshMenuName === 'approval') {
//					initMailTree(boxList);
//					for(idx in boxList) {
//						if(boxList[idx].FolderId === 'ARRIVE') {
//							//console.log('init'+capitalMenuName+'List');
//							$rs.currSubMenu = boxList[idx].FolderId;
//							$rs.$broadcast('init'+capitalMenuName+'List', boxList[idx].DisplayName);
//							break;
//						} 
//					}
//				} else if ($rs.refreshMenuName === 'mail'){
//					$rs.currSubMenu = boxList[0].FolderId;
//					initMailTree(boxList);
//				}else if($rs.refreshMenuName === 'insa'){
//				}else if($rs.refreshMenuName === 'work'){
//					$rs.subMenuType = 'work';
//					$rs.subMenuList = boxList.Menus;
//					$rs.currSubMenu = boxList.Menus[0].MenuKey; 
//				}else if($rs.refreshMenuName === 'main'){
//					var param = callApiObject('board', 'boardBoxs', {LoginKey:$rs.userInfo.LoginKey,CompanyCode:''});
//					$http(param).success(function(data) {
//						var boardData = JSON.parse(data.value);
//						$rs.subMenuType = 'main';
//						$rs.subMenuList = boardData;
//					});
//				}else if($rs.refreshMenuName === 'board'){
//					$rs.subMenuType = 'board';
//					$rs.subMenuList = boxList;
//					
//				}else if($rs.refreshMenuName === 'resource'){
//					$rs.subMenuType = 'resource';
//				}
//			});
		});;
	}
	
	//회사설정
	$rs.$on('setCompany',function(event,companyCode,companyName){
		$s.myCompanyCode = companyCode; 
		$s.myCompanyName = companyName;
		requestSettings();
	});
	
	//초기화면
	$rs.$on('setMainpage',function(event,mainpageCode,mainpageName){
		$s.myMainpageCode = mainpageCode;
		$s.myMainpageName = mainpageName;
		requestSettings();
	});
	
	//언어 설정
	$rs.$on('setLanguage',function(event,languageCode,languageName){
		$s.myLanguageCode = languageCode;
		$s.myLanguageName = languageName;
		requestSettings();
	});
	
	
	//로그아웃
	$s.btnDoLogout = function(){
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
	}
	
	$s.setCompany = function(){
		$s.selectedCompanyCode = $s.companyList[$s.curIdx].code;
		$s.selectedCompanyName = $s.companyList[$s.curIdx].name;
		
		$rs.$broadcast('setCompany',$s.selectedCompanyCode,$s.selectedCompanyName);
		$rs.popPage('pg_setting_company');
	}
	
}]);
appHanmaru.controller('settingLanguageController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.languageList;
	$s.languageCode;
	$s.languageName;
	$s.curIdx;
	
	$rs.$on('initLanguageList',function(event, myLanguage, languageList){
		$s.languageList = languageList;
		console.log(languageList);
		for(idx in languageList){
			if(languageList[idx].code === myLanguage){
				$s.curIdx = idx;
			}
		}
	});
	
	$s.btnSelectLanguage = function(idx){
		$s.curIdx = idx;
	}
	
	$s.setLanguage = function(){
		$s.languageCode = $s.languageList[$s.curIdx].code;
		$s.languageName = $s.languageList[$s.curIdx].name;
		
		$rs.$broadcast('setLanguage',$s.languageCode,$s.languageName);
		$rs.popPage('pg_setting_language');
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
			}
		}
	});
	
	$s.btnSelectMainpage = function(idx){
		$s.curIdx = idx;
	}
	
	$s.setMainpage = function(){
		$s.mainpageCode = $s.mainpageList[$s.curIdx].code;
		$s.mainpageName = $s.mainpageList[$s.curIdx].name;
		
		$rs.$broadcast('setMainpage',$s.mainpageCode,$s.mainpageName);
		$rs.popPage('pg_setting_mainpage');
	};
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
	$s.importantMail = false;
	$s.isDlgMailPopupMenu = false;
//	$s.searchSel = '제목';
	$s.editTxt = '편집';
	$s.mailListPage = 1;
	
	$s.SearchTypeOptions = [
		{'value':'subject','name':'제목'},
		{'value':'body','name':'본문'},
		{'value':'sender','name':'발신자'},
		{'value':'receive','name':'수신자'},
		{'value':'subjectbody','name':'제목+본문'},
	  ];
  	$s.SearchType = $s.SearchTypeOptions[0].value;
  	$s.SearchName = $s.SearchTypeOptions[0].name;
  	$s.curSearchType = 0;
  	
	$rs.$on('initSearchValue',function(event){
		$s.SearchValue = '';
		$s.txtSearchStart = '';
		$s.txtSearchEnd = '';
		$s.SearchType = $s.SearchTypeOptions[0].name;
	});
	
	$rs.$on('displayMailName', function(event, data){
		$s.displayName = data;
	});
	
	$rs.$on('initMailBox', function(event) {
		var param = callApiObject('mail', 'mailBoxs', {LoginKey:$rs.userInfo.LoginKey})
		$http(param).success(function(data) {
			var mailBoxList = JSON.parse(data.value);
			$rs.subMenuType = 'mail';
			$rs.subMenuList = mailBoxList;
			$rs.currSubMenu = mailBoxList[0].FolderId;
			
			initMailTree(mailBoxList);
			
			$rs.$broadcast('initMailList', mailBoxList[0].DisplayName);
		});
	});
	
	$rs.$on('refreshMailBox', function(event) {
		var param = callApiObject('mail', 'mailBoxs', {LoginKey:$rs.userInfo.LoginKey});
		$http(param).success(function(data) {
			var mailBoxList = JSON.parse(data.value);
			$rs.subMenuList = mailBoxList;
			initMailTree(mailBoxList);
			
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
			
			//초기화면 설정을 위해 수정함(기존 'pg_login')
			var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
			pushPage(pageName, 'pg_mail_list');
		}).then(function(){
			$timeout(function(){
				$rs.dialog_progress = false;
			}, 1000);
		});
	});
	
	$s.hideMailVisibleOption = function(e){
		var el = angular.element(e.target);
		var clzNm = el.attr('class');
		
		if(clzNm === 'btnMailOption') {
		} else if(clzNm == 'btnMailSearch' || el.parents('div.mailSearchDiv').attr('class') == 'mailSearchDiv') {
			
		} else {
//			$s.mailOptionShow = false;
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
		$rs.dialog_progress = true;
		
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
		}).then(function(){
			$rs.dialog_progress = false;
		});;
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
	
	//메일 검색 옵션 타입 선택
	$s.applySearchType = function(index){
		$s.curSearchType = index;
		$s.SearchType = $s.SearchTypeOptions[index].value;
		$s.SearchName = $s.SearchTypeOptions[index].name;
	}
	
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
			console.log(mailList);
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
			for(var idx in $s.mailEditList){
				$s.mailEditList[idx].EditSelected = false;
			}
			$s.mailEditList.splice(0,$s.mailEditList.length);
			$s.mailListEditShow = false;
			$s.mailEditShow = false;
			$s.mailOptionShow = false;
			$s.mailSearchnShow = false;
			$s.mailBtnShow = true;
			$s.mailEditHide = false;			
			$s.editTxt = '편집';
		} else {
			$s.mailListEditShow = true;
			$s.mailOptionShow = false;
			$s.mailSearchnShow = false;
			$s.mailEditShow = true;
			$s.mailBtnShow = false;
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
				
				$rs.mailData = mailData;
				parseCIDAttachMailData($rs.mailData);
				
			}).then(function(){
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
					$rs.$broadcast('initMailDetail',mail);
					$rs.$broadcast('refreshMailBox');
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
			$timeout(function(){
				$rs.dialog_progress = false;
			}, 1000);
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
	
	//메일 읽지않음 start
	$s.btnToggleNotRead = function(e){
//		console.log(e);
		var arrMail = new Array();
		var trueCount = 0;
		var state = false;
		
		for(var idx in $s.mailEditList) {
			var email = $s.mailEditList[idx];
			arrMail.push(email.ItemId);
		}
		
		for(var idx in $s.mailEditList) {
			var email = $s.mailEditList[idx];
			state = false;
		}
		
		var readMailData = {
			LoginKey:$rs.userInfo.LoginKey,
			States:state,
			MailId:arrMail
		}
		
		var readParam = callApiObject('mail', 'mailDoRead', readMailData);
		$http(readParam).success(function(readResultData) {
			for(var idx in $s.mailEditList) {
				var email = $s.mailEditList[idx];
				console.log(email);
				email.IsRead = false;
				email.EditSelected = false;
			}
			$s.mailEdit();
		}).then(function(){
			$s.mailEditList.splice(0, $s.mailEditList.length);
			$rs.$broadcast('refreshMailBox');
		});
	}
	//메일 읽지않음 end
	
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
		var mailBodyObj = angular.element(mail.Body);
		var img = mailBodyObj.find('img[src^="cid:"]');
		var tmpAttachMap = new Map();
		var toParseMailBody = mail.Body;
		
		if(img.length > 0) {
			for(var i = 0; i < img.length; i++) {
				var src = img.eq(i).attr('src');
				if(src != undefined) {
					var fileName = src.replace("cid:", "").split('@')[0];
					
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
		} else {
			var mailBody = angular.element(mail.Body);
			var approvalLink = mailBody.find('a[href*="/Workflow/Page/Link.aspx"]');
			var approvalLinkIndex = mail.Body.indexOf("/Workflow/Page/Link.aspx");
			
			if(approvalLinkIndex != -1) {
				var docID = approvalLink.attr('href').split('?')[1].split('=')[1];
				setTimeout(function(){
					var script = "javascript:btnToApprovalDetail('"+docID.trim()+"');";
//					mail.Body = mail.Body.replace($rs.apiURL+"/Workflow/Page/Link.aspx?docId="+docID, script);//$rs.apiURL이 현재 https.
					mail.Body = mail.Body.replace("http://ep.hd-bsnc.com/Workflow/Page/Link.aspx?docId="+docID, script);
					mail.HTMLBody = $sce.trustAsHtml(mail.Body);
				}, 200);
			} else {
				mail.HTMLBody = $sce.trustAsHtml(mail.Body);			
			}
		}
	}
	
	function recursiveImageDeleteLoad(index, mail, removeIdxArray) {
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
		}).then(function(){
			$rs.$broadcast('refreshMailBox');
		});
	}
	
	$s.onReload = function(){
		//console.log('onReload');
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
	
	$rs.$on('applyMailFlagStatus', function(event, mail, mailID){
		console.log(mailID);
		for(i in $s.mailList) {
			var m = $s.mailList[i];
			if(m.ItemId === mailID) {
				m.FlagStatus = mail.FlagStatus;
				break;
			}
		}
	});
	$rs.$on('applyMailReadStatus', function(event, mail, mailID){
		console.log(mailID);
		for(i in $s.mailList) {
			var m = $s.mailList[i];
			if(m.ItemId === mailID) {
				m.IsRead = true;
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
				
				if(scope.agent == 'ios') {
					if ((el.scrollHeight - el.scrollTop) == clientHeight) { // fully scrolled
						scope.$root.dialog_progress = true;
						scope.$apply(fn);
					}
				} else{
					if((el.scrollTop + clientHeight) >= el.scrollHeight){
						scope.$root.dialog_progress = true;
						scope.$apply(fn);
					}
				}
			
			});
		}
	};
})
.directive('onLongPress',function($timeout){
	return {
		restrict: 'A',
		link: function($scope, $elm, $attrs) {
			$elm.bind('touchstart', function(evt) {
				$scope.longPress = true;
				$elm.addClass('pressed');
				$scope.start = Date.now();
				
				$timeout(function() {
	                if ($scope.longPress) {
	                    $scope.$apply(function() {
	                        $scope.$eval($attrs.onLongPress);
	                    });
	                }
	            }, 600);
			});
			
			$elm.bind('touchmove', function(e) {
				$elm.removeClass('pressed');
				$scope.longPress = false;
				clearTimeout($timeout);
			});

			$elm.bind('touchend', function(evt) {
				$scope.longPress = false;
				$elm.removeClass('pressed');
				$scope.end = Date.now();
				
				//ios safari $eval 실행후 터치 이벤트 막기위함
				if ($scope.end - $scope.start >= 600) {
					evt.preventDefault();
			    }
				
				if ($attrs.onTouchEnd) {
					$scope.$apply(function() {
						$scope.$eval($attrs.onTouchEnd);
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
        		scope.$root.dialog_progress = true;
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
		$rs.dialog_progress = true;
		$s.isDlgMailMove = false;
		
		//pinchzoom
		/*
		setTimeout(function(){
			try {
				var elm = document.getElementById('mailDetailHTMLContents');
//				initMailContentsPinchZoom(elm);
				////console.log(angular.element("#mailDetailContents").html());
			} catch(e) {
				//console.log(e);
			}
		}, 500);
		*/
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
		}).then(function(){
			$rs.dialog_progress = false;
		});
		
		//CID ATTACH 가 있을 떄 값 교체
		function downloadCIDFileAS(index, cid) {
			$http.get(cid.FileURL, {responseType:'arraybuffer'}).success((function(index) {
			    return function(data) {
					var base64Data = 'data:image/' + extension + ';base64,'+ _arrayBufferToBase64(data);
					//[[CID::ATTACH_1]]
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
				console.log(cidAttach);
				worker = new Worker(
					downloadCIDFileAS(index, cidAttach)
	    		);
			}
		}
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
		console.log(param);
		$http(param).success(function(data) {
			var startStr = data.value.substring(0,1);
			if(startStr === '{') {
				var mailData = JSON.parse(data.value);
				//modified
				parseCIDAttachMailData(mailData);
				
				setTimeout(function(){
					$s.isRecipientShow = false;
					$rs.mailData = mailData;
					$rs.$apply(function () {
						$rs.mailData.HTMLBody = $sce.trustAsHtml($rs.mailData.Body);
			        });
				}, 100);
			}
		}).then(function(){
			$rs.dialog_progress = false;
			//메일읽음
			var arrMail = new Array();
			arrMail.push(reqMailDetailData.MailId);
			
			var readMailData = {
				LoginKey:$rs.userInfo.LoginKey,
				States:true,
				MailId:arrMail
			}
			var readParam = callApiObject('mail', 'mailDoRead', readMailData);
			$http(readParam).success(function(readResultData) {
				$rs.$broadcast('applyMailReadStatus', $rs.mailData, reqMailDetailData.MailId);
				$rs.$broadcast('refreshMailBox');
			});
		});
		
		$s.resetZoomControl();
	}
	
	$s.popPage = function(currPageName) {
		//zoom init
		$s.resetZoomControl();
		
		$s.isDlgMailMove = false; //이동 메일함 dialog 닫기
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
					$rs.result_message = '플래그가 설정 되었습니다';
				} else {
					$rs.result_message = '플래그가 해제 되었습니다';
				}
				
				$rs.$broadcast('applyMailFlagStatus', $rs.mailData, $rs.CURR_MAIL_ID);
				$rs.dialog_toast = true;
			} else {
				$rs.result_message = '플래그 설정/해제에 실패했습니다.';
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
	
	//확인버튼 클릭->메일함 선택시 바로 메일이동 되도록 수정함
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
	
//	var hammertime;
//	function initMailContentsPinchZoom(elm) {
//		if(hammertime == undefined) {
//			hammertime = new Hammer(elm, {});
//		    var posX = 0, posY = 0, scale = 1, last_scale = 1, last_posX = 0, last_posY = 0, max_pos_x = 0, max_pos_y = 0, transform = "", el = elm;
//
//		    hammertime.on('doubletap pan panend pinch pinchend', function(ev) {
//		        if (ev.type == "doubletap") {
//		            transform = "translate3d(0, 0, 0) " + "scale3d(2, 2, 1) ";
//		            scale = 2;
//		            last_scale = 2;
//		            try {
//		                if (window.getComputedStyle(el, null).getPropertyValue('-webkit-transform').toString() != "matrix(1, 0, 0, 1, 0, 0)") {
//		                    transform = "translate3d(0, 0, 0) " + "scale3d(1, 1, 1) ";
//		                    scale = 1;
//		                    last_scale = 1;
//		                }
//		            } catch (err) {}
//		            el.style.webkitTransform = transform;
//		            transform = "";
//		        }
//
//		        //pan    
//		        if (ev.type == 'pan') {
//		            posX = last_posX + ev.deltaX;
//		            posY = last_posY + ev.deltaY;
//		            max_pos_x = Math.ceil((scale - 1) * el.clientWidth / 2);
//		            max_pos_y = Math.ceil((scale - 1) * el.clientHeight / 2);
//		            if (posX > max_pos_x) posX = max_pos_x;
//		            if (posX < -max_pos_x) posX = -max_pos_x;
//		            if (posY > max_pos_y) posY = max_pos_y;
//		            if (posY < -max_pos_y) posY = -max_pos_y;
//		        }
//
//		        //pinch
//		        if(ev.type == "pinch") scale = Math.max(.999, Math.min(last_scale * (ev.scale), 4));
//		        if(ev.type == "pinchend") last_scale = scale;
//
//		        //panend
//		        if(ev.type == "panend") {
//		            last_posX = posX < max_pos_x ? posX : max_pos_x;
//		            last_posY = posY < max_pos_y ? posY : max_pos_y;
//		        }
//
//		        if (scale != 1) transform = "translate3d(" + posX + "px," + posY + "px, 0) " + "scale3d(" + scale + ", " + scale + ", 1)";
//		        if (transform) el.style.webkitTransform = transform;
//		    });
//		}
//	}
	
	
	//CID 내용이 있으면 파싱, 없으면 일반내용 표시
	function parseCIDAttachMailData(mail) {
		//console.log(mail);
		var mailBodyObj = angular.element(mail.Body);
		var img = mailBodyObj.find('img[src^="cid:"]');
		var tmpAttachMap = new Map();
		var toParseMailBody = mail.Body;
		
		if(img.length > 0) {
			for(var i = 0; i < img.length; i++) {
				var src = img.eq(i).attr('src');
				if(src != undefined) {
					var fileName = src.replace("cid:", "").split('@')[0];
					
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
		} else {
			var mailBody = angular.element(mail.Body);
			var approvalLink = mailBody.find('a[href*="/Workflow/Page/Link.aspx"]');
			var approvalLinkIndex = mail.Body.indexOf("/Workflow/Page/Link.aspx");
			
			if(approvalLinkIndex != -1) {
				var docID = approvalLink.attr('href').split('?')[1].split('=')[1];
				setTimeout(function(){
					var script = "javascript:btnToApprovalDetail('"+docID.trim()+"');";
					mail.Body = mail.Body.replace($rs.apiURL+"/Workflow/Page/Link.aspx?docId="+docID, script);//$rs.apiURL이 현재 https.
//					mail.Body = mail.Body.replace("http://ep.hd-bsnc.com/Workflow/Page/Link.aspx?docId="+docID, script);
					mail.HTMLBody = $sce.trustAsHtml(mail.Body);
				}, 200);
			} else {
				mail.HTMLBody = $sce.trustAsHtml(mail.Body);			
			}
		}
	}
	
	
	$rs.determineExtension = function(file) {
		var extension = file.FileName != undefined ? file.FileName.split('.').pop() : file.name.split('.').pop();
		extension = extension.toLowerCase();
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
	$s.maxZoom = 2;
	$s.currZoom = 1;
	$s.btnMailContentsZoomPlus = function() {
		$s.currZoom++;
		if($s.currZoom <= $s.maxZoom) {
			var el = angular.element('#mailDetailHTMLContents');
			el.css({
				webkitTransform : "translate3d(0, 0, 0) " + "scale3d(" + $s.currZoom + "," + $s.currZoom + ", 1) ",
				width : 'fit-content'
			});
		} else {
			$s.currZoom = $s.maxZoom;
		}
	};
	
	$s.btnMailContentsZoomMinus = function() {
		$s.currZoom--;
		if($s.currZoom >= $s.minZoom) {
			var el = angular.element('#mailDetailHTMLContents');
			el.css({
				webkitTransform : "translate3d(0, 0, 0) " + "scale3d(" + $s.currZoom + "," + $s.currZoom + ", 1) ",
				width : '100%'
			});
		} else {
			$s.currZoom = $s.minZoom;
		}
	};
	
	$s.resetZoomControl = function(){
		var el = angular.element('#mailDetailHTMLContents');
		var domDetailcontents = document.getElementById('mailDetailContents');
		domDetailcontents.scrollTop = 0;
		domDetailcontents.scrollLeft = 0;
		
		el.css({
			webkitTransform : "translate3d(0, 0, 0) " + "scale3d(1, 1, 1) ",
			width : '100%'
		});
		
		$s.currZoom = 1;
	}
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
	$s.isEditorShow = false;
	$s.txt_rcv_name = '';
	$s.txt_cc_name = '';
	$s.txt_hcc_name = '';
	
	var mailContents = angular.element('.wrap_contents');
	mailContents.on('click', function(){
		mailContents.find('iframe').focus();
	});
	
	$rs.$on('mailContentsReset', function(event){
		//에디터 내용 리셋
		$s.isEditorShow = true;
		var mailContents = angular.element('#mailContents');
		var frameMailContents = angular.element(mailContents.contents());
		frameMailContents.find('#btnResetBodyValue').trigger('click');
	});
	
	$s.popPage = function(currPageName) {
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
		$s.isEditorShow = false;
		
		var frameMailContents = angular.element(mailContents.contents());
		frameMailContents.find('#btnResetBodyValue').trigger('click');
		
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
		popPage(currPageName);
	}
	
	$rs.$on('initReplyForwardMailData', function(event, mail, data, list, mailType){
		$s.replyForwardMail = mail;
		$s.hasMailData = data;
		$s.mailType = mailType;
		$s.isEditorShow = true;
		
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
		
		setTimeout(function(){
			var mailContents = angular.element('#mailContents');
			var frameMailContents = angular.element(mailContents.contents());
			frameMailContents.find('#tmpMailContents').val($rs.mailData.Body);
			frameMailContents.find('#btnSetBodyValue').trigger('click');			
		},100);

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
			if($s.mailType == 2 || $s.mailType == 3 || $s.mailType == 4){
				files[0].FileName = files[0].name;
				files[0].FileSize = files[0].size;
				$s.attach_list.push(files[0]);
			} else {
				$s.attach_list.push(files[0]);
			}
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
		console.log(mailSendData);
		
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
		
		if(srch_keyword != undefined) {
			var reqAutoFillInsaData = {
				LoginKey:$rs.userInfo.LoginKey
			};
			
			//response에 displayName이 없음. 대신 Name 쓸것.
			var param = callApiObject('insa', 'insaAutoCompleteList', reqAutoFillInsaData);
			$http(param).success(function(data) {
				console.log(data);
				var code = data.Code;
				if(code == 1){
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

			var organParam = callApiObject('insa', 'insaFind', insaAutoCompleteData);
			$http(organParam).success(function(data) {
				var code = data.Code;
				var startStr = data.value.substring(0,1);
				
				if(code == '1' && (startStr === '{' || startStr === '[')) {
					var userData = JSON.parse(data.value);
					console.log(userData);
					var idx = 0;
					
					if(type === 'rcv') {
						idx = 0;
						$s.search_rcv_result = userData.Users;
						angular.element('.txt_rcv_name').trigger('blur');
					} else if(type === 'cc') {
						idx = 1;
						$s.search_cc_result = userData.Users;
						angular.element('.txt_cc_name').trigger('blur');
					} else if(type === 'hcc') {
						idx = 2;
						$s.search_hcc_result = userData.Users;
						angular.element('.txt_hcc_name').trigger('blur');
					}
				
					var lyrAutoComplete = angular.element('.search_user_list').eq(idx);
					if(!lyrAutoComplete.is(':visible')) {
						lyrAutoComplete.show();
						return;
					}
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
						LoginKey:$rs.userInfo.LoginKey
					};
					
					var param = callApiObject('insa', 'insaAutoCompleteList', reqAutoFillInsaData);
					$http(param).success(function(data) {
						var code = data.Code;
						if(code == 1){
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
			var arrUserInfo = user.DisplayName.split("/");
			user.UserName = arrUserInfo[0];
			user.PositionName = arrUserInfo[1];
			user.DeptName = arrUserInfo[2];
			user.CompName = arrUserInfo[3];
			$s.recipient_user_list.push(user);
			
			if(user.DisplayName == undefined){
				recipients.DisplayName = user.DisplayName;	
			}else{
				recipients.DisplayName = user.Name;
			}
			recipients.EMailAddress = user.EmailAddress;
		} else if(user.Type != undefined) {
			$s.recipient_user_list.push(user);
			if(user.DisplayName == undefined){
				recipients.DisplayName = user.DisplayName;				
			}else{
				recipients.DisplayName = user.Name;
			}
			recipients.EMailAddress = user.EmailAddress;
		}
		$s.TOrecipient_user_list.push(recipients);
		$s.txt_rcv_name = '';
		angular.element('.search_user_list').eq(0).hide();
	}
	
	$s.addCCSelectedUser = function(user) {
		var recipients = {};
		
		if(user.Type == undefined) {
			var arrUserInfo = user.DisplayName.split("/");
			user.UserName = arrUserInfo[0];
			user.PositionName = arrUserInfo[1];
			user.DeptName = arrUserInfo[2];
			user.CompName = arrUserInfo[3];
			$s.cc_user_list.push(user);
			
			recipients.DisplayName = user.DisplayName;
			recipients.EMailAddress = user.EmailAddress;
		} else if(user.Type != undefined) {
			$s.cc_user_list.push(user);
			
			recipients.DisplayName = user.DisplayName;
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
			var arrUserInfo = user.DisplayName.split("/");
			user.UserName = arrUserInfo[0];
			user.PositionName = arrUserInfo[1];
			user.DeptName = arrUserInfo[2];
			user.CompName = arrUserInfo[3];
			$s.hcc_user_list.push(user);
			
			recipients.DisplayName = user.DisplayName;
			recipients.EMailAddress = user.EmailAddress;
		} else if(user.Type != undefined) {
			$s.hcc_user_list.push(user);
			
			recipients.DisplayName = user.DisplayName;
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
	$s.isApprovalSortDDShow = false;
	$s.searchOption1Show = false;
	$s.searchOption2Show = false;
	$s.chkSortOrder = 'R';
	$s.DraftDeptSearch = '';
	$s.StartDate = '';
	$s.EndDate = '';
	
	$s.curSearchType1 = 0;
	$s.curSearchType2 = 0;
	$s.SearchType1 = 'TITLE';
	$s.SearchType2 = 'DRAFT';
	$s.SearchValue1 = '';
	$s.SearchValue2 = '';
	$s.SearchType1Name = '제목';
	$s.SearchType2Name = '기안자';
	
	$s.SearchType1Options = [
		{'value':'TITLE','name':'제목'},
		{'value':'BODY','name':'내용'}
	];
	$s.SearchType2Options = [
		{'value':'DRAFT','name':'기안자'},
		{'value':'REVIEW','name':'결재/합의자'},
		{'value':'CONTROL','name':'통제'},
		{'value':'ACCEPT','name':'담당'},
		{'value':'APPROVAL','name':'승인자'}
	];
	
//	ios datepicker webview 
	if ($rs.agent=='ios'){
		var elems = document.getElementsByClassName("txtDateSearch");

		for (var i = 0; i < elems.length; i++) {
		    elems[i].setAttribute("type", "date");
		}
	}
	
	$rs.$on('initSearchValue',function(event){
		$s.curSearchType1 = 0;
		$s.curSearchType2 = 0;
		$s.SearchType1 = 'TITLE';
		$s.SearchType2 = 'DRAFT';
		$s.SearchValue1 = '';
		$s.SearchValue2 = '';
		$s.SearchType1Name = '제목';
		$s.SearchType2Name = '기안자';
		$s.DraftDeptSearch = '';
		$s.StartDate = '';
		$s.EndDate = '';
	});
	
	$rs.$on('displayApprovalName', function(event, data){
		$s.displayName = data;
	});
	
	$rs.$on('initApprovalBox', function(event) {
		var param = callApiObject('mail', 'mailBoxs', {LoginKey:$rs.userInfo.LoginKey});
		$http(param).success(function(data) {
			var mailBoxList = JSON.parse(data.value);
			
			$rs.subMenuType = 'approval';
			$rs.subMenuList = mailBoxList;
			$rs.currSubMenu = mailBoxList[0].FolderId; 
			$rs.$broadcast('initApprovalList', mailBoxList[0].DisplayName);
		});
	});
	
	$rs.$on('initApprovalList', function(event, data) {
		$s.approvalListPage = 1;
		$s.displayName = data;
		
		//검색조건 초기화
		$rs.$broadcast('initSearchValue');
		
		var reqApprovalListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:20,
			PageNumber:$s.approvalListPage,
			FolderID:$rs.currSubMenu,
			SearchType1:$s.SearchType1,
			SearchValue1:$s.SearchValue1,
			SearchType2:$s.SearchType2,
			SearchValue2:$s.SearchValue2,
			DraftDeptSearch:$s.DraftDeptSearch,
			StartDate:$s.StartDate,
			EndDate:$s.EndDate,
			Sort:$s.chkSortOrder
		};
		
		var param = callApiObject('approval', 'approvalList', reqApprovalListData);
		$http(param).success(function(data) {
			var approvalList = JSON.parse(data.value);
			$rs.approvalList = approvalList.Approvals;
		}).then(function(){
			$timeout(function(){
				$rs.dialog_progress = false;
			}, 2000);
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
		$s.isApprovalSortDDShow = !$s.isApprovalSortDDShow;
	};
	
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
	
	$s.chooseSearchDate = function(type){
		if($rs.agent == 'android') {
			androidWebView.callDatePickerDialog(type);	
		} 
	}
	
	$s.searchType1Option = function() {
		if ($s.searchOption1Show == true) {
			$s.searchOption1Show = false;
		} else {
			$s.searchOption1Show = true;
		}
	};
	$s.applySearchType1 = function(index){
		$s.curSearchType1 = index;
		$s.SearchType1 = $s.SearchType1Options[index].value;
		$s.SearchType1Name = $s.SearchType1Options[index].name;
	}
	
	$s.searchType2Option = function() {
		if ($s.searchOption2Show == true) {
			$s.searchOption2Show = false;
		} else {
			$s.searchOption2Show = true;
		}
	};
	$s.applySearchType2 = function(index){
		$s.curSearchType2 = index;
		$s.SearchType2 = $s.SearchType2Options[index].value;
		$s.SearchType2Name = $s.SearchType2Options[index].name;
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
				} else {
					$s.approvalListPage--;
				}
			}, 500);
		}).then(function(){
			$timeout(function(){
				$rs.dialog_progress = false;
			}, 1000);
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
	        	scope.$root.dialog_progress = true;
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
		$rs.dialog_progress = true;

		$http.get(approvalData.BodyUrl).success(function(data) {
			console.log(approvalData.BodyUrl);
			$s.approvalBody = data;
		}).then(function(){ 
			$rs.dialog_progress = false;
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
					$s.processApprovalData = processResultJsonStr;
//					$s.processApprovalData = processResultJsonStr;
					$s.chkApprovalBtnStatus($s.processApprovalData);
					alert.log($s.processApprovalData);
				}
			}
		} else if($rs.agent=='ios') { 
			webkit.messageHandlers.loadComponent.postMessage(approvalData.ProcessUrl);				
			//ios callback json object
			callbackComponent = function (callbackData) {
				setTimeout(function(){
					$s.processApprovalData = JSON.parse(callbackData);					
					$s.chkApprovalBtnStatus($s.processApprovalData);					
				},500);
			}
			$rs.dialog_progress = false;
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
		angular.element('.btnApproval').addClass("hide");
		angular.element('.approvalState').addClass("full");
		
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
	$rs.snbCurrSelectedDeptCode = '';
	$s.addrCnt = 0;
	$s.organCnt = 0;
	$s.isTopOrgExpand = true;
	
	$rs.$on('initInsaList', function(event) {
		$s.tab_index = 2;
		$rs.topDeptCode = $rs.subMenuList.Depts[0];
		var currUserDepts = $rs.subMenuList;

		//조직도 맵으로 치환
//		$rs.insaTree = new Map();
//		$rs.insaTree.put($rs.topDeptCode.DeptCode, $rs.topDeptCode);
		recursiveOrganTree(currUserDepts, currUserDepts.Depts.length, 0);
	});
	
	$rs.findChildDept = function(dept, depth) {
		$rs.snbCurrSelectedDeptCode = dept.DeptCode;
		var maxDepth = parseInt(dept.DeptLevel, 10);
		searchDept(dept, depth, maxDepth);
		
//		if(depth == 1){
//			var a = angular.element('#'+dept.DeptCode);
//			if(a.parent().find('ul').length == 0) {
//				$rs.snbCurrSelectedDeptCode = dept.DeptCode;
//				var maxDepth = parseInt(dept.DeptLevel, 10);
//				searchDept(dept, depth, maxDepth);
//			} else {
//				dept.isExpand = true;
//			}
//		}else{
//			$rs.snbCurrSelectedDeptCode = dept.DeptCode;
//			var maxDepth = parseInt(dept.DeptLevel, 10);
//			searchDept(dept, depth, maxDepth);
//		}
	}
	
	$rs.btnCollapseTree = function(dept) {
		console.log(dept);
		if(dept.isExpand == undefined) {
			dept.isExpand = false;
		} else {
			dept.isExpand = !dept.isExpand;
		}
		console.log(dept);
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
			var reqInsaListAddrData = {
				LoginKey:$rs.userInfo.LoginKey,
				PageNumber:1,
				PageSize:20,
				SearchValue:$s.orgSearchKeyword
			};
			
			var addrParam = callApiObject('mail', 'mailAddressBook', reqInsaListAddrData);
			$http(addrParam).success(function(data) {
				console.log('addr : ' ,data);
				var code = JSON.parse(data.Code);
				if(code == 1){
					var result = JSON.parse(data.value);
					setTimeout(function(){
						$s.$apply(function(){
							$s.search_org_addr_list = result.Users;
							$s.addrCnt = $s.search_org_addr_list.length;
						});
					}, 500);					
				}else{
					$s.addrCnt = 0;
				}
			});
			
			var reqInsaListOrganData = {
				LoginKey:$rs.userInfo.LoginKey,
				Search:$s.orgSearchKeyword
			};
			
			var organParam = callApiObject('insa', 'insaFind', reqInsaListOrganData);
			$http(organParam).success(function(data) {
				console.log('find : ' ,data);
				var code = JSON.parse(data.Code);
				if(code==1){
					var result = JSON.parse(data.value);
					setTimeout(function(){
						$s.$apply(function(){
							$s.search_org_user_list = result.Users;
							$s.organCnt = $s.search_org_user_list.length;
						});
					}, 500);					
				}else{
					$s.organCnt = 0;
				}
			}).then(function(){
				setTimeout(function(){
					if($s.addrCnt > 0 && $s.organCnt == 0){
						$s.$apply(function(){
							$s.tab_index = 0;
						});
					}else{
						$s.$apply(function(){
							$s.tab_index = 1;
						});					
					}
				},1000);
			});
		} 
	};
	
	/*
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
				}, 500);
				
				angular.element('#organizationSearchKeyword').blur();
			});
		}
	};
	*/
	
	$s.determineProfileImg = function(user) {
		var rtnUrl = '';
		
		if(user.MyPhotoUrl.indexOf('//https') != -1) {
			console.log(1111);
			rtnUrl = 'https://' + user.MyPhotoUrl.substring(user.MyPhotoUrl.indexOf('//https')+10, user.MyPhotoUrl.length);
			try {
				$http.get(rtnUrl).error(function(data){
					user.MyPhotoUrl = '/resources/image/organization/org_user.png';
				});
			} catch(e) {
				user.MyPhotoUrl = '/resources/image/organization/org_user.png';
			}
		}else if(user.MyPhotoUrl.indexOf('http://') != -1) {
			console.log(2222);
			rtnUrl = user.MyPhotoUrl.replace('http', 'https');
			user.MyPhotoUrl = rtnUrl;
		}else if(user.MyPhotoUrl == ''){
			user.MyPhotoUrl = '/resources/image/organization/org_user.png';
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
			
			console.log(result);
			if(result.UserName == '') {
				result.UserName = user.UserName;
				result.CompName = user.CompName;
			}
			
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
	
	//펼치기 접기
//	$rs.btnExpandCollapse = function(obj){
//		if(obj.isExpand != undefined) {
//			obj.isExpand = !obj.isExpand;
//		} else {
//			obj.isExpand = false;
//		}
//	}
	
	//현재 로그인한 아이디가 속한 부서와 사용자 찾기
	function recursiveOrganTree(dept, maxDepth, currDepth) {
		if(currDepth < maxDepth) {
			setTimeout(function(){
				searchDept(dept.Depts[currDepth], currDepth, maxDepth);
				recursiveOrganTree(dept, maxDepth, ++currDepth);
			}, 100);
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
			}, 100);
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
			
//			for(var idx in dept){
//				if(!$s.orgMap.containsKey(dept[idx].DeptCode)){
//					$s.orgMap.put(dept[idx].DeptCode,{isChecked : false,isExpand : false});
//				}
//			}
//			console.log(dept);
//			console.log($s.orgMap);
			
			if(depth == maxDepth) {
				setTimeout(function(){
					$s.$apply(function(){
						$s.org_user_list = result.Users;
					});
				}, 200);
				
				$rs.snbCurrSelectedDeptCode = deptCode.DeptCode;
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
	$s.search_org_user_list = new Array();
	$s.search_org_addr_list = new Array();
	$s.orgSearchKeyword;
	$s.selectedOrganUser;
	$s.isProfileImgEnlarge = true;
	$s.addrCnt = 0;
	$s.organCnt = 0;
	
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
	
	//조직도 임직원 / 주소록 검색 결과
	$s.btnSearchOrgUserList = function(e) {
		if($s.orgSearchKeyword != '' && $s.orgSearchKeyword != undefined) {
			var reqInsaListAddrData = {
				LoginKey:$rs.userInfo.LoginKey,
				PageNumber:1,
				PageSize:20,
				SearchValue:$s.orgSearchKeyword
			};
			
			var addrParam = callApiObject('mail', 'mailAddressBook', reqInsaListAddrData);
			$http(addrParam).success(function(data) {
				
				var code = JSON.parse(data.Code);
				if(code == 1){
					var result = JSON.parse(data.value);
					setTimeout(function(){
						$s.$apply(function(){
							$s.search_org_addr_list = result.Users;
							$s.addrCnt = $s.search_org_addr_list.length;
							
						});
					}, 500);					
				}else{
					$s.addrCnt = 0;
				}
				
			});
			var reqInsaListOrganData = {
				LoginKey:$rs.userInfo.LoginKey,
				Search:$s.orgSearchKeyword
			};
			
			var organParam = callApiObject('insa', 'insaFind', reqInsaListOrganData);
			$http(organParam).success(function(data) {
				var code = JSON.parse(data.Code);
				if(code==1){
					var result = JSON.parse(data.value);
					setTimeout(function(){
						$s.$apply(function(){
							$s.search_org_user_list = result.Users;
							$s.organCnt = $s.search_org_user_list.length;
						});
					}, 500);					
				}else{
					$s.organCnt = 0;
				}
			}).then(function(){
				setTimeout(function(){
					if($s.addrCnt > 0 && $s.organCnt == 0){
						$s.$apply(function(){
							$s.tab_index = 0;
						});
					}else{
						$s.$apply(function(){
							$s.tab_index = 1;
						});					
					}
				},1000);
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
		}else if(user.MyPhotoUrl == ''){
			user.MyPhotoUrl = '/resources/image/organization/org_user.png';
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

			if(result.UserName == '') {
				result.UserName = user.UserName;
				result.CompName = user.CompName;
			}
			
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
		$s.addrCnt = 0;
		$s.organCnt = 0;
	}
}]);


//--------------------------------------------------------------------------------------------
//							2nd Modified
//--------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------
//아래 diaryScheduleController,scheduleWriteController 수정필요.
//Start - End
//--------------------------------------------------------------------------------------------

//Start
//달력 일정
//css line : 1354 ~
appHanmaru.controller('diaryScheduelController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout) {
	$s.isShowSelectDate = false;
	$s.isShowScheduleSearch = false;
	$s.isDlgScheduleDetail = false;
	$s.isDlgShareCalendar = false;
	$s.isDlgShareUser = false;
	
	$s.cal;
	$s.currSelectedDate;
	$s.currSelectedScheduleList;
	$s.scheduleListData;
	$s.currentYear;
	$s.currentMonth;
	$s.startDate = '';
	$s.endDate = '';
	$s.searchValue = '';
	$s.SearchTypeOptions = [
		{'name':'All','value':'전체'},
		{'name':'Title','value':'제목'},
		{'name':'Body','value':'본문'},
		{'name':'TitleBody','value':'제목+본문'},
		{'name':'Sender','value':'발신자'}
	];
	$s.searchType = $s.SearchTypeOptions[0].name;
	$s.txtSearchStart = '';
	$s.txtSearchEnd = '';
	$s.isCalendarSearch = false;
	$s.arrSearchResult;
	$s.arrShareCalendar;
	$s.arrShareUser;
	
	//todo 날짜 fucntion으로 바꿀것.
	$rs.$on('initWorkList', function(event) {
		var mnt = moment();
		
		if($s.currentYear == undefined) {
			$s.currentYear = mnt.format('YYYY');
		} else {
			$s.currentYear = mnt.year($s.currentYear).format('YYYY');
		}
		
		if($s.currentMonth == undefined) {
			$s.currentMonth = mnt.format('MM');
		} else {
			$s.currentMonth = mnt.month($s.currentMonth).format('MM');
		}
		 
		$s.startDate = mnt.startOf('month').format('YYYY-MM-DD');
		$s.endDate = mnt.endOf('month').format('YYYY-MM-DD');
//		console.log($s.currentYear + '-' + $s.currentMonth);
//		console.log($s.startDate + ' - ' + $s.endDate);
		
		var reqWorkTaskListData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate:$s.startDate,	
			EndDate:$s.endDate,	
			PageNumber : 1,
			PageSize : 15
		}
		
		//검색 할때만 parameter로 던질것!!
		if($s.searchType != '') {
			reqWorkTaskListData.SearchType = $s.searchType;
		}
		
		if($s.searchValue != '') {
			reqWorkTaskListData.SearchValue = $s.searchValue;
		}
 		
		var param = callApiObject('work', 'workList', reqWorkTaskListData);
		$http(param).success(function(data) {
			var workListData = JSON.parse(data.value);
			$s.scheduleListData = workListData;
			console.log(workListData);
		}).then(function(){
			// API에서 끌어온 필드를
			// FULLCALENDAR events 필드 목록에 맞게
			// 매핑시키는 작업이 필요
			// 매핑을 제외한 나머지 값들을 포함한 오브젝트를
			// 임의 속성으로 지정해서 값 할당, 이후 클릭 이벤트에서 재사용 하기 위함
			// 참고 : https://fullcalendar.io/docs
			var parseCalData = new Array();
			
			for(idx in $s.scheduleListData.Items) {
				var elem = $s.scheduleListData.Items[idx];
				var obj = {};
				obj.title = elem.Title;
				obj.start = elem.StartDate;
				obj.end = elem.EndDate;
				obj.color = '#'+elem.Color;
				obj.allDay = elem.AllDAyEvent;
				obj.elem = elem;
				parseCalData.push(obj);
			}

			//캘린더가 미정의 상태일 때 캘린더와 이벤트 정의
			if($s.cal == undefined) {
				$s.cal = angular.element('#calendar').fullCalendar({
					defaultView: 'month',
					columnHeader:true,
					navLinks: true,
					navLinkDayClick: function(date, jsEvent) {
					    $s.$apply(function(){
						    $s.isDlgScheduleDetail = true;
						    $s.currSelectedDate = date.format('YYYY-MM-DD dddd');
						    var formatDate = date.format();
						    console.log(formatDate);
						    $s.fetchScheduleDetailList(formatDate);
					    });
					},
				    events:parseCalData,
				    eventClick: function(calEvent, jsEvent, view) {
				    	var elem = calEvent.elem;
				    	elem.selectedDate = view.title;
				    	
				    	$s.$apply(function(){
				    		$s.isDlgScheduleDetail = true;
				    		$s.currSelectedDate = calEvent.start.format('YYYY-MM-DD dddd');
				    		var formatDate = calEvent.start.format('YYYY-MM-DD');
				    		$s.fetchScheduleDetailList(formatDate);
				    	});
				    }
				});

				$s.cal.hammer().on('swipeleft', function(e) {
					$s.cal.fullCalendar('next');
					$s.setScheduleTitle($s.cal);
					
				});
				$s.cal.hammer().on('swiperight', function(e) {
					$s.cal.fullCalendar('prev');
					$s.setScheduleTitle($s.cal);
				});
			} else {
				//캘린더가 정의 상태일 때 캘린더 데이터 교체
				$s.cal.fullCalendar('removeEvents'); 
				$s.cal.fullCalendar('addEventSource', parseCalData); 
			}
		});
	});
	
	//일정 타이틀(년.월) 변경
	$s.setScheduleTitle = function(cal) {
		var date = cal.fullCalendar('getDate');
		var formatYear = date.format('YYYY');
		var formatMonth = date.format('MM');
		
		$s.$apply(function(){
			$s.currentYear = formatYear;
			$s.currentMonth = formatMonth -1;
			$rs.$broadcast('initWorkList');
		});
	};
	
	//클릭 한 날짜의 정보를 가져옴
	$s.fetchScheduleDetailList = function(date) {
		var reqWorkTaskListData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate:date,	
			EndDate:date,
			PageNumber:1,
			PageSize:15
		};
		
		var workListData;
		var param = callApiObject('work', 'workList', reqWorkTaskListData);
		$http(param).success(function(data) {
			workListData = JSON.parse(data.value);
			console.log(data);
		}).then(function(){
			$s.currSelectedScheduleList = workListData.Items;
			console.log($s.currSelectedScheduleList);
		});
	};
	
	//오늘날짜
	$s.btnScheduleToday = function(){
		if($s.isCalendarSearch) {
			$s.isCalendarSearch = false;
			$s.searchType = '';			
			$s.searchValue = '';
		}
		
		var mnt = moment();
		$s.currentYear = mnt.format('YYYY');
		$s.currentMonth = mnt.format('MM') -1;
		
		$s.cal.fullCalendar('gotoDate', mnt.format('YYYY-MM'));
		$rs.$broadcast('initWorkList');
	};
	
	//검색
	$s.btnSearchSchedule = function() {
		$s.isCalendarSearch = true;
		var reqWorkTaskListData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate:$s.txtSearchStart,	
			EndDate:$s.txtSearchEnd,
			SearchType:$s.searchType,
			SearchValue:$s.searchValue,
			PageNumber:1,
			PageSize:99
		}
		
		var param = callApiObject('work', 'workList', reqWorkTaskListData);
		$http(param).success(function(data) {
			var workListData = JSON.parse(data.value);
			$s.arrSearchResult = workListData.Items;
		}).then(function(){
			$s.isShowScheduleSearch = false;
		});
	}
	
	$s.applySearchType = function(value) {
		$s.searchType = value;
	}
	
	$s.btnShowScheduleWrite = function(){
		$rs.pushOnePage('pg_schedule_write');
	}
	
	$s.btnShowScheduleWrite = function() {
		$rs.pushOnePage('pg_schedule_write');
		$rs.$broadcast('initScheduleWrite');
	}
	
	$s.scheduleDateSelectBtn = function(event){
		if($s.isShowScheduleSearch == true){
			$s.isShowScheduleSearch = false;
		}
		$s.isShowSelectDate = !$s.isShowSelectDate;
	}
	
	$s.scheduleSearchBtn = function(event){
		if($s.isCalendarSearch) {
			$s.isCalendarSearch = false;
			$s.arrSearchResult = undefined;
			return;
		}
		
		if($s.isShowSelectDate==true){
			$s.isShowSelectDate = false;
		}
		$s.isShowScheduleSearch = !$s.isShowScheduleSearch;
	}
	
	$s.toggleScheduleSearch = function(){
		$s.isShowScheduleSearch = !$s.isShowScheduleSearch;
	}
	
	$s.dismissDlgScheduleDetail = function(e) {
		$s.isDlgScheduleDetail = false;
		$s.currSelectedScheduleList = undefined;
		$s.currSelectedDate = undefined;
	}
	
	//공유캘린더 호출
	$s.btnShowShareCalendar = function(){
		$s.isDlgShareCalendar = true;
		var param = {
			LoginKey:$rs.userInfo.LoginKey
		}
		
		var param = callApiObject('work', 'workCalendar', param);
		$http(param).success(function(data) {
			console.log(data);
			var result = JSON.parse(data.value);
			$s.arrShareCalendar = result;
		}).then(function(){
		});
	}
	
	$s.btnToggleShareCalendar = function(cal) {
		if(cal.IsChecked == undefined || !cal.IsChecked) {
			cal.IsChecked = true;
		} else {
			cal.IsChecked = false;
		}
	}
	
	//공유칼렌더 적용
	$s.applyShareCalendar = function(e) {
		$s.isDlgShareCalendar = false;
	}
	
	//공유칼렌더 닫기
	$s.dismissDlgShareCalendar = function(e) {
		$s.isDlgShareCalendar = false;
	}
	
	//일정참고자 호출
	$s.btnShowShareUser = function(){
		$s.isDlgShareUser = true;
		
		var param = {
			LoginKey:$rs.userInfo.LoginKey
		}
		
		var param = callApiObject('work', 'workShareUser', param);
		$http(param).success(function(data) {
			var result = JSON.parse(data.value);
			$s.arrShareUser = result;
		}).then(function(){
		});
	}
	
	//일정참고자 추가
	$s.addShareUser = function(e) {
		$s.isDlgShareUser = false;
		//조직도 유저선택 호출
	}

	//일정참고자 적용
	$s.applyShareUser = function(e) {
		$s.isDlgShareUser = false;
	}

	$s.btnToggleShareUser = function(user) {
		if(user.IsChecked == undefined || !user.IsChecked) {
			user.IsChecked = true;
		} else {
			user.IsChecked = false;
		}
	}
	
	//일정참고자 닫기
	$s.dismissDlgShareUser = function(e) {
		$s.isDlgShareUser = false;
	}
}]);

//일정작성
appHanmaru.controller('scheduleWriteController', ['$scope', '$http', '$rootScope', function($s, $http, $rs) {
	$s.showDialog = false;
	$s.showContentsDetail = false;
	$s.isDlgScheduleWork = false;
	$s.isDlgScheduleResource = false;
	$s.selectedColor = '';
	
	//todo popPage 호출시 초기화 해줄것.
	$s.scheduleOpenData;
	$s.txtScheduleTitle = '';
	$s.scheduleContents = '';
	$s.uploadFileList = new Array();
	$s.deleteFileList = new Array();
	$s.dayType = 1; //기본 메일타입
	$s.fileType = 'S';//S=일정, T=작업, R=리포트, P=계획, M=템플릿
	$s.attach_list = new Array();
	$s.approvalKeyList = new Array(); 
	$s.shareUserList = new Array();
	$s.attendanceUserList = new Array();
	
	$rs.$on('initScheduleWrite',function(){
		var reqScheduleOpenData = {
				LoginKey:$rs.userInfo.LoginKey,
				WorkID : '',
				Template : '' 
			}
			
		var param = callApiObject('work','workScheduleWriteOpen',reqScheduleOpenData);
		$http(param).success(function(data){
			var scheduleOpenData = JSON.parse(data.value);
//			console.log(scheduleOpenData);
			$s.scheduleOpenData = scheduleOpenData;
		});
	});
	
	$s.popPage = function(currPageName) {
		popPage(currPageName);
		$s.txtScheduleTitle = '';
		$s.scheduleContents = '';
		$s.uploadFileList = new Array();
		$s.deleteFileList = new Array();
		$s.dayType = 1; //기본 메일타입
		$s.fileType = 'S';//S=일정, T=작업, R=리포트, P=계획, M=템플릿
		$s.attach_list = new Array();
		$s.approvalKeyList = new Array(); 
		$s.shareUserList = new Array();
		$s.attendanceUserList = new Array();
		$s.showContentsDetail = false;
	}
	
	$s.initAttachFile = function(){
		//여기에 하이브리드 기능 기술
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				
			}
		} else if($rs.agent == 'ios') {
			
		} else {
			
		}
	};
	
	$s.changeAttachFile = function(e){
		var files = e.target.files; // FileList 객체
		
		$s.$apply(function(){
			$s.attach_list.push(files[0]);
			$s.chooser_attach_file = undefined;

			var fd = new FormData();
			fd.append('LoginKey', $rs.userInfo.LoginKey);
			fd.append('GUID',$s.scheduleOpenData.GUID);
			fd.append('Type',$s.fileType);
			fd.append('file', files[0]);
						
			var param = callApiObjectNoData('work', 'workFileUpload');
			$http.post(param.url, fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			}).success(function(data) {
				var code = parseInt(data.Code, 10);
				
				if(code === 1) {
					$s.uploadFileList.push(files[0].name);
					console.log(data);
				}
			}).error(function(data){
				console.log(data);
			});
		});
//		console.log($s.attach_list);
	}
	
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
	
	$s.btnWriteSchedule = function(){
		var scheduleContents = angular.element('#scheduleContents');
		var frameMailContents = angular.element(scheduleContents.contents());
		frameMailContents.find('#btnGetBodyValue').trigger('click');
		var scheduleContents = frameMailContents.find('#tmpScheduleContents').val();
		$s.scheduleContents = scheduleContents;
		
		var reqSendScheduleData = {
			LoginKey:$rs.userInfo.LoginKey,
			GUID : $s.scheduleOpenData.GUID,	
			WorkID :'' ,	
			CalencarID : '',	
			Template : $rs.userInfo.EmailAddress,	
			Color : $s.selectedColor,	
			Title : $s.txtScheduleTitle,	
			AllDay : $s.dayType,	
			StartDate : $s.txtSearchStart, // 시간 포함 시 시간까지 같이 더해서 값 설정	
			EndDate : $s.txtSearchEnd, // 시간 포함 시 시간까지 같이 더해서 값 설정
			CreateUser : $rs.userInfo.EmailAddress,	
			AttendanceUser : $s.attendanceUserList,	
			ShareUser : $s.shareUserList,	
			ShareUserPermmistion : 5,	
			ParentTask : '',	
			ResourceKey : '',	
			ResourceName : '',	
			Body : $s.scheduleContents,	
			Approval : $s.approvalKeyList,	
			NewFileList : $s.uploadFileList,	
			DeleteFileList : $s.deleteFileList,	
		}
//		console.log(reqSendScheduleData);
		var param = callApiObject('work','workScheduleEdit',reqSendScheduleData);
		$http(param).success(function(data){
			try {
				var code = parseInt(data.Code, 10);
				if(code === 1) {
					setTimeout(function(){
						$s.popPage('pg_schedule_write');
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
	
	$s.showDetailContent = function(event){
		console.log($s.showContentsDetail);
		$s.showContentsDetail = !$s.showContentsDetail;
		console.log($s.showContentsDetail);
		
		var reqColorListData = {
			LoginKey:$rs.userInfo.LoginKey,
			IsExchange : 1
		}
		//색상
		var param = callApiObject('work','workColor',reqColorListData);
		$http(param).success(function(data){
			var colorList = JSON.parse(data.value);
			$s.scheduleColorList = colorList;
			console.log($s.scheduleColorList);
		});
		$s.setOptionColor = function(item){
		    var color;
		    return 'background:#'+color
		}
		$s.selectedOptionColor = function(selectedOptionColor){
			console.log(selectedOptionColor);
			$s.selectedColor = selectedOptionColor;
		}
		
	}
	
	//작업 선택
	$s.btnShowScheduleWork = function(){
		$s.isDlgScheduleWork = !$s.isDlgScheduleWork;

		var param = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate:$s.txtSearchStart,
			EndDate:$s.txtSearchEnd,
			PageNumber:1,
			PageSize:999
		}
		var param = callApiObject('work','workTaskList',param);
		$http(param).success(function(data){
			console.log(data);
			var result = JSON.parse(data.value);
			$s.arrScheduleWork = result.Items;
			console.log(result);
		}).then(function(){
			
		});
	}
	
	$s.applyScheduleWork = function(e){
		$s.isDlgScheduleWork = false;
	}
	
	$s.dismissDlgScheduleWork = function(e){
		$s.isDlgScheduleWork = false;
	}
	
	//자원예약 선택
	$s.btnShowScheduleResource = function(){
		$s.isDlgScheduleResource = !$s.isDlgScheduleResource;
		
		var param = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate:$s.txtSearchStart,
			EndDate:$s.txtSearchEnd,
			PageNumber:1,
			PageSize:999
		}
		
		var param = callApiObject('resource','resourceMyReservation',param);
		$http(param).success(function(data){
			console.log(data);
			var result = JSON.parse(data.value);
			$s.arrScheduleWork = result.Items;
			console.log(result);
		}).then(function(){
			
		});
	}
	
	$s.applyScheduleResource = function(e){
		$s.isDlgScheduleResource = false;
	}
	
	$s.dismissDlgScheduleResource = function(e){
		$s.isDlgScheduleResource = false;
	}
}])
.directive('workAttachFileChange', function() {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			//todo 수정할것.
			var onChangeHandler = scope.$eval(attrs.workAttachFileChange);
			element.on('change', onChangeHandler);
			element.on('$destroy', function() {
				element.off();
			});
		}
	};
});;

//END
//------------------------------------------------------------------------------------------------------------------------------

//작업목록
appHanmaru.controller('workTaskController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout) {
	$s.isTask = 1;
	$s.isShowTempleteDlg = false;
	$s.isShowTaskSearch = false;
	$s.selectedTemplate = 'efb84a1b-759d-4842-a980-7a0cacb62f9d';
	$s.taskList;
	$s.taskListPage = 1;
	$s.txtSearchStart = '';
	$s.txtSearchEnd   = '';
	$s.templateId = 'efb84a1b-759d-4842-a980-7a0cacb62f9d';
	$s.workTaskId = '';
	
	$s.SearchTypeOptions = [
		{'name':'All','value':'전체'},
		{'name':'Title','value':'제목'},
		{'name':'Body','value':'본문'},
		{'name':'TitleBody','value':'제목+본문'},
		{'name':'Sender','value':'발신자'}
	  ];
	
	$s.searchType = $s.SearchTypeOptions[0].name;
	
	$rs.$on('initTaskList',function(){
		var reqTaskListData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate : $s.txtSearchStart,
			EndDate : $s.txtSearchEnd,
			SearchType : $s.searchType,
			SearchValue : '',
			PageNumber : $s.taskListPage,
			PageSize : 15
		}
		
		var param = callApiObject('work','workTaskList',reqTaskListData);
		$http(param).success(function(data){
			var resTaskList = JSON.parse(data.value);
			$s.taskList = resTaskList.Items; 
		});
	});
	
	$s.selectWorkListTemplete = function(event){
		var reqTempleteData = {
			LoginKey:$rs.userInfo.LoginKey,
			IsTask : $s.isTask
		}
		//템플릿 가져오기
		var param = callApiObject('work','workTemplateListLite',reqTempleteData);
		$http(param).success(function(data){
			var resTempleteList = JSON.parse(data.value);
			$s.templeteList = resTempleteList; 
			$s.isShowTempleteDlg = !$s.isShowTempleteDlg;
		});
	}
	
	$s.closeTempleteDlg = function(event){
		$s.isShowTempleteDlg = !$s.isShowTempleteDlg;
	}
	
	//작업작성
	$s.aplyWorkListTemplete = function(event){
//		var elems = document.getElementsByName("selectTemplate");
//		for (var i = 0, length = elems.length; i < length; i++)
//		{
//		 if (elems[i].checked)
//		 	{
//				console.log(elems)
//				break;
//		 	}
//		}
		//선택된 template key값 받아오기(radio button)
		var reqTaskWriteOpenData = {
			LoginKey:$rs.userInfo.LoginKey,
			WorkID : $s.workTaskId,
			Template : $s.templateId
		}
		
		var param = callApiObject('work','workTaskWriteOpen',reqTaskWriteOpenData);
		$http(param).success(function(data){
			var sendData = JSON.parse(data.value);
			var code = parseInt(data.Code, 10);
			if(code === 1) {
				setTimeout(function(){
					$rs.pushOnePage('pg_task_write');
					$rs.$broadcast('initTaskWrite',sendData); //data가 아닌 특정값 넘겨주도록 수정
					$s.isShowTempleteDlg = false;
				}, 1000);
			} else if(code === -1) {
				alert(data.value);
			}
			
		});
	}
	
	$s.taskSearchBtn = function(event){
		$s.isShowTaskSearch = !$s.isShowTaskSearch;
	}
	
	$s.closeTaskDlg = function(event){
		$s.isShowTaskSearch = !$s.isShowTaskSearch;
	}
	
	$s.taskSearching = function(){
		$s.isShowTaskSearch = false;
		$s.taskListPage = 1;
		
		var reqTaskListData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate : $s.txtSearchStart,
			EndDate : $s.txtSearchEnd,
			SearchType : $s.searchType,	
			SearchValue : $s.taskSearchValue != undefined ? $s.taskSearchValue : '',	
			PageNumber : $s.taskListPage,
			PageSize : 15
		};
		
		reqTaskListData.StartDate = $s.txtSearchStart != undefined ? $s.txtSearchStart : '';
		reqTaskListData.EndDate = $s.txtSearchEnd != undefined ? $s.txtSearchEnd : '';
		
		var param = callApiObject('work','workTaskList', reqTaskListData);
		$http(param).success(function(data) {
			var resTaskList = JSON.parse(data.value);
			console.log(resTaskList.Items);
			$s.taskList = resTaskList.Items;
		});
	}
	
	$s.applySearchType = function(value){
		$s.searchType = value;
	}
	
	$s.moveTaskView = function(event, taskListItem){
		$rs.pushOnePage('pg_task_view');
		$rs.$broadcast('initTaskDetailView',taskListItem);
	}
	
}]);

//작업 상세보기
appHanmaru.controller('taskViewController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.workId;
	$s.templateId = '';
	$s.workType = 2;//구분(1:일정, 2:작업, 3:보고서, 4:계획)
	$s.resTaskDetail;
	$s.selectOrganUser = false;
	$s.selectOranUserInfo;
	
	$rs.$on('initTaskDetailView',function(event,taskListItem){
		$s.workId = taskListItem.WorkID;
		$s.templateId = taskListItem.Template;
		$s.isProfileImgEnlarge = true;
		
		console.log(taskListItem);
		
		var reqTaskDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			WorkID : $s.workId,
			Template : $s.templateId
		}
		console.log(reqTaskDetailData);
		var param = callApiObject('work','workTaskView',reqTaskDetailData);
		$http(param).success(function(data){
			console.log(data);
			$s.resTaskDetail = JSON.parse(data.value);
		});
	});
	
	$s.openTaskViewDialog = function(shareUser) {
		var reqInsaUserData = {
			LoginKey:$rs.userInfo.LoginKey,
			EmailAddress:shareUser.Key
		};
		
		var param = callApiObject('insa', 'insaUserDetail', reqInsaUserData);
		$http(param).success(function(data) {
			var result = JSON.parse(data.value);
			
			if(result.UserName == '') {
				result.UserName = user.UserName;
				result.CompName = user.CompName;
			}
			
			$s.selectOranUserInfo = $s.determineProfileImg(result);
			$s.selectOrganUser = true;
			
			console.log($s.selectOranUserInfo);
		});
	}
	
	$s.closeTaskViewDialog = function(){
		$s.selectOrganUser = false;
	}
	
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
		
		return user;
	}
	
	$s.toggleProfileEnlarge = function() {
		$s.isProfileImgEnlarge = !$s.isProfileImgEnlarge;
	}
	
	$s.getFileSizeUnit = function(value){
		return getFileSizeUnit(value);
	}
	
	$s.taskModify = function(event){
		$rs.$broadcast('initTaskWrite',$s.resTaskDetail);
		console.log($s.resTaskDetail);
		$rs.pushOnePage('pg_task_write');
	};
	
	$s.taskDelete = function(event){
		var reqTaskDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			WorkID : $s.workId,
			WorkType : $s.workType
		}
		var param = callApiObject('work','workDelete',reqTaskDetailData);
		$http(param).success(function(data){
			console.log(data);
			popPage('pg_task_view');
			$rs.$broadcast('initTaskList');
		});
	}
}]);

//작업 작성하기
appHanmaru.controller('workWriteController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.guId = '';
	$s.workId = '';
	$s.templateId = 'efb84a1b-759d-4842-a980-7a0cacb62f9d';
	$s.selectedColor = '';
	$s.taskTitle = '';
	$s.startDate = '2018-11-29 08:00';
	$s.endDate = '2018-11-30 08:00';
	$s.createUser = '' ;
	$s.attendanceUser = new Array();
	$s.shareUser = new Array();
	$s.parentTask = '';
	$s.taskContents = ''; //body 타입 확인할것(html / string 둘다 안됨)
	$s.approval = new Array();
	$s.uploadFileList = new Array();
	$s.deleteFileList = new Array();
	$s.scheduleColorList = new Array(); 
	$s.attach_list = new Array();
	$s.fileType = 'T';//S=일정, T=작업, R=리포트, P=계획, M=템플릿
//	LoginKey : 로그인 인증 키
//	GUID : OPEN API 호출 후 리턴 받은 값
//	WorkID : 신규일때는 공백, 수정일때는 이전 키값(GUID와 동일)
//	Template : 템플릿키
//	Color : 색 값(ex: ffffff)
//	Title : 제목
//	StartDate : 시작 날짜 (ex:2017-08-18 21:00)
//	EndDate : 종료 날짜 (ex:2017-08-18 23:00), 종일 일정일 경우 +1, (ex : 18일 종일 일정이면 2017-08-19)
//	CreateUser : 생성자 메일 주소
//	AttendanceUser : 담당자 메일 주소(Array형 이나 1명만 선택, 다수일때는 첫번째만 입력됨)
//	ShareUser : 공유자 메일 주소(Array형 문자열
//	ParentTask : 부모 작업키
//	Body : 본문
//	Approval : 결재 키 값(Array형 문자열)
//	NewFileList : 첨부파일 이름(Array형 문자열)
//	DeleteFileList : 삭제할 첨부파일(Array형 문자열), 뷰에서 리턴 된 첨파일 URL 그대로 보내면 됨
	$rs.$on('initTaskWrite',function(event,data){
		$s.guId = data.GUID;
		$s.createUser = $rs.userInfo.EmailAddress;

		//색상
		var reqColorListData = {
			LoginKey:$rs.userInfo.LoginKey,
			IsExchange : 0
		}
		var param = callApiObject('work','workColor',reqColorListData);
		$http(param).success(function(data){
			var colorList = JSON.parse(data.value);
			$s.scheduleColorList = colorList;
		});
		
		if(data.WorkID != undefined && data.WorkID != ''){
			$s.taskTitle = data.Title;
			if(data.ShareUser.length > 0){
				$s.shareUser = data.ShareUser;
			}
			$s.taskContents = data.BodyUrl; //파싱처리 할 것.
		}
	});
	
	$s.selectedOptionColor = function(selectedOptionColor){
		$s.selectedColor = selectedOptionColor;
	}
	
	$s.btnWriteWork = function(event){
//		if($s.isMailSend) {
//			alert("메일을 보내는 중입니다.\n잠시만 기다려 주세요");
//			return;
//		}
//		$s.isMailSend = true;
		
		var reqEditWorkData = {
			LoginKey : $rs.userInfo.LoginKey,
			GUID : $s.guId,
			WorkID : $s.workId,
			Template : $s.templateId,
			Color : $s.selectedColor,
			Title : $s.taskTitle,
			StartDate : $s.startDate,
			EndDate : $s.endDate,
			CreateUser : $s.createUser,
			AttendanceUser : $s.attendanceUser,
			ShareUser : $s.shareUser,
			ParentTask : $s.parentTask,
			Body : $s.taskContents,
			Approval : $s.approval,
			NewFileList : $s.uploadFileList,
			DeleteFileList : $s.deleteFileList
		}
		
		if($s.taskTitle == '' || $s.taskTitle == undefined) {
			alert("제목을 입력해 주세요");
			return;
		}
		
		console.log(reqEditWorkData);
		
		var param = callApiObject('work','workTaskEdit',reqEditWorkData);
		$http(param).success(function(data){
			console.log(data);
			popPage('pg_task_write');
			$rs.$broadcast('initTaskList');
		});
	};
	
	$s.changeAttachFile = function(e){
		var files = e.target.files; // FileList 객체
		
		$s.$apply(function(){
			//수정일때는 따로 분기 처리할 것.
			$s.attach_list.push(files[0]);
			
			$s.chooser_attach_file = undefined;
			var fd = new FormData();
			fd.append('LoginKey', $rs.userInfo.LoginKey);
			fd.append('GUID',$s.guId);
			fd.append('Type',$s.fileType);
			fd.append('file', files[0]);
			
			var param = callApiObjectNoData('work', 'workFileUpload');
			$http.post(param.url, fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			}).success(function(data) {
				var code = parseInt(data.Code, 10);
				
				if(code === 1) {
					$s.uploadFileList.push(files[0].name);
					console.log(data);
				}
			}).error(function(data){
				console.log(data);
			});
		});
	}
	
	$s.btnRemoveAttach = function(index) {
		$s.deleteFileList.push($s.attach_list[index].name);
		$s.attach_list.splice(index, 1);
	}
	
	$s.initAttachFile = function(){
		//여기에 하이브리드 기능 기술
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				
			}
		} else if($rs.agent == 'ios') {
			
		} else {
			
		}
	};
	
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
	};
	
	$s.popPage = function(currentPage){
		$s.guId = '';
		$s.workId = '';
		$s.templateId = '';
		$s.selectedColor = '';
		$s.taskTitle = '';
		$s.startDate = '';
		$s.endDate = '';
		$s.createUser = '' ;
		$s.attendanceUser = new Array();
		$s.shareUser = new Array();
		$s.parentTask = '';
		$s.taskContents = '';
		$s.approval = new Array();
		$s.uploadFileList = new Array();
		$s.deleteFileList = new Array();
		$s.scheduleColorList = new Array(); 
		$s.attach_list = new Array();
		$s.fileType = 'T';
		
		popPage(currentPage);
	};
	
}]).directive('workDiaryAttachFileChange', function() {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var onChangeHandler = scope.$eval(attrs.workDiaryAttachFileChange);
			element.on('change', onChangeHandler);
			element.on('$destroy', function() {
				element.off();
			});
		}
	};
});

//보고서 목록
appHanmaru.controller('reportListController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout) {
	$s.reportListPage = 1;
	$s.reportList;
	$s.isShowReportSearch = false;
	$s.reportSearchValue = '';
	$s.txtSearchStart = '';
	$s.txtSearchEnd = 	'';
	$s.isTask = 0;
	$s.templateId = '165bbaae-485f-499f-91a9-a66b5fcb378d';
	$s.workId = '';
	
	$s.SearchTypeOptions = [
		{'name':'All','value':'전체'},
		{'name':'Title','value':'제목'},
		{'name':'Body','value':'본문'},
		{'name':'TitleBody','value':'제목+본문'},
		{'name':'Sender','value':'발신자'}
	  ];
	
	$s.searchType = $s.SearchTypeOptions[0].name;
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
	
	$rs.$on('initReportList',function(){
		var reqReportData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate : $s.txtSearchStart,
			EndDate : $s.txtSearchEnd,	
			SearchType : $s.searchType,	
			SearchValue : $s.reportSearchValue,	
			PageNumber : $s.reportListPage,
			PageSize : 20
		}
		
		var param = callApiObject('work','workReportList',reqReportData);
		$http(param).success(function(data){
			var resReportList = JSON.parse(data.value);
			$s.reportList = resReportList.Items;
		});
	});
	
	$s.selectWorkListTemplete = function(event){
		var reqTempleteData = {
			LoginKey:$rs.userInfo.LoginKey,
			IsTask : $s.isTask
		}
		//템플릿 가져오기
		var param = callApiObject('work','workTemplateListLite',reqTempleteData);
		$http(param).success(function(data){
			console.log(data)
			var resTempleteList = JSON.parse(data.value);
			$s.templeteList = resTempleteList; 
			$s.isShowTempleteDlg = !$s.isShowTempleteDlg;
		});
	}
	
	$s.closeTempleteDlg = function(event){
		$s.isShowTempleteDlg = !$s.isShowTempleteDlg;
	}
	
	$s.reportSearchBtn = function(event){
		$s.isShowReportSearch = !$s.isShowReportSearch;
	}
	
	$s.closeReportDlg = function(event){
		$s.isShowReportSearch = !$s.isShowReportSearch;
	}
	
	$s.reportSearching = function(){
		$s.isShowReportSearch = false;
		$s.reportListPage = 1;
		
		var reqReportListData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate : $s.txtSearchStart,
			EndDate : $s.txtSearchEnd,
			StartDate : $s.txtSearchStart,
			EndDate :	$s.txtSearchEnd,
			SearchType : $s.searchType,	
			SearchValue : $s.reportSearchValue != undefined ? $s.reportSearchValue : '',	
			PageNumber : $s.reportListPage,
			PageSize : 20
		};
		reqReportListData.StartDate = $s.txtSearchStart != undefined ? $s.txtSearchStart : '';
		reqReportListData.EndDate = $s.txtSearchEnd != undefined ? $s.txtSearchEnd : '';
		
		var param = callApiObject('work','workReportList', reqReportListData);
		$http(param).success(function(data) {
			var resReportList = JSON.parse(data.value);
			$s.reportList = resReportList.Items;
		});
	}
	
	$s.applySearchType = function(value){
		$s.searchType = value;
	}
	
	//보고서작성
	$s.aplyWorkListTemplete = function(event){
		//선택된 template key값 받아오기(radio button)
		var reqReportWriteOpenData = {
			LoginKey:$rs.userInfo.LoginKey,
			WorkID : $s.workId,
			Template : $s.templateId
		}
		
		var param = callApiObject('work','workReportWriteOpen',reqReportWriteOpenData);
		$http(param).success(function(data){
			var sendData = JSON.parse(data.value);
			var code = parseInt(data.Code, 10);
			if(code === 1) {
				setTimeout(function(){
					$rs.pushOnePage('pg_report_write');
					$rs.$broadcast('initReportWrite',sendData); //data 넘겨주는게 아니라 특정값 넘겨주도록 수정할것.
					$s.isShowTempleteDlg = false;
				}, 1000);
			} else if(code === -1) {
				alert(data.value);
			}
		});
	}
	
	$s.moveReportView = function(event, reportListItem){
		$rs.pushOnePage('pg_report_view');
		$rs.$broadcast('initReportDetailView',reportListItem);
	}
}]);

//보고서 상세보기
appHanmaru.controller('reportViewController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.workId;
	$s.templateId;
	$s.workType = 3;//구분(1:일정, 2:작업, 3:보고서, 4:계획)
	$s.resReportDetail;
	
	$rs.$on('initReportDetailView',function(event,reportListItem){
		$s.workId = reportListItem.WorkID;
		$s.templateId = reportListItem.Template;
		
		var reqReportDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			WorkID : $s.workId,
			Template : $s.templateId
		}
		var param = callApiObject('work','workReportView',reqReportDetailData);
		$http(param).success(function(data){
			var resReportDetail = JSON.parse(data.value);
			//이곳에 view 그려줄것.
			console.log(resReportDetail);
			$s.resReportDetail = resReportDetail;
		});
	});
	
	$s.reportModify = function(event){
		$rs.$broadcast('initReportWrite',$s.resReportDetail);
		$rs.pushOnePage('pg_report_write');
	};
	
	$s.reportDelete = function(event){
		var reqReportDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			WorkID : $s.workId,
			WorkType : $s.workType
		}
		
		console.log(reqReportDetailData);
		var param = callApiObject('work','workDelete',reqReportDetailData);
		$http(param).success(function(data){
			console.log(data);
			popPage('pg_report_view');
			$rs.$broadcast('initReportList');
		});
	}
}]);
//보고서 작성하기
appHanmaru.controller('reportWriteController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.guId = '';
	$s.workId = '';
	$s.templateId = '165bbaae-485f-499f-91a9-a66b5fcb378d';
	$s.reportTitle = '';
	$s.createUser = '' ;
	$s.shareUser = new Array();
	$s.reportContents = ''; //body paramater 확인해볼것.
//	LoginKey : 로그인 인증 키
//	GUID : OPEN API 호출 후 리턴 받은 값
//	WorkID : 신규일때는 공백, 수정일때는 이전 키값(GUID와 동일)
//	Template : 템플릿키
//	Title : 제목
//	CreateUser : 생성자 메일 주소
//	ShareUser : 공유자 메일 주소(Array형 문자열)
//	Body : 본문
	
	$rs.$on('initReportWrite',function(event,data){
		$s.guId = data.GUID;
		$s.createUser = $rs.userInfo.EmailAddress;

		if(data.WorkID != undefined && data.WorkID != ''){
			$s.reportTitle = data.Title;
			if(data.ShareUser.length > 0){
				$s.shareUser = data.ShareUser;
			}
			$s.reportContents = data.BodyUrl; //파싱처리 할 것.
		}
	});
	
	$s.btnWriteReport = function(event){
		var reqEditReportData = {
			LoginKey : $rs.userInfo.LoginKey,
			GUID : $s.guId,
			WorkID : $s.workId,
			Template : $s.templateId,
			Title : $s.reportTitle,
			CreateUser : $s.createUser,
			ShareUser : $s.shareUser,
			Body : $s.reportContents,
		};
		console.log(reqEditReportData);
		var param = callApiObject('work','workReportEdit',reqEditReportData);
		$http(param).success(function(data){
			console.log(data);
			popPage('pg_report_write');
			$rs.$broadcast('initReportList');
		});
	};
	
	$s.popPage = function(currentPage){
		$s.guId = '';
		$s.workId = '';
		$s.templateId = '';
		$s.reportTitle = '';
		$s.createUser = '' ;
		$s.shareUser = new Array();
		$s.reportContents = ''; //body paramater 확인해볼것.
		
		popPage(currentPage);
	}
}]);

//업무계획 목록
appHanmaru.controller('planListController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout) {
	$s.planListPage = 1;
	$s.planList;
	$s.isShowPlanSearch = false;
	$s.searchType='';
	$s.searchValue='';
	$s.txtSearchStart = '';
	$s.txtSearchEnd = 	'';
	$s.isTask = 0;
	$s.templeteList;
	$s.isShowTempleteDlg = false;
	$s.templateId = '165bbaae-485f-499f-91a9-a66b5fcb378d';
	$s.workId = '';
	
	$s.SearchTypeOptions = [
		{'name':'All','value':'전체'},
		{'name':'Title','value':'제목'},
		{'name':'Body','value':'본문'},
		{'name':'TitleBody','value':'제목+본문'},
		{'name':'Sender','value':'발신자'}
	  ];
	$s.searchType = $s.SearchTypeOptions[0].name;
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
	
	$rs.$on('initPlanList',function(){
		var reqPlanData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate : $s.txtSearchStart,
			EndDate : $s.txtSearchEnd,	
			SearchType : $s.searchType,	
			SearchValue : $s.searchValue,	
			PageNumber : $s.planListPage,
			PageSize : 15
		}
		
		var param = callApiObject('work','workPlanList',reqPlanData);
		$http(param).success(function(data){
			var resPlanList = JSON.parse(data.value);
			console.log(resPlanList.Items);
			$s.planList = resPlanList.Items; 
		});
	});
	
	$s.planSearchBtn = function(event){
		$s.isShowPlanSearch = !$s.isShowPlanSearch;
	}
	
	$s.closePlanDlg = function(event){
		$s.isShowPlanSearch = !$s.isShowPlanSearch;
	}
	
	$s.planSearching = function(event){
		$s.isShowPlanSearch = false;
		$s.planListPage = 1;
		
		var reqPlanListData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate : $s.txtSearchStart,
			EndDate : $s.txtSearchEnd,
			SearchType : $s.searchType,	
			SearchValue : $s.SearchValue != undefined ? $s.SearchValue : '',	
			PageNumber : $s.planListPage,
			PageSize : 15
		};
		
		reqPlanListData.StartDate = $s.txtSearchStart != undefined ? $s.txtSearchStart : '';
		reqPlanListData.EndDate = $s.txtSearchEnd != undefined ? $s.txtSearchEnd : '';
		
		var param = callApiObject('work','workPlanList', reqPlanListData);
		$http(param).success(function(data) {
			var resPlanList = JSON.parse(data.value);
			console.log(resPlanList);
			$s.planList = resPlanList.Items;
		});
	}
	
	$s.applySearchType = function(value){
		$s.searchType = value;
		console.log(value);
	}
	
	$s.planWriteBtn = function(event){
		var reqTempleteData = {
			LoginKey:$rs.userInfo.LoginKey,
			IsTask : $s.isTask
		}
		var param = callApiObject('work','workTemplateListLite',reqTempleteData);
		$http(param).success(function(data){
			console.log(data);
			var resTempleteList = JSON.parse(data.value);
			$s.templeteList = resTempleteList;
			$s.isShowTempleteDlg = !$s.isShowTempleteDlg;
		});
	}
	
	$s.closeTempleteDlg = function(event){
		$s.isShowTempleteDlg = !$s.isShowTempleteDlg;
	}
	
	//계획작성
	// api return error
	$s.aplyWorkListTemplete = function(event){
//		var reqPlanOpenData = {
//			LoginKey:$rs.userInfo.LoginKey,
//			WorkID : $s.workId,
//			Template : $s.templateId
//		}
//		var param = callApiObject('work','workPlanWriteOpenView',reqPlanOpenData);
//		console.log(param);
//		$http(param).success(function(data){
//			var sendData = JSON.parse(data.value);
//			var code = parseInt(data.Code, 10);
//			if(code === 1) {
//				setTimeout(function(){
//					$rs.$broadcast('initPlanWrite');
//					$rs.pushOnePage('pg_plan_write',sendData);
//					$s.isShowTempleteDlg = false;
//				}, 1000);
//			} else if(code === -1) {
//				alert(data.value);
//			}
//		});
		$rs.$broadcast('initPlanWrite');
		$rs.pushOnePage('pg_plan_write',sendData);
		$s.isShowTempleteDlg = false;
	}
	
	$s.movePlanView = function(event, planListItem){
		$rs.pushOnePage('pg_plan_view');
		$rs.$broadcast('initPlanDetailView',planListItem);
	}
	
}]);

//업무계획 상세보기
appHanmaru.controller('planViewController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.workId;
	$s.templateId;
	$s.workType = 4;//구분(1:일정, 2:작업, 3:보고서, 4:계획)
	$s.planTitle;
	$s.planDetailData;
	
	$rs.$on('initPlanDetailView',function(event,planListItem){
		$s.workId = planListItem.WorkID;
		$s.templateId = planListItem.Template;
		
		var reqPlanDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			WorkID : $s.workId,
			Template : $s.templateId
		}
		var param = callApiObject('work','workPlanView',reqPlanDetailData);
		$http(param).success(function(data){
			var resReportDetail = JSON.parse(data.value);
			//이곳에 view 그려줄것.
			console.log(resReportDetail);
			$s.planDetailData = resReportDetail;
		});
	});
	
	$s.planDelete = function(event){
		var reqPlanDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			WorkID : $s.workId,
			WorkType : $s.workType
		}
		
		var param = callApiObject('work','workDelete',reqPlanDetailData);
		$http(param).success(function(data){
			console.log(data);
			popPage('pg_plan_view');
			$rs.$broadcast('initPlanList');
		});
	};
	
	$s.planModify = function(event){
		$rs.$broadcast('initReportWrite',$s.resReportDetail);
		$rs.pushOnePage('pg_plan_write');
	};
	
}]);

//업무계획 작성하기
appHanmaru.controller('planWriteController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.guId = '';
	$s.workId = '';
	$s.templateId = '165bbaae-485f-499f-91a9-a66b5fcb378d';
	$s.planTitle = '';
	$s.createUser = '';
	$s.shareUser = new Array();
	$s.planContents = '';//paramater 확인해볼것.
//	LoginKey : 로그인 인증 키
//	GUID : OPEN API 호출 후 리턴 받은 값
//	WorkID : 신규일때는 공백, 수정일때는 이전 키값(GUID와 동일)
//	Template : 템플릿키
//	Title : 제목
//	CreateUser : 생성자 메일 주소
//	ShareUser : 공유자 메일 주소(Array형 문자열)
//	Body : 본문
	$rs.$on('initPlanWrite',function(event,data){
		$s.guId = data.GUID;
		$s.createUser = $rs.userInfo.EmailAddress;

		if(data.WorkID != undefined && data.WorkID != ''){
			$s.planTitle = data.Title;
			if(data.ShareUser.length > 0){
				$s.shareUser = data.ShareUser;
			}
			$s.planContents = data.BodyUrl; //파싱처리 할 것.
		}
	});
	
	$s.btnWritePlan = function(event){
		var reqEditPlanData = {
			LoginKey:$rs.userInfo.LoginKey,
			GUID : s.guId,
			WorkID : $s.workId,	
			Template : $s.templateId,	
			Title : $s.planTitle,	
			CreateUser : $s.createUser,	
			ShareUser : $s.shareUse,	
			Body : $s.planContents
		}
		
		var param = callApiObject('work','workPlanEdit',reqPlanDetailData);
		$http(param).success(function(data){
			console.log(data);
			popPage('pg_plan_write');
			$rs.$broadcast('initPlanList');
		});
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

function logicTest() {
	var j = 0;
	for (var i = 0; test.Response.Result.PremBnfs[4].ViewData.LC_TotalPremiumPaid.length > i; i++) {
		if (test.Response.Result.PremBnfs[4].ViewData.LC_TotalPremiumPaid[i].Value == "607000.00") {
			j++
		}
	}
}