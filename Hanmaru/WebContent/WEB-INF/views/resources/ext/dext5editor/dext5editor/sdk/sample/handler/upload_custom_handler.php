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
			 * ����� ����
			 * @param	String	���� ������ �����Ѵ�. 
			 * @param	String	���� ���Ͽ��� ���ϸ�� Ȯ���� ���̿� ������ ���ڿ�
			 * @param	int		���� ũ�� 
			 * @param	int		����ũ�� 
			 * 
			 * @return	int 	0�̿��� �� ����	 
			 */
			/*
			$rtn_value = DEXT5Handler::imageThumbnail($save_file, '_thumb', 10000, 1000);
			if ($rtn_value != 0) // ���� ����
			{
				$strLastError = DEXT5Handler::LastErrorMessage(); 
			}
			*/
			
			/**
			 * ������ ��� �� ���ϸ����� �̹����� ���ο� ũ��� �����մϴ�.
			 * @param	String	���� ������ �����Ѵ�. 
			 * @param	String	������� ��� �� ���ϸ�
			 * @param	int		���� ũ�� 
			 * @param	int		����ũ�� 
			 * @param	int		���� ���� ���� ���� (0: ���� ���� / 1: ���� ���� ����)
			 * 
			 * @return	int		0�̿��� �� ����	
			 */
			/*
			$rtn_value = DEXT5Handler::GetImageThumbOrNewEx($save_file, 'E:\xampp\htdocs\dext5sample\dext5data\2014\02\ext\temp.bmp', 100, 100, 0);
			if ($rtn_value != 0) // ���� ����
			{
				$strLastError = DEXT5Handler::LastErrorMessage(); 
			}
			*/
			
			/**
			 * ���� ������ ���ο� �̹��� �������� �����մϴ�.
			 * ���ο� ������ ���� ������ ���ϸ�� Ȯ���� ���̿� '_new' ���ڿ��� ���ϴ�.
			 * ��) test_image.jpg => test_image_new.png
			 * 
			 * @param	String 	���� ����.
			 * @param	String 	jpg �Ǵ� png�� �����մϴ�.
			 * @param	int 	������ ������ ��� ��ȯ���� �ʰ� Skip�մϴ�.(1 : Skip ó��).
			 * 
			 * @return	int		0�̿��� �� ����	
			 */
			/*
			$rtn_value = DEXT5Handler::ImageConvertFormat($save_file, 'png', 1);
			if ($rtn_value != 0) // ���� ����
			{
				$strLastError = DEXT5Handler::LastErrorMessage(); 
			}
			*/
			
			/**
			 * ���� �̹����� ������ ũ��� ��ȯ�մϴ�.
			 * ���� �Ǵ� ���� ũ�⿡�� �ϳ��� ���� 0���� ũ�� �����ϸ�, �ٸ� �κ��� ũ��� �ڵ����� ���Ǿ� �����˴ϴ�.
			 * 
			 * @param	String 	���� ����.
			 * @param	int 	����ũ��.
			 * @param	int 	����ũ��.
			 * 
			 * @return	int		0�̿��� �� ����	
			 */
			/*	
			$rtn_value = DEXT5Handler::ImageConvertSize($save_file, 200, 200);
			if ($rtn_value != 0) // ���� ����
			{
				$strLastError = DEXT5Handler::LastErrorMessage(); 
			}
			*/
			
			/**
			 * ���(����) �̹����� ������ �ۼ�Ʈ�� ����ϰų� �ø��ϴ�.
			 * nPercent �� 50�� �Է��ϸ� �̹����� �������� ��ҵǰ�, 200�� �Է��� ��� 2��� Ȯ��˴ϴ�
			 * 
			 * @param	String 		���� ����.
			 * @param	float 		��ȯ����.
			 * 
			 * @return	int		0�̿��� �� ����	
			 */
			/*			
			$rtn_value = DEXT5Handler::ImageConvertSizeByPercent($save_file, 50);
			if ($rtn_value != 0) // ���� ����
			{
				$strLastError = DEXT5Handler::LastErrorMessage(); 
			}
			*/
			
			 /**
			  * ���� �̹����� ȸ���� �̹����� ��ȯ�մϴ�.(�� �ð� ����)
			  * 
			  * @param	String 		���� ����.
			  * @param	int 		ȸ������ (0, 90, 180, 270, 360 �� �� �ϳ� ����).
			  * 
			  * @return	int		0�̿��� �� ����	
			  */
			 /*
			 $rtn_value = DEXT5Handler::ImageRotate($save_file, 90);
			 if ($rtn_value != 0) // ���� ����
			 {
				$strLastError = DEXT5Handler::LastErrorMessage(); 
			 }
			 */
			
			/**
			* TextWatermark���� ����� ��Ʈ�� �����մϴ�
			* 
			* @param	String 		��Ʈ���� ��� �� ���ϸ�.
			* @param	int 		��Ʈũ��.
			* @param	int 		��Ʈ ���� (RGB������ Hex).
			* 
			* @return	void
			*/
			/*	
			$rtn_value = DEXT5Handler::SetFontInfo('./gulim.ttc', 100, 0x1e90ff);
			if ($rtn_value != 0) // ���� ����
			{
				$strLastError = DEXT5Handler::LastErrorMessage(); 
			}
			*/

			 /**
			  * ���(����) �̹����� ������ ���͸�ũ �̹����� ���͸�ũ ó���� �մϴ�.
			  * �̹��� ���Ͽ� ȸ���� �ΰ� ��ó�� �˸� �� ������ �� �ֽ��ϴ�.
			  * 
			  * @param	String 		���� ����.
			  * @param	String 		���͸�ũ�� ����� �̹��� ����.
			  * @param	String 		���� ����(TOP, MIDDLE, BOTTOM �� �� �ϳ��� ���).
			  * @param	int 		�ȼ���, strVAlignFrom �����κ����� ����, "MIDDLE" �� ��� ���õ�.
			  * @param	String 		���� ���� (LEFT, CENTER, RIGHT �� �� �ϳ��� ���).
			  * @param	int 		�ȼ���, strHAlignFrom �����κ����� ����, "CENTER" �� ��� ���õ�.
			  * @param	int 		���͸�ũ ���� (100 �̸� ���������̰� 0�̸� ����������).
			  * 
			  * @return	int		0�̿��� �� ����	
			  */
			 /*		
			 $rtn_value = DEXT5Handler::ImageWaterMark($save_file, 'E:\xampp\htdocs\dext5sample\dext5data\2014\02\logo.png', 'BOTTOM', 100, 'RIGHT', 100, 50);
			 if ($rtn_value != 0) // ���� ����
			 {
		 		$strLastError = DEXT5Handler::LastErrorMessage(); 
		 	 }
			*/

			/**
			 * ���(����) �̹����� ������ �ؽ�Ʈ�� ���͸�ũ ó���� �մϴ�.
			 * 
			 * @param	String 			���� ����.
			 * @param	String 			���͸�ũ �ؽ�Ʈ.
			 * @param	String 			���� ����(TOP, MIDDLE, BOTTOM �� �� �ϳ��� ���).
			 * @param	int 			�ȼ���, strVAlignFrom �����κ����� ����, "MIDDLE" �� ��� ���õ�.
			 * @param	String 			���� ���� (LEFT, CENTER, RIGHT �� �� �ϳ��� ���).
			 * @param	int 			�ȼ���, strHAlignFrom �����κ����� ����, "CENTER" �� ��� ���õ�.
			 * @param	int 			�ؽ�Ʈ ȸ�� ����.
			 * 
			 * @return	int		$rtn_value			0�̿��� �� ����
			 */	
			/* 
			$rtn_value = DEXT5Handler::TextWaterMark($save_file, 'vvvvvv', 'BOTTOM', 0, 'RIGHT', 0, 90);
			if ($rtn_value != 0) // ���� ����
			{
				$strLastError = DEXT5Handler::LastErrorMessage(); 
			}
			*/

			/**
			 * ���ο� ���� �̸��� ���ڿ��� �����մϴ�
			 * @param	String 	Ȯ����.
			 * @param	String 	���ϸ� ���� Ÿ���� �����մϴ�. ��GUID��, ��TIME�� �� �ϳ��� ����մϴ�..
			 * 
			 * @return	String	���ϸ�	
			 */
			/*
			$rtn_value = DEXT5Handler::GetNewFileNameEx($sExtension, $sType);
			if ($rtn_value != 0) // ���� ����
			{
				$strLastError = DEXT5Handler::LastErrorMessage(); 
			}
			*/
			
			/**
			 * ��� �̹����� Width���� ��ȯ�մϴ�.
			 * 
			 * @param	String 	���� ����.
			 * 
			 * @return	int		Width.
			 */	
			//$rtn_value = DEXT5Handler::GetImageWidth($save_file);
			
			/**
			 * ��� �̹����� Height���� ��ȯ�մϴ�.
			 * 
			 * @param	String 		���� ����.
			 * 
			 * @return	int			Height.
			 */
			//$rtn_value = DEXT5Handler::GetImageHeight($save_file);
			
			/**
			 * ��� �̹����� ���������� ��ȯ�մϴ�.
			 * 
			 * @param	String 		���� ����.
			 * 
			 * @return	String		������������.
			 */
			//$rtn_value = DEXT5Handler::GetImageFormat($save_file);
			
			/**
			 * ��� �̹����� ���ϻ���� ��ȯ�մϴ�.
			 * 
			 * @param	String 		���� ����.
			 * 
			 * @return	int			���ϻ����� (byte).
			 */
			//$rtn_value = DEXT5Handler::GetImageFileSize($save_file);
			
			/**
			 * ��� �̹����� �����մϴ�..
			 * 
			 * @param	String 	$strSourceFile		���� ����.
			 * 
			 * @return	int		$rtn_value			0�̿��� �� ����.
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
	
		// ���Ͼ���
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

			$r_file = fopen($html_real_path_file, "rb"); //rb �б����� ���̷��� Ÿ��

			while (!feof($r_file)) { 
				echo fread($r_file, 100*1024); //echo�� ������ ����.
				flush(); //��� ���ۺ��� �Լ�.. 
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
				// ù��°�� '/' �� �����ϴ� ���
				$to_save_path_url = $_SERVER['DOCUMENT_ROOT'].$to_save_path_url;
			} else {
				$tmp_path = str_replace('\\', '/', realpath("../../."));
				$to_save_path_url = $tmp_path.'/'.$to_save_path_url;
			}
		} else if (strlen($to_save_path_url) == 0) {
			// ���� ���� ���
			$to_save_path_url = str_replace('\\', '/', realpath("../../."));
		} else {
			// �� �̿��� ���
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

		// ������ �������� �ʴٸ�..
		if (is_dir($to_save_path_url) == false) {
			// ���� ���Ѽ���
			//mkdir($to_save_path_url, 0777, true);
			// ���� ����
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

		// �̹��� ũ��
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

		if(!$gdver) return "GD ����üũ ���аų� GD ������ 1 �̸��Դϴ�.";

		$srcname = $imgfull_name;
		$timg = getimagesize($srcname);

		switch ($timg[2]) {
			case IMAGETYPE_JPEG: $cfile = imagecreatefromjpeg($srcname); break;
			case IMAGETYPE_PNG:	$cfile = imagecreatefrompng($srcname); break;
			case IMAGETYPE_GIF:	$cfile = imagecreatefromgif($srcname); break;
			case IMAGETYPE_BMP: $cfile = imagecreatefrombmp($srcname); break;
			default: return "�������� �ʴ� �̹��� �����Դϴ�."; break;
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
