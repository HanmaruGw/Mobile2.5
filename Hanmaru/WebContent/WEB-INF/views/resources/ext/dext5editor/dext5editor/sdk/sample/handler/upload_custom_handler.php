<?
	// handler_version = "3.5.1055089.1927.01"

	require_once './php/DEXT5Handler.php';

	$the_request = null;
	$IsImageUpload = false;

	switch($_SERVER['REQUEST_METHOD'])
	{
		case 'GET': $the_request = &$_GET; break;
		case 'POST': $the_request = &$_POST; break;
	}

	$dext_install = $the_request["dext"];
	$proxy_server_image_url = $the_request["proxy_server_image_url"];
	$htmlValue = $the_request["htmlstring"];
	$upload_type = $the_request["uploadtype"];
	$document_domain = $the_request["document_domain"];
	$savefilepath = $the_request["savefilepath"];

	if(null != $document_domain && strlen($document_domain) > 0) {
		echo "<script type=\'text/javascript\'>document.domain=\'".$document_domain."\';</script>";
	}

	if (null != $dext_install && strlen($dext_install) > 0)
	{		
		echo "Hi, DEXT5 Editor !!!! ".$dext_install;
		exit;
	} else if (null != $proxy_server_image_url && strlen($proxy_server_image_url) > 0) {		
		$IsImageUpload = true;
		$save_file = $proxy_server_image_url;
        echo $proxy_server_image_url;
		exit;
    } else if (null != $htmlValue && strlen($htmlValue) > 0) {
		// SaveAs...
		SaveAs();
	} else if (null != $upload_type && strlen($upload_type) > 0) {
		
		if($upload_type == "openfile"){
			
			header( "Content-Type: text/plain" );
			if(DEXT5Handler::GetImageFileSize($savefilepath) > 0){
				$data = file_get_contents($savefilepath);
				$currEnType = getFileEncodingType($savefilepath);
				if($currEnType != 'UTF-8'){
					//$data = iconv($enc, 'UTF-8', $data);
					$data = mb_convert_encoding($data, "UTF-8", $currEnType);
				}
				echo $data;
			}else {
				echo " ";
			}
			DEXT5Handler::DeleteFile($savefilepath);
			exit;

		}else{
			$IsImageUpload = true;
			$save_file = DEXTImageSave();
		}
		
		if($IsImageUpload){
		
			/**
			 * 썸네일 생성
			 * @param	String	원본 파일을 지정한다. 
			 * @param	String	원본 파일에서 파일명과 확장자 사이에 삽입할 문자열
			 * @param	int		가로 크기 
			 * @param	int		세로크기 
			 * 
			 * @return	int 	0이외의 값 실패	 
			 */
			/*
			$rtn_value = DEXT5Handler::imageThumbnail($save_file, '_thumb', 10000, 1000);
			if ($rtn_value != 0) // 생성 실패
			{
				$strLastError = DEXT5Handler::LastErrorMessage(); 
			}
			*/
			
			/**
			 * 지정한 경로 및 파일명으로 이미지를 새로운 크기로 생성합니다.
			 * @param	String	원본 파일을 지정한다. 
			 * @param	String	대상파일 경로 및 파일명
			 * @param	int		가로 크기 
			 * @param	int		세로크기 
			 * @param	int		원본 파일 삭제 여부 (0: 원본 보존 / 1: 원본 파일 삭제)
			 * 
			 * @return	int		0이외의 값 실패	
			 */
			/*
			$rtn_value = DEXT5Handler::GetImageThumbOrNewEx($save_file, 'E:\xampp\htdocs\dext5sample\dext5data\2014\02\ext\temp.bmp', 100, 100, 0);
			if ($rtn_value != 0) // 생성 실패
			{
				$strLastError = DEXT5Handler::LastErrorMessage(); 
			}
			*/
			
			/**
			 * 원본 파일을 새로운 이미지 포멧으로 변경합니다.
			 * 새로운 파일은 원본 파일의 파일명과 확장자 사이에 '_new' 문자열이 들어갑니다.
			 * 예) test_image.jpg => test_image_new.png
			 * 
			 * @param	String 	원본 파일.
			 * @param	String 	jpg 또는 png만 지원합니다.
			 * @param	int 	동일한 포멧인 경우 변환하지 않고 Skip합니다.(1 : Skip 처리).
			 * 
			 * @return	int		0이외의 값 실패	
			 */
			/*
			$rtn_value = DEXT5Handler::ImageConvertFormat($save_file, 'png', 1);
			if ($rtn_value != 0) // 생성 실패
			{
				$strLastError = DEXT5Handler::LastErrorMessage(); 
			}
			*/
			
			/**
			 * 원본 이미지를 지정한 크기로 변환합니다.
			 * 가로 또는 세로 크기에서 하나의 값만 0보다 크게 설정하면, 다른 부분의 크기는 자동으로 계산되어 설정됩니다.
			 * 
			 * @param	String 	원본 파일.
			 * @param	int 	가로크기.
			 * @param	int 	세로크기.
			 * 
			 * @return	int		0이외의 값 실패	
			 */
			/*	
			$rtn_value = DEXT5Handler::ImageConvertSize($save_file, 200, 200);
			if ($rtn_value != 0) // 생성 실패
			{
				$strLastError = DEXT5Handler::LastErrorMessage(); 
			}
			*/
			
			/**
			 * 대상(원본) 이미지를 지정된 퍼센트로 축소하거나 늘립니다.
			 * nPercent 에 50을 입력하면 이미지가 절반으로 축소되고, 200을 입력한 경우 2배로 확대됩니다
			 * 
			 * @param	String 		원본 파일.
			 * @param	float 		변환비율.
			 * 
			 * @return	int		0이외의 값 실패	
			 */
			/*			
			$rtn_value = DEXT5Handler::ImageConvertSizeByPercent($save_file, 50);
			if ($rtn_value != 0) // 생성 실패
			{
				$strLastError = DEXT5Handler::LastErrorMessage(); 
			}
			*/
			
			 /**
			  * 원본 이미지를 회전한 이미지로 변환합니다.(반 시계 방향)
			  * 
			  * @param	String 		원본 파일.
			  * @param	int 		회전각도 (0, 90, 180, 270, 360 값 중 하나 선택).
			  * 
			  * @return	int		0이외의 값 실패	
			  */
			 /*
			 $rtn_value = DEXT5Handler::ImageRotate($save_file, 90);
			 if ($rtn_value != 0) // 생성 실패
			 {
				$strLastError = DEXT5Handler::LastErrorMessage(); 
			 }
			 */
			
			/**
			* TextWatermark에서 사용할 폰트를 설정합니다
			* 
			* @param	String 		폰트파일 경로 및 파일명.
			* @param	int 		폰트크기.
			* @param	int 		폰트 색상 (RGB형식의 Hex).
			* 
			* @return	void
			*/
			/*	
			$rtn_value = DEXT5Handler::SetFontInfo('./gulim.ttc', 100, 0x1e90ff);
			if ($rtn_value != 0) // 생성 실패
			{
				$strLastError = DEXT5Handler::LastErrorMessage(); 
			}
			*/

			 /**
			  * 대상(원본) 이미지를 지정된 워터마크 이미지로 워터마크 처리를 합니다.
			  * 이미지 파일에 회사의 로고나 출처를 알릴 때 유용할 수 있습니다.
			  * 
			  * @param	String 		원본 파일.
			  * @param	String 		워터마크로 사용할 이미지 파일.
			  * @param	String 		세로 정렬(TOP, MIDDLE, BOTTOM 값 중 하나를 사용).
			  * @param	int 		픽셀값, strVAlignFrom 값으로부터의 여백, "MIDDLE" 인 경우 무시됨.
			  * @param	String 		가로 정렬 (LEFT, CENTER, RIGHT 값 중 하나를 사용).
			  * @param	int 		픽셀값, strHAlignFrom 값으로부터의 여백, "CENTER" 인 경우 무시됨.
			  * @param	int 		워터마크 투명도 (100 이면 완전투명이고 0이면 완전불투명).
			  * 
			  * @return	int		0이외의 값 실패	
			  */
			 /*		
			 $rtn_value = DEXT5Handler::ImageWaterMark($save_file, 'E:\xampp\htdocs\dext5sample\dext5data\2014\02\logo.png', 'BOTTOM', 100, 'RIGHT', 100, 50);
			 if ($rtn_value != 0) // 생성 실패
			 {
		 		$strLastError = DEXT5Handler::LastErrorMessage(); 
		 	 }
			*/

			/**
			 * 대상(원본) 이미지를 지정된 텍스트로 워터마크 처리를 합니다.
			 * 
			 * @param	String 			원본 파일.
			 * @param	String 			워터마크 텍스트.
			 * @param	String 			세로 정렬(TOP, MIDDLE, BOTTOM 값 중 하나를 사용).
			 * @param	int 			픽셀값, strVAlignFrom 값으로부터의 여백, "MIDDLE" 인 경우 무시됨.
			 * @param	String 			가로 정렬 (LEFT, CENTER, RIGHT 값 중 하나를 사용).
			 * @param	int 			픽셀값, strHAlignFrom 값으로부터의 여백, "CENTER" 인 경우 무시됨.
			 * @param	int 			텍스트 회전 각도.
			 * 
			 * @return	int		$rtn_value			0이외의 값 실패
			 */	
			/* 
			$rtn_value = DEXT5Handler::TextWaterMark($save_file, 'vvvvvv', 'BOTTOM', 0, 'RIGHT', 0, 90);
			if ($rtn_value != 0) // 생성 실패
			{
				$strLastError = DEXT5Handler::LastErrorMessage(); 
			}
			*/

			/**
			 * 새로운 파일 이름의 문자열을 생성합니다
			 * @param	String 	확장자.
			 * @param	String 	파일명 생성 타입을 설정합니다. “GUID”, “TIME” 중 하나를 사용합니다..
			 * 
			 * @return	String	파일명	
			 */
			/*
			$rtn_value = DEXT5Handler::GetNewFileNameEx($sExtension, $sType);
			if ($rtn_value != 0) // 생성 실패
			{
				$strLastError = DEXT5Handler::LastErrorMessage(); 
			}
			*/
			
			/**
			 * 대상 이미지의 Width값을 반환합니다.
			 * 
			 * @param	String 	원본 파일.
			 * 
			 * @return	int		Width.
			 */	
			//$rtn_value = DEXT5Handler::GetImageWidth($save_file);
			
			/**
			 * 대상 이미지의 Height값을 반환합니다.
			 * 
			 * @param	String 		원본 파일.
			 * 
			 * @return	int			Height.
			 */
			//$rtn_value = DEXT5Handler::GetImageHeight($save_file);
			
			/**
			 * 대상 이미지의 포멧형식을 반환합니다.
			 * 
			 * @param	String 		원본 파일.
			 * 
			 * @return	String		파일포멧형식.
			 */
			//$rtn_value = DEXT5Handler::GetImageFormat($save_file);
			
			/**
			 * 대상 이미지의 파일사이즈를 반환합니다.
			 * 
			 * @param	String 		원본 파일.
			 * 
			 * @return	int			파일사이즈 (byte).
			 */
			//$rtn_value = DEXT5Handler::GetImageFileSize($save_file);
			
			/**
			 * 대상 이미지를 삭제합니다..
			 * 
			 * @param	String 	$strSourceFile		원본 파일.
			 * 
			 * @return	int		$rtn_value			0이외의 값 실패.
			 */
			//$rtn_value = DEXT5Handler::DeleteFile($save_file);
			
		}
	} 
	
	function GetRandomString() {
	
		$save_file_name = rand(10000, 99999);
		$save_file_name = date("Ymd_His_").$save_file_name;
		
		return $save_file_name;
	}

	function SaveAs() {

		global $the_request;

		$temp_file_name = GetRandomString();

		$to_save_path_url = $the_request["tosavepathurl"];
		$save_foldername_rule = $the_request["savafoldernamerule"];
		$html = $the_request["htmlstring"];
		
		
		$to_save_path_url = DEXT_UF_CheckPath($to_save_path_url, $save_foldername_rule);
		
		$html_real_path_file = $to_save_path_url."/".$temp_file_name.".html";
		$html = urldecode($html); //HttpUtility.UrlDecode(html.Replace("+", "%2b"), Encoding.Default);
		$html = stripslashes ( $html );
	
		// 파일쓰기
		$w_file = fopen($html_real_path_file, "w");
		
		if (fwrite($w_file, $html) === false) {
			// failed.
			echo "500";
		} else {
			//success.

			header("Content-Type: application/octet-stream");
			header("Content-Disposition: attachment;; filename=DEXT5.html");
			header("Cache-Control: cache, must-revalidate"); 
			header("Pragma: no-cache"); 
			header("Expires: 0");

			$r_file = fopen($html_real_path_file, "rb"); //rb 읽기전용 바이러니 타입

			while (!feof($r_file)) { 
				echo fread($r_file, 100*1024); //echo는 전송을 뜻함.
				flush(); //출력 버퍼비우기 함수.. 
			}
			
			@fclose ($r_file);
			@fclose ($w_file);
			@unlink($html_real_path_file);

		}

	}
	
	function DEXT_UF_CheckPath($to_save_path_url, $save_foldername_rule) {
		
		
		$pos = strpos($to_save_path_url, '/');

		if ($pos !== false) {
			if ($pos == 0) {
				// 첫번째에 '/' 가 존재하는 경우
				$to_save_path_url = $_SERVER['DOCUMENT_ROOT'].$to_save_path_url;
			} else {
				$tmp_path = str_replace('\\', '/', realpath("../../."));
				$to_save_path_url = $tmp_path.'/'.$to_save_path_url;
			}
		} else if (strlen($to_save_path_url) == 0) {
			// 빈값이 들어온 경우
			$to_save_path_url = str_replace('\\', '/', realpath("../../."));
		} else {
			// 그 이외의 경우
			$tmp_path = str_replace('\\', '/', realpath("../../."));
			$to_save_path_url = $tmp_path.'/'.$to_save_path_url;
		}

		if (strlen($save_foldername_rule) > 2)
		{
			$save_foldername_rule = GetFormatDate($save_foldername_rule);
			$sub_path = date($save_foldername_rule);
		} else { 
			$sub_path = ""; 
		}

		$to_save_path_url = $to_save_path_url.'/'.$sub_path;

		// 폴더가 존재하지 않다면..
		if (is_dir($to_save_path_url) == false) {
			// 폴더 권한설정
			//mkdir($to_save_path_url, 0777, true);
			// 폴더 생성
			uf_mkdir($to_save_path_url);
		}
		
		return $to_save_path_url;

	}

	function DEXTImageSave() {

		global $the_request;

		$upload_type = $the_request["uploadtype"];
		$proxy_url = $the_request["proxy_url"];
		$save_file_ext = $the_request["savefileext"];
		$server_domain = $the_request["serverdomain"];
		$to_save_path_url = $the_request["tosavepathurl"];
		$save_foldername_rule = $the_request["savafoldernamerule"];
		$save_filename_rule = $the_request["savafilenamerule"];

		$image_convert_format = $the_request["image_convert_format"];
		$image_convert_width = $the_request["image_convert_width"];
		$image_convert_height = $the_request["image_convert_height"];
		
		$paste_image_data = $the_request["imagedata"];

		if (null == $image_convert_format || $image_convert_format != "jpg") { $image_convert_format = ""; }
		if (null == $image_convert_width || $image_convert_width == "") { $image_convert_width = "0"; }
		if (null == $image_convert_height || $image_convert_height == "") { $image_convert_height = "0"; }
		if(strcasecmp($save_file_ext, "bmp") == 0) { $image_convert_format  = "jpg"; }
		$resize_width = intval($image_convert_width);
		$resize_height = intval($image_convert_height);
		$save_file_name = GetRandomString();

		$isPluginUpload = false;

		if ($upload_type != null && $upload_type == "plugin") { $upload_type = "image";}

		if ($upload_type != null && $upload_type == "pluginkey") {
            $isPluginUpload = true;
			$g_allowFileExt = $g_allowFileExt.", cab";
			$save_file_name = $the_request["savefilename"];
		}

		if(checkFileExt($save_file_ext) != true) {
			echo "Does not allow the file extension.";
			exit;
		}

		$to_save_path_url = DEXT_UF_CheckPath($to_save_path_url, $save_foldername_rule);
		$save_file = $to_save_path_url."/".$save_file_name.".".$save_file_ext;

		$temp_file = "";
		
		if(null != $paste_image_data && strlen($paste_image_data) > 0) {
			$w_file = fopen($save_file, "w");
			
	
			$paste_image_data = base64_decode($paste_image_data);
			if (fwrite($w_file, $paste_image_data) === false) {
				// failed.
				echo "501";
			} else {
				fclose ($w_file);	
			}
		} else {
			foreach ($_FILES as $file) {
				$temp_file = $file['tmp_name'];
			}
			move_uploaded_file($temp_file, $save_file);
		}

		if($upload_type == "openfilesave"){
			if(DEXT5Handler::GetImageFileSize($save_file) > 0){
				echo $save_file;
			}else{
				DEXT5Handler::DeleteFile($save_file);
				echo "null";
			}
			exit;
		}
		
		// ==================
		if (strcasecmp($upload_type, "image") == 0 && (strcasecmp($image_convert_format, "jpg") == 0 || $resize_width > 0 || $resize_height > 0)) {
			$image_convert_format = "jpg";

			if(file_exists($save_file)) {
				$imginfo = getImageSize($save_file);
				$img_width  = $imginfo[0];
				$img_height  = $imginfo[1];

				if ($resize_width == 0 || $resize_width > $img_width) {
					if ($resize_width == 0 && $resize_height > 0 && $resize_height < $img_height) {
						$resize_width = ceil($img_width * $resize_height / ($img_height * 1.0));
					} else { $resize_width = $img_width; }
				}

				if ($resize_height == 0 || $resize_height > $img_height) {
					if ($resize_height == 0 && $resize_width > 0 && $resize_width < $img_width) {
						$resize_height = ceil($img_height * $resize_width / ($img_width * 1.0));
					} else { $resize_height = $img_height; }
				}

				$resize_file = $to_save_path_url."/".$save_file_name."_r.".$image_convert_format;

				$convert = make_gdimage($save_file, $resize_width, $resize_height, $resize_file, $image_convert_format);
				if($convert == 1)
				{
					$save_file_name = $save_file_name."_r";
					$save_file_ext = "jpg"; 

					unlink($save_file);
				} else { echo $convert; }

				$save_file = $to_save_path_url."/".$save_file_name.".".$save_file_ext;
			}
		}

		// 이미지 크기
		$imginfo = getImageSize($save_file);
		$img_width  = $imginfo[0];
		$img_height  = $imginfo[1];

		$retFullurlPath = get_url_from_filepath($save_file);

		if (null != $proxy_url && strlen($proxy_url) > 0) {
			if($isPluginUpload == false) {
				$retFullurlPath = $retFullurlPath."*".$img_width."^".$img_height;
			}
			echo "<script> window.location.href='" . $proxy_url . "?proxy_server_image_url=" . $retFullurlPath . "'; </script>";
        } else {
			if($isPluginUpload == false) {
				$retFullurlPath = $retFullurlPath."?".$img_width."^".$img_height;
			}
			echo $retFullurlPath;
		}
		
		return $save_file;
	}

	function make_gdimage($imgfull_name, $width, $height, $savefull_name, $sExtension) {

		$gd = gd_info();
		$gdver = substr(preg_replace("/[^0-9]/", "", $gd['GD Version']), 0, 1);

		if(!$gdver) return "GD 버젼체크 실패거나 GD 버젼이 1 미만입니다.";

		$srcname = $imgfull_name;
		$timg = getimagesize($srcname);

		switch ($timg[2]) {
			case IMAGETYPE_JPEG: $cfile = imagecreatefromjpeg($srcname); break;
			case IMAGETYPE_PNG:	$cfile = imagecreatefrompng($srcname); break;
			case IMAGETYPE_GIF:	$cfile = imagecreatefromgif($srcname); break;
			case IMAGETYPE_BMP: $cfile = imagecreatefrombmp($srcname); break;
			default: return "지원하지 않는 이미지 파일입니다."; break;
		}

		if($gdver == 2) {
			$dest = imagecreatetruecolor($width, $height);
			imagecopyresampled($dest, $cfile, 0, 0, 0, 0, $width, $height, $timg[0], $timg[1]);
		} else {
			$dest = imagecreate($width, $height);
			imagecopyresized($dest, $cfile, 0, 0, 0, 0, $width, $height, $timg[0], $timg[1]);
		}

		imagejpeg($dest, $savefull_name, 100);
		imagedestroy($dest);
		return 1;
	}

	function rstrtrim($str, $remove=null)
	{
		$str    = (string)$str;
		$remove = (string)$remove;

		if(empty($remove)) { return rtrim($str); }

		$len = strlen($remove);
		$offset = strlen($str)-$len;
		
		while($offset > 0 && $offset == strpos($str, $remove, $offset)) {
			$str = substr($str, 0, $offset);
			$offset = strlen($str)-$len;
		}
		return rtrim($str);
	}

	function checkFileExt($post_file_ext)
	{
		$post_file_ext = strtolower($post_file_ext);
		
		$g_allowFileExt = "gif, jpg, jpeg, png, bmp, wmv, asf, swf, avi, mpg, mpeg, mp4, txt, doc, docx, xls, xlsx, ppt, pptx, hwp, zip, pdf, htm, html";
		
		$rtn_value = false;
		
		$sFileList = explode(",", $g_allowFileExt);

		foreach ($sFileList as $key => $value) {
			$allow_file_ext = $value;
			
			$allow_file_ext = trim($allow_file_ext);

			if ($post_file_ext == $allow_file_ext) {
				$rtn_value = true;
			}
		}
		return $rtn_value;
	}

	function uf_mkdir($mk_path)
	{
		$mkdir_array = array();
		$path_array = split ( "/" , $mk_path );
		$path_count = count($path_array);

		for($step = $path_count; $step >= 0; $step--) {
			if(is_dir($mk_path) == false) {
				$path_name = $path_array[$step - 1];

				if(strlen($path_name) > 0) { array_push ($mkdir_array, $path_name); }

				$mk_path = rstrtrim($mk_path, strrchr($mk_path, "/"));
			} else { $step = 0; }
		}

		$path_count = count($mkdir_array);

		for($step = $path_count; $step > 0; $step--) {
			$mk_path = $mk_path."/".$mkdir_array[$step - 1];
			mkdir($mk_path);
		}
	}

	function get_httpschema()
	{
		$s = empty($_SERVER["HTTPS"]) ? '' : ($_SERVER["HTTPS"] == "on") ? "s" : "";
		$protocol = substr(strtolower($_SERVER["SERVER_PROTOCOL"]), 0, strpos(strtolower($_SERVER["SERVER_PROTOCOL"]), "/")) . $s;
		$port = ($_SERVER["SERVER_PORT"] == "80") ? "" : (":".$_SERVER["SERVER_PORT"]);
		return $protocol . "://";// . $_SERVER['SERVER_NAME'] . $port; //.$_SERVER['REQUEST_URI'];
	}

	function get_url_from_filepath($file)
	{
		$httpschma = get_httpschema();
		$host = $_SERVER['HTTP_HOST'];
		$docroot = $_SERVER['DOCUMENT_ROOT'];

		if (is_file($file)) {
			$len = strlen($docroot);
			$dir = substr(dirname($file), $len);
		}

		$basename = pathinfo($file);

		return $httpschma. $host . $dir."/".$basename['basename'];
	}

	function GetFormatDate($rule, $div = '/')
	{
		$return = "";
		$aDatePath=explode("/", $rule);

		foreach($aDatePath as $key => $date) {
			switch (strtolower($date)) {
				case "yyyy": $date = "Y"; break;
				case "mm": $date = "m"; break;
				case "dd": $date = "d"; break;
			}
			if ($return == "") { $return = $date; } else { $return = $return.$div.$date; }
		}
		return $return;
	}


	function imagecreatefrombmp($path) {
	     $filename = $path;

   		if (! $f1 = fopen($filename,"rb")) return FALSE;
 
		$FILE = unpack("vfile_type/Vfile_size/Vreserved/Vbitmap_offset", fread($f1,14));
		if ($FILE['file_type'] != 19778) return FALSE;

		$BMP = unpack('Vheader_size/Vwidth/Vheight/vplanes/vbits_per_pixel/Vcompression/Vsize_bitmap/Vhoriz_resolution/Vvert_resolution/Vcolors_used/Vcolors_important', fread($f1,40));
		$BMP['colors'] = pow(2,$BMP['bits_per_pixel']);
		
		if ($BMP['size_bitmap'] == 0) $BMP['size_bitmap'] = $FILE['file_size'] - $FILE['bitmap_offset'];
		
		$BMP['bytes_per_pixel'] = $BMP['bits_per_pixel']/8;
		$BMP['bytes_per_pixel2'] = ceil($BMP['bytes_per_pixel']);
		$BMP['decal'] = ($BMP['width']*$BMP['bytes_per_pixel']/4);
		$BMP['decal'] -= floor($BMP['width']*$BMP['bytes_per_pixel']/4);
		$BMP['decal'] = 4-(4*$BMP['decal']);
		
		if ($BMP['decal'] == 4) $BMP['decal'] = 0;

		$PALETTE = array();
		if ($BMP['colors'] < 16777216) { $PALETTE = unpack('V'.$BMP['colors'], fread($f1,$BMP['colors']*4)); }
		
		$IMG = fread($f1,$BMP['size_bitmap']);
		$VIDE = chr(0);
		
		$res = imagecreatetruecolor($BMP['width'],$BMP['height']);
		$P = 0;
		$Y = $BMP['height']-1;

		while ($Y >= 0) {
			$X=0;
			while ($X < $BMP['width']) {
				if ($BMP['bits_per_pixel'] == 24)
					$COLOR = unpack("V",substr($IMG,$P,3).$VIDE);
				elseif ($BMP['bits_per_pixel'] == 16) {
					$COLOR = unpack("v",substr($IMG,$P,2));
					$blue  = (($COLOR[1] & 0x001f) << 3) + 7;
					$green = (($COLOR[1] & 0x03e0) >> 2) + 7;
					$red   = (($COLOR[1] & 0xfc00) >> 7) + 7;
					$COLOR[1] = $red * 65536 + $green * 256 + $blue;
				}
				elseif ($BMP['bits_per_pixel'] == 8) {
					$COLOR = unpack("n",$VIDE.substr($IMG,$P,1));
					$COLOR[1] = $PALETTE[$COLOR[1]+1];
				}
				elseif ($BMP['bits_per_pixel'] == 4) {
					$COLOR = unpack("n",$VIDE.substr($IMG,floor($P),1));
					if (($P*2)%2 == 0) { $COLOR[1] = ($COLOR[1] >> 4); } else { $COLOR[1] = ($COLOR[1] & 0x0F); }
					$COLOR[1] = $PALETTE[$COLOR[1]+1];
				}
				elseif ($BMP['bits_per_pixel'] == 1) {
					$COLOR = unpack("n",$VIDE.substr($IMG,floor($P),1));
					if     (($P*8)%8 == 0) $COLOR[1] =  $COLOR[1]        >>7;
					elseif (($P*8)%8 == 1) $COLOR[1] = ($COLOR[1] & 0x40)>>6;
					elseif (($P*8)%8 == 2) $COLOR[1] = ($COLOR[1] & 0x20)>>5;
					elseif (($P*8)%8 == 3) $COLOR[1] = ($COLOR[1] & 0x10)>>4;
					elseif (($P*8)%8 == 4) $COLOR[1] = ($COLOR[1] & 0x8)>>3;
					elseif (($P*8)%8 == 5) $COLOR[1] = ($COLOR[1] & 0x4)>>2;
					elseif (($P*8)%8 == 6) $COLOR[1] = ($COLOR[1] & 0x2)>>1;
					elseif (($P*8)%8 == 7) $COLOR[1] = ($COLOR[1] & 0x1);
					$COLOR[1] = $PALETTE[$COLOR[1]+1];
				}
				else { return FALSE; }
				
				imagesetpixel($res,$X,$Y,$COLOR[1]);
				$X++;
				$P += $BMP['bytes_per_pixel'];
			}
			$Y--;
			$P+=$BMP['decal'];
		}
		
		fclose($f1);
		
		return $res;
	}


	function GetOnlyPathFromURL($sURL) {

		$sRet = "";
		$path_parts = pathinfo($sURL);
		$last_index_of_seperator = strrpos($sURL, '/');
		$last_index_of_dot = strrpos($sURL, '.');

		if ($last_index_of_dot == false) {
			$sRet = $sURL;
		}
		else {
			if ($last_index_of_dot > $last_index_of_seperator) {
				if (strrpos($sURL, '/') > -1) { $sRet = $path_parts['dirname']; }
			}
		}
		return $sRet;
	}

	//define ('UTF32_BIG_ENDIAN_BOM'   , chr(0x00).chr(0x00).chr(0xFE).chr(0xFF));
    //define ('UTF32_LITTLE_ENDIAN_BOM', chr(0xFF).chr(0xFE).chr(0x00).chr(0x00));
    //define ('UTF16_BIG_ENDIAN_BOM'   , chr(0xFE).chr(0xFF));
    //define ('UTF16_LITTLE_ENDIAN_BOM', chr(0xFF).chr(0xFE));
    //define ('UTF8_BOM'               , chr(0xEF).chr(0xBB).chr(0xBF));

	function getFileEncodingType($filename) {
	
      $text = file_get_contents($filename);
      $first2 = substr($text, 0, 2);
      $first3 = substr($text, 0, 3);
      $first4 = substr($text, 0, 4);

      if ($first3 == chr(0xEF).chr(0xBB).chr(0xBF)) return 'UTF-8';
      elseif ($first2 == chr(0xFE).chr(0xFF)) return 'UTF-16BE';
      elseif ($first2 == chr(0xFF).chr(0xFE)) return 'UTF-16LE';
      elseif ($first4 == chr(0x00).chr(0x00).chr(0xFE).chr(0xFF)) return 'UTF-32BE';
      elseif ($first4 == chr(0xFF).chr(0xFE).chr(0x00).chr(0x00)) return 'UTF-32LE';
      else return 'EUC-KR';
    }

?>
