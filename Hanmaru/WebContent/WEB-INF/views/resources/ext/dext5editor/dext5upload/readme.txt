//////////////////////////////////////////////////////////////////////////////////////////////////////
// DEXT5 Upload 설치안내
//////////////////////////////////////////////////////////////////////////////////////////////////////

* 설명
	DEXT5 Upload는 파일을 전송하는 클라이언트 모듈(Javascript)과 파일을 서버쪽에 저장해 주는 서버 모듈로 구성되어 있습니다.
	(서버 모듈은 .NET, JAVA 버전을 제공 하며, hander 하위 폴더에 위치하고 있습니다.)

* 설치규격
	- 지원 운영체제 : Microsoft Windows 2000 Server 이상, Linux, Unix 등
	- 지원 웹 언어 : JSP JDK 1.5 이상 (JDK 1.4 별도문의), ASP, ASP.NET 2.0 이상
	- 지원 웹 서버 : JDK 1.5 이상 (JDK 1.4 별도문의)을 사용하는 WAS, Microsoft .NET Framework 2.0 이상을 사용하는 IIS

* DEXT5 Upload 폴더 설명
	- config	
		DEXT5 Upload의 환경설정을 담당하는 dext5upload.config.xml 을 포함하고 있습니다.
	- css
		DEXT5 Upload에 필요한 스타일시트 파일을 포함하고 있습니다.
	- dext5uploaddata
		저장경로에 대한 별도 설정이 없다면, 파일이 저장되는 ROOT 경로입니다.
	- handler
		파일을 서버에 저장하는 서버 모듈을 포함하고 있습니다. (.NET, JAVA 모듈)
	- images
		DEXT5 Upload에 필요한 이미지 파일을 포함하고 있습니다.
	- js	
		DEXT5 Upload에 필요한 자바스크립트 파일을 포함하고 있습니다.
	- plugin
		플러그인 파일을 포함하고 있습니다. (Microsoft Internet Explorer 사용자용)
	- sdk
		DEXT5 Upload의 SDK를 포함하고 있습니다. (개발 및 테스트 완료후 삭제 하십시오)

* 설치방법
	아래의 순서에 따라 설치하십시오.

	1. config\dext5upload.config.xml 설정
		Dext5Upload > license > product_key, license_key 에 발급받은 키를 설정합니다.

	2. DEXT5 Upload Core 전체 폴더 업로드(하위폴더 및 파일포함)
		WEB서버와 WAS가 분리되어 있는 경우 handler, handler\JAVA, handler\.NET 폴더는 WAS서버에 업로드 합니다.
		나머지 폴더는 WEB서버에 설치합니다.(WEB서버와 경로를 맞춰 WAS에 설치합니다.)

	3. 웹 언어별 설정
		1) ASP, ASP.NET : 
			config\dext5upload.config.xml 설정 : Dext5Upload > uploader_setting > develop_langage 에 NET 으로 설정합니다.
			(필요에 따라 handler_url을 설정합니다. ex: /handler/dext5handler.ashx)

			handler\.NET 폴더의 dll 파일들을 해당 사이트 bin 폴더에 복사한 후, 첨부된 web.config의 내용을 사이트 web.config 에 적용합니다.

		2) JSP : 
			config\dext5upload.config.xml 설정 : Dext5Upload > uploader_setting > develop_langage 에 JAVA 로 설정합니다.
			(필요에 따라 handler_url을 설정합니다. ex: /handler/dext5handler.jsp)

			handler\JAVA 폴더의 jar 파일들을 해당 사이트 WEB-INF\lib 폴더에 복사합니다.
			아래 환경설정 및 jar 파일 변경시에는 서버를 재기동합니다.

			JEUS
				$JEUS_HOME/config/'hostname'/'hostname'_servlet_engine/webcommon.xml 파일에 아래 MimeType이 설정되어 있지 않으면 추가합니다.

				<mime-mapping>
					<extension>xml</extension>
					<mime-type>text/xml</mime-type>
				</mime-mapping>

			WebLogic
				$WebApplication_Root/WEB-INF/web.xml 파일에 아래 MimeType이 설정되어 있지 않으면 추가합니다.

				<mime-mapping>
					<extension>xml</extension>
					<mime-type>text/xml</mime-type>
				</mime-mapping>

			WebSphere
				WebSphere 관리자 페이지에서 아래 MimeType이 설정되어 있지 않으면 추가합니다.

				extension : xml
				mime-type : text/xml

			iPlanet
				$WebServer 설치 폴더/https-xxx/config/mime.conf 파일에 아래 MimeType이 설정되어 있지 않으면 추가합니다.

				type=text/xml     exts=xml

			JAVA의 EXIF 추출 기능은 jdk 1.6이상에서만 지원합니다.
			기능 활성화를 원하시면 1.6버전으로 컴파일된 jar를 고객센터로 요청하십시오.

	4. 권한설정
		아래의 경로에 쓰기 권한을 추가합니다.

		1) 환경 설정 정보가 저장되는 파일
			ex) config\dext5upload.config.xml

		2) 파일이 업로드 되는 임시 폴더
			ex) handler\temp (만일 SetTempPath로 다른경로로 설정했다면, 해당 폴더에 권한설정)

		3) 파일이 업로드 되는 기본 폴더
			ex) /dext5uploaddata

* DEXT5 Upload 서버 모듈 구성
	기본적으로 파일을 업로드하면, 기본 설치폴더/dext5uploaddata 폴더에 파일이 업로드가 되며, WEB 서버와 WAS가 분리된 경우 WAS쪽 폴더(/dext5uploaddata)에 업로드 됩니다.

	SetVirtualPath와 SetPhysicalPath 를 통하여 기본 저장 Root 경로를 설정해야 합니다.
	기본저장 Root 경로의 물리적 경로는 실제 존재하고 있는 경로여야 합니다.

* DEXT5 Upload를 생성하는 방법
	1) <head>...</head> 태그 사이에 아래의 코드를 추가합니다.

		<script type="text/javascript" src="DEXT5Upload설치폴더URL/js/dext5upload.js">

	2) <body>...</body> 태그 사이에 업로드가 들어갈 위치에 업로드 생성 코드를 삽입합니다.

		<script type="text/javascript">
			var dext5Upload = new Dext5Upload("생성할 업로드 이름");
		</script>

* 기타

	추가 문의사항이 있으시면, DEXT5 기술지원팀 (support@raonwiz.com)으로 문의주시거나, http://www.dext5.com 의 제품문의 페이지로 문의주세요.





