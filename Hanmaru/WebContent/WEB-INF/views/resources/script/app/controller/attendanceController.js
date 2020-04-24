
// 근태관리
appHanmaru.controller('attendanceController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout) {
	
	function initAttendacne(attendDate){
		$s.isStartTimeShow = false;
		$s.isEndTimeShow = false;
		
		$s.txtNowDate = '';
		$s.timeList = new Array();
		
		$s.isShowAttendBtn = false;
		$s.txtOTweek = '';
		$s.txtOTmonth = '';
		$s.amCheck = '';
		$s.pmCheck = '';
		$s.selectedStartTimeIdx = 0;
		$s.selectedEndTimeIdx = 0;
		$s.selectedLunchTimeIdx = 0;
		$s.selectedMinusTimeIdx = 0;
		
		var now = moment(new Date()).format("YYYY-MM-DD");
		
		$s.txtCurrentMonth = moment(attendDate).format("M");
		$s.txtWorkingDay = '';
		
		$rs.dialog_progress = true;
		
		// 오전 오후시간 팝업 세팅
		var attendTempTime = moment('00:00',"HH:mm");
		for(var i=0; i<96; i++){
			var sumTime = attendTempTime.add(15,'m').format('HH:mm');
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
		
		//중식시간 팝업 세팅
		$s.lunchTimeList = [{name:"00:60",value:1},{name:"00:45",value:0.75},{name:"00:30",value:0.5}];
		//공제시간 팝업 세팅
		$s.minusTimeList = new Array();
		var minusTempTime = moment('23:45',"HH:mm");
		for(var i=0;i<17;i++){
			var sumTime = minusTempTime.add(15,'m').format('HH:mm');
			
			var timeData = {
				name : 	sumTime,
				value : sumTime
			}
			$s.minusTimeList.push(timeData);
		}
		
		$s.txtStartTimeName = $s.timeList[0].name;
		$s.txtStartTimeValue = $s.timeList[0].value;
		$s.txtEndTimeName = $s.timeList[0].name;
		$s.txtEndTimeValue = $s.timeList[0].value;
		//2020.04.20 추가(중식시간, 공제시간)
		$s.txtLunchTimeName = $s.lunchTimeList[0].name;
		$s.txtLunchTimeValue = $s.lunchTimeList[0].value;
		$s.txtMinusTimeName = $s.minusTimeList[0].name;
		$s.txtMinusTimeValue = $s.minusTimeList[0].value;
	}
	
	$rs.$on('initAttendanceList', function(event,attendDate) {
		initAttendacne(attendDate);
		$s.txtNowDate = attendDate;
		
		$s.txtCurrentMonth = moment(attendDate).format("M"); //현재 월
		
		var reqAttendData = {
			LoginKey:$rs.userInfo.LoginKey == undefined ? '' : $rs.userInfo.LoginKey,
			Date : attendDate
		};
		var param = callApiObject('attendance', 'attendanceBoxs', reqAttendData);
		$http(param).success(function(data) {
//			console.log(data);
			
			var code = data.Code;
			if(code == 1){
				var resData = JSON.parse(data.value);
//				console.log(resData);
				
				$s.txtNowDate = resData.Date; 
				$s.amCheck = resData.AMCheck == '' ? 0 : 1;
				$s.pmCheck = resData.PMCheck == '' ? 0 : 1;
				
				$s.isShowAttendBtn = resData.UseButton == '1' ?  true : false;
				$s.txtOTweek = resData.OTWeek;
				$s.txtOTmonth = resData.OTMonth;
				
				//기준시간
				$s.txtWorkingDay = resData.WORKING_CNT;
				
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
				
				//중식시간 init
				for(var i=0;i<$s.lunchTimeList.length;i++){
					if(resData.LUNCH_CNT == $s.lunchTimeList[i].value){
						$s.txtLunchTimeName = $s.lunchTimeList[i].name;
						$s.txtLunchTimeValue = $s.lunchTimeList[i].value;
						$s.selectedLunchTimeIdx = i;
					}
				}
				
				//공제시간 init
				for(var i=0;i<$s.minusTimeList.length;i++){
					if(resData.MINUS_CNT == $s.minusTimeList[i].value){
						$s.txtMinusTimeValue = $s.minusTimeList[i].name;
						$s.txtMinusTimeName = $s.minusTimeList[i].value;
						$s.selectedMinusTimeIdx = i;
					}
				}
//				console.log('유저 정보 : ',$rs.userInfo);
			}
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
			PMCheck : $s.pmCheck, // 오후 반차 여부
			LUNCH_CNT : $s.txtLunchTimeValue, //중식시간
			MINUS_CNT : $s.txtMinusTimeValue //공제시간
		};
		var checkAttend = confirm($rs.translateLanguage('save_question'));
		if(checkAttend) {
			var param = callApiObject('attendance', 'attendanceSet', reqData);
//			console.log('근태저장 param : ',param);
			
			$http(param).success(function(data) {
				//2020.04.07 수정 - 결과 코드 체크 로직 추가.
//				console.log('근태저장 callback : ',data);
				
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
				$rs.$broadcast('initAttendanceList',$s.txtNowDate);
				
				$timeout(function(){
					$rs.dialog_toast = false;
				}, 2000);
			});
		};
	};
	
	$s.selectStartTime = function(){
		$s.isStartTimeShow = !$s.isStartTimeShow;
		$s.isEndTimeShow = false;
		$s.isLunchTimeShow = false;
		$s.isMinusTimeShow = false;
		
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
		$s.isLunchTimeShow = false;
		$s.isMinusTimeShow = false;
		
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
	
	$s.isLunchTimeShow = false;
	//중식시간
	$s.selectLunchTime = function(event){
		$s.isLunchTimeShow = !$s.isLunchTimeShow;
		$s.isMinusTimeShow = false;
		$s.isEndTimeShow = false;
		$s.isStartTimeShow = false;
		setTimeout(function(){
			$s.$apply(function(){
				$('#LunchTimeList').scrollTop(0); 
			},50);
		});
	}
	//공제시간
	$s.isMinusTimeShow = false;
	$s.selectMinusTime = function(event){
		$s.isMinusTimeShow = !$s.isMinusTimeShow;
		$s.isLunchTimeShow = false;
		$s.isEndTimeShow = false;
		$s.isStartTimeShow = false;
		setTimeout(function(){
			$s.$apply(function(){
				$('#minusTimeList').scrollTop(0); 
			},50);
		});
	}
	
	$s.toggleTimeSelectPopup = function(event){
		$s.isStartTimeShow = false;
		$s.isEndTimeShow = false;
		$s.isLunchTimeShow = false;
		$s.isMinusTimeShow = false;
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
	
	$s.applyLunchTime = function(idx,time){
		$s.selectedLunchTimeIdx = idx;
		$s.txtLunchTimeName = time.name;
		$s.txtLunchTimeValue = time.value;
	};
	$s.applyMinusTime = function(idx,time){
		$s.selectedMinusTimeIdx = idx;
		$s.txtMinusTimeName = time.name;
		$s.txtMinusTimeValue = time.value;
	};
	
	$s.chooseSearchDate = function(type){
//		var tmp = moment($s.txtNowDate).add(-1,'days').format('YYYY-MM-DD');
//		$s.txtNowDate = tmp;
//		$rs.$broadcast('initAttendanceList',tmp);
		
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
			if(value == '' || value == undefined){
//				$rs.result_message = '올바른 날짜를 선택하세요';
//				$rs.dialog_toast = true;
//				$timeout(function(){
//					$rs.dialog_toast = false;
//				}, 1500);
			}
			else{
				$rs.$broadcast('initAttendanceList',value);
			}
		});
	};

}]);