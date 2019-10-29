var objApiURL = {
	general:{
		appVer:{
			name:'Version 받기',
			url:'http://ep.halla.com/nmobile/login/AppVersion'
		},
		app:{
			name:'App URL',
			url:'http://ep.halla.com/nmobile/login/AppURL'
		}
	},
	login:{
		generalLogin:{
			name:'일반 로그인',
			url:'http://Ep.halla.com/nmobile/login/Login'
		},
		pinLogin:{
			name:'Pin 로그인',
			url:'http://ep.halla.com/nmobile/login/PinCodeLogin'
		},
		pinCodeChg:{
			name:'Pin 비밀번호 변경',
			url:'http://ep.halla.com/nmobile/login/PinCodeChange'
		}
	},
	mail:{
		mailBoxs:{
			name:'메일 박스 목록',
			url:'http://ep.halla.com/nmobile/Mail/MailBoxs'
		},
		mailList:{
			name:'메일 리스트',
			url:'http://ep.halla.com/nmobile/Mail/MailList'
		},
		mailDetail:{
			name:'메일 본문보기',
			url:'http://ep.halla.com/nmobile/Mail/Mail'
		},
		mailDoDelete:{
			name:'메일 삭제',
			url:'http://ep.halla.com/nmobile/Mail/MailDelete'
		},
		mailDoFlag:{
			name:'메일 플래그처리',
			url:'http://ep.halla.com/nmobile/Mail/MailFlag'
		},
		mailDoRead:{
			name:'메일 읽음처리',
			url:'http://ep.halla.com/nmobile/Mail/MailRead'
		},
		mailDoMove:{
			name:'메일 이동하기',
			url:'http://ep.halla.com/nmobile/Mail/MailMove'
		},
		mailUploadFile:{
			name:'메일 발송시 첨부파일',
			url:'http://ep.halla.com/nmobile/mail/fileupload'
		},
		mailDoSend:{
			name:'메일 발송',
			url:'http://ep.halla.com/nmobile/mail/mailsend'
		},
		mailAddressBook:{
			name:'주소록',
			url:'http://ep.halla.com/nmobile/mail/AddressBook'
		}
	},
	insa:{
		insaMyOrg:{
			name:'자신부서 및 정보',
			url:'http://ep.halla.com/nmobile/Insa/MyOrg'
		},
		insaDeptChild:{
			name:'부서 이하 부서 및 유저',
			url:'http://ep.halla.com/nmobile/Insa/DeptChild'
		},
		insaUserDetail:{
			name:'유저 상세 정보',
			url:'http://ep.halla.com/nmobile/Insa/UserDetail'
		},
		insaFind:{
			name:'유저 검색',
			url:'http://ep.halla.com/nmobile/Insa/Find'
		},
		insaAutoCompleteList:{
			name:'수발신 주소(자동완성)',
			url:'http://ep.halla.com/nmobile/Insa/AutoCompleteList'
		},
		insaAutoCompleteFind:{
			name:'자동완성 검색',
			url:'http://ep.halla.com/nmobile/Insa/AutoCompleteFind'
		}
	},
	approval:{
		approvalBoxs:{
			name:'결재문서함',
			url:'http://ep.halla.com/nmobile/Approval/ApprovalBoxs'
		},
		approvalList:{
			name:'결재 리스트',
			url:'http://ep.halla.com/nmobile/Approval/ApprovalList'
		},
		approval:{
			name:'결재 가져오기',
			url:'http://ep.halla.com/nmobile/Approval/Approval'
		},
		approvalBody:{
			name:'결재 본문가져오기',
			url:'http://ep.halla.com/nmobile/Approval/ApprovalBody'
		}
	},
	board:{
		boards:{
			name:'게시판 종류가저오기',
			url:'http://ep.halla.com/nmobile/Board/Boards'
		},
		boardList:{
			name:'게시판 리스트가저오기',
			url:'http://ep.halla.com/nmobile/Board/BoardList'
		},
		boardView:{
			name:'게시물 가저오기',
			url:'http://ep.halla.com/nmobile/Board/BoardView'
		}
	},
	main:{
		main:{
			name:'메인 가져오기',
			url:'http://ep.halla.com/nmobile/Board/Main'
		}
	},
	setting:{
		getSetting:{
			name:'설정 가져오기',
			url:'http://ep.halla.com/nmobile/Setting/GetSetting'
		},
		setSetting:{
			name:'설정 하기',
			url:'http://ep.halla.com/nmobile/Setting/SetSetting'
		},
		setPush:{
			name:'푸시 설정',
			url:'http://ep.halla.com/nmobile/Setting/SetPush'
		}
	},
	work:{
		workMenu:{
			name:'일정 메뉴가져오기',
			url:'http://ep.halla.com/nmobile/NewWork/WorkMenu'
		},
		workList:{
			name:'일정(달력리스트)',
			url:'http://ep.halla.com/nmobile/NewWork/WorkList'
		},
		workCalendar:{
			name:'캘린더 리스트',
			url:'http://ep.halla.com/nmobile/NewWork/WorkCalendar'
		},
		workCalendarCheck:{
			name:'캘린더 리스트',
			url:'http://ep.halla.com/nmobile/NewWork/WorkCalendarCheck'
		},
		workShareUser:{
			name:'참고자 리스트',
			url:'http://ep.halla.com/nmobile/NewWork/WorkShareUser'
		},
		workTaskList:{
			name:'작업리스트',
			url:'http://ep.halla.com/nmobile/NewWork/WorkTaskList'
		},
		workReportList:{
			name:'보고서 리스트',
			url:'http://ep.halla.com/nmobile/NewWork/WorkReportList'
		},
		workPlanList:{
			name:'계획 리스트',
			url:'http://ep.halla.com/nmobile/NewWork/WorkPlanList'
		},
		workTemplateList:{
			name:'템플릿 리스트',
			url:'http://ep.halla.com/nmobile/NewWork/WorkTemplateList'
		},
		workScheduleView:{
			name:'일정 보기',
			url:'http://ep.halla.com/nmobile/NewWork/WorkScheduleView'
		},
		workTaskView:{
			name:'작업 보기',
			url:'http://ep.halla.com/nmobile/NewWork/WorkTaskView'
		},
		workReportView:{
			name:'리포트 보기',
			url:'http://ep.halla.com/nmobile/NewWork/WorkReportView'
		},
		workPlanView:{
			name:'계획 보기',
			url:'http://ep.halla.com/nmobile/NewWork/WorkPlanView'
		},
		workTemplateView:{
			name:'템플릿 보기',
			url:'http://ep.halla.com/nmobile/NewWork/WorkTemplateView'
		},
		workBody:{
			name:'본문 가져오기',
			url:'http://ep.halla.com/nmobile/NewWork/WorkBody'
		},
		workAddShareUser:{
			name:'일정참고자 추가',
			url:'http://ep.halla.com/nmobile/NewWork/WorkAddShareUser'
		},
		workDelShareUser:{
			name:'일정참고자 삭제',
			url:'http://ep.halla.com/nmobile/NewWork/WorkDelShareUser'
		},
		workColor:{
			name:'컬러 가저오기',
			url:'http://ep.halla.com/nmobile/NewWork/WorkColor'
		},
		workFileUpload:{
			name:'파일 업로드',
			url:'http://ep.halla.com/nmobile/NewWork/FileUpload'
		},
		workScheduleWriteOpen:{
			name:'일정 작성을 위한 오픈',
			url:'http://ep.halla.com/nmobile/NewWork/WorkScheduleWriteOpen'
		},
		workTaskWriteOpen:{
			name:'작업 작성을 위한 오픈',
			url:'http://ep.halla.com/nmobile/NewWork/WorkTaskWriteOpen'
		},
		workReportWriteOpen:{
			name:'리포트 작성을 위한 오픈',
			url:'http://ep.halla.com/nmobile/NewWork/WorkReportWriteOpen'
		},
		workPlanWriteOpenView:{
			name:'계획 작성을 위한 오픈',
			url:'http://ep.halla.com/nmobile/NewWork/WorkPlanWriteOpenView'
		},
		workTemplateListLite:{
			name:'템플릿 가저오기',
			url:'http://ep.halla.com/nmobile/NewWork/WorkTemplateListLite'
		},
		workScheduleEdit:{
			name:'일정 추가, 수정',
			url:'http://ep.halla.com/nmobile/NewWork/WorkScheduleEdit'
		},
		workTaskEdit:{
			name:'작업 추가, 수정',
			url:'http://ep.halla.com/nmobile/NewWork/WorkTaskEdit'
		},
		workReportEdit:{
			name:'보고서 추가, 수정',
			url:'http://ep.halla.com/nmobile/NewWork/WorkReportEdit'
		},
		workPlanEdit:{
			name:'계획 추가, 수정',
			url:'http://ep.halla.com/nmobile/NewWork/WorkPlanEdit'
		},
		workDelete:{
			name:'삭제(일정, 작업, 보고서, 계획)',
			url:'http://ep.halla.com/nmobile/NewWork/WorkDelete'
		}
	},
	resource:{
		areas:{
			name:'리소스 지역',
			url:'http://ep.halla.com/nmobile/Resource/Areas'
		},
		resourceList:{
			name:'리소스',
			url:'http://ep.halla.com/nmobile/Resource/ResourceList'
		},
		resourceMyReservation:{
			name:'내 예약 현황 가저오기',
			url:'http://ep.halla.com/nmobile/Resource/ResourceMyReservation'
		},
		resourceViewReservationField:{
			name:'상세보기 필드 뷰 출력 여부',
			url:'http://ep.halla.com/nmobile/Resource/ResourceViewReservationFiled'
		},
		resourceReservation:{
			name:'예약 상세보기',
			url:'http://ep.halla.com/nmobile/Resource/ResourceReservation'
		},
		resourceFindPossible:{
			name:'가능 자원 검색',
			url:'http://ep.halla.com/nmobile/Resource/ResourceFindPossible'
		},
		resourceWriteReservationField:{
			name:'작성 필드 뷰 출력 여부',
			url:'http://ep.halla.com/nmobile/Resource/ResourceWriteReservationFilede'
		},
		resourceFileUpload:{
			name:'첨부파일 업로드',
			url:'http://ep.halla.com/nmobile/Resource/fileupload'
		},
		resourceWriteReservation:{
			name:'자원 예약하기',
			url:'http://ep.halla.com/nmobile/Resource/ResourceWriteReservation'
		},
		resourceReservationState:{
			name:'예약 상태 변경',
			url:'http://ep.halla.com/nmobile/Resource/ResourceReservationState'
		}
	},
	timeManager:{
		timeGet:{
			name:'화면 가져오기',
			url:'http://ep.halla.com/nmobile/TimeManager/TimeGet'
		},
		timeSet:{
			name:'저장하기',
			url:'http://ep.halla.com/nmobile/TimeManager/TimeSet'
		}
	}
};