
// 자원예약
appHanmaru.controller('reservListController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout) {
	$s.reservList;
	$s.reservState;
	$s.searchText = '';
	$s.txtSearchStart = '';
	$s.txtSearchEnd = '';
	$s.searchType = 0;
	$s.reservSearchShow = false;
	$s.isCancelReserv = false;
	
	
	$rs.$on('initReservList', function(event) {
		$s.SearchTypeOptions = [
			{'name': $rs.translateLanguage('resource_owner_') ,'value': 0},
			{'name': $rs.translateLanguage('subject'),'value': 1},
			{'name': $rs.translateLanguage('body') ,'value': 2}
		];
		
		$s.SearchType = $s.SearchTypeOptions[0].value;
		$rs.dialog_progress = true;
		$s.reservSearchShow = false;
		
		var now = moment(new Date()).format("YYYY-MM-DD");
		var monthAgo = moment(new Date()).subtract(1, 'month').format("YYYY-MM-DD");
		$s.txtSearchStart = monthAgo;
		$s.txtSearchEnd = now;

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
	
	$s.toggleReservSearchDD = function(){
		$s.reservSearchShow = !$s.reservSearchShow;
	};
	
	$s.getReservState = function(reservItem){
		if(reservItem == 0){
			return '7px solid #BCBEC1';
		}else{
			return '7px solid #4E86FF';
		};
	};

	$s.reservCancel = function(seq){
		$s.isCancelReserv = true;
		var reqReservCancelData = {
			LoginKey : 	$rs.userInfo.LoginKey,
			Seq : seq,
			State : -2
		};
		var param = callApiObject('reserv','resourceReservationState',reqReservCancelData);
		$http(param).success(function(data){
			$rs.$broadcast('initReservList');
			$s.isCancelReserv = false;
		});
	};
	
	$s.btnReservDetail = function(reservItem){
		if(!$s.isCancelReserv){
			$rs.pushOnePage('pg_reserv_view');
			$rs.$broadcast('initReservView',reservItem);
		};
	};
	
	$s.reservSearch = function(event){
		$s.reservSearchShow = !$s.reservSearchShow;
	};
	
	$s.applySearchType = function(value){
		$s.searchType = value;
	};
	
	$s.searchReserv = function(event){
		$s.reservSearchShow = false;
		$rs.dialog_progress = true;
		// 검색
		var reqReservData = {
			LoginKey : 	$rs.userInfo.LoginKey,
			StartdateTime : $s.txtSearchStart != undefined ? $s.txtSearchStart : '',
			EnddateTime : $s.txtSearchEnd != undefined ? $s.txtSearchEnd : '',
			SearchFiled : $s.searchType,
			SearchText : $s.searchText,
			PageSize : 20,
			PageNumber : 1	
		};
		var param = callApiObject('reserv','reservBoxs',reqReservData);
		$http(param).success(function(data){
			var reservListData = JSON.parse(data.value);
			$s.reservList = reservListData;
			$rs.dialog_progress = false;
		});
	};
	
	$s.reservBtn = function(){
		var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
		pushPage(pageName, 'pg_reserv_booking_list');
		$rs.$broadcast('initBookingList');
	};
	
	$s.chooseSearchDate = function(type){
		if($rs.agent == 'android') {
			if(androidWebView != undefined) androidWebView.callReservDatePickerDialog(type);
		}; 
	};
// //android bridge result
	window.setReservSearchDate = function(type, value) {
		$s.$apply(function() {
			if(type === 'start') {
				$s.txtSearchStart = value;
			} else if(type === 'end') {
				$s.txtSearchEnd = value;
			}
		});
	};
// ios datepicker webview
	if ($rs.agent=='ios'){
		var elems = document.getElementsByClassName("txtDateSearch");
		for (var i = 0; i < elems.length; i++) {
		    elems[i].setAttribute("type", "date");
		};
	};
	
}]);
// 내 예약 상세
appHanmaru.controller('ReservViewController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.reservDetailData;
	$s.reservOrganList = new Array();
	$s.reservFieldName = new Array();
	$s.isCancelReserv = false;
	$s.isReservAttachBg = false; //첨부파일 배경화면 control

	$rs.$on('initReservView',function(event,reservItem){
		$rs.dialog_progress = true;
		$s.isReservAttachBg = false;
		
		var reqReservDetailData = {
			LoginKey : 	$rs.userInfo.LoginKey,
			Seq : reservItem.SEQ
		};
		var param = callApiObject('reserv','resourceReservation',reqReservDetailData);
		$http(param).success(function(data){
			var resData = JSON.parse(data.value);
			
			$s.reservDetailData = resData;
			$s.reservOrganList = resData.Users;
			$rs.dialog_progress = false;
		});
	});
	
	$s.btnResourceInfo = function(resourceInfo){
		$rs.pushOnePage('pg_reserv_info');
		$rs.$broadcast('initReservInfo',resourceInfo);
	};
	
	$s.reservCancel = function(seq){
		$s.isCancelReserv = true;
		var reqReservCancelData = {
			LoginKey : 	$rs.userInfo.LoginKey,
			Seq : seq,
			State : -2
		};
		var param = callApiObject('reserv','resourceReservationState',reqReservCancelData);
		$http(param).success(function(data){
			$rs.$broadcast('initReservList');
			$s.isCancelReserv = false;
			$rs.popPage('pg_reserv_view');
		});
	};
	
	$s.toggleReservAttach = function(){
		$s.isReservAttachBg = !$s.isReservAttachBg;
	};
	
	$s.getFileSizeUnit = function(value){
		return getFileSizeUnit(value);
	};
	
	$s.btnDownloadAttachFile = function(fileURL, fileName) {
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.downloadAttachFile(fileURL, fileName);
			}
		} else if($rs.agent == 'ios') {
			webkit.messageHandlers.iosDownloadAttachFile.postMessage({fileURL:fileURL,fileName:fileName});
		}
	};
}]);

// 예약하기 리스트
appHanmaru.controller('ReservBookingListController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	
	$s.areaList = new Array();
	$s.reservPossibleList = new Array();
	$s.txtSearchStart;
	$s.txtSearchEnd;
	$s.areaCode; 
	$s.periodValue = '';
	$s.curAreaIdx = 0;
	$s.txtPeriod = '';
	$s.txtSearchDate = '';
	$s.txtStartTime = '';
	$s.startDateTime = '';
	$s.endDateTime = '';
	$s.areaCodeShow = false;
	$s.areaName = '';
	$s.isTimeShow = false;
	$s.isPeriodShow = false;
	$s.isPossibleReserv = false;
	
	$s.popPage = function(currentPage){
		$s.areaList = new Array();
		$s.reservPossibleList = new Array();
		$s.txtSearchStart;
		$s.txtSearchEnd;
		$s.areaCode; 
		$s.periodValue = '';
		$s.curAreaIdx = 0;
		$s.txtPeriod = '';
		$s.txtSearchDate = '';
		$s.txtStartTime = '';
		$s.startDateTime = '';
		$s.endDateTime = '';
		$s.areaCodeShow = false;
		$s.areaName = '';
		$s.isTimeShow = false;
		$s.isPeriodShow = false;
		$s.isPossibleReserv = false;
		
		$rs.popPage(currentPage);
	};
	
	$rs.$on('initBookingList',function(event){
		
		$s.timeList = [
			{'name': '06:00','value': '06:00'},
			{'name': '06:30','value': '06:30'},
			{'name': '07:00','value': '07:00'},
			{'name': '07:30','value': '07:30'},
			{'name': '08:00','value': '08:00'},
			{'name': '08:30','value': '08:30'},
			{'name': '09:00','value': '09:00'},
			{'name': '09:30','value': '09:30'},
			{'name': '10:00','value': '10:00'},
			{'name': '10:30','value': '10:30'},
			{'name': '11:00','value': '11:00'},
			{'name': '11:30','value': '11:30'},
			{'name': '12:00','value': '12:00'},
			{'name': '12:30','value': '12:30'},
			{'name': '13:00','value': '13:00'},
			{'name': '13:30','value': '13:30'},
			{'name': '14:00','value': '14:00'},
			{'name': '14:30','value': '14:30'},
			{'name': '15:00','value': '15:00'},
			{'name': '15:30','value': '15:30'},
			{'name': '16:00','value': '16:00'},
			{'name': '16:30','value': '16:30'},
			{'name': '17:00','value': '17:00'},
			{'name': '17:30','value': '17:30'},
			{'name': '18:00','value': '18:00'},
			{'name': '18:30','value': '18:30'},
			{'name': '19:00','value': '19:00'},
			{'name': '19:30','value': '19:30'},
			{'name': '20:00','value': '20:00'},
			{'name': '20:30','value': '20:30'},
			{'name': '21:00','value': '21:00'},
			{'name': '21:30','value': '21:30'},
			{'name': '22:00','value': '22:00'},
			{'name': '22:30','value': '22:30'},
			{'name': '23:00','value': '23:00'},
			{'name': '23:30','value': '23:30'}
		];
		
		$s.periodList = [
			{'name': '30'+$rs.translateLanguage('minute'),'value': '30'},
			{'name': '1'+$rs.translateLanguage('hour'),'value': '60'},
			{'name': '1'+$rs.translateLanguage('hour')+'30'+$rs.translateLanguage('minute') ,'value': '90'},
			{'name': '2'+$rs.translateLanguage('hour') ,'value': '120'},
			{'name': '2'+$rs.translateLanguage('hour')+'30'+ $rs.translateLanguage('minute'),'value': '150'},
			{'name': '3'+$rs.translateLanguage('hour') ,'value': '180'},
			{'name': '3'+$rs.translateLanguage('hour') +'30'+ $rs.translateLanguage('minute'),'value': '210'},
			{'name': '4'+$rs.translateLanguage('hour') ,'value': '240'},
			{'name': '4'+$rs.translateLanguage('hour') + '30'+$rs.translateLanguage('minute'),'value': '270'},
			{'name': '5'+$rs.translateLanguage('hour') ,'value': '300'},
			{'name': '5'+$rs.translateLanguage('hour') + '30'+$rs.translateLanguage('minute') ,'value': '330'},
			{'name': '6'+$rs.translateLanguage('hour') ,'value': '360'},
			{'name': '6'+$rs.translateLanguage('hour') + '30'+$rs.translateLanguage('minute'),'value': '390'},
			{'name': '7'+$rs.translateLanguage('hour') ,'value': '420'},
			{'name': '7'+$rs.translateLanguage('hour') + '30'+$rs.translateLanguage('minute'),'value': '450'},
			{'name': '8'+$rs.translateLanguage('hour'),'value': '480'}
		];
		
		var param = callApiObject('reserv','areas',{LoginKey : $rs.userInfo.LoginKey});
		$http(param).success(function(data){
			var resData = JSON.parse(data.value);
			$s.areaCode = resData[0].Value;
			if(resData.length > 0){
				$s.areaList = resData;
				$s.areaName = $s.areaList[0].DisplayName;
			}
		});
		
		var now = moment(new Date()).format("YYYY-MM-DD");
		$s.txtSearchDate = now;
		
		//자원예약 시간 현재시간기준으로 계산(default)
		var d = new Date();
		var Hour = d.getHours();
		var Minute = d.getMinutes();
		if(Minute > 30){
			Minute = "00";
			Hour = Hour+1<10?"0"+Hour+1:Hour+1;	
		}else{
			Minute = "30";
		}
		
		$s.txtStartTime = Hour+":"+Minute// $s.timeList[0].value;
		$s.txtPeriod = $s.periodList[0].name;
		$s.periodValue = $s.periodList[0].value;
		$s.reservPossibleList = new Array();
	});
	
	$s.selectTime = function(){
		$s.isTimeShow = !$s.isTimeShow;
	};
	$s.selectPeriod = function(){
		$s.isPeriodShow = !$s.isPeriodShow;
	};
	
	$s.applyStartTime = function(selectTime){
		$s.txtStartTime = selectTime;
	};
	
	$s.applyPeriod = function(period){
		$s.periodValue = period.value;
		$s.txtPeriod = period.name;
	};
	
	$s.reservFindPossible = function(){
		if($s.txtSearchDate != '' && $s.txtSearchDate != undefined){
			var tempDate = $s.txtSearchDate + ' ' + $s.txtStartTime;
			
			var now = moment(new Date()).format("YYYY-MM-DD HH:mm");
			var tempStartDate = moment(tempDate, 'YYYY-MM-DD HH:mm').format("YYYY-MM-DD HH:mm");
			var tempEndDate = moment(tempStartDate).add($s.periodValue,'minutes').format('YYYY-MM-DD HH:mm');
			
			$s.startDateTime = tempStartDate;
			$s.endDateTime = tempEndDate;
			if(now > tempStartDate){ // 과거
				$s.isPossibleReserv = false;
			}else{
				$s.isPossibleReserv = true;
				var reqPossibleData = {
						LoginKey : 	$rs.userInfo.LoginKey,
						AreaCode : 	$s.areaCode != undefined ? parseInt($s.areaCode) : '',
						StartdateTime : $s.startDateTime,
						EnddateTime : $s.endDateTime
					};
				var param = callApiObject('reserv','resourceFindPossible',reqPossibleData);
				$http(param).success(function(data){
					var resData = JSON.parse(data.value);
					$s.reservPossibleList = resData;
				});
			};
		};
	};
	
	$s.selectAreaCode = function(){
		$s.areaCodeShow = !$s.areaCodeShow;
	};
	$s.applyArea = function(event,idx, area){
		$s.areaName = area.DisplayName;
		$s.areaCode = area.Value;
		$s.curAreaIdx = idx;
	};
	
	$s.reservChoiceBtn = function(reservPossibleItem){
		$rs.pushOnePage('pg_reserv_booking_detail');
		$rs.$broadcast('initReservBookingDetail',$s.areaCode,reservPossibleItem,$s.startDateTime,$s.endDateTime);
		
		$s.popPage('pg_reserv_booking_list');
	};
	
	$s.chooseSearchDate = function(type){
		if($rs.agent == 'android') {
			if(androidWebView != undefined) androidWebView.callReservTimeDatePickerDialog(type);	
		}; 
	};
	
	// android bridge result
	window.setReservTimeSearchDate = function(type, value) {
		$s.$apply(function() {
			if(type === 'start') {
				$s.txtSearchDate = value;
			}
		});
	};
	
// ios datepicker webview
	if ($rs.agent=='ios'){
		var elems = document.getElementsByClassName("txtDateSearch");
		for (var i = 0; i < elems.length; i++) {
		    elems[i].setAttribute("type", "date");
		};
	};
	
}]);
// 예약 등록 상세
appHanmaru.controller('ReservBookingDetailController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.mandatoryUserList = new Array();
	$s.selectUserList = new Array();
	$s.mandatoryUser = '';
	$s.selectUser = '';
	$s.startDateTime;
	$s.endDateTime;
	$s.reservDateTime;
	$s.phoneNumber = '';
	$s.purpose = '';
	$s.attendees = '';
	$s.comment = '';
	$s.reservType = 1;
	$s.attendanceCnt = 0;
	$s.attendanceLimit = new Array();
	$s.resourceCode;
	$s.areaCode;
	$s.filePathKey = '';// (1개의 자원 예약시 여러 파일 업로드해도 같은 내용,형식 : "YYYYMM/(- 제거된
						// GUID)" ex) 201705/A6129783F7F441F5884DC7BE4B556F90
	$s.schedule = 0;
	$s.isSchedule = false; // 0 or 1
	$s.isAttendansee = false; // 0 or 1
	$s.isReservDecision = false;
	$s.isReservInfo = false;
	$s.isReservReport = false;
	$s.isReservOthers = false;
	$s.attach_list = new Array();
	$s.deleteFileList = new Array();
	
	
	$rs.$on('initReservBookingDetail',function(event,areaCode,reservPossibleItem,startDateTime,endDateTime){
		var reservDateTime = startDateTime + ' ~ ' + endDateTime;
		$s.areaCode = areaCode;
		$s.startDateTime = startDateTime;// 받아온 시작 시간 계산할 것.
		$s.endDateTime = endDateTime; // 받아온 종료 시간 계산할 것.
		$s.reservDateTime = reservDateTime;
		$s.resourceCode = reservPossibleItem.Resource_code;
		var attendanceLimit = new Array(parseInt(reservPossibleItem.Attender_limit));
		
		for(var i=1;i<=attendanceLimit.length ; i++){
			$s.attendanceLimit.push(i);
		};
		$s.attendanceCnt = $s.attendanceLimit[0]; 
	});
	
	function initData(){
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
		$s.attendanceLimit = new Array();
		$s.resourceCode;
		$s.areaCode;
		$s.filePathKey = '';// (1개의 자원 예약시 여러 파일 업로드해도 같은 내용,형식 : "YYYYMM/(- 제거된
							// GUID)" ex)
							// 201705/A6129783F7F441F5884DC7BE4B556F90
		$s.schedule = 0;
		$s.isSchedule = false; // 0 or 1
		$s.isAttendansee = false; // 0 or 1
		$s.isReservDecision = false;
		$s.isReservInfo = false;
		$s.isReservReport = false;
		$s.isReservOthers = false;
		$s.attach_list = new Array();
		$s.deleteFileList = new Array();
		$s.mandatoryUser = '';
		$s.selectUser = '';
	};
	
	$s.addScheduleBtn = function(){
		$s.isSchedule = !$s.isSchedule;
	};
	
	$s.selectAttendansee = function(){
		$s.isAttendansee = !$s.isAttendansee;
	};
	
	$s.reservBtn = function(){
		if($s.purpose == '' || $s.purpose == undefined){
			alert($rs.translateLanguage('purpose_text'));
			return;
		}
		
		$s.schedule = $s.isSchedule ? 1 : 0;
		var reqReserv = {
			LoginKey : 	$rs.userInfo.LoginKey,
			AreaCode : 	$s.areaCode != undefined ? parseInt($s.areaCode) : '',
			ResourceCode : $s.resourceCode != undefined ? parseInt($s.resourceCode) : '',
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
			initData();
			$rs.pushPage('pg_reserv_booking_detail', 'pg_reserv_list');
			$rs.$broadcast('initReservList');
		});
	};
	
	$s.btnCallOrganSelect = function(e,attendType) {
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id');
		$rs.$broadcast('initInsaReservList',attendType);
		pushOnePage('pg_insa_list_reserv');
	};
	
	// 조직도 사용자 선택 반영
	$rs.$on("reservApplySelectedUser", function(e, attendType,rcv,cc) {
		if(rcv.length > 0) {
			for(idx in rcv) {
				if($s.mandatoryUserList.indexOf(rcv[idx]) == -1) {
					$s.mandatoryUserList.push(rcv[idx]);
				}
			}
		};
		
		if(cc.length > 0) {
			for(idx in cc) {
				if($s.selectUserList.indexOf(cc[idx]) == -1) {
					$s.selectUserList.push(cc[idx]);
				}
				
			}
		};
		
		for(idx in rcv) {
			var recipients = '';
			var user = rcv[idx];
			
			if(user.UserName != undefined) {
				recipients = user.EmailAddress;
			} else {
				recipients = user.Address;
			}
			$s.mandatoryUser += (recipients+';');
		};
		
		for(idx in cc) {
			var recipients = '';
			var user = cc[idx];
			
			if(user.UserName != undefined) {
				recipients = user.EmailAddress;
			} else {
				recipients = user.Address;
			}
			$s.selectUser += (recipients+';');
		};
		
	});
	
	$s.toggleReservDecision = function(){
		$s.isReservDecision = !$s.isReservDecision;
		$s.isReservInfo = false;
		$s.isReservReport = false;
		$s.isReservOthers = false;
		$s.reservType = 1;
	};
	$s.toggleReservInfo = function(){
		$s.isReservInfo = !$s.isReservInfo;
		$s.isReservDecision = false;
		$s.isReservReport = false;
		$s.isReservOthers = false;
		$s.reservType = 2;
	};
	$s.toggleReservReport = function(){
		$s.isReservReport = !$s.isReservReport; 
		$s.isReservInfo = false;
		$s.isReservDecision = false;
		$s.isReservOthers = false;
		$s.reservType = 3;
	};
	$s.toggleReservOthers = function(){
		$s.isReservOthers = !$s.isReservOthers;
		$s.isReservInfo = false;
		$s.isReservDecision = false;
		$s.isReservReport = false;
		$s.reservType = 4;
	};
	
	$s.popPage = function(currentPage){
		initData();
		pushPage(currentPage, 'pg_reserv_booking_list');
		$rs.$broadcast('initBookingList');
	};
	
	$s.changeAttachFile = function(e){//
		var files = e.target.files; 
		$s.$apply(function(){
			$s.attach_list.push(files[0]);
			$s.chooser_attach_file = undefined;
			var now = moment(new Date()).format("YYYYMM");
			
			var guid = $rs.deviceID.toString();
//			var guid = $rs.deviceID.toString().replace(/\-/g,'');
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
			});
		});
	};
	$s.btnRemoveMandatoryUser = function(index) {
		var user = $s.mandatoryUserList[index];
		if(user.UserKey != undefined) {
			$s.mandatoryUserList.splice(index, 1);
		}
	};
	$s.btnRemoveSelectUser = function(index) {
		var user = $s.selectUserList[index];
		if(user.UserKey != undefined) {
			$s.selectUserList.splice(index, 1);
		}
	};
	
	$s.btnRemoveAttach = function(index) {
		$s.deleteFileList.push($s.attach_list[index].name);
		$s.attach_list.splice(index, 1);
	};
	
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
	}
});;

// 예약하기 참석인원선택
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
		
		var reqInsaListData = {
			LoginKey:$rs.userInfo.LoginKey
		};
		
		var param = callApiObject('insa', 'insaBoxs', reqInsaListData);
		$http(param).success(function(data) {
			var result = JSON.parse(data.value);
			$s.topDeptCode = result.Depts[0];
			
			searchDept(result.Depts[0], 0);
			recursiveOrganTree(result, 0, result.Depts.length);
			$s.selected_deptCode = $rs.userInfo.DeptCode;
			
			
			
			
		});
	});
	
	$s.findChildDept = function(dept, depth) {
		$s.selected_deptCode = dept.DeptCode;
		searchDept(dept, depth);
	};
	
	$s.selectOrgTab = function(index) {
		$s.tab_index = index;
	};
	
	$s.btnDetectSearch = function(e) {
		var keyCode = e.keyCode;
		if(keyCode == 13) {
			$s.btnSearchOrgUserList();
		}
	};
	
	// 조직도 임직원 / 주소록 검색 결과
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
		};
	};
	
	$s.determineProfileImg = function(user) {
		var rtnUrl = '';
		
		if(user.MyPhotoUrl.indexOf('//https') != -1) {
			rtnUrl = 'https://' + user.MyPhotoUrl.substring(user.MyPhotoUrl.indexOf('//https')+10, user.MyPhotoUrl.length);
			try {
				$http.get(rtnUrl).error(function(data){
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
	};
	
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
	};
	
	$s.closeOrganUserDialog = function(){
		$s.selectedOrganUser = undefined;
		$s.isProfileImgEnlarge = true;
	};
	
	$s.toggleProfileEnlarge = function() {
		$s.isProfileImgEnlarge = !$s.isProfileImgEnlarge;
	};
	
	// 전화걸기
	$s.doExecCallPhone = function(num) {
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.callDial(num);
			} 
		} else if($rs.agent=='ios') {
			
		};
	};
	
	// SMS
	$s.doExecSMSPhone = function(num) {
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				androidWebView.callSMSSend(num);
			} 
		} else if($rs.agent=='ios') {
			
		}
	};
	
	// 이메일
	$s.doExecEmail = function(email) {
		$s.arr_selected_rcv.push(email);
		
		$rs.$broadcast("mailApplySelectedUser", $s.arr_selected_rcv, new Array(), new Array());
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id');
		popPage(pageName);
		
		$s.closeOrganUserDialog();
	};
	
	// 현재 로그인한 아이디가 속한 부서와 사용자 찾기
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
	};
	
	// 조직도 수동으로 눌러서 찾기
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
			
			console.log(result);
			console.log(dept);
			
			if(dept.length > 0) {
				switch(currDepth) {
					case 0 :
						$s.first_depth_list = dept;
// $s.org_first_alt_user_list = result.Users;
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
	};

	$s.isUserDeptSelected = false;
	$s.userDeptSelectType = '';
	$s.rcv_count = 0;
	$s.cc_count = 0;
	$s.arr_selected_rcv = new Array();
	$s.arr_selected_cc = new Array();
	$s.arr_selected_userDept = new Array();

	// 2019-02-05 PK 캘린더 추가 선택
	$s.arr_cal_attendee = new Array();
	$s.arr_cal_Jointowner = new Array();
	
	$s.cal_attendee_Count = 0;
	$s.cal_jointowner_Count = 0;
	
	// 2019-02-11 PK 일정참고자
	$s.arr_shareUser = new Array();
	$s.ShareUser_Count = 0;
	
	
	$s.userDeptChecked = function(obj) {
		return $s.arr_selected_userDept.indexOf(obj) != -1 ? true : false;
	};
	
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
		};
	};
	
	// 자원예약/워크다이어리 - 필수참석자
	$s.btnAddRcvUserList = function(e) {
		if($s.arr_selected_userDept.length == 0) {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = $rs.translateLanguage('add');
			$s.userDeptSelectType = 'rcv';
		} else {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = $rs.translateLanguage('add');
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
		};
	};
	
	// 자원예약 - 선택참석자
	$s.btnAddCCUserList = function(e) {
		if($s.arr_selected_userDept.length == 0) {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = $rs.translateLanguage('add');
			$s.userDeptSelectType = 'cc';
		} else {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = $rs.translateLanguage('add');
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
		};
	};
	
	// 2019-02-05 PK 캘린더 참석자
	$s.btnAddCalAttendeeList = function(e) {
		if($s.arr_selected_userDept.length == 0) {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = $rs.translateLanguage('add');
			$s.userDeptSelectType = 'cal_attendee';
		} else {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = $rs.translateLanguage('add');
			$s.userDeptSelectType = 'cal_attendee';
			
			for(idx in $s.arr_selected_userDept) {
				var userDept = $s.arr_selected_userDept[idx];
				if($s.arr_cal_attendee.indexOf(userDept) == -1) {
					$s.arr_cal_attendee.push(userDept);
				} else {
					continue;
				}
			}
			$s.cal_attendee_Count = $s.arr_cal_attendee.length;
			$s.arr_selected_userDept.splice(0, $s.arr_selected_userDept.length);
		};
	};
	
	// 2019-02-05 PK 캘릭더 공유자
	$s.btnAddCalJointownerList = function(e) {
		if($s.arr_selected_userDept.length == 0) {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = $rs.translateLanguage('add');
			$s.userDeptSelectType = 'cal_jointowner';
		} else {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = $rs.translateLanguage('add');
			$s.userDeptSelectType = 'cal_jointowner';
			
			for(idx in $s.arr_selected_userDept) {
				var userDept = $s.arr_selected_userDept[idx];
				if($s.arr_cal_Jointowner.indexOf(userDept) == -1) {
					$s.arr_cal_Jointowner.push(userDept);
				} else {
					continue;
				}
			}
			$s.cal_jointowner_Count = $s.arr_cal_Jointowner.length;
			$s.arr_selected_userDept.splice(0, $s.arr_selected_userDept.length);
		};
	};
	
	// 2019-02-11 PK 일정 참고자
	$s.btnAddShareUserList = function(e) {
		if($s.arr_selected_userDept.length == 0) {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = $rs.translateLanguage('add');
			$s.userDeptSelectType = 'SharaUser';
		} else {
			$s.isUserDeptSelected = true;
			$s.selectedDialogName = $rs.translateLanguage('add');
			$s.userDeptSelectType = 'SharaUser';
			
			for(idx in $s.arr_selected_userDept) {
				var userDept = $s.arr_selected_userDept[idx];
				if($s.arr_shareUser.indexOf(userDept) == -1) {
					$s.arr_shareUser.push(userDept);
				} else {
					continue;
				}
			}
			$s.ShareUser_Count = $s.arr_shareUser.length;
			$s.arr_selected_userDept.splice(0, $s.arr_selected_userDept.length);
		};
	};
	
	$s.btnCloseSelectedDialog = function(e) {
		$s.isUserDeptSelected = false;
	};
	
	$s.btnRemoveRCV = function(index) {
		$s.arr_selected_rcv.splice(index, 1);
		$s.rcv_count = $s.arr_selected_rcv.length;
	};
	$s.btnRemoveCC = function(index) {
		$s.arr_selected_cc.splice(index, 1);
		$s.cc_count = $s.arr_selected_cc.length;
	};
	
	// 2019-02-05 PK 캘린더 삭제 버튼 처리
	$s.btnRemoveAttendee = function(index) {
		$s.arr_cal_attendee.splice(index, 1);
		$s.cal_attendee_Count = $s.arr_cal_attendee.length;
	};

	$s.btnRemoveJointowner = function(index) {
		$s.arr_cal_Jointowner.splice(index, 1);
		$s.cal_jointowner_Count = $s.arr_cal_Jointowner.length;
	};
	
	// 2019-02-11 PK 일정참고자 삭제 버튼 처리
	$s.btnRemoveSharaUser = function(index) {
		$s.arr_shareUser.splice(index, 1);
		$s.ShareUser_Count = $s.arr_shareUser.length;
	};
	
	$s.btnApplySelectedUser = function(e){
		// 2019-02-05 PK 캘린더 분기문
		if( $s.attendType == 'cal_Attendee' ) {
			$rs.$broadcast("Cal_Apply_Attendee", $s.arr_cal_attendee);
		}
		else if( $s.attendType == 'cal_Jointowner' ) {
			$rs.$broadcast("Cal_Apply_Jointowner", $s.arr_cal_Jointowner);
		}
		else if( $s.attendType == 'ShareUser' ) {
			$rs.$broadcast("Apply_ShareUser", $s.arr_shareUser);
		} 
		else if($s.attendType == 'workReport'){
			$rs.$broadcast("workReportApplySelectedUser", $s.arr_selected_rcv);
		}
		else if($s.attendType == 'workPlan'){
			$rs.$broadcast("workPlanApplySelectedUser", $s.arr_selected_rcv);
		}
		else if($s.attendType == 'workTaskAttendance'){
			$rs.$broadcast("workTaskApplyAttendanceUser", $s.arr_selected_rcv);
		}
		else if($s.attendType == 'workTaskShare'){
			$rs.$broadcast("workTaskApplyShareUser", $s.arr_selected_rcv);
		}
		else {
			$rs.$broadcast("reservApplySelectedUser", $s.attendType, $s.arr_selected_rcv, $s.arr_selected_cc);	
		};
		
		$s.attendType = undefined;
		$s.arr_selected_rcv = new Array();
		$s.arr_selected_cc = new Array();
		
		$s.rcv_count = 0;
		$s.cc_count = 0;
		$s.addrCnt = 0;
		$s.organCnt = 0;
		
		popPage('pg_insa_list_reserv');
	};
	
	$s.popPage = function(currentPage){
		// 초기화해줄것
		popPage(currentPage);
		
		$s.attendType = undefined;
		
		$s.rcv_count = 0;
		$s.cc_count = 0;
		$s.addrCnt = 0;
		$s.organCnt = 0;
		
		$s.arr_selected_rcv.splice(0, $s.arr_selected_rcv.length);
		$s.arr_selected_cc.splice(0, $s.arr_selected_cc.length);
		$s.arr_selected_userDept.splice(0, $s.arr_selected_userDept.length);
	};
	
}]);


// 예약 자원 정보
appHanmaru.controller('reservResourceInfoController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout){
	$s.reservInfo ='';
	$rs.$on('initReservInfo',function(event,resourceInfo){
		$s.reservInfo = resourceInfo;
	});
}]);