<%@ page contentType="text/html;charset=utf-8"%><%
	out.clear(); // Servlet으로 handler 작업을 하시려면 제거해주세요.

	request.setCharacterEncoding("UTF-8");

	String sPathChar = java.io.File.separator;

	Raonwiz.Dext5.UploadHandler upload = new Raonwiz.Dext5.UploadHandler();
	
	Raonwiz.Dext5.UploadCompleteEventClass event = new Raonwiz.Dext5.UploadCompleteEventClass();

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

	/* Custom Business Logic */
	
	upload.initParameter(request, response);
    String[] customValueList = upload.GetRequestValue("customValue");
    
    java.util.List downloadList = new java.util.ArrayList();
    
	String TempPath = request.getSession().getServletContext().getRealPath(request.getServletPath().substring(0,request.getServletPath().lastIndexOf("/")));
   	TempPath = TempPath.substring(0, TempPath.lastIndexOf(sPathChar));
   	
	// 필수 조건
    if (customValueList != null) {
   		for (int i = 0; i < customValueList.length; i++) {
			customValueList[i] = java.net.URLDecoder.decode(customValueList[i], "UTF-8");
			// 해당 값을 이용하여 파일의 물리적 경로 생성 (실제 물리적 파일 경로를 설정해주세요.)
			if(customValueList[i].equals("CustomValue1")) {
        		downloadList.add(TempPath + sPathChar + "images" + sPathChar + "Panorama" + sPathChar + "ViewPhotos.jpg");
			} else if(customValueList[i].equals("CustomValue2")) {
        		downloadList.add(TempPath + sPathChar + "images" + sPathChar + "Scenery" + sPathChar + "image" + sPathChar + "CreativeImages.bmp");
			}
		}
   	}

   	/* Custom Business Logic */
   	
    // 임시파일 물리적 경로설정
    // upload.SetTempPath("D:\\temp");
    // upload.SetZipFileName("download.zip");

	// DEXT5 Upload는 다운로드시 서버에서 보안을 위하여 확장자 체크를 합니다. (부모 경로 접근을 이용한 서버파일 다운로드 방지 등)
    // 아래 부분을 적용하시면, 설정한 값으로 서버에서 확장자 체크가 이루어집니다.
    // 1번째 인자는 0: 제한으로 설정, 1: 허용으로 설정, 두번째 인자는 확장자 목록 : jpg,exe (구분자,)
    // upload.SetDownloadCheckFileExtension(0, "exe,aspx,jsp"); 

	// DEXT5 Upload는 업로드시 서버에서 파일명에대한 제어를 위한 설정 기능을 제공합니다.
    // String[] tempWordList  = {"hacking"};
    // upload.SetFileBlackWordList(tempWordList);
    
    String result = upload.ProcessCustomDownload(request, response, application, event, downloadList); // 서버 이벤트 사용시 반드시 3번째 파라미터의 event 객체를 Setting 해줘야 합니다.
	
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
		result = upload.ProcessCustomDownload(request, response, application, event, downloadList); // 서버 이벤트 사용시 반드시 3번째 파라미터의 event 객체를 Setting 해줘야 합니다.
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