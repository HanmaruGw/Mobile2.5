
// approval List
appHanmaru.controller('approvalController', ['$scope', '$http', '$rootScope', '$timeout', '$location', '$anchorScroll', '$window', function($s, $http, $rs, $timeout, $location, $anchorScroll, $window) {
	$s.isApprovalSortDDShow = false;
	$s.searchOption1Show = false;
	$s.searchOption2Show = false;
	$s.chkSortOrder = 'R';
	$s.DraftDeptSearch = '';
	$s.StartDate = '';
	$s.EndDate = '';
	//2019.10.23 추가 - jh.j
	$rs.isApprovalBottomLoading = false;
	//2019.10.23 추가끝
	
//	$s.curSearchType1 = 0;
//	$s.curSearchType2 = 0;
//	$s.SearchType1 = 'TITLE';
//	$s.SearchType2 = 'DRAFT';
//	$s.SearchValue1 = '';
//	$s.SearchValue2 = '';
//	$s.SearchType1Name = '제목';
//	$s.SearchType2Name = '기안자';
//	
	
	$rs.$on('initSearchValue',function(event){
		
		$s.SearchType1Options = [
			{'value':'TITLE','name': $rs.translateLanguage('subject')},
			{'value':'BODY','name': $rs.translateLanguage('contents')}
		];
		$s.SearchType2Options = [
			{'value':'DRAFT','name': $rs.translateLanguage('search_type_draft')},
			{'value':'REVIEW','name':$rs.translateLanguage('search_type_review')},
			{'value':'CONTROL','name':$rs.translateLanguage('search_type_control')},
			{'value':'ACCEPT','name':$rs.translateLanguage('search_type_accept')},
			{'value':'APPROVAL','name':$rs.translateLanguage('search_type_approval')}
		];
		
		$s.curSearchType1 = 0;
		$s.curSearchType2 = 0;
		$s.SearchType1 = 'TITLE';
		$s.SearchType2 = 'DRAFT';
		$s.SearchValue1 = '';
		$s.SearchValue2 = '';
		$s.SearchType1Name = $rs.translateLanguage('subject');
		$s.SearchType2Name = $rs.translateLanguage('search_type_draft');
		$s.DraftDeptSearch = '';
		$s.StartDate = '';
		$s.EndDate = '';
	});
	
	$rs.$on('displayApprovalName', function(event, data){
		$s.displayName = data;
	});
	
	$rs.$on('initApprovalBox', function(event) {
		var param = callApiObject('approval', 'approvalBoxs', {LoginKey:$rs.userInfo.LoginKey});
		$http(param).success(function(data) {
			var boxList = JSON.parse(data.value);
			
			$rs.subMenuType = 'approval';
			$rs.subMenuList = boxList;
			
			for(idx in boxList) {
				if(boxList[idx].FolderId === 'ARRIVE') {
					$rs.currSubMenu = boxList[idx].FolderId;
					$rs.$broadcast('initApprovalList', boxList[idx].DisplayName);
					break;
				} 
			};
			var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
			pushPage(pageName, 'pg_approval_list');
		});
	});
	
	$rs.$on('initApprovalList', function(event, data) {
		$rs.dialog_progress = true;
		$s.approvalListPage = 1;
		$s.displayName = data;
		
		// 검색조건 초기화
		$rs.$broadcast('initSearchValue');
		
		//2019.11.11 수정
		//검색 기준 : 3개월 전 문서만 불러오도록 수정.
//		if($rs.currSubMenu === 'ARRIVE'){
//			var now = moment(new Date()).format("YYYY-MM-DD");
//			var yearAgo = moment(new Date()).subtract(3, 'months').format("YYYY-MM-DD");
//			$s.txtSearchStart = yearAgo;
//			$s.txtSearchEnd = now;
////			$s.txtSearchStart = '';
////			$s.txtSearchEnd = '';
//		}else{
//			var now = moment(new Date()).format("YYYY-MM-DD");
//			var yearAgo = moment(new Date()).subtract(3, 'months').format("YYYY-MM-DD");
//			$s.txtSearchStart = yearAgo;
//			$s.txtSearchEnd = now;
//		}
		var now = moment(new Date()).format("YYYY-MM-DD");
		var yearAgo = moment(new Date()).subtract(3, 'months').format("YYYY-MM-DD");
		$s.txtSearchStart = yearAgo;
		$s.txtSearchEnd = now;
		
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
			StartDate:$s.StartDate = $s.txtSearchStart != undefined ? $s.txtSearchStart : '',
			EndDate:$s.EndDate = $s.txtSearchEnd != undefined ? $s.txtSearchEnd : '',
			Sort:$s.chkSortOrder
		};
		
		var param = callApiObject('approval', 'approvalList', reqApprovalListData);
		$http(param).success(function(data) {
			var approvalList = JSON.parse(data.value);
			$rs.approvalList = approvalList.Approvals;
			
			$rs.dialog_progress = false;
		}).then(function(){
			$timeout(function(){
				$rs.dialog_progress = false;
			}, 1000);
		});
	});
	
	// 결재 리스트 클릭 시 상세 또는 리스트 선택
	$rs.approvalDetail = function(e, approval, displayName) {
		$rs.dialog_progress = true;
		$rs.CURR_APPROVAL_ID = approval.ApprovalID;
		
		// 결재 상세
		var reqApprovalData = {
			LoginKey:$rs.userInfo.LoginKey,
			ApprovalID:approval.ApprovalID
		};
		
		
		var param = callApiObject('approval', 'approval', reqApprovalData);
		$http(param).success(function(data) {
			var approvalData = JSON.parse(data.value);
//			console.log('결재 : ', approvalData);
			
			//2020.01.29 추가
			//메일에서 결재 상세 페이지 열때 상단 헤더에 제목 변경하기 위함.
			//미결,반려 결재문서는 기본 온라인 문서고 리스트에 표기되지 않음.
			if(displayName=="온라인 문서고"){
			    if(approvalData.State =="Process"){
			        displayName="미결함";
			    }else if(approvalData.State =="Reject"){
			        displayName="반려함";
			    }
			}
			
			for(idx in $rs.approvalList) {
				var tmpApproval = $rs.approvalList[idx];
				
				if(approval.ApprovalID === tmpApproval.ApprovalID) {
					$rs.approvalList[idx].ReadDate=new Date();
					break;
				}
			}
			$rs.dialog_progress = false;
			
			$rs.pushOnePage('pg_approval_view');
			$rs.$broadcast('initApprovalDetail', approvalData, displayName);
		});
	}
	
	// 검색 다이얼로그
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
			androidWebView.callApprovalDatePickerDialog(type);	
		} 
	}
	
	$s.getApprovalReadState = function(ReadDate){
		if(ReadDate != ""){
			return '7px solid #BCBEC1';
		}else{
			return '7px solid #4E86FF';
		}
	}
	
	// android bridge result
	window.setApprovalSearchDate = function(type, value) {
		$s.$apply(function() {
			if(type === 'start') {
				$s.txtSearchStart = value;
			} else if(type === 'end') {
				$s.txtSearchEnd = value;
			}
		});
	}
	
// ios datepicker webview
	if ($rs.agent=='ios'){
		var elems = document.getElementsByClassName("txtDateSearch");
		for (var i = 0; i < elems.length; i++) {
		    elems[i].setAttribute("type", "date");
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

	// 검색
	$s.btnSearchApproval = function(type) {
		$s.approvalListPage = 1;
		$rs.dialog_progress = true;
		
		var reqApprovalListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:20,
			PageNumber:$s.approvalListPage,
			FolderID:$rs.currSubMenu,
			Sort:$s.chkSortOrder,
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
		console.log(param);
		
		$http(param).success(function(data) {
			var approvalList = JSON.parse(data.value);
			$rs.approvalList = approvalList.Approvals;
			 console.log($rs.approvalList);
			
			var contents = angular.element('.viewContents');
			contents.animate({scrollTop : 0}, 200);
		}).then(function(){
			$rs.dialog_progress = false;
		});
		$rs.isApprovalSearchDDShow = false;
	}
	
	// 정렬 열렸는지 확인
	$s.chkSortVisible = function(e){
		var target = angular.element(e.target);
		if(target.hasClass('ic_sort') || target.hasClass('approval_sort')) {
			$s.isApprovalSortDDShow = true;
		} else {
			$s.isApprovalSortDDShow = false;
		}
	}
	
	// 다음페이지 읽기
	$s.readApprovalNextPage = function(){
// //console.log($rs.currSubMenu);
		//2019.10.23 추가 - jh.j
		$rs.isApprovalBottomLoading = true;
		//2019.10.23 추가끝
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
					$rs.result_message = $rs.translateLanguage('last_list');
					$rs.dialog_toast = true;
				}
				//2019.10.23 추가 - jh.j
				$rs.isApprovalBottomLoading = false;
				//2019.10.23 추가끝
			}, 500);
			$rs.dialog_progress = false;
		}).then(function(){
			$timeout(function(){
				$rs.dialog_toast = false;
			}, 1000);
		});
	}
	
	// event receive after approval process in success
	$rs.$on('applyDeleteApprovalList', function(event, approval) {
		for(idx in $rs.approvalList) {
			var tmpApproval = $rs.approvalList[idx];
			
			// console.log(approval.ApprovalID + " / " +
			// tmpApproval.ApprovalID);
			
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
	    	pullThreshold: 50,
	        maxPullThreshold: 0,
	        'callback': function(e) {
	        	//angular.element('.pull-indicator.approval').hide();
	        	scope.$apply(attr.ngXpull);
	        	scope.$root.$broadcast('initApprovalList', scope.displayName);
	        	//scope.$root.dialog_progress = true;
	        	return;
	        }
	    });
	};
})
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
						scope.$apply(fn);
					}
				} else{
					if((el.scrollTop + clientHeight + 0.5) >= el.scrollHeight){
						scope.$apply(fn);
					}
				}
			
			});
		}
	};
});

// approval view
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
		$s.tabIdx = 0; //결재현황 탭 idx
		
		$rs.dialog_progress = true;
		
		//화면 초기화
//		angular.element(".wrapBodyContents").find('*').remove();

		//결재문서 이미지
//		$http.get(approvalData.BodyUrl).success(function(data) {
//			$s.approvalBody = data;
//			console.log(data);
//		}).then(function(){ 
//			$rs.dialog_progress = false;
//		});
		
//		console.log('결재 data : ',approvalData);
		
//		var tmpContents = angular.element("#approvalBodyContents1").clone();
//		tmpContents.pinchzoomer();
		
		//결재 문서 로드
//		setTimeout(function(){
//			var tmpContents = angular.element("#tmpApprovalBodyContents").clone();
//			angular.element(".wrapBodyContents").find('*').remove();
//			angular.element(".wrapBodyContents").append(tmpContents);
//			tmpContents.pinchzoomer();
//			
//			// 결재 본문 높이 조절
//			setTimeout(function(){
//				
//				var elem = angular.element(".wrapBodyContents");
//				var elemFirstDiv = elem.find('div').eq(0);
//				var elemSecondDiv = elemFirstDiv.find('div').eq(0);
//				var elemThirdDiv = elemSecondDiv.find('div').eq(0);
//				var elemDivImg = elemThirdDiv.find('img').eq(0);
//				
//				elemFirstDiv.css({'user-select':'','-webkit-user-drag':'','touch-action':''});
//				elemThirdDiv.css({'overflow':'','user-select':'','-webkit-user-drag':'','touch-action':''});
//				elemDivImg.css({'user-select':'','-webkit-user-drag':'','touch-action':'auto'});
//				
//				//모바일 디바이스가 아닌 일반 웹에서 확인시 progress 없애기 위함.
//				$s.$apply(function() {
//					$rs.dialog_progress = false;
//				});
//			},2000); //높이조절 delay. 문서로드 이후에 해야함.
//			
//			//결재 본문 이미지 높이값 설정.
//			var viewContentsTitle = angular.element('.viewContentsTitle');
//			var titleWrap = angular.element('.titleWrap');
//			var viewContentsDetail = angular.element('.viewContentsDetail');
//			viewContentsDetail.height(viewContentsTitle.height() - titleWrap.innerHeight());
//		}, 10); //문서 로드 delay
		
//		console.log('결재 data : ',approvalData);
		
		setTimeout(function(){
			setDocumentHeight(setDocumentScroll);
		},10);
		
		function setDocumentHeight(callback){
			var tmpContents = angular.element("#tmpApprovalBodyContents").clone();
			angular.element(".wrapBodyContents").find('*').remove();
			angular.element(".wrapBodyContents").append(tmpContents);
			
			tmpContents.pinchzoomer();
			
			//결재 본문 이미지 높이값 설정.
			var viewContentsTitle = angular.element('.viewContentsTitle');
			var titleWrap = angular.element('.titleWrap');
			var viewContentsDetail = angular.element('.viewContentsDetail');
			viewContentsDetail.height(viewContentsTitle.height() - titleWrap.innerHeight());
			
			//모바일 디바이스가 아닌 일반 웹에서 확인시 progress 없애기 위함.
			$s.$apply(function() {
				$rs.dialog_progress = false;
			});
			
			if(typeof callback == 'function'){
				setTimeout(function(){
					callback(true);
				},2000);
			}
		}
		
		function setDocumentScroll(result){
			if(result){
				var elem = angular.element(".wrapBodyContents");
				var elemFirstDiv = elem.find('div').eq(0);
				var elemSecondDiv = elemFirstDiv.find('div').eq(0);
				var elemThirdDiv = elemSecondDiv.find('div').eq(0);
				var elemDivImg = elemThirdDiv.find('img').eq(0);
				
				elemFirstDiv.css({'user-select':'','-webkit-user-drag':'','touch-action':''});
				elemThirdDiv.css({'overflow':'','user-select':'','-webkit-user-drag':'','touch-action':''});
				elemDivImg.css({'user-select':'','-webkit-user-drag':'','touch-action':'auto'});
			}
		};
		
		
		if($rs.currSubMenu === 'ARRIVE') { //미결함
			angular.element('.btnApproval').removeClass("hide");
			angular.element('.approvalState').removeClass("full");
		}else{
			if($rs.currSubMenu === 'PROCESS') { //기결함
				angular.element('.btnApproval').addClass("hide");
				angular.element('.approvalState').addClass("full");
			}
			else if($rs.currSubMenu === 'DRAFT'){ //기안함
				angular.element('.btnApproval').addClass("hide");
				angular.element('.approvalState').addClass("full");
			}
			else{ //메일에서 타고 들어왔을때 
				if(approvalData.State =="Process"){
			        //진행중
			    	angular.element('.btnApproval').removeClass("hide");
					angular.element('.approvalState').removeClass("full");
			    }else{
			    	angular.element('.btnApproval').addClass("hide");
					angular.element('.approvalState').addClass("full");
			    }
			}
		    
		}
		
		// 결재 하이브리드 기술
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.loadProcessURL(approvalData.ProcessUrl);//결재용 웹뷰 로드. 꼭 필요함.
				
				setTimeout(function(){
					androidWebView.parseProcessUrl(approvalData.ProcessUrl);
				}, 1000);
				
				// aos callback json object
				window.applyProcessUrl = function(processResultJsonStr) {
//					console.log(processResultJsonStr);
					$s.processApprovalData = processResultJsonStr;
					$s.chkApprovalBtnStatus($s.processApprovalData);
					
				}
			}
		} else if($rs.agent=='ios') { 
			webkit.messageHandlers.loadComponent.postMessage(approvalData.ProcessUrl);				
			// ios callback json object
			callbackComponent = function (callbackData) {
//				setTimeout(function(){
					$s.processApprovalData = JSON.parse(callbackData);					
					$s.chkApprovalBtnStatus($s.processApprovalData);					
//				},1000);
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
			} 
		};
		
		$s.chkApprovalBtnStatus($s.processApprovalData);

		// 승인,반려 등 버튼 이벤트
		$s.btnProcessApproval = function(cmd) {
			console.log('결재 cmd : ',cmd);
			if(cmd === 'Reject') {
				if($s.processApprovalOpinion == '') {
					alert($rs.translateLanguage('approval_opinion_hint'));
					return;
				}
			}
			
			var chkConfirm = confirm($rs.translateLanguage('confirm_approval_text'));
			if(chkConfirm) {
				doApproval(cmd, $s.processApprovalOpinion);
			}
		}
	});
	
	//2020.03.26 수정 - 결재현황 탭 변경.
	$s.selectApprovalTab = function(idx){
		$s.tabIdx = idx;
	}
	
	$s.toggleApprovalDetailDD = function(e){
		$s.isApprovalDetailDDShow = !$s.isApprovalDetailDDShow;
	};
	
	$s.toggleApprovalProcessDD = function(e){
		$s.hasProcessApprovalData = !(JSON.stringify($s.processApprovalData) === JSON.stringify({}));
		if(!$s.hasProcessApprovalData) {
			alert($rs.translateLanguage('loading_approval_text'));
			return;
		}
		
		$s.isApprovalProcessDDShow = !$s.isApprovalProcessDDShow;
		$s.isApprovalStatusDDShow = false;
		$s.isApprovalAttachDDShow = false;
		// $s.processApprovalOpinion = '';
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
		$s.processApprovalData = {};
		angular.element('.btnApproval').addClass("hide");
		angular.element('.approvalState').addClass("full");
		
//		angular.element(".wrapBodyContents").find('*').remove();
		popPage(pageName);
	}
	
	$s.btnDownloadAttachFile = function(fileURL, fileName) {
		// 여기에 하이브리드 기능 기술
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.downloadAttachFile(fileURL, fileName);
			}
		} else if($rs.agent == 'ios') {
			webkit.messageHandlers.iosDownloadAttachFile.postMessage({fileURL:fileURL,fileName:fileName});
		}
	}
	
	// 결재 처리부분 : 추가 iframe으로 띄운 결재쪽 웹뷰의 script 실행하기 위함.
	function doApproval(action, opinion) {
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.processApproval(action, opinion);
			}
		} else if($rs.agent=='ios') {
			   webkit.messageHandlers.iosProcessApproval.postMessage({action:action,opinion:opinion});
		}
	}
	
	// 결재 처리 후 완료 부분
	window.successAllApproval = function() {
		afterApprovalSuccess();
	}

	iosSuccesApproval = function() {
		afterApprovalSuccess();
	 }
	
	function afterApprovalSuccess() {
		alert($rs.translateLanguage('done_approval_text'));
	   var currPage = angular.element('[class^="panel"][class*="current"]');
	   var pageName = currPage.eq(currPage.length-1).attr('id');
	   popPage(pageName);
	   
	   $rs.$broadcast('applyDeleteApprovalList', $s.approval);
	}
	
	// 결재 focused, 결재 입력에 용이하게 하단부 스크롤
	angular.element('.processApprovalOpinion').focus(function(){
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.scrollEnterApprovalEdit();
			}
		} else if($rs.agent=='ios') {
			// 필요시 기입
		}
	}).blur(function(){
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.scrollExitApprovalEdit();
			}
		} else if($rs.agent=='ios') {
			// 필요시 기입
		}
	});
}])
.filter('convertPeriodDate',function(){
	return function(input) {
        return calcYear(input);
    };

    function calcYear (year){
    	if(year != null && year != undefined && year != ''){
    		return (year / 12) + '년'; 
    	}
        return '- 년';
    }
});