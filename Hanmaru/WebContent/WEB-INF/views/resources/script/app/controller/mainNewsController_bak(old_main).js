// mainController
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
	
	$s.bannerImageList = new Array();
	
	$rs.$on('initMainBox', function(event) {
		var param = callApiObject('board', 'boardBoxs', {LoginKey:$rs.userInfo.LoginKey,CompanyCode:''});
		$http(param).success(function(data) {
			var boardData = JSON.parse(data.value);
			
			//2020.03.24 추가 - Funla 게시판 제거
			let a = [ {f1: 1, f2: 2}, {f1: 3, f2: 4} ] 
			const itemToFind = boardData.find(function(item) {return item.MasterID == '4678'})
			const idx = boardData.indexOf(itemToFind) 
			if (idx > -1) boardData.splice(idx, 1);
			
			$rs.subMenuType = 'main';
			$rs.subMenuList = boardData;
			
			$rs.$broadcast('initMainList',boardData);
			
			var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
			pushPage(pageName, 'pg_main_list');
		});
	});
	
	$rs.$on('initMainList',function(event,boardData){
		
		
		$rs.dialog_progress = true;
		var param = callApiObject('main', 'mainBoxs', {LoginKey:$rs.userInfo.LoginKey});
		$http(param).success(function(data) {
			var mainData = JSON.parse(data.value);
			$s.mainData = mainData;
//			console.log('main data  :',mainData);
			$s.headSubject = mainData.Head.Subject;
			$s.headImage = mainData.Head.Image;

			$s.hallaInList = mainData.HallaMessage; //19.11.25 변경
			
			$s.noticeList = mainData.Notice; //공지사항
			$s.pressList = mainData.Press; //Funla
			$s.coronaList = mainData.CoronaVirus; //코로나 대응 게시판

			//배너
			if($rs.userInfo.CompCode == '00005'){
//				$s.bannerImage = '/resources/image/main/banner_00005.jpg';
				$s.bannerImageList = [{Image:'/resources/image/main/banner_00005.jpg'}];
			}else{
				if(mainData.Banner.length < 1){
					$s.bannerImage = mainData.Banner2[0].Image;
					$s.bannerUrl = mainData.Banner2[0].LinkURL;
					//이미지 슬라이드
					$s.bannerImageList = mainData.Banner2;
				}else{
					$s.bannerImage = mainData.Banner[0].Image;
					$s.bannerUrl = mainData.Banner[0].LinkURL;
					//이미지 슬라이드
					$s.bannerImageList = mainData.Banner;
				}
			}
			
			$rs.dialog_progress = false;
		}).then(function(){
			$rs.dialog_progress = false;
		});
	});
	
	// 배너Url
	$s.btnMainBanner = function(banner){
		//만도 배너 url 분기처리
		if($rs.agent == 'android'){
			if($rs.userInfo.CompCode === '00005'){
				if(androidWebView != undefined) androidWebView.withMandoBanner($rs.userInfo.Sabun);
			}else{
				window.open(banner.LinkURL,'_blank');
			}
		}else if($rs.agent=='ios') {
			if($rs.userInfo.CompCode === '00005'){
				webkit.messageHandlers.withMandoBannerIos.postMessage($rs.userInfo.Sabun);
			}else{
				window.open(banner.LinkURL,'_blank');
			}
			webkit.messageHandlers.sendDownloadUrl.postMessage(banner.LinkURL);
		}
	};
	
	$s.btnMainPage = function(){
		$rs.loadMenu('main');
	};
	$s.btnWorkDiaryPage = function(){
		$rs.loadMenu('work');
	};
	$s.btnMailPage = function(){
		$rs.loadMenu('mail');
	};
	$s.btnApprovalPage = function(){
		$rs.loadMenu('approval');
	};
	$s.btnBoardPage = function(){
		$rs.loadMenu('board');
	};
	$s.btnOrganPage = function(){
		$rs.loadMenu('insa');
	};
	$s.btnResourcePage = function(){
		$rs.loadMenu('reserv');
	};
	
	//공지사항
	$s.btnPartnerMore = function(){
		$s.boardType = $s.noticeList[0].BoardType;
		$s.masterID = $s.noticeList[0].MasterID;
		var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
		$s.displayName = '공지사항';
		pushPage(pageName, 'pg_board_list');
		$rs.$broadcast('initBoardList',$s.boardType,$s.masterID,$s.displayName);
	};
	
	//코로나 대응 게시판 추가 - 2020.03.24
	$s.btnCoronaMore = function(){
		$s.boardType = $s.coronaList[0].BoardType;
		$s.masterID = $s.coronaList[0].MasterID;
		$s.displayName = '코로나 대응 상황 데일리 리포트';
		var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
		pushPage(pageName, 'pg_board_list');
		$rs.$broadcast('initBoardList',$s.boardType,$s.masterID,$s.displayName);
	}
	
	//Funla
//	$s.btnOrganMore = function(){
//		$s.boardType = $s.pressList[0].BoardType;
//		$s.masterID = $s.pressList[0].MasterID;
//		$s.displayName = 'Funla';
//		var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
//		pushPage(pageName, 'pg_board_list');
//		$rs.$broadcast('initBoardList',$s.boardType,$s.masterID,$s.displayName);
//	};
}]);