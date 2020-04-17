// mainController
appHanmaru.controller('mandoMainController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
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
	
	$rs.$on('initMandoMain', function(event) {
		var param = callApiObject('board', 'boardBoxs', {LoginKey:$rs.userInfo.LoginKey,CompanyCode:''});
		$http(param).success(function(data) {
			var boardData = JSON.parse(data.value);
			
			//2020.03.24 추가 - Funla 게시판 제거
			const itemToFind = boardData.find(function(item) {return item.MasterID == '4678'})
			const idx = boardData.indexOf(itemToFind) 
			if (idx > -1) boardData.splice(idx, 1);
			
			$rs.subMenuType = 'main';
			$rs.subMenuList = boardData;
			
			console.log('user 계열사  :', $rs.userCompMainView);
			
			//여기서 계열사별 구분 예정.
			$rs.$broadcast('initMandoMainList',boardData);
//			$rs.$broadcast('initMandoMain',boardData);
//			
			var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
//			pushPage(pageName, 'pg_main_list');
			
			console.log('현재 페이지 : ',pageName);
			pushPage(pageName, 'pg_main_mando_view');
		});
	});
	
	
	$rs.$on('initMandoMainList',function(event,boardData){
		$('.mainContentsDiv').scrollTop(0);
		
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
			
			
			//만도 게시판 추가 테스트 데이터
			$s.companyBoardList = $s.noticeList;
			$s.newsBoardList = $s.noticeList;
			
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
	
	$s.mandoCompanyTabId = 1;
	//만도 메인
	$s.toggleMandoCompanyTab = function(tabIdx){
		$s.mandoCompanyTabId = tabIdx;
	}
	$s.selectBottomArea = function(area){
		switch(area){
			case 'PyeongTaek' :
				console.log('탭 번호 : ',$s.mandoCompanyTabId);
				alert('평택');
				break;
			case 'Wonju' :
				console.log('탭 번호 : ',$s.mandoCompanyTabId);
				alert('원주');
				break;
			case 'Iksan' :
				console.log('탭 번호 : ',$s.mandoCompanyTabId);
				alert('익산');
				break;
			case 'Global' :
				console.log('탭 번호 : ',$s.mandoCompanyTabId);
				alert('글로벌');
				break;
		}
	}
	//community zone
	$s.companyBoardTab = 0;
	$s.selectCompanyBoardTab = function(idx){
		$s.companyBoardTab = idx;	
		//테스트 데이터
		switch(idx){
			case 0 : //경조사
				$s.companyBoardList = $s.noticeList;		
				break;
			case 1 : //복지게시판
				$s.companyBoardList = $s.pressList;		
				break;
			case 2 : //감사합니데이
				$s.companyBoardList = $s.coronaList;		
				break;
			case 3 : //소통채널 만통
				$s.companyBoardList = $s.noticeList;		
				break;
		}
	}
	//Mando News
	$s.companyNewsTab = 0;
	$s.selectCompanyNewsTab = function(idx){
		$s.companyNewsTab = idx;	
		//테스트 데이터
		switch(idx){
			case 0 : //경조사
				$s.newsBoardList = $s.noticeList;		
				break;
			case 1 : //복지게시판
				$s.newsBoardList = $s.pressList;		
				break;
			case 2 : //감사합니데이
				$s.newsBoardList = $s.coronaList;		
				break;
			case 3 : //소통채널 만통
				$s.newsBoardList = $s.noticeList;		
				break;
		}
	}
	
	//한라뉴스 전체보기 - 테스트 데이터
	$s.selectHallaNews = function(){
		$s.boardType = $s.hallaInList[0].BoardType;
		$s.masterID = $s.hallaInList[0].MasterID;
		var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
		$s.displayName = '한라뉴스';
		pushPage(pageName, 'pg_board_list');
		$rs.$broadcast('initBoardList',$s.boardType,$s.masterID,$s.displayName);
	}
	
	//인기콘텐츠 전체보기 - 테스트 데이터
	$s.selectHallaTube = function(){
		$s.boardType = $s.hallaInList[0].BoardType;
		$s.masterID = $s.hallaInList[0].MasterID;
		var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
		$s.displayName = '인기콘텐츠';
		pushPage(pageName, 'pg_board_list');
		$rs.$broadcast('initBoardList',$s.boardType,$s.masterID,$s.displayName);
	}
	
}]);