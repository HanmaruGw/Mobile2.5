
// 근태관리
appHanmaru.controller('attendanceController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout) {
	
	$rs.$on('initAttendanceList', function(event,attendDate) {
		$s.isStartTimeShow = false;
		$s.isEndTimeShow = false;
		
		$s.txtNowDate = '';
		$s.timeList = new Array();
		
		$s.txtStartTimeName = '';
		$s.txtStartTimeValue = '';
		$s.txtEndTimeName = '';
		$s.txtEndTimeValue = '';
		$s.isShowAttendBtn = false;
		$s.txtOTweek = '';
		$s.txtOTmonth = '';
		$s.amCheck = '';
		$s.pmCheck = '';
		$s.selectedStartTimeIdx = 0;
		$s.selectedEndTimeIdx = 0;
		
		$rs.dialog_progress = true;
		
		// 팝업 세팅
		var tempTime = moment('00:00',"HH:mm");
		for(var i=0; i<96; i++){
			var sumTime = tempTime.add(15,'m').format('HH:mm');
			var timeSep = "";
			if(sumTime < moment('12:00',"HH:mm").format('HH:mm')){
				timeSep = $rs.translateLanguage('am');
			}else{
				timeSep = $rs.translateLanguage('pm');
			}
			var timeData = {
				name : 	timeSep + ' ' + sumTime,
				value : sumTime
			}
			$s.timeList.push(timeData);
		};
		
		$s.txtNowDate = attendDate;
		
		var reqAttendData = {
			LoginKey:$rs.userInfo.LoginKey == undefined ? '' : $rs.userInfo.LoginKey,
			Date : attendDate
		};
		var param = callApiObject('attendance', 'attendanceBoxs', reqAttendData);
		$http(param).success(function(data) {
			var resData = JSON.parse(data.value);
			console.log(resData);
			
			$s.txtNowDate = resData.Date; 
			$s.amCheck = resData.AMCheck == '' ? 0 : 1;
			$s.pmCheck = resData.PMCheck == '' ? 0 : 1;
			
			$s.isShowAttendBtn = resData.UseButton == '1' ?  true : false;
			$s.txtOTweek = resData.OTWeek;
			$s.txtOTmonth = resData.OTMonth;
			
			for(var i=0;i<$s.timeList.length;i++){
				if(resData.StartTime == $s.timeList[i].value){
					$s.txtStartTimeName = $s.timeList[i].name;
					$s.txtStartTimeValue = $s.timeList[i].value;
					$s.selectedStartTimeIdx = i;
				}
				if(resData.EndTime == $s.timeList[i].value){
					$s.txtEndTimeName = $s.timeList[i].name;
					$s.txtEndTimeValue = $s.timeList[i].value;
					$s.selectedEndTimeIdx = i;
				}
			};
		}).then(function(){
			$timeout(function(){
				$rs.dialog_progress = false;
			}, 1000);			
		});
	});
	
	$s.btnSetAttend = function(){
		var reqData = {
			LoginKey : $rs.userInfo.LoginKey,
			Date : $s.txtNowDate,
			StartTime : $s.txtStartTimeValue,
			EndTime : $s.txtEndTimeValue,
			AMCheck : $s.amCheck, // 오전반차 여부
			PMCheck : $s.pmCheck // 오후 반차 여부
		};
		var checkAttend = confirm($rs.translateLanguage('save_question'));
		if(checkAttend) {
			var param = callApiObject('attendance', 'attendanceSet', reqData);
			$http(param).success(function(data) {
				//2020.04.07 수정 - 결과 코드 체크 로직 추가.
				var code = data.Code;
				if(code == 1){
//					$s.isShowAttendBtn = false;
					$rs.result_message = $rs.translateLanguage('time_save');
					$rs.dialog_toast = true;
				}else{
					$rs.result_message = data.value == "" ? "에러 발생" : data.value;
					$rs.dialog_toast = true;
				}
				
			}).then(function(){
				$timeout(function(){
					$rs.dialog_toast = false;
					$timeout(function(){
						$rs.$broadcast('initAttendanceList',$s.txtNowDate);	
					},50);
				}, 1000);	
			});
		};
	};
	
	$s.selectStartTime = function(){
		$s.isStartTimeShow = !$s.isStartTimeShow;
		$s.isEndTimeShow = false;
		
		//2019.01.03 추가 - 시간선택 팝업시 현재 시간 기준으로 스크롤
		setTimeout(function(){
			$s.$apply(function(){
//				var divHeight = $('#attendanceTimeList').prop('scrollHeight');
//				var scrollHeight = getScrollHeight(divHeight,$s.selectedStartTimeIdx);
//				$('#attendanceTimeList').scrollTop(scrollHeight);
				
				var now = moment(new Date()).format("YYYY-MM-DD");
				if(moment($s.txtNowDate).isSame(now)){
					$('#attendanceTimeList').scrollTop(0).scrollTop($('#attendanceTimeList li:nth-child(30)').position().top); //7 am 기준 index.
				}else{
					$('#attendanceTimeList').scrollTop(0).scrollTop($('#attendanceTimeList li:nth-child('+ $s.selectedStartTimeIdx +')').position().top);
				}
				
			},50);
		});
	};
	
	$s.selectEndTime = function(event){
		$s.isEndTimeShow = !$s.isEndTimeShow;
		$s.isStartTimeShow = false;
		
		//2019.01.03 추가 - 시간선택 팝업시 현재 시간 기준으로 스크롤
		setTimeout(function(){
			$s.$apply(function(){
//				var divHeight = $('#quittingTimeList').prop('scrollHeight');
//				var scrollHeight = getScrollHeight(divHeight,$s.selectedEndTimeIdx);
//				$('#quittingTimeList').scrollTop(scrollHeight);
				
				var now = moment(new Date()).format("YYYY-MM-DD");
				if(moment($s.txtNowDate).isSame(now)){
					$('#quittingTimeList').scrollTop(0).scrollTop($('#quittingTimeList li:nth-child(70)').position().top); //5 pm 기준 index.
				}else{
					$('#quittingTimeList').scrollTop(0).scrollTop($('#quittingTimeList li:nth-child('+ $s.selectedEndTimeIdx +')').position().top);
				}
			},50);
		});
	};
	
	$s.toggleTimeSelectPopup = function(event){
		$s.isStartTimeShow = false;
		$s.isEndTimeShow = false;
	}
	

	$s.applyStartTime = function(idx,time){
		$s.selectedStartTimeIdx = idx;
		$s.txtStartTimeName = time.name;
		$s.txtStartTimeValue = time.value;
	};
	
	$s.applyEndTime = function(idx,time){
		$s.selectedEndTimeIdx = idx;
		$s.txtEndTimeName = time.name;
		$s.txtEndTimeValue = time.value;
	};
	
	$s.chooseSearchDate = function(type){
//		var tmp = moment($s.txtNowDate).add(-1,'days').format('YYYY-MM-DD');
//		$s.txtNowDate = tmp;
		
		if($rs.agent == 'android') {
			if(androidWebView != undefined) androidWebView.callAttendDatePickerDialog(type);	
		};
	};
	
	// android bridge result
	window.setAttendSearchDate = function(type, value) {
		$s.$apply(function() {
			if(type === 'start') {
				$s.txtNowDate = value;
				$rs.$broadcast('initAttendanceList',value);
			};
		});
	};
	
// ios datepicker webview
	if ($rs.agent=='ios'){
		var elems = document.getElementsByClassName("txtDateSearch");
		for (var i = 0; i < elems.length; i++) {
		    elems[i].setAttribute("type", "date");
		};
		
		$s.$watch('txtNowDate',function(value){
			$rs.$broadcast('initAttendanceList',value);
		});
	};


}]);