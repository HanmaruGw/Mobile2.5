
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
//	$s.SearchTypeOptions = [
//		{'name':'All','value':'전체'},
//		{'name':'Title','value':'제목'},
//		{'name':'Body','value':'본문'},
//		{'name':'TitleBody','value':'제목+본문'},
//		{'name':'Sender','value':'발신자'}
//	];
	
	$s.txtSearchStart = curruntMonth('start');
	$s.txtSearchEnd = curruntMonth('end');
	$s.isCalendarSearch = false;
	$s.arrSearchResult;
	$s.arrShareCalendar;
	$s.arrShareUser;
	$s.selectDate ='';
	$s.searchOptionShow = false;
	
	$rs.$on('initWorkBox',function(){
		//2019.12.05 추가
//		$s.searchType = $s.SearchTypeOptions[0].name;
//		$s.searchValue = '';
		
		
		var loginData = {
			LoginKey:$rs.userInfo.LoginKey,
		}
		var now = moment(new Date()).format("YYYY-MM-DD");
		var future = moment(new Date()).add(1,'d').format("YYYY-MM-DD");
		loginData.StartDate = now;
		loginData.EndDate = future;
		
		var param = callApiObject('work', 'workBoxs',loginData);
		$http(param).success(function(data) {
			var boxList = JSON.parse(data.value);
			$rs.subMenuType = 'work';
			$rs.subMenuList = boxList.Menus;
			$rs.currSubMenu = boxList.Menus[0].MenuKey;
			$rs.$broadcast('initWorkList',boxList.Menus[0].MenuName);
			
			var pageName = angular.element('[class^="panel"][class*="current"]').attr('id');
			pushPage(pageName, 'pg_work_list');
			
		});
	});
	
	$s.searchOption = function(){
		$s.searchOptionShow = !$s.searchOptionShow;
	}
	
	// todo 날짜 fucntion으로 바꿀것.
	$rs.$on('initWorkList', function(event) {
		
		$s.SearchTypeOptions = [
			{'value':'All','name':$rs.translateLanguage('all')},
			{'value':'Title','name':$rs.translateLanguage('subject')},
			{'value':'Body','name':$rs.translateLanguage('body') },
			{'value':'TitleBody','name':$rs.translateLanguage('subjectbody')},
			{'value':'Sender','name':$rs.translateLanguage('sender')}
			];
		$s.searchType = $s.SearchTypeOptions[0].value;
		$s.searchName = $s.SearchTypeOptions[0].name;
	  	$s.curSearchType = 0;
	  	$s.searchValue = '';
	  	
		$rs.dialog_progress = true; 
		
		var mnt = moment();
		$s.currentYear = mnt.format('YYYY');
		$s.currentMonth = mnt.format('MM');
		
		// 2019-03-04 PK 캘린더 위치값
		var		strDate = mnt.format("YYYY-MM-DD");
		var		mnt_Start = moment( strDate );
		var		mnt_end = moment( strDate );
		
		//2020.03.13 수정 - 날짜 기준 해당월 앞뒤로 3일씩만 가져오도록 수정.
		$s.startDate = mnt_Start.startOf('month').add(-3, 'days').format('YYYY-MM-DD');
		$s.endDate = mnt_end.endOf('month').add(3, 'days').format('YYYY-MM-DD');
		
		// 2019-03-04 PK 캘린더 수치 변화
//		$s.startDate = mnt_Start.startOf('month').add(-10, 'days').format('YYYY-MM-DD');
//		$s.endDate = mnt_end.endOf('month').add(10, 'days').format('YYYY-MM-DD');
		
		var reqWorkTaskListData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate:$s.startDate,	
			EndDate:$s.endDate,
			PageNumber : 1,
			PageSize : 100,//9999, 2020.03.13 수정 - 리스트 최대갯수 100개만
			SearchType : $s.searchType,
			SearchValue : $s.searchValue
		}
		
		//2019.12.05 주석처리
		// 검색 할때만 parameter로 던질것!!
//		if($s.searchType != '') {
//			reqWorkTaskListData.SearchType = $s.searchType;
//		}
//		
//		if($s.searchValue != '') {
//			reqWorkTaskListData.SearchValue = $s.searchValue;
//		}

		var param = callApiObject('work', 'workList', reqWorkTaskListData);
		$http(param).success(function(data) {
			//요일
			$s.dayOfWeekArr = [
				$rs.translateLanguage('week_sun'),$rs.translateLanguage('week_mon'),$rs.translateLanguage('week_tues'),
				$rs.translateLanguage('week_wednes'),$rs.translateLanguage('week_thurs'),$rs.translateLanguage('week_fri'),$rs.translateLanguage('week_satur')
			];
			
			var workListData = JSON.parse(data.value);
			$s.scheduleListData = workListData;
			$rs.dialog_progress = false;
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

				// 2019-03-04 PK 종일체크면 EndDate +1 시키기
				var mnt2 = moment( elem.EndDate );
				mnt2.add('days', 1);
				
				if(elem.WorkType!="T"){
					var obj = {};
					obj.title = elem.Title;
					obj.start = elem.StartDate;
					// obj.end = elem.EndDate;
					obj.end = mnt2.format('YYYY-MM-DD');
					obj.color = '#'+elem.Color;
					obj.allDay = elem.AllDayEvent;
					obj.elem = elem;
					parseCalData.push(obj);
				}
				
			}

			// 캘린더가 미정의 상태일 때 캘린더와 이벤트 정의
			if($s.cal == undefined) {
				$s.cal = angular.element('#calendar').fullCalendar({
					defaultView: 'month',
					columnHeader:true,
					navLinks: true,
					navLinkDayClick: function(date, jsEvent) {
					    $s.$apply(function(){
						    $s.isDlgScheduleDetail = true;
						    
						    switch( date.format( 'dddd' ) )
						    {
						    case 'Sunday':		$s.currSelectedDate = date.format('YYYY.MM.DD ') + '(일)';		break;
						    case 'Monday':		$s.currSelectedDate = date.format('YYYY.MM.DD ') + '(월)';		break;
						    case 'Tuesday':		$s.currSelectedDate = date.format('YYYY.MM.DD ') + '(화)';		break;
						    case 'Wednesday':	$s.currSelectedDate = date.format('YYYY.MM.DD ') + '(수)';		break;
						    case 'Thursday':	$s.currSelectedDate = date.format('YYYY.MM.DD ') + '(목)';		break;
						    case 'Friday':		$s.currSelectedDate = date.format('YYYY.MM.DD ') + '(금)';		break;
						    case 'Saturday':	$s.currSelectedDate = date.format('YYYY.MM.DD ') + '(토)';		break;
						    }
						    
						    // $s.currSelectedDate = date.format('YYYY-MM-DD
							// dddd') + 'Easy';
						    var formatDate = date.format();
						    $s.selectDate = formatDate;

							var mnt = moment( formatDate );
							mnt.add('days', 1 );
						    
						    $s.fetchScheduleDetailList(formatDate, mnt.format('YYYY-MM-DD'));
							// $s.cal.fullCalendar('gotoDate',
							// mnt.format('YYYY-MM'));
					    });
					},
					dayClick: function(date, jsEvent) {
					    $s.$apply(function(){
						    $s.isDlgScheduleDetail = true;
						    
						    switch( date.format( 'dddd' ) )
						    {
						    case 'Sunday':		$s.currSelectedDate = date.format('YYYY.MM.DD ') + '(일)';		break;
						    case 'Monday':		$s.currSelectedDate = date.format('YYYY.MM.DD ') + '(월)';		break;
						    case 'Tuesday':		$s.currSelectedDate = date.format('YYYY.MM.DD ') + '(화)';		break;
						    case 'Wednesday':	$s.currSelectedDate = date.format('YYYY.MM.DD ') + '(수)';		break;
						    case 'Thursday':	$s.currSelectedDate = date.format('YYYY.MM.DD ') + '(목)';		break;
						    case 'Friday':		$s.currSelectedDate = date.format('YYYY.MM.DD ') + '(금)';		break;
						    case 'Saturday':	$s.currSelectedDate = date.format('YYYY.MM.DD ') + '(토)';		break;
						    }
						    
						    // $s.currSelectedDate = date.format('YYYY-MM-DD
							// dddd') + 'Easy';
						    var formatDate = date.format();
						    $s.selectDate = formatDate;
						    // console.log(formatDate);

							var mnt = moment( formatDate );
							mnt.add('days', 1 );
						    
						    $s.fetchScheduleDetailList(formatDate, mnt.format('YYYY-MM-DD'));
							// $s.cal.fullCalendar('gotoDate',
							// mnt.format('YYYY-MM'));
					    });
					},
				    events:parseCalData,
				    eventClick: function(calEvent, jsEvent, view) {
				    // dayClick: function(calEvent, jsEvent, view) {
				    	var elem = calEvent.elem;
				    	elem.selectedDate = view.title;
				    	
				    	$s.$apply(function(){
				    		$s.isDlgScheduleDetail = true;

						    switch( calEvent.start.format( 'dddd' ) )
						    {
						    case 'Sunday':		$s.currSelectedDate = calEvent.start.format('YYYY.MM.DD ') + '(일)';		break;
						    case 'Monday':		$s.currSelectedDate = calEvent.start.format('YYYY.MM.DD ') + '(월)';		break;
						    case 'Tuesday':		$s.currSelectedDate = calEvent.start.format('YYYY.MM.DD ') + '(화)';		break;
						    case 'Wednesday':	$s.currSelectedDate = calEvent.start.format('YYYY.MM.DD ') + '(수)';		break;
						    case 'Thursday':	$s.currSelectedDate = calEvent.start.format('YYYY.MM.DD ') + '(목)';		break;
						    case 'Friday':		$s.currSelectedDate = calEvent.start.format('YYYY.MM.DD ') + '(금)';		break;
						    case 'Saturday':	$s.currSelectedDate = calEvent.start.format('YYYY.MM.DD ') + '(토)';		break;
						    }
				    		// $s.currSelectedDate =
							// calEvent.start.format('YYYY-MM-DD dddd') +
							// 'Easy';
				    		var formatDate = calEvent.start.format('YYYY-MM-DD');
				    		$s.selectDate = formatDate;

							var mnt = moment( formatDate );
							mnt.add('days', 1 );
						    
				    		$s.fetchScheduleDetailList(formatDate, mnt.format('YYYY-MM-DD'));
							// $s.cal.fullCalendar('gotoDate',
							// mnt.format('YYYY-MM'));
				    	});
				    }
					/*
					 * , dayClick : function(e) { alert(e); }
					 */
				});

				//swipe
				$s.cal.hammer().on('swipeleft', function(e) {
					$s.cal.fullCalendar('next');
					$s.setScheduleTitle($s.cal);
				});
				$s.cal.hammer().on('swiperight', function(e) {
					$s.cal.fullCalendar('prev');
					$s.setScheduleTitle($s.cal);
				});
			} else {				
				// 캘린더가 정의 상태일 때 캘린더 데이터 교체
				$s.cal.fullCalendar('removeEvents'); 
				$s.cal.fullCalendar('addEventSource', parseCalData);
				$s.cal.fullCalendar('gotoDate', mnt.format('YYYY-MM'));
			}
		});
	});
	

	// todo 날짜 fucntion으로 바꿀것.
	$rs.$on('ChangeWorkList', function(event) {
		$rs.dialog_progress = true;
		
		var mnt = moment();
		$s.currentMonth--;
		
		$s.currentYear = mnt.year($s.currentYear).format('YYYY');
		$s.currentMonth = mnt.month($s.currentMonth).format('MM');
		
		// 2019-03-04 PK 캘린더 위치값
		var		strDate = mnt.format("YYYY-MM-DD");
		var		mnt_Start = moment( strDate );
		var		mnt_end = moment( strDate );
		
		//2020.03.13 수정 - 날짜 기준 해당월 앞뒤로 3일씩만 가져오도록 수정.
		$s.startDate = mnt_Start.startOf('month').add(-3, 'days').format('YYYY-MM-DD');
		$s.endDate = mnt_end.endOf('month').add(3, 'days').format('YYYY-MM-DD');
		
		// 2019-03-04 PK 캘린더 수치 변화
//		$s.startDate = mnt_Start.startOf('month').add(-10, 'days').format('YYYY-MM-DD');
//		$s.endDate = mnt_end.endOf('month').add(10, 'days').format('YYYY-MM-DD');
		
		//2019.12.30 수정
		//searchtype, searchValue 무조건 같이 넘기도록.
		var reqWorkTaskListData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate:$s.startDate,	
			EndDate:$s.endDate,
			PageNumber : 1,
			PageSize : 100,//9999, 2020.03.13 수정 - 리스트 최대갯수 100개만
			SearchType : $s.searchType,
			SearchValue : $s.searchValue
		}
		
		//2019.12.05 주석처리
		// 검색 할때만 parameter로 던질것!!
//		if($s.searchType != '') {
//			reqWorkTaskListData.SearchType = $s.searchType;
//		}
//		if($s.searchValue != '') {
//			reqWorkTaskListData.SearchValue = $s.searchValue;
//		}
		
		var param = callApiObject('work', 'workList', reqWorkTaskListData);
		
//		console.log('changeWorkList param : ',param);
		
		$http(param).success(function(data) {
			var workListData = JSON.parse(data.value);
			$s.scheduleListData = workListData;

			$rs.dialog_progress = false;
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

				// 2019-03-04 PK 종일체크면 EndDate +1 시키기
				var mnt2 = moment( elem.EndDate );
				mnt2.add('days', 1);
				
				if(elem.WorkType!="T"){
					var obj = {};
					obj.title = elem.Title;
//					obj.start = elem.WorkType=="T"?elem.EndDate:elem.StartDate;
					obj.start = elem.StartDate;
					obj.end = mnt2.format('YYYY-MM-DD');
					obj.color = '#'+elem.Color;
					obj.allDay = elem.AllDayEvent;
					obj.elem = elem;
					parseCalData.push(obj);
				}
				$s.fetchScheduleDetailList($s.selectDate, mnt.format('YYYY-MM-DD'));

				// 캘린더가 정의 상태일 때 캘린더 데이터 교체
				$s.cal.fullCalendar('removeEvents'); 
				$s.cal.fullCalendar('addEventSource', parseCalData);
				$s.cal.fullCalendar('gotoDate', mnt.format('YYYY-MM'));
			}
			
			//2019.12.05 추가
//			if(!$s.isCalendarSearch) {
//				$s.searchType = $s.SearchTypeOptions[0].value;			
//				$s.searchName = $s.SearchTypeOptions[0].name;
//				$s.searchValue = '';
//			}
		});
	});
	
	// 2019-02-15 PK 일정보기 상세 버튼 클릭시
	$s.Btn_Schedule_View = function(itemData) {
		$s.isDlgScheduleDetail = false;
		
		$rs.pushOnePage('pg_schedule_view');
		$rs.$broadcast('initScheduleView', itemData);
	}
	
	// 일정 타이틀(년.월) 변경
	$s.setScheduleTitle = function(cal) {
		var date = cal.fullCalendar('getDate');
		var formatYear = date.format('YYYY');
		var formatMonth = date.format('MM');
		
		$s.$apply(function(){
			$s.currentYear = formatYear;
			// $s.currentMonth = formatMonth - 1;
			$s.currentMonth = formatMonth;
			$rs.$broadcast('ChangeWorkList');
		});
	};
	
	// 클릭 한 날짜의 정보를 가져옴
	$s.fetchScheduleDetailList = function(date, EndDate) {
		
		// 2019-03-04 PK 일정 보기 리스트 처리
		$s.currSelectedScheduleList = new Array();
		for(var i = 0; i < $s.scheduleListData.Count; i++) {
			//추후 작업 메뉴 추가되면 넣을것.
//			var t1 = moment( $s.scheduleListData.Items[i].WorkType=="T"?$s.scheduleListData.Items[ i ].EndDate:$s.scheduleListData.Items[ i ].StartDate, 'YYYY-MM-DD' );
			var t1 = moment( $s.scheduleListData.Items[ i ].StartDate, 'YYYY-MM-DD' );
			var t2 = moment( date, 'YYYY-MM-DD' );
			
			var Range = moment.duration( t2.diff( t1 ) ).asDays();
			
			if( Range < 0 ) {
				continue;
			}

			// console.log( "PK Date : " + $s.scheduleListData.Items[ i
			// ].StartDate );
			// console.log( "PK Day Block : " + $s.scheduleListData.Items[ i
			// ].IntOfWidthDay );
			// console.log( "PK Range : " + Range );
			
			if( Range < $s.scheduleListData.Items[ i ].IntOfWidthDay ) {
				$s.currSelectedScheduleList.push( $s.scheduleListData.Items[ i ] );
			}
		}
	};
	
	// 2019-03-12 PK 칼렌더 호출
	
	
	// 오늘날짜
	$s.btnScheduleToday = function(){
		if($s.isCalendarSearch) {
			$s.isCalendarSearch = false;
			$s.searchType = $s.SearchTypeOptions[0].value;			
			$s.searchName = $s.SearchTypeOptions[0].name;			
			$s.searchValue = '';
		}
		
		var mnt = moment();
		$s.currentYear = mnt.format('YYYY');
		// $s.currentMonth = mnt.format('MM') -1;
		$s.currentMonth = mnt.format('MM');
		
		$s.cal.fullCalendar('gotoDate', mnt.format('YYYY-MM'));
		$rs.$broadcast('ChangeWorkList');
	};
	
	// 검색
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
			//워크다이어리 검색부분 숨김처리 해제
			//$s.isShowScheduleSearch = false;
		}); 
	}
	
	$s.applySearchType = function(index) {
//		$s.searchType = value;
		
		$s.curSearchType = index;
		$s.searchType = $s.SearchTypeOptions[index].value;
		$s.searchName = $s.SearchTypeOptions[index].name;
	}
	
	$s.btnShowScheduleWrite = function(){
		$s.isDlgScheduleDetail = false;
		
		$rs.pushOnePage('pg_schedule_write');
		$rs.$broadcast('initScheduleWrite');
	}
	
	$s.btnShowScheduleWrite_Time = function() {
		$s.isDlgScheduleDetail = false;
		
		$rs.pushOnePage('pg_schedule_write');
		$rs.$broadcast( 'initScheduleWrite' );
		$rs.$broadcast('initScheduleData', $s.currSelectedDate );
	}
	
	$s.scheduleDateSelectBtn = function(event){
		if($s.isShowScheduleSearch == true){
			$s.isShowScheduleSearch = false;
		}
		$s.isShowSelectDate = !$s.isShowSelectDate;
	}
	
	$('.headerBarMenu').on('click',function(){
		$s.isShowScheduleSearch = false;
		$s.isCalendarSearch = false;
		$s.arrSearchResult = undefined;
	});
	
	$s.scheduleSearchBtn = function(event){
		if($s.isCalendarSearch) {
			$s.isCalendarSearch = false;
			$s.arrSearchResult = undefined;
		}
		
		if($s.isShowSelectDate==true){
			$s.isShowSelectDate = false;
			$s.isCalendarSearch = false;
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
	
	// 공유캘린더 호출
	$s.btnShowShareCalendar = function(){
		$s.isDlgShareCalendar = true;
		var param = {
			LoginKey:$rs.userInfo.LoginKey
		}
		
		var param = callApiObject('work', 'workCalendar', param);
		$http(param).success(function(data) {
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
	
	// 공유칼렌더 적용
	$s.applyShareCalendar = function(e) {		
		$s.isDlgShareCalendar = false;
		
		var	arr_list = new Array();
		
		for(var i = 0; i < $s.arrShareCalendar.length; i++)
		{
			var		data = {};
			data.CalendarID		= $s.arrShareCalendar[i].ID;
			data.IsChecked		= $s.arrShareCalendar[i].IsChecked;
			
			arr_list.push( data );
		}
		
		var param = {
			LoginKey:$rs.userInfo.LoginKey,
			TargetIDS:arr_list
		};
		
		var param = callApiObject( 'work', 'workCalendarCheck', param );
		$http(param).success(function(data) {
			// $s.btnScheduleToday();
			
			$s.cal.fullCalendar('gotoDate', $s.currentYear + '-' + $s.currentMonth );
			
			$s.currentMonth--;
			$rs.$broadcast('initWorkList');
		});
	}
	
	// 공유칼렌더 닫기
	$s.dismissDlgShareCalendar = function(e) {
		$s.isDlgShareCalendar = false;
	}
	
	// 일정참고자 호출
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
	
	// 일정참고자 추가
	$s.addShareUser = function(e, type) {
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id');
		$rs.$broadcast('initInsaReservList',type);
		pushOnePage('pg_insa_list_reserv');
	}
	
	// 2019-02-11 PK 일정참고자 리스트 선택 반영
	$rs.$on("Apply_ShareUser", function(e, list) {
		if( list.length > 0 ) {			
			var		arr_list = new Array();
			
			for(idx in list) {
				if($s.arrShareUser.indexOf( list[ idx ] ) == -1 ) {
					var		data = {};
					data.EmailAddress		= list[ idx ].EmailAddress;
					data.IsChecked			= 0;
					
					arr_list.push( data );
				}
			}

			var param = {
				LoginKey:$rs.userInfo.LoginKey,
				TargetUsers:arr_list
			};

			var param = callApiObject( 'work', 'workAddShareUser', param );
			$http(param).success(function(data) {
				for(idx in list) {
					if($s.arrShareUser.indexOf( list[ idx ] ) == -1 ) {
						$s.arrShareUser.push( list[ idx ] );
					}
				}
			});
		}
	});
	
	// 2019-02-11 PK 일정참고자 삭제 버튼
	$s.btnRemoveShareUser = function(index) {
		var param = {
			LoginKey:$rs.userInfo.LoginKey,
			EmailAddress:$s.arrShareUser[ index ].EmailAddress
		};

		var param = callApiObject( 'work', 'workDelShareUser', param );
		$http(param).success(function(data) {
			$s.arrShareUser.splice( index, 1 );
		});
	}

	// 2019-02-14 PK 달력 API 호출
	$s.chooseSearchDate = function(type){
		if($rs.agent == 'android') {
			if(androidWebView != undefined) androidWebView.callCalendarDatePickerDialog(type);	
		}
	}

	// android bridge result
	window.setCalendarSearchDate = function(type, value) {
		// alert( value.substr( 5, 2 ) );
		$s.$apply(function() {
			if(type == 'start') {
				$s.txtSearchStart = value;
			} else if(type == 'end') {
				$s.txtSearchEnd = value;
			}

			$s.currentYear = value.substr( 0, 4 );
			$s.currentMonth = value.substr( 5, 2 );

			$s.cal.fullCalendar('gotoDate', $s.currentYear + '-' + $s.currentMonth );
			
			// $s.currentMonth--;
			$rs.$broadcast('ChangeWorkList');	
		});
	}
	
	// ios datepicker webview
	if ($rs.agent=='ios'){
		var elems = document.getElementsByClassName("txtDateSearch");
		for (var i = 0; i < elems.length; i++) {
		    elems[i].setAttribute("type", "date");
		}
	}

	// 일정참고자 적용
	$s.applyShareUser = function(e) {
		$s.isDlgShareUser = false;
		
		var		arr_list = new Array();
		
		for(var i = 0; i < $s.arrShareUser.length; i++) {
			var		data = {};
			data.EmailAddress		= $s.arrShareUser[ i ].EmailAddress;
			
			if( $s.arrShareUser[ i ].IsChecked == true ) {
				data.IsChecked = 1;
			}
			else if( $s.arrShareUser[ i ].IsChecked == false ) {
				data.IsChecked = 0;
			}
			else {
				data.IsChecked = 0;
			}
			
			arr_list.push( data );
		}
		
		var param = {
			LoginKey:$rs.userInfo.LoginKey,
			TargetUsers:arr_list
		};

		var param = callApiObject( 'work', 'workShareUserCheck', param );
		$http(param).success(function(data) {
			$s.btnScheduleToday();
		});
	}

	$s.btnToggleShareUser = function(user) {
		if(user.IsChecked == undefined || !user.IsChecked) {
			user.IsChecked = 1;
		} else {
			user.IsChecked = 0;
		}
	}
	
	// 일정참고자 닫기
	$s.dismissDlgShareUser = function(e) {
		$s.isDlgShareUser = false;
	}
}]);

//일정보기
appHanmaru.controller('scheduleViewController', ['$scope', '$http', '$rootScope', '$sce',function($s, $http,$rs,$sce) {

	$s.bodyUrl = '';
	$s.approvalBody = '';
	
	// 2019-03-06 PK
	$s.ScheduleItem;
	$s.ScheduleViewData;
	
	$s.ScheduleStartDate = '';
	$s.ScheduleEndDate = '';
	
	// 2019-03-06 PK broadcast
	$rs.$on('initScheduleView', function(event, item) {
		$s.ScheduleItem = item;
		
		var reqScheduleParam = {
				LoginKey:$rs.userInfo.LoginKey,
				WorkID : $s.ScheduleItem.WorkID,
				Template : $s.ScheduleItem.RegEmailAddress
		}

		var param = callApiObject('work','workScheduleView',reqScheduleParam);
		$http(param).success(function(data){
			if(data.Code==1){
				var resData = JSON.parse(data.value);
				$s.ScheduleViewData = resData;
//$s.bodyUrl = resData.BodyUrl;
				var tempUrl = resData.BodyUrl+"&LoginKey="+$rs.userInfo.LoginKey;
				$s.bodyUrl = $sce.trustAsResourceUrl(tempUrl);
				
				// 2019-03-06 PK 정보 출력
				$s.ScheduleStartDate = moment( $s.ScheduleViewData.StartDate ).format('YYYY.MM.DD');
				$s.ScheduleEndDate = moment( $s.ScheduleViewData.EndDate ).format('YYYY.MM.DD');
				
			}else{
				$rs.result_message = $rs.translateLanguage('data_load_fail');
				$rs.dialog_toast = true;
				
				$timeout(function(){
					$rs.dialog_toast = false;
					$rs.popPage('pg_schedule_view');
				},1500);
			}
		}).then(function(){
			/*
			 * var bodyParam = { LoginKey:$rs.userInfo.LoginKey, WorkID :
			 * $s.ScheduleItem.WorkID, Type : 'S' }
			 * 
			 * var param = callApiObject('work','workBody',bodyParam);
			 * $http(param).success(function(data) { console.log(data);
			 * $s.approvalBody = data; });
			 */
//$http.get($s.bodyUrl).success(function(data) {
//console.log(data);
//$s.approvalBody = data;
//});
		});
	});

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
	$s.getFileSizeUnit = function(value){
		return getFileSizeUnit(value);
	}
	
	// 2019-02-15 PK 뒤로가기 버튼
	$s.BtnBack = function() {
		$s.popPage("pg_schedule_view");
	}
	
	// 2019-03-06 PK 일정 삭제
	$s.ScheduleDelete = function() {
		var param = {
				LoginKey:$rs.userInfo.LoginKey,
				WorkID : $s.ScheduleItem.WorkID,
				WorkType : 1
		}

		var param = callApiObject('work','workDelete',param);
		$http(param).success(function(data) {
			$rs.$broadcast('ChangeWorkList');
			$s.BtnBack();
		});
	}
	
	// initWorkList
	
	// 2019-03-06 PK 일정 수정
	$s.ScheduleSetting = function() {
		$rs.pushOnePage( 'pg_schedule_write' );
		console.log('일정수정 data 1 : ',$s.ScheduleItem);
		console.log('일정수정 data 2 : ',$s.ScheduleViewData);
		$rs.$broadcast( 'initScheduleWrite', $s.ScheduleItem, $s.ScheduleViewData );
	}
}]);

//일정작성
appHanmaru.controller('scheduleWriteController', ['$scope', '$http', '$rootScope', function($s, $http, $rs) {
	$s.showDialog = false;
	$s.showContentsDetail = false;
	$s.isDlgScheduleResource = false;
	$s.selectedColor = '';
	
	// 2019-03-12 PK WorkID
	$s.PK_WrokID = '';
	
	// 2019-03-06 PK 컬러 리스트
	$s.arr_Color_List = new Array();
	
	// 2019-02-14 PK 시간 선택
	$s.firstSelectTime = '';
	$s.secondSelectTime = '';
	
	// 2019-02-14 PK 자세히
	$s.isDetail = false;
	
	// 2019-02-14 PK 달력 설정
	$s.txtSearchStart = '';
	$s.txtSearchEnd = '';
	
	// 2019-02-06 PK 작업 선택
	$s.isDlgScheduleWork = false;
	$s.SelectScheduleWork;
	

	// 2019-01-30 PK 공유칼렌더
	$s.isDlgShareCalendar = false;
	$s.arrShareCalendar;
	$s.selectWithCalendar;					// 공유 캘린더 Name
	
	// 2019-02-01 PK 회의실 예약
	$s.isMeetingReserv = false;
	$s.arrMettingRoom;
	$s.selectWithMetting;
	
	// 2019-02-04 PK 참석자
	$s.arr_Attendee_list = new Array();
	$s.txt_attendee_name = '';

	// 2019-02-04 PK 공유자
	$s.arr_Jointowner_list = new Array();
	$s.txt_jointowner_name = '';
	
	// 2019-01-31 PK 시간 종일 체크
	$s.isTimeAllDayCheck = false;
	
	
	// todo popPage 호출시 초기화 해줄것.
	$s.scheduleOpenData;
	$s.txtScheduleTitle = '';
	$s.scheduleContents = '';
	$s.uploadFileList = new Array();
	$s.deleteFileList = new Array();
	$s.dayType = 0; // 기본 메일타입
	$s.fileType = 'S';// S=일정, T=작업, R=리포트, P=계획, M=템플릿
	$s.attach_list = new Array();
	$s.approvalKeyList = new Array(); 
	$s.shareUserList = new Array();
	$s.attendanceUserList = new Array();
	
	$rs.$on('initScheduleWrite',function(event, changedata, changeviewdata){
		// 2019-01-31 PK 시간 Option 배열
		var amTxt = $rs.translateLanguage('am');
		var pmTxt = $rs.translateLanguage('pm');
		$s.timeOptionList = [
			{	time:amTxt+" 12:30"	},
			{ 	time:amTxt+" 01:00"	},		{ 	time:amTxt+" 01:30"	},				{ 	time:amTxt+" 02:00" 	},		{ 	time:amTxt+" 02:30" 	},		{ 	time:amTxt+" 03:00" 	},
			{ 	time:amTxt+" 03:30" 	},		{ 	time:amTxt+" 04:00" 	},		{ 	time:amTxt+" 04:30" 	},		{ 	time:amTxt+" 05:00" 	},		{ 	time:amTxt+" 05:30" 	},
			{ 	time:amTxt+" 06:00" 	},		{	time:amTxt+" 06:30" 	},		{ 	time:amTxt+" 07:00" 	},		{ 	time:amTxt+" 07:30" 	},		{ 	time:amTxt+" 08:00" 	},
			{ 	time:amTxt+" 08:30" 	},		{ 	time:amTxt+" 09:00" 	},		{ 	time:amTxt+" 09:30" 	},		{ 	time:amTxt+" 10:00" 	},		{ 	time:amTxt+" 10:30" 	},
			{ 	time:amTxt+" 11:00" 	},		{ 	time:amTxt+" 11:30" 	},		{ 	time:pmTxt+" 12:00" 	},		{ 	time:pmTxt+" 12:30" 	},		{ 	time:pmTxt+" 01:00" 	},
			{ 	time:pmTxt+" 01:30" 	},		{ 	time:pmTxt+" 02:00" 	},		{ 	time:pmTxt+" 02:30" 	},		{ 	time:pmTxt+" 03:00" 	},		{ 	time:pmTxt+" 03:30" 	},
			{ 	time:pmTxt+" 04:00" 	},		{ 	time:pmTxt+" 04:30" 	},		{ 	time:pmTxt+" 05:00" 	},		{ 	time:pmTxt+" 05:30" 	},		{ 	time:pmTxt+" 06:00" 	},
			{ 	time:pmTxt+" 06:30" 	},		{ 	time:pmTxt+" 07:00" 	},		{ 	time:pmTxt+" 07:30" 	},		{ 	time:pmTxt+" 08:00" 	},		{ 	time:pmTxt+" 08:30" 	},
			{ 	time:pmTxt+" 09:00" 	},		{ 	time:pmTxt+" 09:30" 	},		{ 	time:pmTxt+" 10:00" 	},		{ 	time:pmTxt+" 10:30" 	},		{ 	time:pmTxt+" 11:00" 	},
			{ 	time:pmTxt+" 11:30" 	}
		];
		
		
		var reqScheduleOpenData = {
				LoginKey:$rs.userInfo.LoginKey,
				WorkID : '',
				Template : '' 
			}
		
		$s.initSchedule();
		
		$s.firstSelectTime = amTxt+" 12:30";
		$s.secondSelectTime = amTxt+" 12:30";
		

		var mnt = moment();
		$s.txtSearchStart = mnt.format('YYYY') + '-' + mnt.format('MM') + '-' + mnt.format('DD');
		$s.txtSearchEnd = mnt.format('YYYY') + '-' + mnt.format('MM') + '-' + mnt.format('DD');
		
		var param = callApiObject('work','workScheduleWriteOpen',reqScheduleOpenData);
		$http(param).success(function(data){
			var scheduleOpenData = JSON.parse(data.value);
			$s.scheduleOpenData = scheduleOpenData;
		});
		
		// 2019-03-06 PK WorkColor
		var color_param = {
				LoginKey:$rs.userInfo.LoginKey,
				IsExchange:1
		};

		var param = callApiObject( 'work', 'workColor', color_param );
		$http(param).success(function(data) {
			$s.arr_Color_List = JSON.parse( data.value );
			
			for(var i = 0; i < $s.arr_Color_List.length; i++) {
				$s.arr_Color_List[ i ].isCheck = false;
			}
			$s.arr_Color_List[ 0 ].isCheck = true;

			// 2019-03-08 PK 수정일때
			if( changedata != undefined ) {
				for(var i = 0; i < $s.arr_Color_List.length; i++) {
					if( changedata.Color == $s.arr_Color_List[ i ].Value ) {
						$s.OptionColorSelect( $s.arr_Color_List[ i ] );
						break;
					}	
				}
			}
		});
		
		// 2019-03-08 PK 수정일때
		if( changedata != undefined ) {
			$s.txtScheduleTitle = changedata.Title;
			
			$s.txtSearchStart = moment( changedata.StartDate ).format( 'YYYY-MM-DD' );
			$s.txtSearchEnd = moment( changedata.EndDate ).format( 'YYYY-MM-DD' );
			
			$s.isTimeAllDayCheck = changedata.AllDayEvent;

			$s.LoadTimeData( changedata );
			
			// 2019-03-12 PK WorkID
			$s.PK_WrokID = changedata.WorkID;
		}
		
		if( changeviewdata != undefined ) {
			if( changeviewdata != undefined ) {
				$s.txtSearchStart = moment( changedata.StartDate ).format( 'YYYY-MM-DD' );
				$s.txtSearchEnd = moment( changedata.EndDate ).format( 'YYYY-MM-DD' );
			}
			
			$s.selectWithCalendar = changeviewdata.Calencars[ 0 ];
			$s.selectWithCalendar.Name = $s.selectWithCalendar.DisplayName;
			
			// 공유자, 참석자 리스트
			$s.arr_Attendee_list = changeviewdata.AttendanceUser;
			$s.arr_Jointowner_list = changeviewdata.ShareUser;
			
			// 참조파일
			$s.attach_list = changeviewdata.Attachments;
			for(var i = 0; i < $s.attach_list.length; i++) {
				$s.attach_list[ i ].name = changeviewdata.Attachments[ i ].FileName;
				$s.attach_list[ i ].size = changeviewdata.Attachments[ i ].FileSize;	
			}
			
			// 작업 선택
			$s.LoadTaskData( changeviewdata );
			
			// 회의실 선택
			$s.LoadResourceData( changeviewdata );
		}

		// 2019-03-08 PK 공유 칼렌더 리스트 호출
		$s.ShareListCall();
	});

	// 2019-06-30 PK 날짜 입력 Broadcast
	$rs.$on('initScheduleData', function(event, time) {
		if( time != undefined ) {
			$s.txtSearchStart = moment( time ).format( 'YYYY-MM-DD' );
			$s.txtSearchEnd = moment( time ).format( 'YYYY-MM-DD' );
		}
	});
	
	// 2019-03-12 PK Task 정보 처리
	$s.LoadTaskData = function(info) {
		if( info.ParentTask == null ) {
			return;
		}

		// 2019-03-12 PK 작업선택 리스트
		var param = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate:'',
			EndDate:'',
			SearchType:'All',
			SearchValue:'',
			PageNumber:1,
			PageSize:9999
		}
		
		var param = callApiObject('work','workTaskList',param);
		$http(param).success(function(data){
			var result = JSON.parse(data.value);
			$s.arrScheduleWork = result.Items;

			for(var i = 0; i < $s.arrScheduleWork.length; i++) {
				if( info.ParentTask.Key == $s.arrScheduleWork[ i ].WorkID ) {
					$s.SelectScheduleWork = $s.arrScheduleWork[ i ];
				}
			}
			
			for(var i = 0; i < $s.arrScheduleWork.length; i++) {
				if( $s.SelectScheduleWork != undefined ) {
					if( $s.arrScheduleWork[ i ].Title == $s.SelectScheduleWork.Title ) {
						$s.arrScheduleWork[ i ].IsChecked = true;
					}
					else {
						$s.arrScheduleWork[ i ].IsChecked = false;
					}
				}
				else {
					$s.arrScheduleWork[ i ].IsChecked = false;	
				}
			}
		});
	}
	
	// 2019-03-12 PK 회의실 선택 처리
	$s.LoadResourceData = function(info) {
		if( info.Resource == null ) {
			return;
		}
		
		var param = {
				LoginKey:$rs.userInfo.LoginKey,
				AreaCode:$s.areaCode,
				StartdateTime:'2017-01-01 13:00',
				EnddateTime:'2017-01-01 14:00'
		}
		
		var param = callApiObject('reserv', 'resourceFindPossible', param);
		$http(param).success(function(data) {
			var	result = JSON.parse(data.value);			
			$s.arrMettingRoom = result;

			for(var i = 0; i < $s.arrMettingRoom.length; i++) {
				if( info.Resource.Key == $s.arrMettingRoom[ i ].Resource_code ) {
					$s.selectWithMetting = $s.arrMettingRoom[ i ];
				}
			}

			for(var i = 0; i < $s.arrMettingRoom.length; i++) {
				if( $s.selectWithMetting != undefined ) {
					if( $s.arrMettingRoom[ i ].Resource_name == $s.selectWithMetting.Resource_name ) {
						$s.arrMettingRoom[ i ].IsChecked = true;
					}
					else {
						$s.arrMettingRoom[ i ].IsChecked = false;	
					}	
				}
				else {
					$s.arrMettingRoom[ i ].IsChecked = false;	
				}
			}
		});
	}
	
	// 2019-03-11 PK 일정 시간 표시 처리
	$s.LoadTimeData = function(data) {
		// 일정 시간 체크하기
		var start_time = moment( data.StartDate ).format( 'HH:mm' );
		var end_time = moment( data.EndDate ).format( 'HH:mm' );
		
		var Start_Hour = parseInt( start_time.substr( 0, 2 ) );
		var End_Hour = parseInt( end_time.substr( 0, 2 ) );
		
		var Start_Minite = start_time.substr( 3, 2 );
		var End_Minite = end_time.substr( 3, 2 );
		
		if( Start_Hour > 12 ) {
			Start_Hour-=12;
			
			if( Start_Hour < 10 ) {
				Start_Hour = "0" + Start_Hour;
			}
			
			$s.firstSelectTime = $rs.translateLanguage('pm') + Start_Hour + ":" + Start_Minite;
		}
		else {
			if( Start_Hour < 10 ) {
				Start_Hour = "0" + Start_Hour;
			}
			
			$s.firstSelectTime = $rs.translateLanguage('am') + Start_Hour + ":" + Start_Minite;
		}
		
		if( End_Hour > 12 ) {
			End_Hour-=12;

			if( End_Hour < 10 ) {
				End_Hour = "0" + End_Hour;
			}
			
			$s.secondSelectTime =  $rs.translateLanguage('pm') + End_Hour + ":" + End_Minite;
		}
		else {
			if( End_Hour < 10 ) {
				End_Hour = "0" + End_Hour;
			}
			
			$s.secondSelectTime =  $rs.translateLanguage('am') + End_Hour + ":" + End_Minite;
		}
		
		if( $s.firstSelectTime ==  $rs.translateLanguage('am')+" 00:00" ) {
			$s.firstSelectTime =  $rs.translateLanguage('am')+" 12:30"
		}
		if( $s.secondSelectTime ==  $rs.translateLanguage('am')+" 00:00" ) {
			$s.secondSelectTime =  $rs.translateLanguage('am')+" 12:30"
		}
		
		$("#scheduleSelectName1").val($s.firstSelectTime).prop("selected", true);
		$("#scheduleSelectName2").val($s.secondSelectTime).prop("selected", true);
	}

	var scheduleContents = angular.element('.wrap_contents');
	scheduleContents.on('click', function(){
		scheduleContents.find('iframe').focus();
	});
	
	$rs.$on('ScheduleContentsReset',function() {
		// 에디터 내용 리셋
		var mailContents = angular.element('#scheduleContents');
		var frameMailContents = angular.element(mailContents.contents());
		frameMailContents.find('#btnResetBodyValue').trigger('click');
	});
	
	$s.popPage = function(currPageName) {
		popPage(currPageName);
		$s.txtScheduleTitle = '';
		$s.scheduleContents = '';
		$s.uploadFileList = new Array();
		$s.deleteFileList = new Array();
		$s.dayType = 0; // 기본 메일타입
		$s.fileType = 'S';// S=일정, T=작업, R=리포트, P=계획, M=템플릿
		$s.attach_list = new Array();
		$s.approvalKeyList = new Array(); 
		$s.shareUserList = new Array();
		$s.attendanceUserList = new Array();
		$s.showContentsDetail = false;
		
		$s.selectedColor = '';

		// 2019-02-05 PK 정보 초기화
		$s.arr_Color_List = new Array();
		
		$s.isDetail = false;

		$s.firstSelectTime = '';
		$s.secondSelectTime = '';
		
		$s.txtSearchStart = '';
		$s.txtSearchEnd = '';
		
		$s.isDlgShareCalendar = false;
		$s.arrShareCalendar;
		$s.selectWithCalendar;		
		$s.isMeetingReserv = false;
		$s.arrMettingRoom;		
		$s.arr_Attendee_list = new Array();
		$s.txt_attendee_name = '';
		$s.arr_Jointowner_list = new Array();
		$s.txt_jointowner_name = '';
		$s.isTimeAllDayCheck = false;
		$s.isColorSelect = 0;

		$s.SelectScheduleWork = undefined;
		$s.selectWithMetting = undefined;
		
		$s.PK_WrokID = '';
	}
	
	$s.initAttachFile = function(){
		// 여기에 하이브리드 기능 기술
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				
			}
		} else if($rs.agent == 'ios') {
			
		} else {
			
		}
	};
	
	$s.changeAttachFile = function(e){
		var files = e.target.files; // FileList 객체
		console.log(files);
		
		$s.$apply(function(){
			files[0].FileName = files[0].name;
			files[0].FileSize = files[0].size;
			$s.attach_list.push(files[0]);
			
			$s.chooser_attach_file = undefined;
			
			var fd = new FormData();
			fd.append('LoginKey', $rs.userInfo.LoginKey);
			fd.append('GUID',$s.scheduleOpenData.GUID);
			fd.append('Type',$s.fileType);
			fd.append('file', files[0]);
			console.log(fd);
						
			var param = callApiObjectNoData('work', 'workFileUpload');
			console.log('파일업로드 param :',param);
			
			$http.post(param.url, fd, {
				transformRequest: angular.identity,
				headers: {'Content-Type': undefined}
			}).success(function(data) {
				var code = parseInt(data.Code, 10);
				console.log('파일업로드 data :',data);
				if(code === 1) {
					$s.uploadFileList.push(files[0].name);
				}
			}).error(function(data){
				console.log('data upload error :',data);
			});
		});
//console.log($s.attach_list);
	}
	
	// 2019-02-14 PK 자세히 기능
	$s.btnDetail = function() {
		$s.isDetail = true;
	}

	// 2019-02-06 PK 첨부파일 삭제 기능
	$s.btnRemoveAttach = function(index) {
		$s.deleteFileList.push($s.attach_list[index].name);
		$s.attach_list.splice(index, 1);
	}
	
	// 2019-06-26 PK 일정 작성 초기
	
	$s.isScheduleWride = false;
	
	$s.initSchedule = function() {
		$s.isScheduleWride = false;
	}
	
	$s.btnWriteSchedule = function(){
		// 작성 눌렀으면 다시 눌러지지않게 막기
		if( $s.isScheduleWride == true ) {
			return;
		}
		
		$s.isScheduleWride = true;
		
		var ScheContents = angular.element('#scheduleContents');
		var frameMailContents = angular.element(ScheContents.contents());
		frameMailContents.find('#btnGetBodyValue').trigger('click');
		var scheduleContents = frameMailContents.find('#tmpMailContents').val();
		$s.scheduleContents = scheduleContents;

		var txtSearchStartDate = '';
		var txtSearchEndDate = '';		
		var txtfirstSearch_Time = '';
		var txtsecondSearch_Time = '';
		
		if( $s.firstSelectTime.time == undefined ) {
			txtfirstSearch_Time = $s.firstSelectTime;
		}
		else {
			txtfirstSearch_Time = $s.firstSelectTime.time;
		}

		if( $s.secondSelectTime.time == undefined ) {
			txtsecondSearch_Time = $s.secondSelectTime;
		}
		else {
			txtsecondSearch_Time = $s.secondSelectTime.time;
		}
		
		if( !$s.isTimeAllDayCheck ) {
//			if( $s.dayType == 0 ) {
			var		txtfirst_1 = txtfirstSearch_Time.substr( 0, 2 );
			var		txtfirst_Hour = txtfirstSearch_Time.substr( 3, 2 );
			var		txtfirst_Min = txtfirstSearch_Time.substr( 6, 2 );

			var		txtsecond_1 = txtsecondSearch_Time.substr( 0, 2 );
			var		txtsecond_Hour = txtsecondSearch_Time.substr( 3, 2 );
			var		txtsecond_Min = txtsecondSearch_Time.substr( 6, 2 );
			
			if( txtfirst_1 ==  $rs.translateLanguage('pm')) {
				txtfirst_Hour = parseInt( txtfirst_Hour ) + 12;
			}
			

			if( txtsecond_1 ==  $rs.translateLanguage('pm')) {
				txtsecond_Hour = parseInt( txtsecond_Hour ) + 12;
			}
			
			txtSearchStartDate = $s.txtSearchStart + " " + txtfirst_Hour + ":" + txtfirst_Min;
			txtSearchEndDate = $s.txtSearchEnd + " " + txtsecond_Hour + ":" + txtsecond_Min
			
		}
		else {
			txtSearchStartDate = $s.txtSearchStart;
			// 종일일 경우 날짜 + 1
			var mnt = moment( $s.txtSearchEnd );
			// mnt.add('days', 1 );
			txtSearchEndDate = mnt.format('YYYY-MM-DD');
		}
		
		// 2019-03-08 PK 캘린더 처리
		var	calendar_ID = '';
		if( $s.selectWithCalendar != undefined && $s.selectWithCalendar.Name != '' ) {
			calendar_ID = $s.selectWithCalendar.ID;
		}
		
		// 2019-02-15 Color 초기화
		if( $s.selectedColor == '' ) {
			$s.selectedColor = 'ffcc00';
		}
		
		// 2019-03-08 PK 참석자 & 공유자 메일 주소
		var arr_Attendee = new Array();
		var arr_Share = new Array();
		
		for(var i = 0; i < $s.arr_Attendee_list.length; i++) {
			if( $s.arr_Attendee_list[ i ].EmailAddress != undefined ) {
				arr_Attendee.push( $s.arr_Attendee_list[ i ].EmailAddress );	
			}
			else {
				arr_Attendee.push( $s.arr_Attendee_list[ i ].Key );
			}
		}

		for(var i = 0; i < $s.arr_Jointowner_list.length; i++) {
			if( $s.arr_Jointowner_list[ i ].EmailAddress != undefined ) {
				arr_Share.push( $s.arr_Jointowner_list[ i ].EmailAddress );	
			}
			else {
				arr_Share.push( $s.arr_Jointowner_list[ i ].Key );
			}
		}
		
		// 2019-03-12 PK 작업 선택
		var TaskKey = '';
		if( $s.SelectScheduleWork != undefined ) {
			TaskKey = $s.SelectScheduleWork.WorkID;
		}
		
		// 2019-03-12 PK 회의실 선택
		var Resource_Key = '';
		var Resource_Name = '';
		if( $s.selectWithMetting != undefined ) {
			Resource_Key = $s.selectWithMetting.Resource_code;
			Resource_Name = $s.selectWithMetting.Resource_name;
		}
		
		var reqSendScheduleData = {
			LoginKey:$rs.userInfo.LoginKey,
			GUID : $s.scheduleOpenData.GUID,	
			WorkID : $s.PK_WrokID,	
			CalendarID : calendar_ID,	
			Template : $rs.userInfo.EmailAddress,	
			Color : $s.selectedColor,
			Title : $s.txtScheduleTitle,	
			AllDay : $s.isTimeAllDayCheck ? 1 : 0 , //2019.01.03 수정 - $s.dayType 에서 수정함.
			StartDate : txtSearchStartDate,		// 시간 포함 시 시간까지 같이 더해서 값 설정
			EndDate : txtSearchEndDate,			// 시간 포함 시 시간까지 같이 더해서 값 설정
//StartDate : "2019-04-23", // 시간 포함 시 시간까지 같이 더해서 값 설정
//EndDate : "2019-04-23", // 시간 포함 시 시간까지 같이 더해서 값 설정
			CreateUser : $rs.userInfo.EmailAddress,			
			AttendanceUser : arr_Attendee,
			ShareUser : arr_Share,
			ShareUserPermmistion : 5,
			ParentTask : TaskKey,
			ResourceKey : Resource_Key,
			ResourceName : Resource_Name,
			Body : $s.scheduleContents,	
			Approval : $s.approvalKeyList,	
			NewFileList : $s.uploadFileList,	
			DeleteFileList : $s.deleteFileList
		}
		var param = callApiObject('work','workScheduleEdit',reqSendScheduleData);
		$http(param).success(function(data){
			console.log(data);
			try {
				var code = parseInt(data.Code, 10);
				if(code === 1) {
					setTimeout(function(){
						$s.popPage('pg_schedule_write');
						$rs.$broadcast('ChangeWorkList');
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
		$s.showContentsDetail = !$s.showContentsDetail;
		
		var reqColorListData = {
			LoginKey:$rs.userInfo.LoginKey,
			IsExchange : 1
		}
		// 색상
		var param = callApiObject('work','workColor',reqColorListData);
		$http(param).success(function(data){
			var colorList = JSON.parse(data.value);
			$s.scheduleColorList = colorList;
		});
		$s.setOptionColor = function(item){
		    var color;
		    return 'background:#'+color
		}
		$s.selectedOptionColor = function(selectedOptionColor){
			$s.selectedColor = selectedOptionColor;
		}
		
	}

	// 2019-02-14 PK 달력 API 호출
	$s.chooseSearchDate = function(type){
		if($rs.agent == 'android') {
			if(androidWebView != undefined) androidWebView.callCalendarWriteDatePickerDialog(type);	
		} 
	}

	// android bridge result
	window.setCalendarWriteSearchDate = function(type, value) {
		// alert(value + 1);
		$s.$apply(function() {
			if(type == 'start') {
				$s.txtSearchStart = value;
			} else if(type == 'end') {
				$s.txtSearchEnd = value;
			}
		});
	}
	
	// 작업 선택
	$s.btnShowScheduleWork = function(){
		$s.isDlgScheduleWork = !$s.isDlgScheduleWork;

		var param = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate:'',
			EndDate:'',
			SearchType:'All',
			SearchValue:'',
			PageNumber:1,
			PageSize:9999
		}

		$rs.dialog_progress = true;
		var param = callApiObject('work','workTaskList',param);
		$http(param).success(function(data){
			$rs.dialog_progress = false;
			
			var result = JSON.parse(data.value);
			$s.arrScheduleWork = result.Items;

			
			for(var i = 0; i < $s.arrScheduleWork.length; i++) {
				if( $s.SelectScheduleWork != undefined ) {
					if( $s.arrScheduleWork[ i ].Title == $s.SelectScheduleWork.Title ) {
						$s.arrScheduleWork[ i ].IsChecked = true;
					}
					else {
						$s.arrScheduleWork[ i ].IsChecked = false;
					}
				}
				else {
					$s.arrScheduleWork[ i ].IsChecked = false;	
				}
			}
		}).then(function(){
			
		});
	}
	
	$s.selectScheduleWork = function(cal) {
		if( cal.IsChecked == undefined || !cal.IsChecked ) {
			
			// 2019-01-30 PK 작업선택 하나만 체크되도록 처리
			for(var i = 0; i < $s.arrScheduleWork.length; i++) {
				$s.arrScheduleWork[ i ].IsChecked = false;
			}
			
			cal.IsChecked = true;
		}
		else {
			cal.IsChecked = false;
		}
	}
	
	$s.applyScheduleWork = function(e){
		$s.isDlgScheduleWork = false;
		
		for(var i = 0; i < $s.arrScheduleWork.length; i++) {
			if( $s.arrScheduleWork[ i ].IsChecked == true ) {
				$s.SelectScheduleWork = $s.arrScheduleWork[ i ]; 
				break;
			}
		}
	}
	
	$s.dismissDlgScheduleWork = function(e){
		$s.isDlgScheduleWork = false;
	}
	
	// 자원예약 선택
	$s.btnShowScheduleResource = function(){
		$s.isDlgScheduleResource = !$s.isDlgScheduleResource;
		
		var param = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate:$s.txtSearchStart,
			EndDate:$s.txtSearchEnd,
			PageNumber:1,
			PageSize:9999
		}
		
		var param = callApiObject('resource','resourceMyReservation',param);
		$http(param).success(function(data){
			var result = JSON.parse(data.value);
			$s.arrScheduleWork = result.Items;
		}).then(function(){
			
		});
	}
	
	$s.applyScheduleResource = function(e){
		$s.isDlgScheduleResource = false;
	}
	
	$s.dismissDlgScheduleResource = function(e){
		$s.isDlgScheduleResource = false;
	}
	
	// 2019-01-30 PK 참석자 & 공유자 버튼 처리
	$s.btnCallOrganSelect = function(e,attendType) {
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id');
		$rs.$broadcast('initInsaReservList',attendType);
		pushOnePage('pg_insa_list_reserv');
	}
	
	// 2019-02-05 PK 참석자 리스트 선택 반영
	$rs.$on("Cal_Apply_Attendee", function(e, list) {
		if(list.length > 0 ) {
			for( idx in list ) {
				if( $s.arr_Attendee_list.indexOf( list[ idx ] ) == -1 ){
					$s.arr_Attendee_list.push( list[ idx ] );
				}
			}
		}
	});
	
	// 2019-02-06 PK 참석자 리스트 삭제 버튼
	$s.btnRemoveAttendee = function(index) {		
		$s.arr_Attendee_list.splice(index, 1);
	}
	
	// 2019-02-05 PK 공유자 리스트 선택 반영
	$rs.$on("Cal_Apply_Jointowner", function(e, list) {
		if(list.length > 0 ) {
			for( idx in list ) {
				if( $s.arr_Jointowner_list.indexOf( list[ idx ] ) == -1 ){
					$s.arr_Jointowner_list.push( list[ idx ] );
				}
			}
		}
	});

	// 2019-02-06 PK 공유자 리스트 삭제 버튼
	$s.btnRemoveJointowner = function(index) {		
		$s.arr_Jointowner_list.splice(index, 1);
	}
	
	// 2019-02-06 PK 공유자 & 참석자 검색 기능
	var autoFindTimeout;
	$s.btnDetectSearch = function(type, e) {
		var keyCode = e.keyCode;
		var srch_keyword = '';
		
		if( type == 'attendee') {
			srch_keyword = $s.txt_attendee_name;
		} else if(type == 'jointowner') {
			srch_keyword = $s.txt_jointowner_name;
		} else {
			return;
		}

		if( srch_keyword.length >= 2 ) {
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
					
					if(type == 'attendee') {
						idx = 0;
						$s.search_attendee_result = userData.Users;
						angular.element('.txt_attendee_name').trigger('blur');
					} else if(type == 'jointowner') {
						idx = 1;
						$s.search_jointowner_result = userData.Users;
						angular.element('.txt_jointowner_name').trigger('blur');
					}
				
					var lyrAutoComplete = angular.element('.search_user_list').eq(idx);
					if(!lyrAutoComplete.is(':visible')) {
						lyrAutoComplete.show();
						return;
					}
				}
			});
		}
		else {
			// 입력한 이름으로 검색하기
			autoFindTimeout = setTimeout(function(){
				var reqAutoFillInsaData = {
					LoginKey:$rs.userInfo.LoginKey
				};
				
				var param = callApiObject('insa', 'insaAutoCompleteList', reqAutoFillInsaData);
				$http(param).success(function(data) {
					var code = data.Code;
					if(code == 1){
						var userList = JSON.parse(data.value);
						if(type == 'attendee') {
							$s.search_attendee_result = userList;
						} else if(type == 'jointowner') {
							$s.search_jointowner_result = userList;
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

	// 2019-02-06 PK 참석자 추가
	$s.addAttendeeSelectedUser = function(user) {
		var attendee = {};
		if(user.Type == undefined) {
			var arrUserInfo = user.DisplayName.split("/");
			user.UserName = arrUserInfo[0];
			user.PositionName = arrUserInfo[1];
			user.DeptName = arrUserInfo[2];
			user.CompName = arrUserInfo[3];
			$s.arr_Attendee_list.push(user);
			
			if(user.DisplayName == undefined){
				attendee.DisplayName = user.DisplayName;	
			}else{
				attendee.DisplayName = user.Name;
			}
			attendee.EMailAddress = user.EmailAddress;
		} else if(user.Type != undefined) {
			$s.arr_Attendee_list.push(user);
			if(user.DisplayName == undefined){
				attendee.DisplayName = user.DisplayName;				
			}else{
				attendee.DisplayName = user.Name;
			}
			attendee.EMailAddress = user.EmailAddress;
		}
		// $s.TOrecipient_user_list.push(recipients);
		$s.txt_attendee_name = '';
		angular.element('.search_user_list').eq(0).hide();
		
		$s.search_attendee_result = new Array();
	}

	// 2019-02-12 PK 공유자 추가
	$s.addJointownerSelectedUser = function(user) {
		var jointowner = {};
		if(user.Type == undefined) {
			var arrUserInfo = user.DisplayName.split("/");
			user.UserName = arrUserInfo[0];
			user.PositionName = arrUserInfo[1];
			user.DeptName = arrUserInfo[2];
			user.CompName = arrUserInfo[3];
			$s.arr_Jointowner_list.push(user);
			
			if(user.DisplayName == undefined){
				jointowner.DisplayName = user.DisplayName;	
			}else{
				jointowner.DisplayName = user.Name;
			}
			jointowner.EMailAddress = user.EmailAddress;
		} else if(user.Type != undefined) {
			$s.arr_Jointowner_list.push(user);
			if(user.DisplayName == undefined){
				jointowner.DisplayName = user.DisplayName;				
			}else{
				jointowner.DisplayName = user.Name;
			}
			jointowner.EMailAddress = user.EmailAddress;
		}
		// $s.TOrecipient_user_list.push(recipients);
		$s.txt_jointowner_name = '';
		angular.element('.search_user_list').eq(0).hide();
		
		$s.search_jointowner_result = new Array();
	}
	
	// 2019-01-30 PK 공유캘린더 호출
	$s.btnShowShareCalendar = function() {
		$s.isDlgShareCalendar = true;
		
		$s.ShareListCall();
	}
	
	// 2019-03-08 PK 공유 칼렌더 리스트 호출
	$s.ShareListCall = function() {
		var param = {
				LoginKey:$rs.userInfo.LoginKey
		}

		$rs.dialog_progress = true;
		var param = callApiObject('work', 'workCalendar', param);
		$http(param).success(function(data) {
			$rs.dialog_progress = false;
			
			var result = JSON.parse(data.value);
			
			// 2019-01-30 PK 공유 캘린더 체크 해제 코드
			for(var i = 0; i < result.length; i++) {
				if( $s.selectWithCalendar == undefined ) {
					result[ i ].IsChecked = false;
				}
				else if( result[ i ].Name == $s.selectWithCalendar.Name ) {
					result[ i ].IsChecked = true;
				}
				else {
					result[ i ].IsChecked = false;	
				}
			}
			
			$s.arrShareCalendar = result;
			
			$s.ShareNameCheck();
			// $s.applyShareCalendar();
		}).then(function() {
			
		});
	}
	
	// 2019-03-08 PK 공유 칼렌더 이름 체크
	$s.ShareNameCheck = function() {
		
		// 2019-01-30 PK 공유 캘린더 체크 해제 코드
		for(var i = 0; i < $s.arrShareCalendar.length; i++) {
			if( $s.selectWithCalendar != undefined ) {
				if( $s.arrShareCalendar[ i ].Name == $s.selectWithCalendar.Name ) {
					$s.arrShareCalendar[ i ].IsChecked = true;
				}
				else {
					$s.arrShareCalendar[ i ].IsChecked = false;	
				}	
			}
			else {
				$s.arrShareCalendar[ i ].IsChecked = false;	
			}	
		}
	}
	
	// 2019-01-30 PK 공유 칼렌더 체크
	$s.btnToggleShareCalendar = function(cal) {
		if( cal.IsChecked == undefined || !cal.IsChecked ) {
			
			// 2019-01-30 PK 공유캘린더 하나만 체크되도록 처리
			for(var i = 0; i < $s.arrShareCalendar.length; i++) {
				$s.arrShareCalendar[ i ].IsChecked = false;
			}
			
			cal.IsChecked = true;
		}
		else {
			cal.IsChecked = false;
		}
	}
	
	// 2019-01-30 PK 공유칼렌더 확인
	$s.applyShareCalendar = function(e) {
		$s.isDlgShareCalendar = false;
		
		if( $s.selectWithCalendar != undefined ) {
			$s.selectWithCalendar.Name = '';	
		}
		
		for(var i = 0; i < $s.arrShareCalendar.length; i++) {
			if( $s.arrShareCalendar[ i ].IsChecked == true ) {
				$s.selectWithCalendar = $s.arrShareCalendar[ i ]; 
				break;
			}
		}
		
	}
	
	// 2019-01-30 PK 공유칼렌더 닫기
	$s.dismissDlgShareCalendar = function(e) {
		$s.isDlgShareCalendar = false;
	}
	
	// 2019-01-31 PK 종일 체크
	$s.timeAllDayCheck = function(e) {
		if( $s.isTimeAllDayCheck == true ) {
			$s.isTimeAllDayCheck = false;
			$s.dayType = 0;
		}
		else {
			$s.isTimeAllDayCheck = true;
			$s.dayType = 1;
		}
	}
	
	// 2019-02-01 PK 회의실 예약
	$s.btnShowMettingReserv = function() {
		$s.isMeetingReserv = true;
		var param = {
				LoginKey:$rs.userInfo.LoginKey,
				AreaCode:$s.areaCode,
				StartdateTime:'2017-01-01 13:00',
				EnddateTime:'2017-01-01 14:00'
		}
		
		$rs.dialog_progress = true; 
		var param = callApiObject('reserv', 'resourceFindPossible', param);
		$http(param).success(function(data) {
			$rs.dialog_progress = false; 
			
			var	result = JSON.parse(data.value);
			
			$s.arrMettingRoom = result;

			for(var i = 0; i < $s.arrMettingRoom.length; i++) {
				if( $s.selectWithMetting != undefined ) {
					if( $s.arrMettingRoom[ i ].Resource_name == $s.selectWithMetting.Resource_name ) {
						$s.arrMettingRoom[ i ].IsChecked = true;
					}
					else {
						$s.arrMettingRoom[ i ].IsChecked = false;	
					}	
				}
				else {
					$s.arrMettingRoom[ i ].IsChecked = false;	
				}
			}
		}).then(function() {
			
		});
	}
	
	// 2019-02-01 PK 회의실 체크 버튼
	$s.btnCheckMettingReserv = function(met) {
		if( met.IsChecked == undefined || !met.IsChecked ) {
			
			// 2019-02-01 PK 미팅룸 하나만 체크되도록 처리
			for(var i = 0; i < $s.arrMettingRoom.length; i++) {
				$s.arrMettingRoom[ i ].IsChecked = false;
			}
			
			met.IsChecked = true;
		}
		else {
			met.IsChecked = false;
		}
	}
	
	// 2019-02-01 PK 회의실 예약 닫기
	$s.dismissMettingReserv = function() {
		$s.isMeetingReserv = false;
	}
	
	// 2019-02-01 PK 회의실 예약 적용
	$s.applyMettingReserv = function() {
		$s.isMeetingReserv = false;
		
		for(var i = 0; i < $s.arrMettingRoom.length; i++) {
			if( $s.arrMettingRoom[ i ].IsChecked == true ) {
				$s.selectWithMetting = $s.arrMettingRoom[ i ];
				break;
			}
		}
	}
	
	// 2019-01-31 PK Color 옵션 선택 ( 2019-03-06 PK 수정 )
	$s.OptionColorSelect = function(color) {
		for(var i = 0; i < $s.arr_Color_List.length; i++) {
			$s.arr_Color_List[ i ].isCheck = false;
		}
		color.isCheck = true;
		
		$s.selectedColor = color.Value;
	}	
}])
.directive('workAttachFileChange', function() {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			// todo 수정할것.
			var onChangeHandler = scope.$eval(attrs.workAttachFileChange);
			element.on('change', onChangeHandler);
			element.on('$destroy', function() {
				element.off();
			});
		}
	};
});

//END
//------------------------------------------------------------------------------------------------------------------------------

//작업 목록
appHanmaru.controller('workTaskController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout) {
	$s.SearchTypeOptions = [
		{'value':'All','name':'전체'},
		{'value':'Title','name':'제목'},
		{'value':'Body','name':'본문'},
		{'value':'TitleBody','name':'제목+본문'},
		{'value':'Sender','name':'발신자'}
	  ];
	function initTask(){
		$s.isShowTempleteDlg = false;
		$s.isShowTaskSearch = false;
		$s.taskList;
		$s.txtSearchStart = '';
		$s.txtSearchEnd = '';
		$s.taskListPage = 1;
		$s.taskSearchValue = '';
		$s.templateId = '';
		$s.workTaskId = '';
		$s.templateList;
		$s.curIdx = 0;
		$s.searchOptionShow = false;
		$s.curSearchType = 0;
	}
	
	$s.searchTypeOption = function(){
		$s.searchOptionShow  = !$s.searchOptionShow;
	}
	
	$rs.$on('initTaskList',function(){
		initTask();
//var now = moment(new Date()).format("YYYY-MM-DD");
//var monthAgo = moment(new Date()).subtract(12, 'month').format("YYYY-MM-DD");
		$s.searchType = $s.SearchTypeOptions[0];
		
		$rs.dialog_progress = true;
		var reqTaskListData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate : $s.txtSearchStart,
			EndDate : $s.txtSearchEnd,
			SearchType : $s.searchType.value,
			SearchValue : $s.taskSearchValue,
			PageNumber : $s.taskListPage,
			PageSize : 15
		}
		
		
		var param = callApiObject('work','workTaskList',reqTaskListData);
		$http(param).success(function(data){
			var resTaskList = JSON.parse(data.value);
			$s.taskList = resTaskList.Items; 
		}).then(function(){
			$rs.dialog_progress = false;
		});
	});
	
	// 템플릿 호출
	$s.callWorkListTemplete = function(event){
		$s.isShowTempleteDlg = !$s.isShowTempleteDlg;
		var reqTempleteData = {
			LoginKey:$rs.userInfo.LoginKey,
			IsTask : 1
		}
		// 템플릿 가져오기
		var param = callApiObject('work','workTemplateListLite',reqTempleteData);
		$http(param).success(function(data){
			var resTempleteList = JSON.parse(data.value);
			$s.templateList = resTempleteList;
			$s.templateId = resTempleteList[0].Key;
		});
	}

	// 템플릿 선택
	$s.selectTemplate = function(idx,template){
		$s.curIdx = idx;
		$s.templateId = template.Key;
	}
	
	// 템플릿 적용
	$s.applyTemplate = function(){
		var reqTaskWriteOpenData = {
			LoginKey:$rs.userInfo.LoginKey,
			WorkID : '', // 신규작성
			Template : $s.templateId
		}
		var param = callApiObject('work','workTaskWriteOpen',reqTaskWriteOpenData);
		$http(param).success(function(data){
			var sendData = JSON.parse(data.value);
			var code = parseInt(data.Code, 10);
			if(code === 1) {
				$rs.pushOnePage('pg_task_write');
				$rs.$broadcast('initTaskWrite',sendData);
				$s.isShowTempleteDlg = false;
			} else if(code === -1) {
				alert(data.value);
			}
		});
	}
	
	$s.taskSearchBtn = function(event){
		$s.isShowTaskSearch = !$s.isShowTaskSearch;
	}
	
	$s.closeTaskDlg = function(event){
		$s.isShowTaskSearch = false;
		$s.isShowTempleteDlg = false;
	}
	
	$s.taskSearching = function(){
		$s.isShowTaskSearch = false;
		$s.taskListPage = 1;
		
		$rs.dialog_progress = true;
		var reqTaskListData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate : $s.txtSearchStart,
			EndDate : $s.txtSearchEnd,
			SearchType : $s.searchType.value,	
			SearchValue : $s.taskSearchValue != '' ? $s.taskSearchValue : '',	
			PageNumber : $s.taskListPage,
			PageSize : 15
		};
		
		reqTaskListData.StartDate = $s.txtSearchStart != '' ? $s.txtSearchStart : '';
		reqTaskListData.EndDate = $s.txtSearchEnd != '' ? $s.txtSearchEnd : '';
		
		var param = callApiObject('work','workTaskList', reqTaskListData);

		$http(param).success(function(data) {
			var resTaskList = JSON.parse(data.value);
			$s.taskList = resTaskList.Items;
		}).then(function(){
			$rs.dialog_progress = false;
			$s.taskSearchValue = '';
		});
	}
	
	$s.applySearchType = function(idx,type){
		$s.curSearchType = idx;
		$s.searchType = type;
	}
	
	$s.moveTaskView = function(event, taskListItem){
		$rs.pushOnePage('pg_task_view');
		$rs.$broadcast('initTaskDetailView',taskListItem);
	}
	
	$s.chooseSearchDate = function(type){
		if($rs.agent == 'android') {
			if(androidWebView != undefined) androidWebView.callTaskDatePickerDialog(type);
		} 
	}
	// android bridge result
	window.setTaskSearchDate = function(type, value) {
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
	
	// 다음페이지 읽기
	$s.readTaskNextPage = function(){
		$s.pageNumber++;
		var reqTaskListData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate : $s.txtSearchStart,
			EndDate : $s.txtSearchEnd,
			SearchType : $s.searchType.value,
			SearchValue : $s.taskSearchValue,
			PageNumber : $s.taskListPage,
			PageSize : 15
		}
		var param = callApiObject('work','workTaskList',reqTaskListData);
		$http(param).success(function(data){
			var resTaskList = JSON.parse(data.value);
			$timeout(function(){
				if(resTaskList.Items.length > 0) {
					for(idx in resTaskList.Items) {
						$s.taskList.push(resTaskList.Items[idx]);
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
	
}]);

//작업 상세보기
appHanmaru.controller('taskViewController', ['$scope', '$http', '$rootScope', '$timeout','$sce', function($s, $http, $rs, $timeout,$sce){
	$s.workId;
	$s.templateId = '';
	$s.workType = 2;// 구분(1:일정, 2:작업, 3:보고서, 4:계획)
	$s.resTaskDetail;
	$s.selectOrganUser = false;
	$s.selectOranUserInfo;
	$s.bodyUrl = '';
	
	$rs.$on('initTaskDetailView',function(event,taskListItem){
		$s.workId = taskListItem.WorkID;
		$s.templateId = taskListItem.Template;
		$s.isProfileImgEnlarge = true;
		
		var reqTaskDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			WorkID : $s.workId,
			Template : $s.templateId
		}
		var param = callApiObject('work','workTaskView',reqTaskDetailData);
		$http(param).success(function(data){
			if(data.Code==1){
				var resData = JSON.parse(data.value);
				$s.resTaskDetail = resData;
				var tempUrl = resData.BodyUrl+"&LoginKey="+$rs.userInfo.LoginKey;
				$s.resReportDetail = resData;
				$s.bodyUrl = $sce.trustAsResourceUrl(tempUrl);
			}else{
				$rs.result_message = $rs.translateLanguage('data_load_fail');
				$rs.dialog_toast = true;
				$timeout(function(){
					$rs.dialog_toast = false;
					$rs.popPage('pg_task_view');
				},1500);
			}
		}).then(function(){
			$rs.dialog_progress = false;
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
		$rs.pushOnePage('pg_task_write');
		popPage('pg_task_view');
	};
	
	$s.taskDelete = function(event){
		var reqTaskDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			WorkID : $s.workId,
			WorkType : $s.workType
		}
		var param = callApiObject('work','workDelete',reqTaskDetailData);
		$http(param).success(function(data){
			popPage('pg_task_view');
			$rs.$broadcast('initTaskList');
		});
	}
}]);

//작업 작성 하기
appHanmaru.controller('workWriteController', ['$scope', '$http', '$rootScope', '$timeout','$sce', function($s, $http, $rs, $timeout,$sce){
	$s.attendanceUserList = new Array();
	$s.shareUserList = new Array();
	$s.guId = '';
	$s.workId = '';
	$s.templateId = '';
	$s.selectedColor = '';
	$s.taskTitle = '';
	$s.txtSearchStart = '';
	$s.txtSearchEnd = '';
	$s.createUser = '' ;
	$s.parentTask = '';
	$s.taskContents = ''; // body 타입 확인할것(html / string 둘다 안됨)
	$s.approval = new Array();
	$s.uploadFileList = new Array();
	$s.deleteFileList = new Array();
	$s.scheduleColorList = new Array(); 
	$s.attach_list = new Array();
	$s.fileType = 'T';// S=일정, T=작업, R=리포트, P=계획, M=템플릿
	
	$rs.$on('initTaskWrite',function(event,data){
		$s.guId = data.GUID;
		$s.createUser = $rs.userInfo.EmailAddress;
		$s.templateId = data.Template;
		
	
		var now = moment(new Date()).format("YYYY-MM-DD");
		var future = moment(new Date()).add(1,'d').format("YYYY-MM-DD");
		$s.txtSearchStart = now;
		$s.txtSearchEnd = future;
		
		// 색상
		var reqColorListData = {
			LoginKey:$rs.userInfo.LoginKey,
			IsExchange : 0
		}
		var param = callApiObject('work','workColor',reqColorListData);
		$http(param).success(function(data){
			$s.scheduleColorList = JSON.parse(data.value);
				
			for(var i = 0; i < $s.scheduleColorList.length; i++) {
				$s.scheduleColorList[i].isCheck = false;
			}
			$s.scheduleColorList[0].isCheck = true;
		}).error(function(data){
			
		}).then(function(){
			// 색상코드 가져온후 처리
			var tempUrl = data.BodyUrl+"&LoginKey="+$rs.userInfo.LoginKey;
			$s.taskContents = $sce.trustAsResourceUrl(tempUrl);
			
			// 수정일 경우.
			if(data.WorkID != undefined && data.WorkID != ''){
				$s.taskTitle = data.Title;
				
				$s.txtSearchStart = data.StartDate;
				$s.txtSearchEnd = data.EndDate;
				
				if(data.AttendanceUser.length > 0){
					$s.attendanceUserList = data.AttendanceUser;
				}
				if(data.ShareUser.length > 0){
					$s.shareUserList = data.ShareUser;
				}
				
				for(var i = 0; i < $s.scheduleColorList.length; i++) {
					$s.scheduleColorList[i].isCheck = false;
					if( data.Color == $s.scheduleColorList[i].Value ) {
						$s.scheduleColorList[i].isCheck = true;
						$s.selectedColor = $s.scheduleColorList[i].Value;
						break;
					}	
				}
			}
		});
	});
	
	$s.OptionColorSelect = function(color) {
		for(var i = 0; i < $s.scheduleColorList.length; i++) {
			$s.scheduleColorList[i].isCheck = false;
		}
		color.isCheck = true;
		$s.selectedColor = color.Value;
	}
	
	$s.btnWriteWork = function(event){
		
		var temp = document.getElementById("workTaskEditor");
		var tempDoc = temp.contentWindow || temp.contentDocument;
		
		var taskEditor = tempDoc.getElementById("NamoSE_Ifr__NamoCross");
		taskEditor.DataSave();
		
		var reqEditWorkData = {
			LoginKey : $rs.userInfo.LoginKey,
			GUID : $s.guId,
			WorkID : $s.workId,
			Template : $s.templateId,
			Color : $s.selectedColor,
			Title : $s.taskTitle,
			StartDate : $s.txtSearchStart,
			EndDate : $s.txtSearchEnd,
			CreateUser : $s.createUser,
			AttendanceUser : $s.attendanceUserList,
			ShareUser : $s.shareUserList,
			ParentTask : $s.parentTask,
			Body : $s.taskContents,
			Approval : $s.approval,
			NewFileList : $s.uploadFileList,
			DeleteFileList : $s.deleteFileList
		}
		
		if($s.taskTitle == '' || $s.taskTitle == undefined) {
			alert($rs.translateLanguage('subject_hint'));
			return;
		}
		
		var param = callApiObject('work','workTaskEdit',reqEditWorkData);
//$http(param).success(function(data){
//popPage('pg_task_write');
//$rs.$broadcast('initTaskList');
//});
	};
	
	$s.chooseSearchDate = function(type){
		if($rs.agent == 'android') {
			if(androidWebView != undefined) androidWebView.callTaskWriteDatePickerDialog(type);
		} 
	}
	// android bridge result
	window.setTaskWriteSearchDate = function(type, value) {
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
	
	$s.changeAttachFile = function(e){
		var files = e.target.files; // FileList 객체

		$s.$apply(function(){
			for(idx in $s.attach_list){
				if($s.attach_list[idx].name == files[0].name){
					return;
				}
			}
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
				}
			}).error(function(data){
			});
		});
	}
	
	$s.btnRemoveAttach = function(index) {
		$s.deleteFileList.push($s.attach_list[index].name);
		$s.attach_list.splice(index, 1);
	}
	
	$s.initAttachFile = function(){
		// 여기에 하이브리드 기능 기술
		if($rs.agent == 'android') {
			if(androidWebView != undefined) {
				
			}
		} else if($rs.agent == 'ios') {
			
		} 
	};
	
	$s.popPage = function(currentPage){
		$s.attendanceUserList = new Array();
		$s.shareUserList = new Array();
		$s.guId = '';
		$s.workId = '';
		$s.templateId = '';
		$s.selectedColor = '';
		$s.taskTitle = '';
		$s.txtSearchStart = '';
		$s.txtSearchEnd = '';
		$s.createUser = '' ;
		$s.parentTask = '';
		$s.taskContents = ''; // body 타입 확인할것(html / string 둘다 안됨)
		$s.approval = new Array();
		$s.uploadFileList = new Array();
		$s.deleteFileList = new Array();
		$s.scheduleColorList = new Array(); 
		$s.attach_list = new Array();
		$s.fileType = 'T';// S=일정, T=작업, R=리포트, P=계획, M=템플릿
		
		popPage(currentPage);
	};
	
	
	// 참석자 선택
	$s.btnCallOrganSelect = function(e,attendType) {
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id');
		$rs.$broadcast('initInsaReservList',attendType);
		pushOnePage('pg_insa_list_reserv');
	}
	
	// 조직도 사용자(담당자) 선택 반영
	$rs.$on("workTaskApplyAttendanceUser", function(e, rcv) {
		if(rcv.length > 0) {
			for(idx in rcv) {
				if($s.attendanceUserList.indexOf(rcv[idx]) == -1) {
					$s.attendanceUserList.push(rcv[idx]);
				}
			}
		}
	});
	
	$s.btnRemoveAttendanceUser = function(index) {
		var user = $s.attendanceUserList[index];
		if(user.UserKey != undefined) {
			$s.attendanceUserList.splice(index, 1);
		}else if(user.Key != undefined){
			$s.attendanceUserList.splice(index, 1);
		}
		
	}
	
	// 조직도 사용자(공유자) 선택 반영
	$rs.$on("workTaskApplyShareUser", function(e, rcv) {
		if(rcv.length > 0) {
			for(idx in rcv) {
				if($s.shareUserList.indexOf(rcv[idx]) == -1) {
					$s.shareUserList.push(rcv[idx]);
				}
			}
		}
	});
	
	$s.btnRemoveShareUser = function(index) {
		var user = $s.shareUserList[index];
		if(user.UserKey != undefined) {
			$s.shareUserList.splice(index, 1);
		}
	}
	
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
	$s.SearchTypeOptions = [
		{'value':'All','name':'전체'},
		{'value':'Title','name':'제목'},
		{'value':'Body','name':'본문'},
		{'value':'TitleBody','name':'제목+본문'},
		{'value':'Sender','name':'발신자'}
	  ];
	
	function initReport(){
		$s.isShowReportSearch = false;
		$s.isShowTempleteDlg = false;
		$s.reportList;
		$s.txtSearchStart = '';
		$s.txtSearchEnd = 	'';
		$s.reportListPage = 1;
		$s.reportSearchValue = '';
		$s.templateId = '';
		$s.workId = '';
		$s.templateList;
		$s.curIdx = 0;
		$s.searchOptionShow = false;
		$s.curSearchType = 0;
	}
	
	$s.searchTypeOption = function(){
		$s.searchOptionShow  = !$s.searchOptionShow;
	}
	
	$rs.$on('initReportList',function(){
		initReport();
		$s.searchType = $s.SearchTypeOptions[0];
		
		$rs.dialog_progress = true;
		var reqReportData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate : $s.txtSearchStart,
			EndDate : $s.txtSearchEnd,	
			SearchType : $s.searchType.value,	
			SearchValue : $s.reportSearchValue,	
			PageNumber : $s.reportListPage,
			PageSize : 15
		}
		
		var param = callApiObject('work','workReportList',reqReportData);
		$http(param).success(function(data){
			var resReportList = JSON.parse(data.value);
			$s.reportList = resReportList.Items;
		}).then(function(){
			$rs.dialog_progress = false;
		});
	});
	
	// 템플릿 호출
	$s.callWorkListTemplete = function(event){
		$s.isShowTempleteDlg = !$s.isShowTempleteDlg;
		var reqTempleteData = {
			LoginKey:$rs.userInfo.LoginKey,
			IsTask : 0
		};
		// 템플릿 가져오기
		var param = callApiObject('work','workTemplateListLite',reqTempleteData);
		$http(param).success(function(data){
			var resTempleteList = JSON.parse(data.value);
			$s.templateList = resTempleteList;
			$s.templateId = resTempleteList[0].Key;
		});
	}
	
	// 템플릿 선택
	$s.selectTemplate = function(idx,template){
		$s.curIdx = idx;
		$s.templateId = template.Key;
	}
	
	// 템플릿 적용
	$s.applyTemplate = function(){
		var reqReportWriteOpenData = {
			LoginKey:$rs.userInfo.LoginKey,
			WorkID : '', // 신규작성
			Template : $s.templateId
		}
		var param = callApiObject('work','workReportWriteOpen',reqReportWriteOpenData);
		$http(param).success(function(data){
			var sendData = JSON.parse(data.value);
			var code = parseInt(data.Code, 10);
			if(code === 1) {
				$rs.pushOnePage('pg_report_write');
				$rs.$broadcast('initReportWrite',sendData);
				$s.isShowTempleteDlg = false;
			} else if(code === -1) {
				alert(data.value);
			}
		});
	}
	
	$s.reportSearchBtn = function(event){
		$s.isShowReportSearch = !$s.isShowReportSearch;
	}
	
	$s.closeReportDlg = function(event){
		$s.isShowReportSearch = false;
		$s.isShowTempleteDlg = false;
	}
	
	$s.chooseSearchDate = function(type){
		if($rs.agent == 'android') {
			if(androidWebView != undefined) androidWebView.callReportDatePickerDialog(type);
		} 
	}
	// android bridge result
	window.setReportSearchDate = function(type, value) {
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
	
	$s.reportSearching = function(){
		$s.isShowReportSearch = false;
		$s.reportListPage = 1;
		$rs.dialog_progress = true;
		
		var reqReportListData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate : $s.txtSearchStart,
			EndDate : $s.txtSearchEnd,
			StartDate : $s.txtSearchStart,
			EndDate :	$s.txtSearchEnd,
			SearchType : $s.searchType.value,	
			SearchValue : $s.reportSearchValue != '' ? $s.reportSearchValue : '',	
			PageNumber : $s.reportListPage,
			PageSize : 15
		};
		reqReportListData.StartDate = $s.txtSearchStart != undefined ? $s.txtSearchStart : '';
		reqReportListData.EndDate = $s.txtSearchEnd != undefined ? $s.txtSearchEnd : '';
		
		var param = callApiObject('work','workReportList', reqReportListData);
		$http(param).success(function(data) {
			var resReportList = JSON.parse(data.value);
			$s.reportList = resReportList.Items;
		}).then(function(){
			$rs.dialog_progress = false;
			$s.reportSearchValue = '';
		});
	}
	
	$s.applySearchType = function(idx,type){
		$s.curSearchType = idx;
		$s.searchType = type;
	}
	
	$s.moveReportView = function(event, reportListItem){
		$rs.pushOnePage('pg_report_view');
		$rs.$broadcast('initReportDetailView',reportListItem);
	};
	
	// 다음페이지 읽기
	$s.readReportNextPage = function(){
		$s.pageNumber++;
		var reqReportData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate : $s.txtSearchStart,
			EndDate : $s.txtSearchEnd,	
			SearchType : $s.searchType.value,	
			SearchValue : $s.reportSearchValue,	
			PageNumber : $s.reportListPage,
			PageSize : 15
		}
			
		var param = callApiObject('work','workReportList',reqReportData);
		$http(param).success(function(data){
			var resReportList = JSON.parse(data.value);
			$timeout(function(){
				if(resReportList.Items.length > 0) {
					for(idx in resReportList.Items) {
						$s.reportList.push(resReportList.Items[idx]);
					}
				} else {
					$s.pageNumber--;
				}
			}, 500);
		}).then(function(){
			$rs.dialog_progress = false;
		});
		
	};
	
}]);

//보고서 상세보기
appHanmaru.controller('reportViewController', ['$scope', '$http', '$rootScope', '$timeout','$sce', function($s, $http, $rs, $timeout,$sce){
	$s.workId;
	$s.templateId;
	$s.workType = 3;// 구분(1:일정, 2:작업, 3:보고서, 4:계획)
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
			if(data.Code==1){
				var resData = JSON.parse(data.value);
				var tempUrl = resData.BodyUrl+"&LoginKey="+$rs.userInfo.LoginKey;
				$s.resReportDetail = resData;
				$s.bodyUrl = $sce.trustAsResourceUrl(tempUrl);
			}else{
				$rs.result_message = $rs.translateLanguage('data_load_fail');
				$rs.dialog_toast = true;
				$timeout(function(){
					$rs.dialog_toast = false;
					$rs.popPage('pg_report_view');
				},1500);
			}
		});
	});
	
	$s.reportModify = function(event){
		$rs.$broadcast('initReportWrite',$s.resReportDetail);
		$rs.pushOnePage('pg_report_write');
		popPage('pg_report_view');
	};
	
	$s.reportDelete = function(event){
		var reqReportDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			WorkID : $s.workId,
			WorkType : $s.workType
		}
		
		var param = callApiObject('work','workDelete',reqReportDetailData);
		$http(param).success(function(data){
			popPage('pg_report_view');
			$rs.$broadcast('initReportList');
		});
	}
}]);
//보고서 작성하기
appHanmaru.controller('reportWriteController', ['$scope', '$http', '$rootScope', '$timeout','$sce', function($s, $http, $rs, $timeout,$sce){
	$s.shareUserList = new Array();
	$s.shareUser = '';
	$s.guId = '';
	$s.workId = '';
	$s.templateId = '';
	$s.reportTitle = '';
	$s.createUser = '' ;
	$s.reportContents = '';
	
	$rs.$on('initReportWrite',function(event,data){
		$s.guId = data.GUID;
		$s.createUser = $rs.userInfo.EmailAddress;
		$s.templateId = data.Template;
		
		var tempUrl = data.BodyUrl+"&LoginKey="+$rs.userInfo.LoginKey;
		$s.reportContents = $sce.trustAsResourceUrl(tempUrl);
		
		if(data.WorkID != undefined && data.WorkID != ''){
			$s.reportTitle = data.Title;
			if(data.ShareUser.length > 0){
				$s.shareUserList = data.ShareUser;
			}
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
			ShareUser : $s.shareUserList,
//Body : $s.reportContents,
			Body : '',
		};
		
		if($s.reportTitle == '' || $s.reportTitle == undefined) {
			alert($rs.translateLanguage('subject_hint'));
			return;
		}
		
		var param = callApiObject('work','workReportEdit',reqEditReportData);
		$http(param).success(function(data){
			popPage('pg_report_write');
			$rs.$broadcast('initReportList');
		});
	};
	
	$s.popPage = function(currentPage){
		$s.shareUserList = new Array();
		$s.shareUser = '';
		$s.guId = '';
		$s.workId = '';
		$s.templateId = '';
		$s.reportTitle = '';
		$s.createUser = '' ;
		$s.reportContents = ''; // body paramater 확인해볼것.
		
		popPage(currentPage);
	}
	
	// 참석자 선택
	$s.btnCallOrganSelect = function(e,attendType) {
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id');
		$rs.$broadcast('initInsaReservList',attendType);
		pushOnePage('pg_insa_list_reserv');
	}
	
	// 조직도 사용자 선택 반영
	$rs.$on("workReportApplySelectedUser", function(e, rcv) {
		if(rcv.length > 0) {
			for(idx in rcv) {
				if($s.shareUserList.indexOf(rcv[idx]) == -1) {
					$s.shareUserList.push(rcv[idx]);
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
			$s.shareUser += (recipients+';');
		}
	});
	
	$s.btnRemoveMandatoryUser = function(index) {
		var user = $s.shareUserList[index];
		if(user.UserKey != undefined) {
			$s.shareUserList.splice(index, 1);
		}else if(user.Key != undefined){
			$s.shareUserList.splice(index, 1);
		}
	}
	
}]);

//업무계획 목록
appHanmaru.controller('planListController', ['$scope', '$http', '$rootScope', '$timeout', function($s, $http, $rs, $timeout) {
	$s.SearchTypeOptions = [
		{'value':'All','name':'전체'},
		{'value':'Title','name':'제목'},
		{'value':'Body','name':'본문'},
		{'value':'TitleBody','name':'제목+본문'},
		{'value':'Sender','name':'발신자'}
	  ];
	
	function initPlan(){
		$s.isShowPlanSearch = false;
		$s.isShowTempleteDlg = false;
		$s.planListPage = 1;
		$s.planList;
		$s.searchType='';
		$s.planSearchValue='';
		$s.txtSearchStart = '';
		$s.txtSearchEnd = 	'';
		$s.templeteList;
		$s.templateId = '';
		$s.workId = '';
		$s.curIdx = 0;
		$s.searchOptionShow = false;
		$s.curSearchType = 0;
	}
	
	$s.searchTypeOption = function(){
		$s.searchOptionShow  = !$s.searchOptionShow;
	}
	
	$rs.$on('initPlanList',function(){
		initPlan();
		$s.searchType = $s.SearchTypeOptions[0];
		
		$rs.dialog_progress = true;
		var reqPlanData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate : $s.txtSearchStart,
			EndDate : $s.txtSearchEnd,	
			SearchType : $s.searchType.value,	
			SearchValue : $s.planSearchValue,	
			PageNumber : $s.planListPage,
			PageSize : 15
		}
		
		var param = callApiObject('work','workPlanList',reqPlanData);
		$http(param).success(function(data){
			var resPlanList = JSON.parse(data.value);
			$s.planList = resPlanList.Items; 
		}).then(function(){
			$rs.dialog_progress = false;
		});
	});
	
	// 템플릿 호출
	$s.callWorkListTemplete = function(event){
		$s.isShowTempleteDlg = !$s.isShowTempleteDlg;
		var reqTempleteData = {
			LoginKey:$rs.userInfo.LoginKey,
			IsTask : 0
		}
		// 템플릿 가져오기
		var param = callApiObject('work','workTemplateListLite',reqTempleteData);
		$http(param).success(function(data){
			var resTempleteList = JSON.parse(data.value);
			$s.templateList = resTempleteList;
			$s.templateId = resTempleteList[0].Key;
		});
	}

	// 템플릿 선택
	$s.selectTemplate = function(idx,template){
		$s.curIdx = idx;
		$s.templateId = template.Key;
	}
	
	// 템플릿 적용
	$s.applyTemplate = function(){
		var reqPlanOpenData = {
			LoginKey:$rs.userInfo.LoginKey,
			WorkID : '',
			Template : $s.templateId
		}
		var param = callApiObject('work','workPlanWriteOpenView',reqPlanOpenData);
		$http(param).success(function(data){
			var sendData = JSON.parse(data.value);
			var code = parseInt(data.Code, 10);
			if(code === 1) {
				$rs.$broadcast('initPlanWrite',sendData);
				$rs.pushOnePage('pg_plan_write');
				$s.isShowTempleteDlg = false;
			} else if(code === -1) {
				alert(data.value);
			}
		});
//$rs.$broadcast('initPlanWrite');
//$rs.pushOnePage('pg_plan_write');
//$s.isShowTempleteDlg = false;
	}
	
	$s.planSearchBtn = function(event){
		$s.isShowPlanSearch = !$s.isShowPlanSearch;
	}
	
	$s.closePlanDlg = function(event){
		$s.isShowPlanSearch = false;
		$s.isShowTempleteDlg = false;
	}
	
	$s.planSearching = function(event){
		$s.isShowPlanSearch = false;
		$s.planListPage = 1;
		$rs.dialog_progress = true;
		var reqPlanListData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate : $s.txtSearchStart,
			EndDate : $s.txtSearchEnd,
			SearchType : $s.searchType.value,	
			SearchValue : $s.planSearchValue != '' ? $s.planSearchValue : '',	
			PageNumber : $s.planListPage,
			PageSize : 15
		};
		reqPlanListData.StartDate = $s.txtSearchStart != undefined ? $s.txtSearchStart : '';
		reqPlanListData.EndDate = $s.txtSearchEnd != undefined ? $s.txtSearchEnd : '';
		
		var param = callApiObject('work','workPlanList', reqPlanListData);
		$http(param).success(function(data) {
			var resPlanList = JSON.parse(data.value);
			$s.planList = resPlanList.Items;
		}).then(function(){
			$rs.dialog_progress = false;
			$s.planSearchValue = '';
		});
	};
	
	$s.applySearchType = function(idx,type){
		$s.curSearchType = idx;
		$s.searchType = type;
	}
	
	$s.planWriteBtn = function(event){
		var reqTempleteData = {
			LoginKey:$rs.userInfo.LoginKey,
			IsTask : $s.isTask
		}
		var param = callApiObject('work','workTemplateListLite',reqTempleteData);
		$http(param).success(function(data){
			var resTempleteList = JSON.parse(data.value);
			$s.templeteList = resTempleteList;
			$s.isShowTempleteDlg = !$s.isShowTempleteDlg;
		});
	}
	
////계획작성
	$s.aplyWorkListTemplete = function(event){
		var reqPlanOpenData = {
			LoginKey:$rs.userInfo.LoginKey,
			WorkID : $s.workId,
			Template : $s.templateId
		}
		var param = callApiObject('work','workPlanWriteOpenView',reqPlanOpenData);
		$http(param).success(function(data){
			var sendData = JSON.parse(data.value);
			var code = parseInt(data.Code, 10);
			if(code === 1) {
				setTimeout(function(){
					$rs.$broadcast('initPlanWrite');
					$rs.pushOnePage('pg_plan_write',sendData);
					$s.isShowTempleteDlg = false;
				}, 1000);
			} else if(code === -1) {
				alert(data.value);
			}
		});
//$rs.$broadcast('initPlanWrite');
//$rs.pushOnePage('pg_plan_write',sendData);
//$s.isShowTempleteDlg = false;
	}
	
	$s.movePlanView = function(event, planListItem){
		$rs.pushOnePage('pg_plan_view');
		$rs.$broadcast('initPlanDetailView',planListItem);
	}
	
	// 다음페이지 읽기
	$s.readPlanNextPage = function(){
		$s.pageNumber++;
		var reqPlanData = {
			LoginKey:$rs.userInfo.LoginKey,
			StartDate : $s.txtSearchStart,
			EndDate : $s.txtSearchEnd,	
			SearchType : $s.searchType.value,	
			SearchValue : $s.searchValue,	
			PageNumber : $s.planListPage,
			PageSize : 15
		}
		
		var param = callApiObject('work','workPlanList',reqPlanData);
		$http(param).success(function(data){
			var resPlanList = JSON.parse(data.value);
			$timeout(function(){
				if(resPlanList.Items.length > 0) {
					for(idx in resPlanList.Items) {
						$s.planList.push(resPlanList.Items[idx]);
					}
				} else {
					$s.pageNumber--;
				}
			}, 500);
			
		}).then(function(){
			$rs.dialog_progress = false;
		});;
	};
	
	// android bridge result
	window.setSearchDate = function(type, value) {
		$s.$apply(function() {
			if(type === 'start') {
				$s.txtSearchStart = value;
			} else if(type === 'end') {
				$s.txtSearchEnd = value;
			}
		});
	}
	
	$s.chooseSearchDate = function(type){
		if($rs.agent == 'android') {
			if(androidWebView != undefined) androidWebView.callPlanDatePickerDialog(type);
		} 
	}
	// android bridge result
	window.setPlanSearchDate = function(type, value) {
		$s.$apply(function() {
			if(type === 'start') {
				$s.txtSearchStart = value;
			} else if(type === 'end') {
				$s.txtSearchEnd = value;
			}
		});
	}
	
//ios datepicker webview
	if ($rs.agent=='ios'){
		var elems = document.getElementsByClassName("txtDateSearch");
		for (var i = 0; i < elems.length; i++) {
		    elems[i].setAttribute("type", "date");
		}
	}
	
}]);

//업무계획 상세보기
appHanmaru.controller('planViewController', ['$scope', '$http', '$rootScope', '$timeout','$sce', function($s, $http, $rs, $timeout,$sce){
	$s.workId;
	$s.templateId;
	$s.workType = 4;// 구분(1:일정, 2:작업, 3:보고서, 4:계획)
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
			if(data.Code==1){
				var resData = JSON.parse(data.value);
				$s.planDetailData = resData;
				var tempUrl = resData.BodyUrl+"&LoginKey="+$rs.userInfo.LoginKey;
				$s.resReportDetail = resData;
				$s.bodyUrl = $sce.trustAsResourceUrl(tempUrl);
			}else{
				$rs.result_message = $rs.translateLanguage('data_load_fail');
				$rs.dialog_toast = true;
				$timeout(function(){
					$rs.dialog_toast = false;
					$rs.popPage('pg_plan_view');
				},1500);
			}
		});
	});

	$s.planModify = function(event){
		$rs.$broadcast('initPlanWrite',$s.planDetailData);
		$rs.pushOnePage('pg_plan_write');
		popPage('pg_plan_view');
	};
	
	$s.planDelete = function(event){
		var reqPlanDetailData = {
			LoginKey:$rs.userInfo.LoginKey,
			WorkID : $s.workId,
			WorkType : $s.workType
		}
		
		var param = callApiObject('work','workDelete',reqPlanDetailData);
		$http(param).success(function(data){
			popPage('pg_plan_view');
			$rs.$broadcast('initPlanList');
		});
	};
	
}]);

//업무계획 작성하기
appHanmaru.controller('planWriteController', ['$scope', '$http', '$rootScope', '$timeout','$sce', function($s, $http, $rs, $timeout,$sce){
	$s.shareUserList = new Array();
	$s.guId = '';
	$s.workId = '';
	$s.templateId = '';
	$s.planTitle = '';
	$s.createUser = '';
	$s.planContents = '';
	
	$rs.$on('initPlanWrite',function(event,data){
		$s.guId = data.GUID;
		$s.createUser = $rs.userInfo.EmailAddress;
		$s.templateId = data.Template;
		
		var tempUrl = data.BodyUrl+"&LoginKey="+$rs.userInfo.LoginKey;
		$s.planContents = $sce.trustAsResourceUrl(tempUrl);

		if(data.WorkID != undefined && data.WorkID != ''){
			$s.planTitle = data.Title;
			if(data.ShareUser.length > 0){
				$s.shareUserList = data.ShareUser;
			}
		}
	});
	
	$s.btnWritePlan = function(event){
		var reqEditPlanData = {
			LoginKey:$rs.userInfo.LoginKey,
			GUID : $s.guId,
			WorkID : $s.workId,	
			Template : $s.templateId,	
			Title : $s.planTitle,	
			CreateUser : $s.createUser,	
			ShareUser : $s.shareUserList,	
			Body : $s.planContents
//Body : ''
		}
		
		if($s.planTitle == '' || $s.planTitle == undefined) {
			alert($rs.translateLanguage('subject_hint'));
			return;
		}
		
		var param = callApiObject('work','workPlanEdit',reqEditPlanData);
		$http(param).success(function(data){
			popPage('pg_plan_write');
			$rs.$broadcast('initPlanList');
		});
	}
	
	$s.popPage = function(currentPage){
		$s.shareUserList = new Array();
		$s.guId = '';
		$s.workId = '';
		$s.templateId = '';
		$s.planTitle = '';
		$s.createUser = '';
		$s.shareUser = '';
		$s.planContents = '';// paramater 확인해볼것.
		
		popPage(currentPage);
	}
	
	// 참석자 선택
	$s.btnCallOrganSelect = function(e,attendType) {
		var currPage = angular.element('[class^="panel"][class*="current"]');
		var pageName = currPage.eq(currPage.length-1).attr('id');
		$rs.$broadcast('initInsaReservList',attendType);
		pushOnePage('pg_insa_list_reserv');
	}
	
	// 조직도 사용자 선택 반영
	$rs.$on("workPlanApplySelectedUser", function(e, rcv) {
		if(rcv.length > 0) {
			for(idx in rcv) {
				if($s.shareUserList.indexOf(rcv[idx]) == -1) {
					$s.shareUserList.push(rcv[idx]);
				}
			}
		}
	});
	
	$s.btnRemoveShareUser = function(index) {
		var user = $s.shareUserList[index];
		if(user.UserKey != undefined) {
			$s.shareUserList.splice(index, 1);
		}else if(user.Key != undefined){
			$s.shareUserList.splice(index, 1);
		}
	}
	
}]);
