
// mailController
appHanmaru.controller('mailController', ['$scope', '$http', '$rootScope', '$sce', '$timeout', function($s, $http, $rs, $sce, $timeout) {
	$s.mailOptionShow = false;			// 받은 편지함 필터메뉴
	$s.mailSearchnShow = false;			// 메일 검색 메뉴
	$s.searchOptionShow = false;		// 메일 검색 옵션 메뉴
	$s.mailListEditShow = false;		// 메일 편집
	$s.mailBtnShow = true;				// 메일 작성 bottom 버튼
	$s.mailEditShow = false;			// 메일 편집 bottom 버튼
	$s.mailEditHide = false;			// 메일 편집시 가려지는 요소들
	$rs.mailEditClick = false;			// 메일 선택 시 백그라운드 변경
	$s.noneRead = false;
	$rs.flagMail = false;
	$s.todayMail = false;
	$s.importantMail = false;
	$s.isDlgMailPopupMenu = false;
// $s.searchSel = '제목';
	$s.editTxt = '편집';
	$s.mailListPage = 1;
	//2019.10.21 추가 - jh.j
	$rs.isMailBottomLoading = false;
	//2019.10.21 추가끝
	
	$s.afterSwipe = function(e,idx){
		var email = $rs.mailList[idx];
		$s.btnDlgMailDelete(e,email);
	}
	
	$s.cancelReOrder = function(e){
		e.preventDefault();
	};
	
	$rs.$on('initSearchValue',function(event){
		$s.SearchTypeOptions = [
			{'value':'subject','name':$rs.translateLanguage('subject')},
			{'value':'body','name':$rs.translateLanguage('body')},
			{'value':'sender','name':$rs.translateLanguage('sender')},
			{'value':'receive','name':$rs.translateLanguage('receive')},
			{'value':'subjectbody','name':$rs.translateLanguage('subjectbody')},
		  ];
	  	$s.SearchType = $s.SearchTypeOptions[0].value;
	  	$s.SearchName = $s.SearchTypeOptions[0].name;
	  	$s.curSearchType = 0;
		
		//2019.10.21 수정 - jh.j
	  	//메일 검색시 default 날짜를 3개월전으로.
		$s.SearchValue = '';
		var now = moment(new Date()).format("YYYY-MM-DD");
		var monthAgo = moment(new Date()).subtract(3, 'months').format("YYYY-MM-DD");
		$s.txtSearchStart = monthAgo;
		$s.txtSearchEnd = now;
		
		$s.SearchType = $s.SearchTypeOptions[0].value;		
		//2019.10.21 수정끝
	});
	
	$rs.$on('displayMailName', function(event, data){
		$s.displayName = data;
	});
	
	$rs.$on('initMailBox', function(event) {
		$rs.dialog_progress = true;
		
		var param = callApiObject('mail', 'mailBoxs', {LoginKey:$rs.userInfo.LoginKey,Type:''})
		$http(param).success(function(data) {
			var code = data.Code;
			if(code == 1){
				var mailBoxList = JSON.parse(data.value);
				
				$rs.subMenuType = 'mail';
				$rs.subMenuMailList = mailBoxList;
//				$rs.subMenuList = mailBoxList;
				//2019.12.09 추가.
				//임시 mailBox List
				$rs.tmpMailBoxList = mailBoxList;
				$rs.currSubMenu = mailBoxList[0].FolderId;
				
				initMailTree(mailBoxList);
				$rs.$broadcast('initMailList', mailBoxList[0].DisplayName);
				
			}else{
				$rs.result_message = data.value;
				$rs.dialog_toast = true;
				
				setTimeout(function(){
					$rs.dialog_toast = false;
					$rs.dialog_progress = false;
					$rs.$apply();
				},500);
			}
		});
	});
	
	$rs.$on('refreshMailBox', function(event) {
		//$rs.subMenuMailList null 체크 할
		var param = callApiObject('mail', 'mailBoxsCount', {LoginKey:$rs.userInfo.LoginKey})
		$http(param).success(function(data) {
			var code = data.Code;
			if(code == 1){
				var mailBoxList = JSON.parse(data.value);
//				var mailCountList = updateSubMailMenuTree(mailBoxList);
				initMailTree(updateSubMailMenuTree(mailBoxList));
			}
		});
	});
	
	$rs.isDataLoading = false;
	$rs.$on('initMailList', function(event, data) {
//		$rs.dialog_progress = true;
		// data => menuName
		$s.mailListPage = 1;
		//다른메뉴 이동시 xpull 초기화
		angular.element('.mailListDiv').data("plugin_xpull").options.paused = false;
		
		// 메일 체크리스트 초기화
		$s.mailEditList = new Array();
		if($s.mailEditList.length*1 == 0){
			$(".mailListDiv").scrollTop(0);
			$(".mailListDiv").removeClass("mailListDivCheck");
			$(".mailContentsBehaviorDiv").hide();
		}
		
		if(data != '') {
			$s.displayName = data;
		}
		
		//2019.10.21 수정 - jh.j
		//3개월에 해당하는 data만 로드하도록 수정.
		var now = moment(new Date()).format("YYYY-MM-DD");
		var monthAgo = moment(new Date()).subtract(3, 'months').format("YYYY-MM-DD");
		$s.txtSearchStart = monthAgo;
		$s.txtSearchEnd = now;
		
		var reqMailListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:15, 
			PageNumber:$s.mailListPage,
			FolderID:$rs.currSubMenu,
			StartDate:$s.txtSearchStart,
			EndDate:$s.txtSearchEnd
		};
		//2019.10.21 수정끝.
		
		//2019.12.13 추가 
		//메일 로딩확인
		$rs.isDataLoading = true;
		var param = callApiObject('mail', 'mailList', reqMailListData);
		
//		console.log(param);
		
		$http(param).success(function(data) {
			var mailList = JSON.parse(data.value);
			$rs.mailList = mailList.Mails;
		
			// 초기화면 설정을 위해 수정함(기존 'pg_login')
			var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
			pushPage(pageName, 'pg_mail_list');
			
			$rs.dialog_progress = false;
		}).then(function(){
			$rs.dialog_progress = false;
			$rs.isDataLoading = false;
//			$timeout(function(){
//				$rs.dialog_progress = false;
//			}, 500);
		});
	});
	
	$rs.$on('initMailListImportance', function(event, data) {
		$rs.dialog_progress = true;
		// data => menuName
		$s.mailListPage = 1;
		
		//다른메뉴 이동시 xpull 초기화
		angular.element('.mailListDiv').data("plugin_xpull").options.paused = false;
		
		// 메일 체크리스트 초기화
		$s.mailEditList = new Array();
		if($s.mailEditList.length*1 == 0){
			$(".mailListDiv").removeClass("mailListDivCheck"); //높이조절 
			$(".mailContentsBehaviorDiv").hide();
		}
		
		if(data != '') {
			$s.displayName = data;
		};
		
		var reqMailListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:30, // 기존 30, 테스트로 90개
			PageNumber:$s.mailListPage,
			FolderID:$rs.currSubMenu,
			Importance:'High'
		};
		
		var param = callApiObject('mail', 'mailList', reqMailListData);
		$http(param).success(function(data) {
			var mailList = JSON.parse(data.value);
			$rs.mailList = mailList.Mails;
			
			// 초기화면 설정을 위해 수정함(기존 'pg_login')
			var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
			pushPage(pageName, 'pg_mail_list');
		}).then(function(){
			$timeout(function(){
				$rs.dialog_progress = false;
			}, 500);
		});
	});
	
	$rs.$on('initMailListFile', function(event, data) {
		$rs.dialog_progress = true;
		// data => menuName
		$s.mailListPage = 1;
		
		//다른메뉴 이동시 xpull 초기화
		angular.element('.mailListDiv').data("plugin_xpull").options.paused = false;
		
		// 메일 체크리스트 초기화
		$s.mailEditList = new Array();
		if($s.mailEditList.length*1 == 0){
			$(".mailListDiv").removeClass("mailListDivCheck"); //높이조절 
			$(".mailContentsBehaviorDiv").hide();
		};
		
		if(data != '') {
			$s.displayName = data;
		};
		
		var reqMailListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:30, // 기존 30, 테스트로 90개
			PageNumber:$s.mailListPage,
			FolderID:$rs.currSubMenu,
			IsHasAttach:'true'
		};
		
		var param = callApiObject('mail', 'mailList', reqMailListData);
		$http(param).success(function(data) {
			var mailList = JSON.parse(data.value);
			$rs.mailList = mailList.Mails;
			
			// 초기화면 설정을 위해 수정함(기존 'pg_login')
			var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
			pushPage(pageName, 'pg_mail_list');
		}).then(function(){
			$timeout(function(){
				$rs.dialog_progress = false;
			}, 500);
		});
	});
	
	$rs.$on('initMailListUnRead', function(event, data) {
		$rs.dialog_progress = true;
		// data => menuName
		$s.mailListPage = 1;
		
		//다른메뉴 이동시 xpull 초기화
		angular.element('.mailListDiv').data("plugin_xpull").options.paused = false;
		
		// 메일 체크리스트 초기화
		$s.mailEditList = new Array();
		if($s.mailEditList.length*1 == 0){
			$(".mailListDiv").removeClass("mailListDivCheck"); //높이조절 
			$(".mailContentsBehaviorDiv").hide();
		}
		
		if(data != '') {
			$s.displayName = data;
		}
		
		var reqMailListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:30, // 기존 30, 테스트로 90개
			PageNumber:$s.mailListPage,
			FolderID:$rs.currSubMenu,
			IsUnRead:'true'
		};
		
		var param = callApiObject('mail', 'mailList', reqMailListData);
		$http(param).success(function(data) {
			var mailList = JSON.parse(data.value);
			$rs.mailList = mailList.Mails;
			
			// 초기화면 설정을 위해 수정함(기존 'pg_login')
			var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
			pushPage(pageName, 'pg_mail_list');
		}).then(function(){
			$timeout(function(){
				$rs.dialog_progress = false;
			}, 500);
		});
	});
	
	$rs.$on('initMailListFlag', function(event, data) {
		$rs.dialog_progress = true;
		$rs.flagMail = true; //2019.12.04 수정
		// data => menuName
		$s.mailListPage = 1;
		
		//다른메뉴 이동시 xpull 초기화
		angular.element('.mailListDiv').data("plugin_xpull").options.paused = false;
		
		// 메일 체크리스트 초기화
		$s.mailEditList = new Array();
		if($s.mailEditList.length*1 == 0){
			$(".mailListDiv").removeClass("mailListDivCheck"); //높이조절 
			$(".mailContentsBehaviorDiv").hide();
		}
		
		if(data != '') {
			$s.displayName = data;
		}
		
		var reqMailListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:30, // 기존 30, 테스트로 90개
			PageNumber:$s.mailListPage,
			FolderID:$rs.currSubMenu,
			IsFlag:$rs.flagMail
		};
		
		var param = callApiObject('mail', 'mailList', reqMailListData);
		$http(param).success(function(data) {
			var mailList = JSON.parse(data.value);
			$rs.mailList = mailList.Mails;
			
			// 초기화면 설정을 위해 수정함(기존 'pg_login')
//			var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
//			pushPage(pageName, 'pg_mail_list');
		}).then(function(){
			$timeout(function(){
				$rs.dialog_progress = false;
			}, 500);
		});
	});
	
	
	$s.hideMailVisibleOption = function(e){
		var el = angular.element(e.target);
		var clzNm = el.attr('class');
		
		if(clzNm === 'btnMailOption') {
		} else if(clzNm == 'btnMailSearch' || el.parents('div.mailSearchDiv').attr('class') == 'mailSearchDiv') {
			
		} else {
			$s.mailSearchnShow = false;
		}
	};
	
	// 받은 메일 옵션메뉴
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
			PageSize:20,
			PageNumber:$s.mailListPage,
			FolderID:$rs.currSubMenu,
			IsUnRead:$s.noneRead,
			IsFlag:$rs.flagMail,
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
	
	// 메일 검색 메뉴
	$s.mailSearch = function() {
		if ($s.mailSearchnShow == true) {
			$s.mailSearchnShow = false;
		} else {
			$s.mailOptionShow = false;
			$s.mailSearchnShow = true;
		}
	};
	
	// 메일 검색 메뉴 체크 이미지
	$s.noneReadMailClick = function() {
		$s.noneRead = !$s.noneRead;
	};
	
	// 메일 검색 메뉴 체크 이미지
	$s.FlagMailClick = function() {
		$rs.flagMail = !$rs.flagMail;
	};
	
	// 메일 검색 메뉴 체크 이미지
	$s.todayMailClick = function() {
		$s.todayMail = !$s.todayMail;
	};
	
	// 메일 검색 옵션 메뉴(제목, 본문...)
	$s.searchOption = function() {
		if ($s.searchOptionShow == true) {
			$s.searchOptionShow = false;
		} else {
			$s.searchOptionShow = true;
		}
	};
	
	// 메일 검색 옵션 타입 선택
	$s.applySearchType = function(index){
		$s.curSearchType = index;
		$s.SearchType = $s.SearchTypeOptions[index].value;
		$s.SearchName = $s.SearchTypeOptions[index].name;
	}
	
	// 메일 검색 옵션 선택시 텍스트 변경
	$s.searchOptionSel = function(e) {
		if ($s.searchOptionShow == true) {
			$s.searchOptionShow = false;
			$s.searchSel = e.srcElement.innerHTML;
		} else {
			$s.searchOptionShow = true;
		}
	};
	
	// 메일 검색
	$s.btnSearchMail = function(){
		$rs.dialog_progress = true;
		$s.mailSearchnShow = false;
		$s.mailOptionShow = false;
		$s.mailBtnShow = true;
		$s.mailListPage = 1;
		
		var reqMailListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:20,
			PageNumber:$s.mailListPage,
			FolderID:$rs.currSubMenu,
			SearchType:$s.SearchType,
			SearchValue:$s.SearchValue != undefined ? $s.SearchValue : '',
			IsUnRead:$s.noneRead,
			IsFlag:$rs.flagMail,
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
	
	// 메일 편집
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
	
	// 메일 리스트 클릭 시 상세 또는 리스트 선택
	$s.mailEditList = new Array();
	
	$s.mailListSelect = function(e, index, mail) {
		var currSelectedElement = angular.element('.mailListBox').eq(index).find('.swiper-content');
		$rs.CURR_MAIL_ID = mail.ItemId;
		
		// 메일 상세
		var reqMailDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			Offset:mail.OffSet,
			FolderID:$rs.currSubMenu,
			MailId:mail.ItemId
		};
		
		//2020.03.12 수정 - PC에서 삭제한 메일일 경우 오류 수정.
		var code = -1; 
		
		var param = callApiObject('mail', 'mailDetail', reqMailDetailData);
		$http(param).success(function(data) {
			
			code = parseInt(data.Code);
			if(code == 1){
				var mailData = JSON.parse(data.value);
				
				$rs.mailData = mailData;
				parseCIDAttachMailData($rs.mailData);
			}
		}).then(function(){
			// 메일 읽음
			var arrMail = new Array();
			arrMail.push(mail.ItemId);
			
			var readMailData = {
				LoginKey:$rs.userInfo.LoginKey,
				States:true,
				MailId:arrMail
			}
			var readParam = callApiObject('mail', 'mailDoRead', readMailData);
			$http(readParam).success(function(readResultData) {
				mail.IsRead = true;
			}).then(function(){
				if(code == 1){
					$rs.pushOnePage('pg_mail_view');
					$rs.$broadcast('initMailDetail',mail);
					$rs.$broadcast('refreshMailBox');
				}else{
					alert('메일을 불러오는데 실패했습니다. 새로고침 해 주세요');
				}
			});
		});
			
//			var reqBodyData = {
//					LoginKey:$rs.userInfo.LoginKey,
//					MailType:'2',
//					MailID:mail.ItemId,
//					ToRecipients:'',
//					CcRecipients:'',
//					BccRecipients:''
//			}
//			var param1 = callApiObject('mail', 'mailSendBody', reqBodyData);
//			$http(param1).success(function(data) {
//				mailBody='<br><br>'+data.Body;
//			});
//			mailWriteTmpSave(mail.ItemId);
	}
	
	// 2019-09-23 김현석 [메일리스트 전체체크 추가]
	$s.btnToggleAllCheck = function(e){
		
		for(var idx in $s.mailList){
			var mail = $s.mailList[idx];
			if(mail.EditSelected == undefined || mail.EditSelected == false) {
				
				$(".mailContentsBehaviorDiv").show();
				mail.EditSelected = true;
				$s.mailEditList.push(mail);
			} 
		}		
	}
	// 2019-09-23 김현석 [메일리스트 전체해제 추가]
	$s.btnToggleUnCheckAll = function(){
		for(var idx in $s.mailList){
			var mail = $s.mailList[idx];
			
			for(var editidx in $s.mailEditList) {
				var toUncheckEmail = $s.mailEditList[editidx];
				
				if(toUncheckEmail.ItemId == mail.ItemId) {
					$s.mailEditList.splice(editidx, 1);
					mail.EditSelected = false;
					break;
				}
			}	
		}		
		
		if($s.mailEditList.length*1 == 0){
			angular.element('.mailListDiv').data("plugin_xpull").options.paused = false;
			// 메일 편집
			$rs.mailEditClick = false;
			
			setTimeout(function(){
				$rs.$apply(function(){
					$(".mailListDiv").removeClass("mailListDivCheck"); //높이조절 
					$(".mailContentsBehaviorDiv").hide();
				});
			}, 50);
			
		}
	}
	
	$s.mailListBoxSelect = function(e, index, mail) {
		var currSelectedElement = angular.element('.mailListBox').eq(index).find('.swiper-content');
			var email = $s.mailList[index];
			
			if(email.EditSelected == undefined || email.EditSelected == false) {
				// 2019-09-17 김현석 [체크박스 클릭하였을때 처리메뉴 보이게끔 수정]
				$(".mailContentsBehaviorDiv").show();
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
			
			// 2019-09-17 김현석 [클릭된 리스트가 없을시 처리메뉴 숨기기]
			if($s.mailEditList.length*1 == 0){ //체크된값이 없을때
				angular.element('.mailListDiv').data("plugin_xpull").options.paused = false;
				
				// 메일 편집
				$rs.mailEditClick = false;
				
				$(".mailListDiv").removeClass("mailListDivCheck"); //높이조절 
				$(".SenderWidthNowCheck").addClass("SenderWidthNow"); //제목 너비조절 (오늘리스트)
				$(".SenderWidthNow").removeClass("SenderWidthNowCheck"); //제목 너비조절 (오늘리스트)
				$(".SenderWidthCheck").addClass("SenderWidth"); //제목 너비조절 (오늘이 아닌 리스트)
				$(".SenderWidth").removeClass("SenderWidthCheck"); //제목 너비조절 (오늘이 아닌 리스트)
								
				$(".mailContentsBehaviorDiv").hide();
			}else{
				angular.element('.mailListDiv').data("plugin_xpull").options.paused = true; 
				
				// 메일 편집
				$rs.mailEditClick = true;
				
				$(".mailListDiv").addClass("mailListDivCheck"); //높이조절 
				$(".SenderWidthNow").addClass("SenderWidthNowCheck"); //제목 너비조절 (오늘리스트)
				$(".SenderWidthNowCheck").removeClass("SenderWidthNow"); //제목 너비조절 (오늘리스트)
				$(".SenderWidth").addClass("SenderWidthCheck"); //제목 너비조절 (오늘이 아닌 리스트)
				$(".SenderWidthCheck").removeClass("SenderWidth"); //제목 너비조절 (오늘이 아닌 리스트)
			}
	}
	
	//뒤로가기시 메일편집 모드 해제
	$rs.$on('editMailListInit',function(){
		$s.btnToggleUnCheckAll();
	});

	
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
	
	// 다음페이지 읽기
	$s.readMailNextPage = function(){
		$rs.isMailBottomLoading = true;
		$s.mailListPage++;
		
		var reqMailListData = {
			LoginKey:$rs.userInfo.LoginKey,
			PageSize:15,
			PageNumber:$s.mailListPage,
			FolderID:$rs.currSubMenu,
			IsUnRead:$s.noneRead,
			IsFlag:$rs.flagMail,
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
					//2019.10.22 추가 - jh.j
					//하단 로딩처리
					$rs.isMailBottomLoading = false;
					//2019.10.22 추가 끝.
				} else {
					console.log('err : ',$s.mailListPage);
					$s.mailListPage--;
				}
			}, 50);
		}).then(function(){
			$timeout(function(){
//				$rs.dialog_progress = false;
				$rs.isMailBottomLoading = false;
			}, 100);
		});
	};
	
	// 일자 계산(오늘/어제/요일/오래 전 등)
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
  
  // 오래전 표시 여부
  $s.isPreviousDateShowIndex = 0;
  $s.isPreviousDateShownCount = 0;
	$s.chooseSearchDate = function(type){
		if($rs.agent == 'android') {
			if(androidWebView != undefined) androidWebView.callMailDatePickerDialog(type);	
		} 
	}
	
	// android bridge result
	window.setMailSearchDate = function(type, value) {
		$s.$apply(function() {
			if(type === 'start') {
				$s.txtSearchStart = value;
			} else if(type === 'end') {
				$s.txtSearchEnd = value;
			}
		});
	}

	// 메일 플래그
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
			
			/* $s.mailEdit(); */
		}).then(function(){
			$s.mailEditList.splice(0, $s.mailEditList.length);
		});
	}
	
	// 메일 이동 start
	$s.isDlgMailMove = false;
	$s.btnDlgMailMove = function(e) {
		$s.isDlgMailMove = !$s.isDlgMailMove;
		
		var param = callApiObject('mail', 'mailBoxs', {LoginKey:$rs.userInfo.LoginKey,Type:'UPDATE'});
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
					$rs.result_message = $rs.translateLanguage('mail_move_success');
					$rs.dialog_toast = true;
					
					$s.btnSearchMail(); // 화면갱신
				} else {
					$rs.result_message = $rs.translateLanguage('mail_move_fail');
					$rs.dialog_toast = true;
				}
				
				$s.targetFolderId = undefined;
				$s.isDlgMailMove = false;
				
				
				/* $s.mailEdit(); */
			}).then(function(){
				setTimeout(function(){
					$rs.$apply(function(){
						$rs.dialog_toast = false;
					});
				}, 1000);
				
				$s.mailEditList.splice(0, $s.mailEditList.length);
				if($s.mailEditList.length*1 == 0){
					$(".mailListDiv").scrollTop(0);
					$(".mailListDiv").removeClass("mailListDivCheck"); //높이조절 
					$(".mailContentsBehaviorDiv").hide();
				}
			});
		} else {
			$s.isDlgMailMove = false;
		}
	}
	// 메일 이동 end
	
	// 메일 삭제 start
	$s.isDlgMailDelete = false;
	$s.btnCancelDeleteMail = function(){
		$s.isDlgMailDelete = false;
	};
	
	$s.btnDlgMailDelete = function(e,swipedItem) {
		$s.isDlgMailDelete = !$s.isDlgMailDelete;
		deleteMail(swipedItem);		
	};
	
	function deleteMail(swipedItem){
		$s.dismissDlgMailDelete = function(e){
			var target = angular.element(e.target);
			
			if(target.hasClass('dlgMailDelete')) {
				$s.isDlgMailDelete = false;
			} else {
				return;
			}
		};
		
		$s.btnConfirmDeleteMail = function(){
			var folderType;
			var isSwipeDelete = false; //스와이프해서 삭제 판단 변수.
			
			for(idx in $rs.subMenuList) {
				var folderID = $rs.subMenuList[idx].FolderId;
				if(folderID === $rs.currSubMenu) {
					folderType = $rs.subMenuList[idx].FolderType;
					break;
				}
			}
			
			var arrMail = new Array();
			//스와이프 해서 삭제
			if(swipedItem !=null && swipedItem !=undefined){
				isSwipeDelete = true;
				arrMail.push(swipedItem.ItemId);
//				$s.mailEditList.push(swipedItem);
			}
			//편집모드에서 삭제
			else{
				isSwipeDelete = false;
				
				for(var idx in $s.mailEditList) {
					var email = $s.mailEditList[idx];
					arrMail.push(email.ItemId);
				}
			}
			
			var mailDeleteData = {
				LoginKey : $rs.userInfo.LoginKey,
				States : (folderType === 'DELETEDITEMS' ? true : false ),
				MailId : arrMail
			};
			
			var param = callApiObject('mail', 'mailDoDelete', mailDeleteData);
			$http(param).success(function(data) {
				$s.isDlgMailDelete = false;
				
				var code = parseInt(data.Code);
				if(code == 1) {
					$rs.result_message = $rs.translateLanguage('mail_remove_success');
					$rs.dialog_toast = true;
					
					if(isSwipeDelete){
						//스와이프로 메일 삭제
						for(idx in $rs.mailList){
							var mailId = $rs.mailList[idx].ItemId;
							if(mailId == swipedItem.ItemId){
								$rs.mailList.splice(idx, 1);
							}
						}
					}else{
						//전체 메일리스트에서 선택한 메일 삭제
						angular.forEach($s.mailEditList, function (value, index) {
							var index = $rs.mailList.indexOf(value);
							$rs.mailList.splice($rs.mailList.indexOf(value), 1);
						});
						$s.mailEditList.splice(0, $s.mailEditList.length);
					}
					
				} else {
					$rs.result_message = $rs.translateLanguage('mail_remove_fail');
					$rs.dialog_toast = true;
				}
				
			}).then(function(){
			    setTimeout(function(){
			        $rs.$apply(function(){
			            $rs.dialog_toast = false;
			            isSwipeDelete = false;
			            
			            if($s.mailEditList.length*1 == 0){
							$(".mailListDiv").removeClass("mailListDivCheck"); //높이조절 
							$(".mailContentsBehaviorDiv").hide();
						}
			        });
			    }, 1000);
			});
			
		};
		
	}
	// 메일 삭제 end
	
	// 메일 읽지않음 start
	$s.btnToggleNotRead = function(e){
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
				email.IsRead = false;
				email.EditSelected = false;
			}
			/* $s.mailEdit(); */
		}).then(function(){
			$s.mailEditList.splice(0, $s.mailEditList.length);
			$rs.$broadcast('refreshMailBox');
			
			if($s.mailEditList.length*1 == 0){
				$(".mailListDiv").removeClass("mailListDivCheck"); //높이조절 
				$(".mailContentsBehaviorDiv").hide();
			}
		});
		
		
	}
	// 메일 읽지않음 end
	
	// 결재아이디 파싱해서 보내기
	window.btnToApprovalDetail = function(docID) {
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id'); // 가장 위에 출력된
																	// 화면
		var approval = {};
		approval.ApprovalID = docID;
		
		// 챗봇 결재문서 열기 위한 분기 처리(챗봇에서 결재문서 바로가기는 currPage == 1 / 기존 그룹웨어에서는 2로 나옴)
		if(currPage.length > 1){ 
			popPage(pageName);			
		}
		
		$rs.approvalDetail('', approval, '온라인 문서고');
	}
	
	//푸시용 결재문서 연결
	window.btnToPushApprovalDetail = function(docID, displayState) {
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id'); // 가장 위에 출력된
																	// 화면
		var approval = {};
		approval.ApprovalID = docID;
		
		// 챗봇 결재문서 열기 위한 분기 처리(챗봇에서 결재문서 바로가기는 currPage == 1 / 기존 그룹웨어에서는 2로 나옴)
		if(currPage.length > 1){ 
			popPage(pageName);			
		}
		
		var displayName = getApprovalDisplayName(displayState);
		$rs.approvalDetail('', approval, displayName);
	}
	
	var getApprovalDisplayName = function(displayState){
		var name = '온라인 문서고';
		
		if(displayState == '1' || displayState == '19' || displayState == '20'){
			name = '온라인 문서고';
		}else if(displayState == '11'){
			name = '반려함';
		}else if(displayState == '21'){
			name = '회람 문서함';
		}else{
			name = '미결함';
		}
		return name;
	}
	
	//메일 리스트 페이지 파싱
	// CID 내용이 있으면 파싱, 없으면 일반내용 표시
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
						//2019.11.27 추가
						//첨부파일 이름 체크하여 Attachments 배열에서 제거.
						$.each(mail.Attachments,function(index,item){
							if(item.FileName.indexOf(fileName)>-1){
								mail.Attachments.splice(index,1);
								return false;
							}
						})
					}
				}
			}
			
			mail.Body = toParseMailBody;
			mail.HTMLBody = $sce.trustAsHtml(mail.Body);		
			mail.tmpAttachMap = tmpAttachMap;
//			mail.Attachments = new Array(); //2019.11.27 수정 - 첨부파일리스트 초기화 주석처리.
		} else {
			var mailBody = angular.element(mail.Body);
			var approvalLink = mailBody.find('a[href*="/Workflow/Page/Link.aspx"]');
			var approvalLinkIndex = mail.Body.indexOf("/Workflow/Page/Link.aspx");
			
			if(approvalLinkIndex != -1) {
				var docID = approvalLink.attr('href').split('?')[1].split('=')[1];
				
//				console.log(docID);
				
				setTimeout(function(){
					var script = "javascript:btnToApprovalDetail('"+docID.trim()+"');";
// mail.Body =
// mail.Body.replace($rs.apiURL+"/Workflow/Page/Link.aspx?docId="+docID,
// script);//$rs.apiURL이 현재 https.
					mail.Body = mail.Body.replace("https://ep.halla.com/Workflow/Page/Link.aspx?docId="+docID, script);
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
		
		//2020.01.07 임시저장 관련 주석처리.
//		var reqBodyData = {
//				LoginKey:$rs.userInfo.LoginKey,
//				MailType:'2',
//				MailID:$s.currSelectedMail.ItemId,
//				ToRecipients:'',
//				CcRecipients:'',
//				BccRecipients:''
//		}
//		var param1 = callApiObject('mail', 'mailSendBody', reqBodyData);
//		$http(param1).success(function(data) {
//			mailBody="<br><br>"+data.Body;
//		});
	}
	
	$s.btnToggleFlagList = function(mail){
		// 메일 플래그
		var arrMail = new Array();
		arrMail.push(mail.ItemId);
		
		var flagMailData = {
			LoginKey:$rs.userInfo.LoginKey,
			States:!mail.FlagStatus,
			MailId:arrMail
		}
		
		var flagParam = callApiObject('mail', 'mailDoFlag', flagMailData);
		$http(flagParam).success(function(flagResultData) {
			var code = parseInt(flagResultData.Code);
			
			if(code == 1) {
				for(i in $s.mailList) {
					var m = $s.mailList[i];
					if(m.ItemId === arrMail[0]) {
						m.FlagStatus = !mail.FlagStatus;
						$s.mailList[i]=m;
						break;
					}
				}
				
				if(mail.FlagStatus) {
					$rs.result_message = $rs.translateLanguage('setting_flagged');
				} else {
					$rs.result_message = $rs.translateLanguage('setting_un_flagged');
				}
				
				$rs.$broadcast('applyMailFlagStatus', mail, mail.ItemId);
				$rs.dialog_toast = true;
			} else {
				$rs.result_message = $rs.translateLanguage('setting_flag_fail');
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
	
	$s.itemOnTouchEnd = function(mail) {
		
	}
	
	// 롱클릭 팝업메뉴 닫기
	$s.dismissDlgMailPopupMenu = function(e) {
		$s.isDlgMailPopupMenu = false;
	}
	
	// 답장
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
		
			$rs.mailData.Body=mailBody;
			
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
	
	// 전달
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

			$rs.mailData.Body=mailBody;
			
			parseCIDAttachMailData($rs.mailData);

			var recipientArray = new Array();
			
			$rs.pushOnePage('pg_mail_write');
			$rs.$broadcast('initReplyForwardMailData', $s.currSelectedMail, true, recipientArray, 4);
			$s.dismissDlgMailPopupMenu();
			$s.currSelectedMail = undefined;
		});
	}
	
	// 메일 이동
	$s.btnMailPopupMove = function(){
		$s.mailListEditShow = true;
		$s.mailEditList = new Array();
		$s.mailEditList.push($s.currSelectedMail);
		$s.btnDlgMailMove();
	}
	
	// 깃발 표시
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
	
	// 읽지않음으로 표시
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
		// console.log('onReload');
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
	}
	
	//2019.12.09 추가
	//메일박스 카운트 업데이트
	function updateSubMailMenuTree(boxList) {
		var tmpList = $rs.tmpMailBoxList; 
		if(tmpList != null && tmpList != undefined){
			for(idx in tmpList){
				var tmpIdx = tmpList[idx].FolderId;
				for(idx2 in boxList){
					var boxIdx = boxList[idx2].FolderId;
					if(tmpIdx == boxIdx){
						tmpList[idx].UnreadCount = boxList[idx2].UnreadCount;
					}
				}
			}
		}
		return tmpList;
	}
	
	$rs.$on('applyMailFlagStatus', function(event, mail, mailID){
		for(i in $s.mailList) {
			var m = $s.mailList[i];
			if(m.ItemId === mailID) {
				m.FlagStatus = mail.FlagStatus;
				break;
			}
		}
	});
	$rs.$on('applyMailReadStatus', function(event, mail, mailID){
		for(i in $s.mailList) {
			var m = $s.mailList[i];
			if(m.ItemId === mailID) {
				m.IsRead = true;
				break;
			}
		}
	});
	
	//체크된 메일 없을때
//	$s.isEditMail = $s.mailEditList.length*1 == 0 ? false : true; 
	
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
					if ((el.scrollHeight - el.scrollTop) == clientHeight) { // fully
																			// scrolled
						if(!scope.$root.isMailBottomLoading){ //하단 로딩 돌고있지 않을때만 다음페이지 읽기
							scope.$apply(fn);	
						}
					}
				} else{
					if((el.scrollTop + clientHeight + 0.5) >= el.scrollHeight){
//						console.log('하단 로딩!!! : ',scope.$root.isMailBottomLoading);
						
						if(!scope.$root.isMailBottomLoading){ //하단 로딩 돌고있지 않을때만 다음페이지 읽기
							scope.$apply(fn);
						}
						//scope.$root.dialog_progress = true;
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
	            }, 500);
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
				
				// ios safari $eval 실행후 터치 이벤트 막기위함
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
})
.directive("mailXpull", function() {
	return function(scope, elm, attr) {
		return $(elm[0]).xpull({
	    	pullThreshold: 200,	
	        maxPullThreshold: 0,
//	        'vibration':function(e){
//	        	//Haptic
//        		if(scope.$root.agent == 'android') {
//        			if(androidWebView != undefined) androidWebView.pullToRefreshHaptic(5);	
//        		}else if(scope.$root.agent == 'ios'){
//        			webkit.messageHandlers.pullToRefreshHapticIos.postMessage('5');
//        		}
//	        },
	        /*'onPullThreshold' : function(){
	        	angular.element('.pull-indicator.mail').show();
	        },*/
//	        'onPullThresholdReverse':function(e){
//	        	setTimeout(function(){
//	        		angular.element('.mailListDiv').data("plugin_xpull").reset();
//	        	},300);
//	        },
	        'callback': function(e) {
	        	//angular.element('.pull-indicator.mail').hide();
        		scope.$apply(attr.ngXpull);
        		scope.$root.$broadcast('initMailList', scope.displayName);
        		//scope.$root.dialog_progress = true;
	        	return;
	        }
	    });
	    
	};
});


// mailDetail
appHanmaru.controller('hallaMailDetailCtrl', ['$scope', '$http', '$rootScope', '$sce', function($s, $http, $rs, $sce) {
	$s.isRecipientShow = false;
	$s.isProfileImgEnlarge = true;

//	var worker;
// var pinchZoom;
	
	$rs.$on('initMailDetail', function(event, data){
		$s.isRecipientShow = false;
		$rs.dialog_progress = true;
		$s.isDlgMailMove = false;
		
		
		// pinchzoom
		/*
		 * setTimeout(function(){ try { var elm =
		 * document.getElementById('mailDetailHTMLContents'); //
		 * initMailContentsPinchZoom(elm);
		 * ////console.log(angular.element("#mailDetailContents").html()); }
		 * catch(e) { //console.log(e); } }, 500);
		 */
		// 사용자 상세정보
		$s.userDetailData = undefined;
		var reqUserDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			EmailAddress:$rs.mailData.FromEmailAddress 
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
		
		// CID ATTACH 가 있을 떄 값 교체
		function downloadCIDFileAS(index, cid) {
			$http.get(cid.FileURL, {responseType:'arraybuffer'}).success((function(index) {
			    return function(data) {
					var base64Data = 'data:image/' + extension + ';base64,'+ _arrayBufferToBase64(data);
					// [[CID::ATTACH_1]]
					var cidAttachIndex = '[[CID::ATTACH_'+index+']]';
					$rs.mailData.Body = $rs.mailData.Body.replaceAll(cidAttachIndex, base64Data);
					$rs.mailData.HTMLBody = $sce.trustAsHtml($rs.mailData.Body);
			    }
			})(index));
		}
			
		//
		if($rs.mailData.tmpAttachMap != undefined) {
			var keys = Object.keys($rs.mailData.tmpAttachMap.map);
			for(var i = 0; i < keys.length; i++) {
				var fileName = keys[i];
				var index = $rs.mailData.tmpAttachMap.get(fileName).index;
				var cidAttach = $rs.mailData.tmpAttachMap.get(fileName).attach;
				var extension = cidAttach.FileName.split('.').pop();
//				worker = new Worker(
//					downloadCIDFileAS(index, cidAttach)
//	    		);
				downloadCIDFileAS(index, cidAttach);
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
		$http(param).success(function(data) {
			var startStr = data.value.substring(0,1);
			if(startStr === '{') {
				var mailData = JSON.parse(data.value);
				// modified
				parseCIDAttachMailData(mailData);
				
				setTimeout(function(){
					$s.isRecipientShow = false;
					$rs.mailData = mailData;
					$rs.$apply(function () {
						$rs.mailData.HTMLBody = $sce.trustAsHtml($rs.mailData.Body);
			        });
					
					//2019-09-26 김현석 [메일 이전,다음보기시 유저정보 갱신부분 추가] start
					$s.userDetailData = undefined;
					var reqUserDetailData = {
						LoginKey:$rs.userInfo.LoginKey,
						EmailAddress:$rs.mailData.FromEmailAddress 
					};
					
					var param = callApiObject('insa', 'insaUserDetail', reqUserDetailData);
					$http(param).success(function(data) {
						var startStr = data.value.substring(0,1);
						
						if(startStr === '{') {
							setTimeout(function(){
								$s.$apply(function(){
									$s.userDetailData = JSON.parse(data.value);
								});
							}, 10);
						}
					}).then(function(){
						$rs.dialog_progress = false;
					});
					//end
				}, 100);
			}
		}).then(function(){
			$rs.dialog_progress = false;
			// 메일읽음
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
		// zoom init
		$s.resetZoomControl();
		
		$s.isDlgMailMove = false; // 이동 메일함 dialog 닫기
		
		popPage(currPageName);
	}
	
	$s.btnToggleFlag = function(e){
		// 메일 플래그
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
					$rs.result_message = $rs.translateLanguage('setting_flagged');
				} else {
					$rs.result_message = $rs.translateLanguage('setting_un_flagged');
				}
				
				$rs.$broadcast('applyMailFlagStatus', $rs.mailData, $rs.CURR_MAIL_ID);
				$rs.dialog_toast = true;
			} else {
				$rs.result_message = $rs.translateLanguage('setting_flag_fail');
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
		// $rs.pushOnePage('pg_mail_write');
	}
	
	// 메일 이동 start
	$s.btnDlgMailMove = function(e) {
		$s.isDlgMailMove = !$s.isDlgMailMove;
		
		var param = callApiObject('mail', 'mailBoxs', {LoginKey:$rs.userInfo.LoginKey,Type:'UPDATE'});
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
	
	// 확인버튼 클릭->메일함 선택시 바로 메일이동 되도록 수정함
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
				var code = parseInt(data.Code);
				if(code == 1) {
					$rs.result_message = $rs.translateLanguage('mail_move_success');
					$rs.dialog_toast = true;
				} else {
					$rs.result_message = $rs.translateLanguage('mail_move_fail');
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
				
				// 삭제된 파일이 있기때문에 리스트 가져옴
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
	// 메일 이동 end
	
	// 메일 삭제 start
	$s.isDlgMailDelete = false;
	$s.btnCancelDeleteMail = function(){
		$s.isDlgMailDelete = false;
	}
	$s.btnDlgMailDelete = function(e) {
//		console.log('삭제 event만');
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
		
		$s.btnConfirmDeleteMail = function(){
// $rs.currSubMenu = boxList[0].FolderId;
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
				$s.isDlgMailDelete = false;
				
				var code = parseInt(data.Code);
				if(code == 1) {
					$rs.result_message = $rs.translateLanguage('mail_remove_success');
					$rs.dialog_toast = true;
				} else {
					$rs.result_message = $rs.translateLanguage('mail_remove_fail');
					$rs.dialog_toast = true;
				}
				
				// 삭제된 파일이 있기때문에 리스트 가져옴
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
	// 메일 삭제 end
	
	// 답장/전달 start
	$s.isShowReplyForward = false;
	$s.detectReplyForward = function(e) {
		var currTarget = angular.element(e.target);
		var parentTarget = angular.element(e.target).parent();
		if(!currTarget.hasClass('reply') && !parentTarget.hasClass('reply')) {
			$s.isShowReplyForward = false;
		} else {
			return;
		}
	}
	
	$s.btnShowReplyForwardMenu = function(e) {
		$s.isShowReplyForward = !$s.isShowReplyForward;
	}
	
	// 메일유형
	// 1 : 일반, 2 : 회신, 3 : 전체회신, 4 : 전달
	$s.btnReply = function(e) {
		var recipientArray = new Array();
		var recipients = {};
		recipients.DisplayName = $rs.mailData.FromName;
		recipients.EMailAddress = $rs.mailData.FromEmailAddress;
		recipientArray.push(recipients);
		
		$rs.mailData.ItemId = $rs.CURR_MAIL_ID;
		
		//2020.02.24 수정
		//메일 회신, 전달시 이미지 안나오는 문제 수정 - mailDetail api 호출후 페이지 넘어가도록 수정.
		// 메일 상세
		var reqMailDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			Offset:$rs.mailData.OffSet,
			FolderID:$rs.currSubMenu,
			MailId:$rs.mailData.ItemId
		};
		var param = callApiObject('mail', 'mailDetail', reqMailDetailData);
		$http(param).success(function(data) {
			var code = parseInt(data.Code);
			if(code == 1){
				var mailData = JSON.parse(data.value);
				$rs.originalMailData  = mailData;
			}
		}).then(function(){
			//2019.01.06 수정 - 메일 임시저장 시점을 리스트 클릭시가 아닌 회신버튼 눌렀을때로 수정.
			var reqBodyData = {
					LoginKey:$rs.userInfo.LoginKey,
					MailType:'2',
					MailID:$rs.mailData.ItemId,
					ToRecipients:'',
					CcRecipients:'',
					BccRecipients:'',
			}
			var param1 = callApiObject('mail', 'mailSendBody', reqBodyData);
			$http(param1).success(function(data) {
				
				var tmpBody='<br><br>'+ data.Body;
				$rs.originalMailData.Body = tmpBody;
				
				$rs.originalMailData.ItemId = $rs.CURR_MAIL_ID;
//				parseCIDAttachMailData($rs.originalMailData);
				
			}).then(function(){
				$rs.pushPage('pg_mail_view', 'pg_mail_write');
				$rs.$broadcast('initReplyForwardMailData', $rs.originalMailData, true, recipientArray, 2);	
			});			
		});
		
		
//		var reqBodyData = {
//				LoginKey:$rs.userInfo.LoginKey,
//				MailType:'2',
//				MailID:$rs.mailData.ItemId,
//				ToRecipients:'',
//				CcRecipients:'',
//				BccRecipients:'',
//		}
//		var param1 = callApiObject('mail', 'mailSendBody', reqBodyData);
//		$http(param1).success(function(data) {
//			var mailBody='<br><br>'+data.Body;
//			$rs.mailData.Body = mailBody;
//			
//			
//		}).then(function(){
////			parseCIDAttachMailData($rs.mailData);
//			
//			$rs.pushPage('pg_mail_view', 'pg_mail_write');
//			$rs.$broadcast('initReplyForwardMailData', $rs.mailData, true, recipientArray, 2);	
//		});
//		
	}
	
	
	$s.btnReplyAll = function(e) {
		var recipientArray = new Array();
		var recipients = {};
		
		//2019.11.26 추가(전체 회신시 보내는 사람까지,본인은 제외)
		if($rs.userInfo.EmailAddress != $rs.mailData.FromEmailAddress){
			var fromUser = {};
			fromUser.DisplayName = $rs.mailData.FromName;
			fromUser.EMailAddress = $rs.mailData.FromEmailAddress;
			recipientArray.push(fromUser);
		}
		
		//받는사람
		for(var idx in $rs.mailData.ToRecipients) {
			var mail = $rs.mailData.ToRecipients[idx];
			var recipient = {};
			recipient.DisplayName = mail.DisplayName;
			recipient.EMailAddress = mail.EMailAddress;
			
			if(mail.EMailAddress != $rs.mailData.FromEmailAddress){
				recipientArray.push(recipient);				
			}
		}
		
		$rs.mailData.ItemId = $rs.CURR_MAIL_ID;
		
		//2020.02.24 수정
		//메일 회신, 전달시 이미지 안나오는 문제 수정 - mailDetail api 호출후 페이지 넘어가도록 수정.
		// 메일 상세
		var reqMailDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			Offset:$rs.mailData.OffSet,
			FolderID:$rs.currSubMenu,
			MailId:$rs.mailData.ItemId
		};
		var param = callApiObject('mail', 'mailDetail', reqMailDetailData);
		$http(param).success(function(data) {
			var code = parseInt(data.Code);
			if(code == 1){
				var mailData = JSON.parse(data.value);
				$rs.originalMailData  = mailData;
			}
		}).then(function(){
			//2019.01.06 수정 - 메일 임시저장 시점을 리스트 클릭시가 아닌 회신버튼 눌렀을때로 수정.
			var reqBodyData = {
					LoginKey:$rs.userInfo.LoginKey,
					MailType:'2',
					MailID:$rs.mailData.ItemId,
					ToRecipients:'',
					CcRecipients:'',
					BccRecipients:'',
			}
			var param1 = callApiObject('mail', 'mailSendBody', reqBodyData);
			$http(param1).success(function(data) {
				var tmpBody='<br><br>'+data.Body;
				$rs.originalMailData.Body = tmpBody;
				
				$rs.originalMailData.ItemId = $rs.CURR_MAIL_ID;
				
//				parseCIDAttachMailData($rs.originalMailData);
			}).then(function(){
				$rs.pushPage('pg_mail_view', 'pg_mail_write');
				$rs.$broadcast('initReplyForwardMailData', $rs.originalMailData, true, recipientArray, 3);
			});			
		});
		
//		var reqBodyData = {
//				LoginKey:$rs.userInfo.LoginKey,
//				MailType:'2',
//				MailID:$rs.mailData.ItemId,
//				ToRecipients:'',
//				CcRecipients:'',
//				BccRecipients:'',
//		}
//		var param1 = callApiObject('mail', 'mailSendBody', reqBodyData);
//		$http(param1).success(function(data) {
//			mailBody='<br><br>'+data.Body;
//			
//			$rs.mailData.Body=mailBody;
//			parseCIDAttachMailData($rs.mailData);
//			
//			$rs.pushPage('pg_mail_view', 'pg_mail_write');
//			$rs.$broadcast('initReplyForwardMailData', $rs.mailData, true, recipientArray, 3);
//		});

	}
	
	$s.btnForward = function(e) {
		var recipientArray = new Array();
		var recipients = {};
		
		$rs.mailData.ItemId = $rs.CURR_MAIL_ID;
		
		//2020.02.24 수정
		//메일 회신, 전달시 이미지 안나오는 문제 수정 - mailDetail api 호출후 페이지 넘어가도록 수정.
		// 메일 상세
		var reqMailDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			Offset:$rs.mailData.OffSet,
			FolderID:$rs.currSubMenu,
			MailId:$rs.mailData.ItemId
		};
		var param = callApiObject('mail', 'mailDetail', reqMailDetailData);
		$http(param).success(function(data) {
			var code = parseInt(data.Code);
			if(code == 1){
				var mailData = JSON.parse(data.value);
				$rs.originalMailData  = mailData;
			}
		}).then(function(){
			//2019.01.06 수정 - 메일 임시저장 시점을 리스트 클릭시가 아닌 회신버튼 눌렀을때로 수정.
			var reqBodyData = {
					LoginKey:$rs.userInfo.LoginKey,
					MailType:'2',
					MailID:$rs.mailData.ItemId,
					ToRecipients:'',
					CcRecipients:'',
					BccRecipients:'',
			}
			var param1 = callApiObject('mail', 'mailSendBody', reqBodyData);
			$http(param1).success(function(data) {
				var tmpBody='<br><br>'+data.Body;
				$rs.originalMailData.Body = tmpBody;
				
				$rs.originalMailData.ItemId = $rs.CURR_MAIL_ID;
				
//				parseCIDAttachMailData($rs.originalMailData);
			}).then(function(){
				$rs.pushPage('pg_mail_view', 'pg_mail_write');
				$rs.$broadcast('initReplyForwardMailData', $rs.originalMailData, true, recipientArray, 4);
			});			
		});
		
//		var reqBodyData = {
//				LoginKey:$rs.userInfo.LoginKey,
//				MailType:'2',
//				MailID:$rs.mailData.ItemId,
//				ToRecipients:'',
//				CcRecipients:'',
//				BccRecipients:'',
//		}
//		var param1 = callApiObject('mail', 'mailSendBody', reqBodyData);
//		$http(param1).success(function(data) {
//			mailBody='<br><br>'+data.Body;
//			
//			$rs.mailData.Body=mailBody;
//			parseCIDAttachMailData($rs.mailData);
//			
//			$rs.pushPage('pg_mail_view', 'pg_mail_write');
//			$rs.$broadcast('initReplyForwardMailData', $rs.mailData, true, recipientArray, 4);
//		});
		
	}
	// 답장/전달 end
	
	$s.getFileSizeUnit = function(value){
		return getFileSizeUnit(value);
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
	
	// 사용자 상세조회
	$s.selectOrganUser = function(emailAddr) {
		// 사용자 상세정보
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
		
		if(user.MyPhotoUrl.indexOf('//https') != -1) {
			rtnUrl = 'https://' + user.MyPhotoUrl.substring(user.MyPhotoUrl.indexOf('//https')+10, user.MyPhotoUrl.length);
			try {
				$http.get(rtnUrl).error(function(data){
					// console.log(data);
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
	

	// 전화걸기
	$s.doExecCallPhone = function(num) {
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.callDial(num);
			} 
		} else if($rs.agent=='ios') {
			
		}
		
		$s.closeOrganUserDialog();
	}
	
	// SMS
	$s.doExecSMSPhone = function(num) {
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.callSMSSend(num);
			} 
		} else if($rs.agent=='ios') {
			
		}
		
		$s.closeOrganUserDialog();
	}
	
	// 이메일
	$s.doExecEmail = function(user) {
		var arr = new Array();
		arr.push(user);
		
		$rs.$broadcast("mailApplySelectedUser", arr, new Array(), new Array());
		pushOnePage('pg_mail_write');
		
		$s.closeOrganUserDialog();
	}
	
	//메일 작성페이지 파싱
	// CID 내용이 있으면 파싱, 없으면 일반내용 표시
	function parseCIDAttachMailData(mail) {
		var mailBodyObj = angular.element(mail.Body);
		var img = mailBodyObj.find('img[src^="cid:"]');
		var tmpAttachMap = new Map();
		var toParseMailBody = mail.Body;
		
		//2020.02.27 추가 - cid 이름 배열
		var tmpCidNameMap = new Map();
		
		if(img.length > 0) {
			for(var i = 0; i < img.length; i++) {
				var src = img.eq(i).attr('src');
				if(src != undefined) {
					var fileName = src.replace("cid:", "").split('@')[0];
					
					//2020.02.27 추가
					if(tmpCidNameMap.get(i) == undefined){
						tmpCidNameMap.put(i,src);
					}
					
					if(tmpAttachMap.get(fileName) != undefined) {
						toParseMailBody = toParseMailBody.replace(src, "[[CID::ATTACH_"+ tmpAttachMap.get(fileName).index + "]]");
					} else {
						for(fileIdx in mail.Attachments) {
							var attachFileName = mail.Attachments[fileIdx].FileName;
							
							if(attachFileName === fileName) {
								if(tmpAttachMap.get(fileName) == undefined) {
									tmpAttachMap.put(fileName, {index:i, attach:mail.Attachments[fileIdx]});
									//여기부터작업.
//									toParseMailBody = toParseMailBody.replace(src, mail.Attachments[fileIdx].attach.FileURL);
									toParseMailBody = toParseMailBody.replace(src, "[[CID::ATTACH_"+ i + "]]");
								} 
							}
						}
						
						//2019.11.27 추가
						//첨부파일 이름 체크하여 Attachments 배열에서 제거.
						$.each(mail.Attachments,function(index,item){
							if(item.FileName.indexOf(fileName)>-1){
								mail.Attachments.splice(index,1);
								return false;
							}
						})
					}
					
				}
			}
			
			mail.Body = toParseMailBody;
			mail.HTMLBody = $sce.trustAsHtml(mail.Body); //2020.02.20 추가
			mail.tmpAttachMap = tmpAttachMap;
			mail.tmpCidNameMap = tmpCidNameMap; //2020.02.27 추가. - cid 이름 배열
			
//			mail.Attachments = new Array(); //2019.11.27 수정 - 첨부파일리스트 초기화 주석처리.
			
		} else {
			var mailBody = angular.element(mail.Body);
			var approvalLink = mailBody.find('a[href*="/Workflow/Page/Link.aspx"]');
			var approvalLinkIndex = mail.Body.indexOf("/Workflow/Page/Link.aspx");
			
			if(approvalLinkIndex != -1) {
				var docID = approvalLink.attr('href').split('?')[1].split('=')[1];
				
				console.log(docID);
				
				setTimeout(function(){
					var script = "javascript:btnToApprovalDetail('"+docID.trim()+"');";
					mail.Body = mail.Body.replace("https://ep.halla.com/Workflow/Page/Link.aspx?docId="+docID, script);// $rs.apiURL이 현재https.
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
//		$s.currZoom++;
		$s.currZoom += 0.5;
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
//		$s.currZoom--;
		$s.currZoom -= 0.5;
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


// mailWrite
// 메일유형
// 1 : 일반, 2 : 회신, 3 : 전체회신, 4 : 전달
appHanmaru.controller('hallaMailWriteCtrl', ['$scope', '$http', '$rootScope','$sce', function($s, $http, $rs, $sce) {
	$s.hasMailData = false;
	$s.isFlagMailMe = false;
	$s.attach_list = new Array();
	//UI 상 표기되는 user list
	$s.recipient_user_list = new Array(); 
	$s.cc_user_list= new Array();
	$s.hcc_user_list = new Array();
	//실제 data로 넘어가는 user list
	$s.TOrecipient_user_list = new Array();
	$s.CCrecipient_user_list = new Array();
	$s.BCCrecipient_user_list = new Array();
	$s.uploadFileList = new Array();
	$s.deleteFileList = new Array();
	$s.mailType = 1; // 기본 메일타입
	$s.isMailSend = false;
	$s.txt_rcv_name = '';
	$s.txt_cc_name = '';
	$s.txt_hcc_name = '';
	
//	var mailContents = angular.element('.wrap_contents');
//	mailContents.on('click', function(){
//		mailContents.find('iframe').focus();
//	});
	
	
	$rs.$on('mailContentsReset', function(event){
		// 에디터 내용 리셋
		var mailContents = angular.element('#mailContents');
		var frameMailContents = angular.element(mailContents.contents());
		frameMailContents.find('#btnResetBodyValue').trigger('click');
		
		//2020.03.03 추가
		$s.hasMailData = false;
		$s.isFlagMailMe = false;
		$s.attach_list = new Array();
		//UI 상 표기되는 user list
		$s.recipient_user_list = new Array(); 
		$s.cc_user_list= new Array();
		$s.hcc_user_list = new Array();
		//실제 data로 넘어가는 user list
		$s.TOrecipient_user_list = new Array();
		$s.CCrecipient_user_list = new Array();
		$s.BCCrecipient_user_list = new Array();
		$s.uploadFileList = new Array();
		$s.deleteFileList = new Array();
		$s.mailType = 1; // 기본 메일타입
		$s.isMailSend = false;
		$s.txt_rcv_name = '';
		$s.txt_cc_name = '';
		$s.txt_hcc_name = '';
		
		$s.showHide = false;
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
//		$s.mailType = 1; // 기본 메일타입 -  2020.01.07 주석처리. 
		$s.txt_rcv_name = '';
		$s.txt_cc_name = '';
		$s.txt_hcc_name = '';
		
		$s.showHide = false;
		
//		var frameMailContents = angular.element(mailContents.contents());
//		frameMailContents.find('#btnResetBodyValue').trigger('click');

		//2019.01.06 수정 - 작성중 뒤로가기시 임시저장.
		
		var mailContents = angular.element('#mailContents');
		var frameMailContents = angular.element(mailContents.contents());
		frameMailContents.find('#btnGetBodyValue').trigger('click');
		var mailContents = frameMailContents.find('#tmpMailContents').val();
		$s.mailContents = mailContents;
		
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
		
		//2019.01.07 추가 - 임시저장 함수 추가.
		var reqBodyData = {
				LoginKey:$rs.userInfo.LoginKey,
				MailType:$s.mailType,
				Subject: $s.mailSubject,
				Body: $s.mailContents,
				ToRecipients:'',
				CcRecipients:'',
				BccRecipients:'',
				NewFileList:'',
				DeleteFileList:''
		}
		
		if($s.replyForwardMail != undefined) {
			reqBodyData.MailId = $s.replyForwardMail.ItemId; 
		}
		
		if($rs.originalMailData != undefined || $rs.originalMailData !=null || $rs.originalMailData != ''){
			$rs.originalMailData = undefined;
		}  
		
		var param1 = callApiObject('mail', 'mailSendBody', reqBodyData);
		$http(param1).success(function(data) {
			//2020.02.24 추가
			//뒤로가기 후 에디터 초기화
			var mailContents = angular.element('#mailContents');
			var frameMailContents = angular.element(mailContents.contents());
			frameMailContents.find('#btnResetBodyValue').trigger('click');	
			
			popPage(currPageName);	
		});
	}
	
	$s.showHide = false;
	$s.toggleShowHide = function(){
		$s.showHide = !$s.showHide;
	};
	
	//메일 작성페이지 파싱
	// CID 내용이 있으면 파싱, 없으면 일반내용 표시
	function parseCIDAttachMailData(mail) {
		var mailBodyObj = angular.element(mail.Body);
		var img = mailBodyObj.find('img[src^="cid:"]');
		var tmpAttachMap = new Map();
		var toParseMailBody = mail.Body;
		
		//2020.02.27 추가 - cid 이름 배열
		var tmpCidNameMap = new Map();
		
		if(img.length > 0) {
			for(var i = 0; i < img.length; i++) {
				var src = img.eq(i).attr('src');
				if(src != undefined) {
					var fileName = src.replace("cid:", "").split('@')[0];
					
					//2020.02.27 추가
					if(tmpCidNameMap.get(i) == undefined){
						tmpCidNameMap.put(i,src);
					}
					
					if(tmpAttachMap.get(fileName) != undefined) {
						toParseMailBody = toParseMailBody.replace(src, "[[CID::ATTACH_"+ tmpAttachMap.get(fileName).index + "]]");
					} else {
						for(fileIdx in mail.Attachments) {
							var attachFileName = mail.Attachments[fileIdx].FileName;
							
							if(attachFileName === fileName) {
								if(tmpAttachMap.get(fileName) == undefined) {
									tmpAttachMap.put(fileName, {index:i, attach:mail.Attachments[fileIdx]});
									//여기부터작업.
//									toParseMailBody = toParseMailBody.replace(src, mail.Attachments[fileIdx].attach.FileURL);
									toParseMailBody = toParseMailBody.replace(src, "[[CID::ATTACH_"+ i + "]]");
								} 
							}
						}
						
						//2019.11.27 추가
						//첨부파일 이름 체크하여 Attachments 배열에서 제거.
						$.each(mail.Attachments,function(index,item){
							if(item.FileName.indexOf(fileName)>-1){
								mail.Attachments.splice(index,1);
								return false;
							}
						})
					}
					
				}
			}
			
			mail.Body = toParseMailBody;
			mail.HTMLBody = $sce.trustAsHtml(mail.Body); //2020.02.20 추가
			mail.tmpAttachMap = tmpAttachMap;
			mail.tmpCidNameMap = tmpCidNameMap; //2020.02.27 추가. - cid 이름 배열
			
//			mail.Attachments = new Array(); //2019.11.27 수정 - 첨부파일리스트 초기화 주석처리.
			
		} else {
			var mailBody = angular.element(mail.Body);
			var approvalLink = mailBody.find('a[href*="/Workflow/Page/Link.aspx"]');
			var approvalLinkIndex = mail.Body.indexOf("/Workflow/Page/Link.aspx");
			
			if(approvalLinkIndex != -1) {
				var docID = approvalLink.attr('href').split('?')[1].split('=')[1];
				
				console.log(docID);
				
				setTimeout(function(){
					var script = "javascript:btnToApprovalDetail('"+docID.trim()+"');";
					mail.Body = mail.Body.replace("https://ep.halla.com/Workflow/Page/Link.aspx?docId="+docID, script);// $rs.apiURL이 현재https.
					mail.HTMLBody = $sce.trustAsHtml(mail.Body);
				}, 200);
			} else {
				mail.HTMLBody = $sce.trustAsHtml(mail.Body);			
			}
		}
	}
	
	
	$rs.$on('initReplyForwardMailData', function(event, mail, data, list, mailType){
		//2020.02.25 추가 - 회신/전달시 원본 메일 파싱하는 부분.
		//기존에는 각 버튼 클릭시 파싱 -> 변경후 여기서 파싱.
		//2020.03.12 수정 -> 다시 버튼 클릭시 파싱하도록 변경.
		parseCIDAttachMailData(mail);
		
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
				$s.showHide = true;
			}else{
				$s.showHide = false;
			}
			
			for(idx in ccList) {
				var recipients = {};
				var user = ccList[idx];
				
				if(user.UserName != undefined) {
					recipients.DisplayName = user.DisplayName;
					recipients.EMailAddress = user.EMailAddress;
				}
				//2019.11.26 추가
				else if(user.DisplayName != undefined){
					recipients.DisplayName = user.DisplayName;
					recipients.EMailAddress = user.EMailAddress;
				}
				else {
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
				} 
				//2019.11.26 추가
				else if(user.DisplayName != undefined){
					recipients.DisplayName = user.DisplayName;
					recipients.EMailAddress = user.EMailAddress;
				}
				else {
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
			//2020.02.24 수정
			//메일 회신, 전달시 본문내용 불러오기 위함.
//			// CID ATTACH 가 있을 떄 값 교체
			function downloadCIDFileAS(index, cid) {
				$http.get(cid.FileURL, {responseType:'arraybuffer'}).success((function(index) {
				    return function(data) {
						var base64Data = 'data:image/' + extension + ';base64,'+ _arrayBufferToBase64(data);
						// [[CID::ATTACH_1]]
						var cidAttachIndex = '[[CID::ATTACH_'+index+']]';
						
						mail.Body = mail.Body.replaceAll(cidAttachIndex, base64Data);
						mail.HTMLBody = $sce.trustAsHtml(mail.Body);
						
						var mailContents = angular.element('#mailContents');
						var frameMailContents = angular.element(mailContents.contents());
						frameMailContents.find('#tmpMailContents').val(mail.Body);
						frameMailContents.find('#btnSetBodyValue').trigger('click');
				    }
				})(index));
			}
				
			//
			if(mail.tmpAttachMap != undefined) {
				var keys = Object.keys(mail.tmpAttachMap.map);
				for(var i = 0; i < keys.length; i++) {
					var fileName = keys[i];
					var index = mail.tmpAttachMap.get(fileName).index;
					var cidAttach = mail.tmpAttachMap.get(fileName).attach;
					var extension = cidAttach.FileName.split('.').pop();
					downloadCIDFileAS(index, cidAttach);
				}
			}
			
			
			var mailContents = angular.element('#mailContents');
			var frameMailContents = angular.element(mailContents.contents());
//			frameMailContents.find('#tmpMailContents').val(mail.HTMLBody);
			frameMailContents.find('#tmpMailContents').val(mail.Body);
			frameMailContents.find('#btnSetBodyValue').trigger('click');
		},100);

		if(mailType == 1){
			// 에디터 내용 리셋
			var mailContents = angular.element('#mailContents');
			var frameMailContents = angular.element(mailContents.contents());
			frameMailContents.find('#btnResetBodyValue').trigger('click');	
		}

	});
	
	// 조직도 사용자 선택 반영
	$rs.$on("mailApplySelectedUser", function(e, rcv, cc, bcc) {
		// console.log(cc);
		// console.log(bcc);
		
		if(rcv.length > 0) {
			for(idx in rcv) {
				// console.log($s.recipient_user_list.indexOf(rcv[idx]));
				if($s.recipient_user_list.indexOf(rcv[idx]) == -1) {
					$s.recipient_user_list.push(rcv[idx]);
				}
			}
		}
		
		if(cc.length > 0) {
			for(idx in cc) {
				// console.log($s.cc_user_list.indexOf(cc[idx]));
				if($s.cc_user_list.indexOf(cc[idx]) == -1) {
					$s.cc_user_list.push(cc[idx]);
				}
				
			}
		}
		
		if(bcc.length > 0) {
			for(idx in bcc) {
				// console.log($s.hcc_user_list.indexOf(bcc[idx]));
				if($s.hcc_user_list.indexOf(bcc[idx]) == -1) {
					$s.hcc_user_list.push(bcc[idx]);
				}
			}
		}
		
		for(idx in rcv) {
			var recipients = {};
			var user = rcv[idx];
			
			//2019.11.27 추가(내게 쓰기시 중복안되게)
			if($s.isFlagMailMe){
				if($rs.userInfo.EmailAddress == user.EmailAddress){
					$s.recipient_user_list.splice(idx, 1);
					$s.TOrecipient_user_list.splice(idx, 1);
				}
			}
			
			if(user.UserName != undefined) {
				recipients.DisplayName = user.UserName;
				recipients.EMailAddress = user.EmailAddress;
			} 
			//2019.11.26 추가
			else if(user.DisplayName != undefined){
				recipients.DisplayName = user.DisplayName;
				recipients.EMailAddress = user.EMailAddress;
			}
			else {
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
			}
			//2019.11.26 추가
			else if(user.DisplayName != undefined){
				recipients.DisplayName = user.DisplayName;
				recipients.EMailAddress = user.EMailAddress;
			}
			else {
				recipients.DisplayName = user.DeptName;
				recipients.EMailAddress = user.Address;
			}
//			if($rs.userInfo.EmailAddress != user.EmailAddress){
//				
//			}
			$s.CCrecipient_user_list.push(recipients);
		}
		
		for(idx in bcc) {
			var recipients = {};
			var user = bcc[idx];
			
			if(user.UserName != undefined) {
				recipients.DisplayName = user.UserName;
				recipients.EMailAddress = user.EmailAddress;
			} 
			//2019.11.26 추가
			else if(user.DisplayName != undefined){
				recipients.DisplayName = user.DisplayName;
				recipients.EMailAddress = user.EMailAddress;
			}
			else {
				recipients.DisplayName = user.DeptName;
				recipients.EMailAddress = user.Address;
			}
//			if($rs.userInfo.EmailAddress != user.EmailAddress){
//				
//			}
			$s.BCCrecipient_user_list.push(recipients);
		}
		/*
		 * $s.TOrecipient_user_list = new Array(); $s.CCrecipient_user_list =
		 * new Array(); $s.BCCrecipient_user_list = new Array();
		 */
	});
	
	
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
			});
		});
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
			
			//2020.03.03 추가
			for(idx in $s.TOrecipient_user_list) {
				var user = $s.TOrecipient_user_list[idx];
				if(user.EMailAddress == $rs.userInfo.EmailAddress) {
					$s.TOrecipient_user_list.splice(idx, 1);
					break;
				}
			}
			$s.TOrecipient_user_list.push(recipients);
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
	
	
	//메일 작성후 본문내 이미지 재 파싱
	function parseImgTOCid(mail,body) {
		var mailBodyObj = angular.element(body);
		var img = mailBodyObj.find('img[src^="data:"]');
		var toParseMailBody = body;
		
		//2020.02.27 추가 - cid 이름 배열
		var tmpCidNameMap = mail.tmpCidNameMap;
		
		if(img.length > 0) {
			for(var i = 0; i < img.length; i++) {
				var src = img.eq(i).attr('src');
				if(src != undefined) {
					var cidVal = tmpCidNameMap.get(i);
					
					if(tmpCidNameMap.get(i) != undefined) {
						toParseMailBody = toParseMailBody.replace(src, cidVal);
					}
				}
			}
		} 
		
		mail.Body = toParseMailBody;
		mail.HTMLBody = $sce.trustAsHtml(mail.Body); //2020.02.20 추가
		mail.tmpCidNameMap = new Map();
	}
	
	
	$s.btnSendEmail = function(){
		if($s.isMailSend) {
			alert($rs.translateLanguage('mail_sending_text'));
			return;
		}
		
		$s.isMailSend = true;
		var mailContents = angular.element('#mailContents');
		var frameMailContents = angular.element(mailContents.contents());
		frameMailContents.find('#btnGetBodyValue').trigger('click');
		var mailContents = frameMailContents.find('#tmpMailContents').val();
		$s.mailContents = mailContents;
		
//		console.log('메일 body : ' , $s.mailContents);
//		console.log('메일 $s.replyForwardMail : ' , $s.replyForwardMail.Body);
		
		if($s.mailSubject == '' || $s.mailSubject == undefined) {
			alert($rs.translateLanguage('subject_hint'));
			$s.isMailSend = false;
			return;
		}
		/*
		 * if($s.mailContents == '' || $s.mailContents == undefined) {
		 * alert("내용을 입력해주세요"); return; }
		 */
		
		if($s.TOrecipient_user_list.length == 0 && ($s.txt_rcv_name == undefined || $s.txt_rcv_name == '')) {
			alert($rs.translateLanguage('receive_hint'));
			$s.isMailSend = false;
			return;
		}
		
		//2019.11.13 추가
		$rs.dialog_progress = true;
		
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
		
		//2020.02.26 추가
		//api 변경에 따른 mailType 변경(기존 : 2,3 -> 변경 : 5 / 기존 : 4 -> 변경 : 6) 
		if($s.mailType == 2 || $s.mailType ==3){
			$s.mailType = 5;
		}else if($s.mailType == 4){
			$s.mailType = 6;
		}
		
		//다운로드 된 메일본문 이미지를 cid 형식으로 다시 바꿔서 보냄.
		if($s.replyForwardMail != undefined){
			parseImgTOCid($s.replyForwardMail,$s.mailContents);
		}

		var mailSendData = {
			LoginKey:$rs.userInfo.LoginKey,
			MailType:$s.mailType,
			Subject : $s.mailSubject,
			Body : $s.replyForwardMail != undefined ? $s.replyForwardMail.Body : $s.mailContents, //$s.replyForwardMail.Body,//$s.mailContents,
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
		console.log('보내는 mail param : ',param);
		
		$http(param).success(function(data) {
			try {
				var code = parseInt(data.Code, 10);
				if(code === 1) {
					$rs.result_message = $rs.translateLanguage('send_mail_success');
					$rs.dialog_toast = true;
					
				} else if(code === -1) {
					alert(data.value);
				}
			} catch(e){}
		}).then(function(){
			setTimeout(function(){
				$rs.$apply(function(){
					$rs.dialog_toast = false;
					$rs.dialog_progress = false;
					
					$s.popPage('pg_mail_write');
					$s.isMailSend = false;
				});
			}, 1000);
		});
	}
	
	$s.getFileSizeUnit = function(value){
		return getFileSizeUnit(value);
	}
	
	// 포커스 닿으면 이전에 입력했던 목록 나오기
	// insaAutoCompleteList
	/*
	 * angular.element('.txt_rcv_name, .txt_cc_name,
	 * .txt_hcc_name').focusin(function(){ var clzNm =
	 * angular.element(this).attr('class'); var idx = 0; var srch_keyword = '';
	 * 
	 * if(clzNm.indexOf('_rcv_') != -1) { idx = 0; srch_keyword =
	 * $s.txt_rcv_name; } else if(clzNm.indexOf('_cc_') != -1) { idx = 1;
	 * srch_keyword = $s.txt_cc_name; } else if(clzNm.indexOf('_hcc_') != -1) {
	 * idx = 2; srch_keyword = $s.txt_hcc_name; }
	 * 
	 * if(srch_keyword != undefined) { var reqAutoFillInsaData = {
	 * LoginKey:$rs.userInfo.LoginKey };
	 * 
	 * //response에 displayName이 없음. 대신 Name 쓸것. var param =
	 * callApiObject('insa', 'insaAutoCompleteList', reqAutoFillInsaData);
	 * $http(param).success(function(data) { var code = data.Code; if(code ==
	 * 1){ var userList = JSON.parse(data.value); if(idx == 0) {
	 * $s.search_rcv_result = userList; } else if(idx == 1) {
	 * $s.search_cc_result = userList; } else if(idx == 2) {
	 * $s.search_hcc_result = userList; }
	 * 
	 * var lyrAutoComplete = angular.element('.search_user_list').eq(idx);
	 * if(!lyrAutoComplete.is(':visible')) { lyrAutoComplete.show(); return; } }
	 * }); } });
	 */
	/*
	 * .blur(function(){ var lyrAutoComplete =
	 * angular.element('.search_user_list'); lyrAutoComplete.hide(); });
	 */
	
	var autoFindTimeout;
	$s.btnDetectSearch = function(type, e) {
		var keyCode = e.keyCode;
		$s.search_rcv_result="";
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
			
			// fire find person api
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
				
				// 입력한 이름으로 검색하기
				autoFindTimeout = setTimeout(function(){
					var insaAutoCompleteData = {
							LoginKey:$rs.userInfo.LoginKey,
							Search:$s.txt_rcv_name
						};

						var organParam = callApiObject('insa', 'insaFind', insaAutoCompleteData);
						$http(organParam).success(function(data) {
							var code = data.Code;
							var startStr = data.value.substring(0,1);
							
							if(code == '1' && (startStr === '{' || startStr === '[')) {
								var userData = JSON.parse(data.value);
								var idx = 0;
								
								if(type === 'rcv') {
									idx = 0;
									$s.search_rcv_result = userData.Users;
								} else if(type === 'cc') {
									idx = 1;
									$s.search_cc_result = userData.Users;
								} else if(type === 'hcc') {
									idx = 2;
									$s.search_hcc_result = userData.Users;
								}
							
								var lyrAutoComplete = angular.element('.search_user_list').eq(idx);
								if(!lyrAutoComplete.is(':visible')) {
									lyrAutoComplete.show();
									return;
								}
							}
						});
				}, 100);
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
	 * window.callMailEditorFocus = function() { var currPage =
	 * angular.element('[class^="panel"][class*="current"]'); var pageName =
	 * currPage.eq(currPage.length-1).attr('id');
	 * 
	 * 
	 * if(pageName === 'pg_mail_write') { window.scrollTo(0, 300); } }
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