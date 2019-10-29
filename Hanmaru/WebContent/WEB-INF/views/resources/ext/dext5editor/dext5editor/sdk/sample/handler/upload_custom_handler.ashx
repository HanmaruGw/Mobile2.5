<%@ WebHandler Language="C#" Class="upload_handler" %>

using System;
using System.Web;

using com.dext5;

public class upload_handler : IHttpHandler
{
    private string handler_version = "3.5.1055089.1927.01";
    
    private string _allowFileExt = "gif, jpg, jpeg, png, bmp, wmv, asf, swf, avi, mpg, mpeg, mp4, txt, doc, docx, xls, xlsx, ppt, pptx, hwp, zip, pdf";
	
    public void ProcessRequest (HttpContext context)
	{
		DEXT5Handler DEXT5 = new DEXT5Handler();
		DEXT5.JpegQuality = 100; // JPG 품질 (1 ~ 100)
		// (저품질, 용량 축소) 1 ~ 100 (고품질, 용량 증가)

		string rtn_message = DEXT5.DEXTProcess(context, _allowFileExt);

        // 다음과 같이 서버측 API를 사용하실 수 있습니다.
        string _LastSaveFile = DEXT5.LastSaveFile;
        string _LastSaveUrl = DEXT5.LastSaveUrl;
                
        //  이미지 관련 API	
		if (DEXT5.IsImageUpload == true)
		{
			/*
			// 동일 폴더에 이미지 썸네일 생성하기
			string strSourceFile = DEXT5.LastSaveFile;
			int rtn_value = DEXT5.ImageThumbnail(strSourceFile, "_thumb", 600, 0);
			if (rtn_value != 0)
			{
				string strLastError = DEXT5.LastErrorMessage;
			}
			*/

			/*
			// 썸네일 파일 생성
			string strSourceFile = DEXT5.LastSaveFile;
			string strNewFileName = strSourceFile.Replace("\\image\\", "\\thumbnail\\");
			int rtn_value = DEXT5.GetImageThumbOrNewEx(strSourceFile, strNewFileName, 200, 0, 0);
			if (rtn_value != 0)
			{
				string strLastError = DEXT5.LastErrorMessage;
			}
			*/

			/*
			// 이미지 포멧 변경
			string strSourceFile = DEXT5.LastSaveFile;
			int rtn_value = DEXT5.ImageConvertFormat(strSourceFile, "png", 0);
			if (rtn_value != 0)
			{
				string strLastError = DEXT5.LastErrorMessage;
			}
			*/
			
			/*
			// 이미지 크기 변환
			string strSourceFile = DEXT5.LastSaveFile;
			int rtn_value = DEXT5.ImageConvertSize(strSourceFile, 500, 30);
			if (rtn_value != 0)
			{
				string strLastError = DEXT5.LastErrorMessage;
			}
			*/

			/*
			// 비율로 이미지 크기 변환
			string strSourceFile = DEXT5.LastSaveFile;
			int rtn_value = DEXT5.ImageConvertSizeByPercent(strSourceFile, 50);
			if (rtn_value != 0)
			{
				string strLastError = DEXT5.LastErrorMessage;
			}
			*/

			/*
			// 이미지 회전
			string strSourceFile = DEXT5.LastSaveFile;
			int rtn_value = DEXT5.ImageRotate(strSourceFile, 90);
			if (rtn_value != 0)
			{
				string strLastError = DEXT5.LastErrorMessage;
			}
			*/

			/*
			// 이미지 워터마크
			string strSourceFile = DEXT5.LastSaveFile;
			string strWaterMarkFile = @"C:\Temp\watermark.jpg";
			int rtn_value = DEXT5.ImageWaterMark(strSourceFile, strWaterMarkFile, "TOP", 10, "RIGHT", 10, 0);
			if (rtn_value != 0)
			{
				string strLastError = DEXT5.LastErrorMessage;
			}
			*/

			/*
			// 텍스트 워터마크
			string strSourceFile = DEXT5.LastSaveFile;
			DEXT5.SetFontInfo("굴림", 50, "FF00FF");
			int rtn_value = DEXT5.TextWaterMark(strSourceFile, "DEXT5", "TOP", 10, "CENTER", 10, 0, 45);
			if (rtn_value != 0)
			{
				string strLastError = DEXT5.LastErrorMessage;
			}
			*/

            /*
            // 다른 파일명.확장자 
            string strSourceFile = DEXT5.LastSaveFile;
            string rtn_value = DEXT5.GetNewFileNameEx("jpg", "TIME");
            if (rtn_value.Equals(""))
            {
                string strLastError = DEXT5.LastErrorMessage;
            }
            */

            /*
            // 이미지 가로(Width) 크기
            string strSourceFile = DEXT5.LastSaveFile;
            int rtn_value = DEXT5.GetImageWidth(strSourceFile);
            if (rtn_value <= 0)
            {
                string strLastError = DEXT5.LastErrorMessage;
            }
            */
			
			/*
			// 이미지 세로(Height) 크기
			string strSourceFile = DEXT5.LastSaveFile;
			int rtn_value = DEXT5.GetImageHeight(strSourceFile);
			if (rtn_value <= 0)
			{
				string strLastError = DEXT5.LastErrorMessage;
			}
			*/

			/*
			// 이미지 Format 정보
			string strSourceFile = DEXT5.LastSaveFile;
			string rtn_value = DEXT5.GetImageFormat(strSourceFile);
			if (rtn_value == "")
			{
				string strLastError = DEXT5.LastErrorMessage;
			}
			*/


			/*
			// 이미지 파일 크기
			string strSourceFile = DEXT5.LastSaveFile;
			long rtn_value = DEXT5.GetImageFileSize(strSourceFile);
			if (rtn_value <= 0)
			{
				string strLastError = DEXT5.LastErrorMessage;
			}
			*/
			
			/*
			// 파일 삭제
			string strSourceFile = DEXT5.LastSaveFile;
			int rtn_value = DEXT5.DeleteFile(strSourceFile, false);
			if (rtn_value != 0)
			{
				string strLastError = DEXT5.LastErrorMessage;
			}
			*/ 
  
		
		}

        if (!String.IsNullOrEmpty(rtn_message))
        {
            context.Response.Clear();
            context.Response.Write(rtn_message);
        }
    }

	
	public bool IsReusable { get { return false; } }

}