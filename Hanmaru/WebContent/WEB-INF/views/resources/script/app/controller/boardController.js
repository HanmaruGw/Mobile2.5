
// board
appHanmaru.controller('boardListController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$rs.curr_board_id = ''
	$s.displayName = '';
	$s.masterID = '';
	$s.pageSize  = 20;
	$s.pageNumber = 1;
	$s.searchKeyword = '';
	$s.boardList = new Array();
	$s.boardType = '';
	$s.isProfileImgEnlarge = true;
	$s.boardSearchShow = false;
	$s.searchOptionShow = false;
	
  	
  	$rs.$on('initSearchValue',function(event){
  		$s.SearchTypeOptions = [
  			{'value':'SubjectContents','name' : $rs.translateLanguage('subjectbody') },
  			{'value':'Subject','name':$rs.translateLanguage('subject') },
  			{'value':'Contents','name':$rs.translateLanguage('body') },
  			{'value':'RegUserName','name':$rs.translateLanguage('reg_user_name') },
  		  ];
  		
		$s.searchKeyword = '';
		$s.SearchType = $s.SearchTypeOptions[0].value;
	  	$s.SearchName = $s.SearchTypeOptions[0].name;
	  	$s.curSearchType = 0;
	});
  	
  	$rs.$on('initBoardBox',function(){
  		var param = callApiObject('board', 'boardBoxs',{LoginKey:$rs.userInfo.LoginKey,CompanyCode:$rs.userInfo.CompCode});
		$http(param).success(function(data) {
			var boxList = JSON.parse(data.value);
			$rs.subMenuList = boxList;
			$rs.subMenuType = 'board';
			$rs.$broadcast('initBoardList',boxList[0].BoardType,boxList[0].MasterID,boxList[0].Name);
			$rs.currSubMenu = boxList[0].MasterID;
			
			var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
			pushPage(pageName, 'pg_board_list');
		});
  	});
	
	$rs.$on('initBoardList',function(event,boardType,masterID,displayName){
		$rs.dialog_progress = true;
		$s.boardSearchShow = false;
		$s.displayName = displayName;
		$s.boardType = boardType;
		$s.masterID = masterID;
		
		// 검색조건 초기화
		$rs.$broadcast('initSearchValue');
		
		var reqBoardData = {
			LoginKey : $rs.userInfo.LoginKey,
			BoardType : $s.boardType,
			MasterID : $s.masterID,
			Page : $s.pageNumber,
			PageSize : $s.pageSize,
			SearchField : $s.SearchType,
			SearchKeyword : $s.searchKeyword
		};
		var param = callApiObject('board', 'boardList',reqBoardData);
		
		$http(param).success(function(data) {
			var boardData = JSON.parse(data.value);
			$s.boardList = boardData.Boards;
			
		}).then(function(){
			$timeout(function(){
				$rs.dialog_progress = false;
			}, 1000);
		});;
	});
	
	
	// 다음페이지 읽기
	$s.readBoardNextPage = function(){
		$s.pageNumber++;
		
		var reqBoadrListData = {
			LoginKey : $rs.userInfo.LoginKey,
			BoardType : $s.boardType,
			MasterID : $s.masterID,
			Page : $s.pageNumber,
			PageSize : $s.pageSize,
			SearchField : $s.SearchType,
			SearchKeyword : $s.searchKeyword
		};

		var param = callApiObject('board', 'boardList', reqBoadrListData);
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
	
	// 공지 리스트 중 하나 클릭 시 공지사항 상세 화면 이동
	$rs.boardDetail = function(board, boardType, displayName) {
		//게시판 들어갔을때 항상 위에서부터 시작되도록 수정
		$('.boardContentsWrap').scrollTop(0);
		if(boardType != ''){ // 메인에서 접근할 경우 boardType존재, 게시판에서 접근할 경우 boardType ''
			$s.boardType = boardType;
		}
		$rs.curr_board_id = board.BoardID;
		// 공지사항 Request 정보 세팅
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
		
	}
	
	$s.btnSearchBoard = function(event){
		$s.pageNumber = 1;
		
		var reqBoardData = {
			LoginKey : $rs.userInfo.LoginKey,
			BoardType : $s.boardType,
			MasterID : $s.masterID,
			Page : $s.pageNumber,
			PageSize : $s.pageSize,
			SearchField : $s.SearchType,
			SearchKeyword : $s.searchKeyword
		}
		var param = callApiObject('board', 'boardList',reqBoardData);
		
		$http(param).success(function(data) {
			var boardData = JSON.parse(data.value);
			$s.boardList = boardData.Boards;
			$s.boardSearchShow = false;
			
		});
}
	
}]);

appHanmaru.controller('boardDetailController', ['$scope', '$http', '$rootScope', '$timeout','$sce', function($s, $http, $rs, $timeout,$sce) {
	$rs.$on('initBoardDetail', function(event, boardData, displayName) {
		$s.displayName = displayName;
		$s.boardDetailData = boardData;
		$s.selectOrganUser = false;
		$rs.dialog_progress = true;
		$s.isProfileImgEnlarge = true;
		$s.regUserName = '';
		
		$s.boardContents = $sce.trustAsHtml(boardData.Contents);
		
		var regUserNameArray = boardData.RegUserName.split("/");
		$s.regUserName = regUserNameArray[0];
		
//		$rs.isIOS = false;
//		if($rs.agent == 'ios'){
//			$rs.isIOS = true;
//			$s.iosVideoSrc = "http://play.smartucc.kr/player.php?origin=177a38a2d62d98b5e5b630cbef974f2a";
//		}
		
		// 공지사항 상세정보
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
		
		//게시글 스크롤 초기화
		
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
	
	// (공통)첨부파일 다운로드
	$s.btnDownloadAttachFile = function(index, fileURL, fileName) {
		// 여기에 하이브리드 기능 기술
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.downloadAttachFile(fileURL, fileName);
			}
			
		} else if($rs.agent == 'ios') {
			webkit.messageHandlers.iosDownloadAttachFile.postMessage({fileURL:fileURL,fileName:fileName});
		}
	}
	
	// ios file download success return
	iosDownloadSuccess = function() {
		$rs.result_message = $rs.translateLanguage('message_dont_open_file');
		$rs.dialog_toast = true;
		
		setTimeout(function(){
			$rs.$apply(function(){
				$rs.dialog_toast = false;
			});
		}, 10000);
	};
	
}]);