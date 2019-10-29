<%@ page contentType="text/html;charset=utf-8"%><%
	out.clear(); // Servlet으로 handler 작업을 하시려면 제거해주세요.
	
	request.setCharacterEncoding("UTF-8");

	Raonwiz.Dext5.UploadHandler upload = new Raonwiz.Dext5.UploadHandler();

	// 디버그시 사용(system.out.println 출력)
	// upload.SetDebugMode(true);

	Raonwiz.Dext5.UploadCompleteEventClass event = new Raonwiz.Dext5.UploadCompleteEventClass();

	// 파일 저장전 이벤트
	/*
	event.addUploadBeforeInitializeEventListenerEx(new Raonwiz.Dext5.UploadBeforeInitializeEventListenerEx() {
		public void UploadBeforeInitializeEventEx(Raonwiz.Dext5.Process.Entity.UploadEventEntity parameterEntity) {
			// 파일 저장전 발생하는 이벤트 입니다.
			// 파일에 대한 저장 경로를 변경해야 하는 경우 사용합니다.
			// 아직 클라이언트 측으로 출력을 내보내기 전이므로, 이곳에서 Response값을 변경하시면 클라이언트로 적용된 값이 전달됩니다.
			
			HttpServletRequest request = parameterEntity.getRequest(); //Request Value
			HttpServletResponse response = parameterEntity.getResponse(); //Response Value
			String newFileLocation = parameterEntity.getNewFileLocation(); //NewFileLocation Value
			String responseFileName = parameterEntity.getResponseFileName(); //ResponseFileName Value
			
			parameterEntity.setNewFileLocation(newFileLocation); //Change NewFileLocation Value
			parameterEntity.setResponseFileName(responseFileName); //Change ResponseFileName Value

			//parameterEntity.setCustomError("사용자오류");
			//parameterEntity.setCustomError("999", "사용자오류"); //Error Code를 설정하실 때에는 900이상의 3자리로 설정
		}
    });
	*/
	
	// 업로드 완료전 이벤트
	/*
	event.addUploadCompleteBeforeEventListenerEx(new Raonwiz.Dext5.UploadCompleteBeforeEventListenerEx() {
		public void UploadCompleteBeforeEventEx(Raonwiz.Dext5.Process.Entity.UploadEventEntity parameterEntity) {
			// 파일 업로드 완료전 발생하는 이벤트 입니다.
			// 업로드된 파일의 DRM을 해제와 같은 파일처리 작업이 필요할 경우 사용합니다.
			// 아직 클라이언트 측으로 출력을 내보내기 전이므로, 이곳에서 Response값을 변경하시면 클라이언트로 적용된 값이 전달됩니다.
			
			HttpServletRequest request = parameterEntity.getRequest(); //Request Value
			HttpServletResponse response = parameterEntity.getResponse(); //Response Value
			String newFileLocation = parameterEntity.getNewFileLocation(); //NewFileLocation Value
			String responseFileServerPath = parameterEntity.getResponseFileServerPath(); //ResponseFileServerPath Value
			String responseFileName = parameterEntity.getResponseFileName(); //ResponseFileName Value
			String responseGroupId = parameterEntity.getResponseGroupId(); //GroupId Value
			String fileIndex = parameterEntity.getFileIndex(); //FileIndex Value - 마지막 파일은 index 뒤에 z가 붙습니다.
			
			parameterEntity.setNewFileLocation(newFileLocation); //Change NewFileLocation Value
			parameterEntity.setResponseFileServerPath(responseFileServerPath); //Change ResponseFileServerPath Value
			parameterEntity.setResponseFileName(responseFileName); //Change ResponseFileName Value
			//parameterEntity.setResponseCustomValue("ResponseCustomValue"); //Set ResponseCustomValue (특수기호(:,::,*,|,\b)가 포함되면 ResponseCustomValue가 설정되지 않습니다.)
			//parameterEntity.setResponseGroupId(GroupId); //Change GroupId Value (특수기호(:,::,*,|,\b)가 포함되면 ResponseCustomValue가 설정되지 않습니다.)

			//parameterEntity.setCustomError("사용자오류");
			//parameterEntity.setCustomError("999", "사용자오류"); //Error Code를 설정하실 때에는 900이상의 3자리로 설정
		}
    });
	*/

	// 업로드 완료후 이벤트
	/*
    event.addUploadCompleteEventListenerEx(new Raonwiz.Dext5.UploadCompleteEventListenerEx() {
		public void UploadCompleteEventEx(Raonwiz.Dext5.Process.Entity.UploadEventEntity parameterEntity) {
			// 파일 업로드 완료후 발생하는 이벤트 입니다.
			
			HttpServletRequest _request = parameterEntity.getRequest(); //Request Value
			HttpServletResponse _response = parameterEntity.getResponse(); //Response Value
			String _newFileLocation = parameterEntity.getNewFileLocation(); //NewFileLocation Value
	        String _responseFileServerPath = parameterEntity.getResponseFileServerPath(); //ResponseFileServerPath Value
	        String _responseFileName = parameterEntity.getResponseFileName(); //ResponseFileName Value
	        
	        // 이미지 처리 관련 API
	        Raonwiz.Dext5.Common.Dext5Image dextImage = new Raonwiz.Dext5.Common.Dext5Image();
	        try {
				//dextImage.SetJpegQuality(100); // JPG 품질 (1 ~ 100) - jdk 1.5 이상에서만 사용가능합니다.
				
                String tempFilePath = "";                
                String sourceFileFullPath = _newFileLocation;
                
                // 동일 폴더에 이미지 썸네일 생성하기
                //tempFilePath = dextImage.MakeThumbnail(sourceFileFullPath, "", 200, 0, true);

                // 특정위치에 이미지 썸네일 생성하기
                //String targetFileFullPath = "c:\\temp\\test_thumb.jpg";
                //tempFilePath = dextImage.MakeThumbnailEX(sourceFileFullPath, targetFileFullPath, 200, 0, false);

                // 이미지 포멧 변경
                //tempFilePath = dextImage.ConvertImageFormat(sourceFileFullPath, "", "png", false, false);

                // 이미지 크기 변환
                //dextImage.ConvertImageSize(sourceFileFullPath, 500, 30);

                // 비율로 이미지 크기 변환
                //dextImage.ConvertImageSizeByPercent(sourceFileFullPath, 50);

                // 이미지 회전
                //dextImage.Rotate(sourceFileFullPath, 90);

                // 이미지 워터마크
                //String waterMarkFilePath = "c:\\temp\\dext5_logo.png";
                //dextImage.SetImageWaterMark(sourceFileFullPath, waterMarkFilePath, "TOP", 10, "RIGHT", 10, 0);

                // 텍스트 워터마크
                //Raonwiz.Dext5.Common.Entity.TextWaterMark txtWaterMark = new Raonwiz.Dext5.Common.Entity.TextWaterMark("DEXT5 Upload", "굴림", 12, "#FF00FF");                
                //dextImage.SetTextWaterMark(sourceFileFullPath, txtWaterMark, "TOP", 10, "CENTER", 10, 0, 0);

                // 이미지 크기
                //java.awt.Dimension size = dextImage.GetImageSize(sourceFileFullPath);
                //int _width = size.width;
                //int _height = size.height;
				
				// EXIF 추출 (Exif standard 2.2, JEITA CP-2451)
         		// jdk 1.6 이상에서만 사용가능합니다.
				// 기능 활성화를 원하시면 1.6버전으로 컴파일된 jar를 고객센터로 요청하십시오.
				//Raonwiz.Dext5.Common.Dext5ImageExif dextImageExif = new Raonwiz.Dext5.Common.Dext5ImageExif();
                //Raonwiz.Dext5.Common.Exif.ExifEntity exifData = dextImageExif.GetExifData(sourceFileFullPath);

            } catch (Exception ex) {
                String errorMsg = ex.getMessage();
            }
		}
    });
	*/

	// 다운로드 경로변경 이벤트
	/*
	event.addOpenDownloadPathChangeEventListenerEx(new Raonwiz.Dext5.OpenDownloadPathChangeEventListenerEx() {
		public void OpenDownloadPathChangeEventEx(Raonwiz.Dext5.Process.Entity.UploadEventEntity parameterEntity) {
			// 파일 열기 및 다운로드시 발생하는 이벤트 입니다.
			// 파일 열기 및 다운로드 경로변경시 사용됩니다.
			HttpServletRequest request = parameterEntity.getRequest(); //Request Value
			HttpServletResponse response = parameterEntity.getResponse(); //Response Value
			String[] downloadFilePath = parameterEntity.getDownloadFilePath(); //DownloadFilePath Value
			String[] downloadFileName = parameterEntity.getDownloadFileName(); //DownloadFileName Value
			String[] downloadCustomValue = parameterEntity.getDownloadCustomValue(); //DownloadCustomValue
			
			parameterEntity.setDownloadFilePath(downloadFilePath); //Change DownloadFilePath Value

			//parameterEntity.setCustomError("사용자오류");
			//parameterEntity.setCustomError("999", "사용자오류"); //Error Code를 설정하실 때에는 900이상의 3자리로 설정
		}
    });
	*/

	// 다운로드 전 이벤트
	/*
	event.addOpenDownloadBeforeInitializeEventListenerEx(new Raonwiz.Dext5.OpenDownloadBeforeInitializeEventListenerEx() {
		public void OpenDownloadBeforeInitializeEventEx(Raonwiz.Dext5.Process.Entity.UploadEventEntity parameterEntity) {
			// 파일 열기 및 다운로드시 발생하는 이벤트 입니다.
			HttpServletRequest request = parameterEntity.getRequest(); //Request Value
			HttpServletResponse response = parameterEntity.getResponse(); //Response Value
			String[] downloadFilePath = parameterEntity.getDownloadFilePath(); //DownloadFilePath Value
			String[] downloadFileName = parameterEntity.getDownloadFileName(); //DownloadFileName Value
			String[] downloadCustomValue = parameterEntity.getDownloadCustomValue(); //DownloadCustomValue
			
			parameterEntity.setDownloadFilePath(downloadFilePath); //Change DownloadFilePath Value
			parameterEntity.setDownloadFileName(downloadFileName); //Change DownloadFileName Value
			//parameterEntity.setUseDownloadServerFileName(true); //DownloadFileName 변경했을 경우 설정해야 합니다.

			//parameterEntity.setCustomError("사용자오류");
			//parameterEntity.setCustomError("999", "사용자오류"); //Error Code를 설정하실 때에는 900이상의 3자리로 설정
		}
    });
	*/

	// 다운로드 완료후 이벤트
	/*
	event.addOpenDownloadCompleteEventListenerEx(new Raonwiz.Dext5.OpenDownloadCompleteEventListenerEx() {
		public void OpenDownloadCompleteEventEx(Raonwiz.Dext5.Process.Entity.UploadEventEntity parameterEntity) {
			// 파일 업로드 열기 및 다운로드시 발생하는 이벤트 입니다.
			
			HttpServletRequest request = parameterEntity.getRequest(); //Request Value
			HttpServletResponse response = parameterEntity.getResponse(); //Response Value
			String[] downloadFilePath = parameterEntity.getDownloadFilePath(); //DownloadFilePath Value
			String[] downloadFileName = parameterEntity.getDownloadFileName(); //DownloadFileName Value
			String[] downloadCustomValue = parameterEntity.getDownloadCustomValue(); //DownloadCustomValue
		}
    });
	*/
	
	// 실제 업로드 할 기본경로 설정 (가상경로와 물리적 경로로 설정 가능)
    // 폴더명 제일 뒤에 .과 공백이 있다면 제거하시고 설정해 주세요.(운영체제에서 지원되지 않는 문자열입니다.)
	
	//-------------------- [설정방법1] 물리적 경로 설정 시작 --------------------//
    /*
    // 해당 설정은 PhysicalPath를 DEXT5 Upload 제품폴더\dext5uploaddata\ 를 저장 Root 경로로 설정하는 내용입니다.
    String saveRootFolder = request.getServletPath();
    saveRootFolder = saveRootFolder.substring(0,saveRootFolder.lastIndexOf("/"));
    saveRootFolder = request.getSession().getServletContext().getRealPath(saveRootFolder.substring(0,saveRootFolder.lastIndexOf("/")));
    String sPathChar = java.io.File.separator;
    upload.SetPhysicalPath(saveRootFolder + sPathChar + "dext5uploaddata");

	// 임시파일 물리적 경로설정 ( SetPhysicalPath에 설정된 경로 + dext5temp )
	upload.SetTempPath(saveRootFolder + sPathChar + "dext5uploaddata" + sPathChar + "dext5temp");
	*/
    //-------------------- [설정방법1] 물리적 경로 설정 끝 --------------------//

	//-------------------- [설정방법2] 가상경로 설정 시작 --------------------//
	upload.SetVirtualPath("/dext5uploaddata");

	// 임시파일 물리적 경로설정 ( SetVirtualPath에 설정된 경로 + dext5temp )
	upload.SetTempPath(request.getSession().getServletContext().getRealPath("/dext5uploaddata") + java.io.File.separator + "dext5temp");
	//-------------------- [설정방법2] 가상경로 설정 끝 ----------------------//

	// 위에 설정된 임시파일 물리적 경로에서 불필요한 파일을 삭제 처리하는 설정 (단위: 일)
    upload.SetGarbageCleanDay(2);

	// 환경설정파일 물리적 폴더 (서버 환경변수를 사용할 경우)
    // upload.SetConfigPhysicalPath("D:\\temp");

	// 서버 구성정보중 Context Path가 있다며, 아래와 같이 설정해주세요. (SetVirtualPath 사용시만 필요)
	// upload.SetContextPath("Context Path");
    
    // upload.SetZipFileName("download.zip");

	// DEXT5 Upload는 업로드시 클라이언트와 서버에서 보안을 위하여 이중으로 확장자 체크를 합니다.
    // 서버 확장자 체크는 클라이언트에서 적용한 값으로 기본 설정되며, 
    // 아래 부분을 적용하시면, 설정한 값으로 서버에서 확장자 체크가 이루어집니다.
    // 1번째 인자는 0: 제한으로 설정, 1: 허용으로 설정, 두번째 인자는 확장자 목록 : jpg,exe (구분자,)
    // upload.SetUploadCheckFileExtension(0, "exe,aspx,jsp");

    // DEXT5 Upload는 업로드시 서버에서 파일명에대한 제어를 위한 설정 기능을 제공합니다.
    // String[] tempWordList  = {"hacking"};
    // upload.SetFileBlackWordList(tempWordList);
	
    // DEXT5 Upload는 다운로드시 서버에서 보안을 위하여 확장자 체크를 합니다. (부모 경로 접근을 이용한 서버파일 다운로드 방지 등)
    // 아래 부분을 적용하시면, 설정한 값으로 서버에서 확장자 체크가 이루어집니다.
    // 1번째 인자는 0: 제한으로 설정, 1: 허용으로 설정, 두번째 인자는 확장자 목록 : jpg,exe (구분자,)
    // upload.SetDownloadCheckFileExtension(0, "exe,aspx,jsp");

    String result = upload.Process(request, response, application, event); // 서버 이벤트 사용시 반드시 4번째 파라미터의 event 객체를 Setting 해줘야 합니다.

    if(!result.equals("")) {
		out.print(result);
	}

	// Servlet으로 handler 작업을 하시려면 다음과 같이 작성해 주세요.
	// Servlet으로 구성하실 때 해당 Function의 Return Type은 void로 선언 후 return 되는 값은 반드시 없어야합니다.
	/*
	// 만일 getServletContext()가 undefined 이면 request.getSession().getServletContext(); 으로 하시면 됩니다.
	ServletContext application = getServletContext();

	String result = "";
    try {
		result = upload.Process(request, response, application, event); // 서버 이벤트 사용시 반드시 4번째 파라미터의 event 객체를 Setting 해줘야 합니다.
	} catch (Exception e) {
		e.printStackTrace();
	}
	
	if(!result.equals("")) {
		ServletOutputStream out = response.getOutputStream();
		out.print(result);
		out.close();
	}
	*/
%>