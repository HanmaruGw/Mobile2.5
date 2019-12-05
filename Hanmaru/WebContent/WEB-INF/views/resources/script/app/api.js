var objApiURL = {
	apiDomain:'',	
	setApiDomain:function(domain){
		objApiURL.apiDomain = domain;
	},
	initApiDomain:function(){
		objApiURL.chabotLogin = {
			login : {
				name : '챗봇 로그인',
				url : 'http://ep.halla.com/Aibot/login/login'
			}
		};
		
		objApiURL.login = {
			generalLogin:{
				name:'일반 로그인',
				url:objApiURL.apiDomain+'/nmobile/login/Login'
			},
			pinLogin:{
				name:'Pin 로그인',
				url:objApiURL.apiDomain+'/nmobile/login/PinCodeLogin'
			},
			autoLoginSetting:{
				name:'자동로그인 설정',
				url:objApiURL.apiDomain+'/nmobile/login/AutoLoginSetting'
			},
			pinCodeChg:{
				name:'Pin 비밀번호 변경',
				url:objApiURL.apiDomain+'/nmobile/login/PinCodeChange'
			},
			versionCheck:{
				name:'Version 받기',
				url:objApiURL.apiDomain+'/nmobile/login/AppVersion'
			},
			//2019.08.05 추가
			callLoginImage : {
				name : '로그인 메뉴 이미지',
				url : objApiURL.apiDomain+'/nmobile/login/LoginImage'
			},
			callDomainList : {
				name : '도메인 받기',
				url : objApiURL.apiDomain+'/nmobile/login/Apptype'
			},
			autoLogin : {
				name : '자동로그인',
				url : objApiURL.apiDomain+'/nmobile/login/AutoLoginCheck'
			},
			LoginLock : {
				name : '로그인잠금/해제',
				url : objApiURL.apiDomain+'/nmobile/login/LoginLock'
			},
			//2019.12.02 추가
			hallasearch : {
				name : '한라 지식인',
				url : objApiURL.apiDomain+'/nmobile/login/hallasearch'
			},
			heisso : {
				name : 'HEISSO',
				url : objApiURL.apiDomain+'/nmobile/login/heissso'
			},
		};
		
		objApiURL.mail = {
			mailBoxs:{
				name:'메일 박스 목록',
				url:objApiURL.apiDomain+'/nmobile/Mail/MailBoxs'
			},
			mailList:{
				name:'메일 리스트',
				url:objApiURL.apiDomain+'/nmobile/Mail/MailList'
			},
			mailDetail:{
				name:'메일 본문보기',
				url:objApiURL.apiDomain+'/nmobile/Mail/Mail'
			},
			mailSendBody:{
				name:'메일 반환 본문정보',
				url:objApiURL.apiDomain+'/nmobile/Mail/MailSendBody'
			},
			mailDoDelete:{
				name:'메일 삭제',
				url:objApiURL.apiDomain+'/nmobile/Mail/MailDelete'
			},
			mailDoFlag:{
				name:'메일 플래그처리',
				url:objApiURL.apiDomain+'/nmobile/Mail/MailFlag'
			},
			mailDoRead:{
				name:'메일 읽음처리',
				url:objApiURL.apiDomain+'/nmobile/Mail/MailRead'
			},
			mailDoMove:{
				name:'메일 이동하기',
				url:objApiURL.apiDomain+'/nmobile/Mail/MailMove'
			},
			mailUploadFile:{
				name:'메일 발송시 첨부파일',
				url:objApiURL.apiDomain+'/nmobile/mail/fileupload'
			},
			mailDoSend:{
				name:'메일 발송',
				url:objApiURL.apiDomain+'/nmobile/mail/mailsend'
			},
			mailAddressBook:{
				name:'주소록',
				url:objApiURL.apiDomain+'/nmobile/mail/AddressBook'
			}
		};
		
		objApiURL.insa = {
			insaBoxs:{
				name:'자신부서 및 정보',
				url:objApiURL.apiDomain+'/nmobile/Insa/MyOrg'
			},
			insaDeptChild:{
				name:'부서 이하 부서 및 유저',
				url:objApiURL.apiDomain+'/nmobile/Insa/DeptChild'
			},
			insaUserDetail:{
				name:'유저 상세 정보',
				url:objApiURL.apiDomain+'/nmobile/Insa/UserDetail'
			},
			insaFind:{
				name:'유저 검색',
				url:objApiURL.apiDomain+'/nmobile/Insa/Find'
			},
			insaAutoCompleteList:{
				name:'수발신 주소(자동완성)',
				url:objApiURL.apiDomain+'/nmobile/Insa/AutoCompleteList'
			},
			insaAutoCompleteFind:{ //not used
				name:'자동완성 검색',
				url:objApiURL.apiDomain+'/nmobile/Insa/AutoCompleteFind'
			}
		};
		
		objApiURL.approval = {
			approvalBoxs:{
				name:'결재문서함',
				url:objApiURL.apiDomain+'/nmobile/Approval/ApprovalBoxs'
			},
			approvalList:{
				name:'결재 리스트',
				url:objApiURL.apiDomain+'/nmobile/Approval/ApprovalList'
			},
			approval:{
				name:'결재 가져오기',
				url:objApiURL.apiDomain+'/nmobile/Approval/Approval'
			},
			approvalBody:{
				name:'결재 본문가져오기',
				url:objApiURL.apiDomain+'/nmobile/Approval/ApprovalBody'
			}
		};
		
		objApiURL.board = {
			boardBoxs:{
				name:'게시판 종류가저오기',
				url:objApiURL.apiDomain+'/nmobile/Board/Boards'
			},
			boardList:{
				name:'게시판 리스트가저오기',
				url:objApiURL.apiDomain+'/nmobile/Board/BoardList'
			},
			boardView:{
				name:'게시물 가저오기',
				url:objApiURL.apiDomain+'/nmobile/Board/BoardView'
			}
		};
		
		objApiURL.main = {
			mainBoxs:{
				name:'메인 가져오기',
				url:objApiURL.apiDomain+'/nmobile/Board/Main'
			}
		};
		
		objApiURL.setting = {
			getSetting:{
				name:'설정 가져오기',
				url:objApiURL.apiDomain+'/nmobile/Setting/GetSetting'
			},
			setSetting:{
				name:'설정 하기',
				url:objApiURL.apiDomain+'/nmobile/Setting/SetSetting'
			},
			setPush:{
				name:'푸시 설정',
				url:objApiURL.apiDomain+'/nmobile/Setting/SetPush'
			}
		};
		
		objApiURL.work = {
				workBoxs:{
				name:'일정 메뉴가져오기',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkMenu'
			},
			workList:{
				name:'일정(달력리스트)',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkList'
			},
			workCalendar:{
				name:'캘린더 리스트(공유캘린더)',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkCalendar'
			},
			workCalendarCheck:{
				name:'칼렌더 체크 상태 변경',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkCalendarCheck'
			},
			workShareUser:{
				name:'참고자 리스트',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkShareUser'
			},
			workShareUserCheck:{
				name:'참고자 체크 상태 변경',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkShareUserCheck'
			},
			workTaskList:{
				name:'작업리스트',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkTaskList'
			},
			workReportList:{
				name:'보고서 리스트',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkReportList'
			},
			workPlanList:{
				name:'계획 리스트',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkPlanList'
			},
			workTemplateList:{
				name:'템플릿 리스트',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkTemplateList'
			},
			workScheduleView:{
				name:'일정 보기',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkScheduleView'
			},
			workTaskView:{
				name:'작업 보기',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkTaskView'
			},
			workReportView:{
				name:'리포트 보기',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkReportView'
			},
			workPlanView:{
				name:'계획 보기',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkPlanView'
			},
			workTemplateView:{
				name:'템플릿 보기',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkTemplateView'
			},
			workBody:{
				name:'본문 가져오기',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkBody'
			},
			workAddShareUser:{
				name:'일정참고자 추가',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkAddShareUser'
			},
			workDelShareUser:{
				name:'일정참고자 삭제',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkDelShareUser'
			},
			workColor:{
				name:'컬러 가저오기',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkColor'
			},
			workFileUpload:{
				name:'파일 업로드',
				url:objApiURL.apiDomain+'/nmobile/NewWork/FileUpload'
			},
			workScheduleWriteOpen:{
				name:'일정 작성을 위한 오픈',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkScheduleWriteOpen'
			},
			workTaskWriteOpen:{
				name:'작업 작성을 위한 오픈',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkTaskWriteOpen'
			},
			workReportWriteOpen:{
				name:'리포트 작성을 위한 오픈',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkReportWriteOpen'
			},
			workPlanWriteOpenView:{
				name:'계획 작성을 위한 오픈',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkPlanWriteOpen'
			},
			workTemplateListLite:{
				name:'템플릿 가저오기',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkTemplateListLite'
			},
			workScheduleEdit:{
				name:'일정 추가, 수정',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkScheduleEdit'
			},
			workTaskEdit:{
				name:'작업 추가, 수정',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkTaskEdit'
			},
			workReportEdit:{
				name:'보고서 추가, 수정',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkReportEdit'
			},
			workPlanEdit:{
				name:'계획 추가, 수정',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkPlanEdit'
			},
			workDelete:{
				name:'삭제(일정, 작업, 보고서, 계획)',
				url:objApiURL.apiDomain+'/nmobile/NewWork/WorkDelete'
			}
		};
		
		objApiURL.reserv = { //2019.01.02 수정 - resource -> reserv
			areas:{
				name:'리소스 지역',
				url:objApiURL.apiDomain+'/nmobile/Resource/Areas'
			},
			resourceList:{
				name:'리소스',
				url:objApiURL.apiDomain+'/nmobile/Resource/ResourceList'
			},
			reservBoxs:{ //2018.12.14 Zedd 추가 - 자원예약 -> 화면 초기데이터 세팅할 때 임의의 인터페이스명 
				name:'내 예약 현황 가저오기',
				url:objApiURL.apiDomain+'/nmobile/Resource/ResourceMyReservation'
			},
			resourceViewReservationField:{
				name:'상세보기 필드 뷰 출력 여부',
				url:objApiURL.apiDomain+'/nmobile/Resource/ResourceViewReservationFiled'
			},
			resourceReservation:{
				name:'예약 상세보기',
				url:objApiURL.apiDomain+'/nmobile/Resource/ResourceReservation'
			},
			resourceFindPossible:{
				name:'가능 자원 검색',
				url:objApiURL.apiDomain+'/nmobile/Resource/ResourceFindPossible'
			},
			resourceWriteReservationField:{
				name:'작성 필드 뷰 출력 여부',
				url:objApiURL.apiDomain+'/nmobile/Resource/ResourceWriteReservationFilede'
			},
			resourceFileUpload:{
				name:'첨부파일 업로드',
				url:objApiURL.apiDomain+'/nmobile/Resource/fileupload'
			},
			resourceWriteReservation:{
				name:'자원 예약하기',
				url:objApiURL.apiDomain+'/nmobile/Resource/ResourceWriteReservation'
			},
			resourceReservationState:{
				name:'예약 상태 변경',
				url:objApiURL.apiDomain+'/nmobile/Resource/ResourceReservationState'
			}
		};
		
		//2019.03.25 이전 api
		objApiURL.attendance = {
			attendanceBoxs:{
				name:'화면 가져오기',
				url:objApiURL.apiDomain+'/nmobile/TimeManager/TimeGet'
			},
			attendanceSet:{
				name:'저장하기',
				url:objApiURL.apiDomain+'/nmobile/TimeManager/TimeSet'
			}
		};
		
		//2019.03.25 이후 api
//		objApiURL.attendance = {
//			attendanceBoxs : {
//				name : '52시간 정보',
//				url : objApiURL.apiDomain+'/NMobile/TimeManager/TimeGet'
//			},
//			attendanceStart : {
//				name : '출근',
//				url : objApiURL.apiDomain+'/NMobile/TimeManager/WorkStart'
//			},
//			attendanceEnd : {
//				name : '퇴근',
//				url : objApiURL.apiDomain+'/NMobile/TimeManager/WorkEnd'
//			},
//			attendanceGoOutStart : {
//				name : '외출시작',
//				url : objApiURL.apiDomain+'/NMobile/TimeManager/GoOutStart'
//			},
//			attendanceGoOutEnd : {
//				name : '외출종료',
//				url : objApiURL.apiDomain+'/NMobile/TimeManager/GoOutEnd'
//			}
//		};
	},
	general:{
		appVer:{
			name:'Version 받기',
			url:'http://ep.halla.com/nmobile/login/AppVersion'
		},
		app:{
			name:'App URL',
			url:'http://ep.halla.com/nmobile/login/AppURL'
		}
	}
};