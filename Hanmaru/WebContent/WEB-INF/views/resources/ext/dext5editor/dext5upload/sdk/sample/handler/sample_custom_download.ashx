<%@ WebHandler Language="C#" Class="sample_custom_download" %>

using System;
using System.Web;

public class sample_custom_download : IHttpHandler {

    private char m_PathChar = System.IO.Path.DirectorySeparatorChar;
    
    public void ProcessRequest (HttpContext context) {
        
        using (Raonwiz.Dext5.UploadHandler upload = new Raonwiz.Dext5.UploadHandler())
        {
            // 다운로드 전 이벤트 처리기 등록
            upload.OpenDownloadBeforeInitializeEventEx += new Raonwiz.Dext5.OpenDownloadBeforeInitializeDelegateEx(Dext5_OpenDownloadBeforeInitializeEventEx);
            
            // 파일 업로드 열기 및 다운로드 이벤트 처리기 등록
            upload.OpenDownloadCompleteEventEx += new Raonwiz.Dext5.OpenDownloadHandlerDelegateEx(Dext5_OpenDownloadCompleteEventEx);
            
            #region Custom Business Logic
            
            string[] customValueList = upload.GetRequestValue(context, "customValue");

            System.Collections.Generic.List<string> downloadList = new System.Collections.Generic.List<string>();

            string TempPath = context.Request.PhysicalPath.Substring(0, context.Request.PhysicalPath.LastIndexOf(m_PathChar));
            TempPath = TempPath.Substring(0, TempPath.LastIndexOf(m_PathChar));

            // 필수 조건
            if (customValueList != null)
            {
                for (int i = 0; i < customValueList.Length; i++)
                {
                    customValueList[i] = HttpUtility.UrlDecode(customValueList[i], System.Text.Encoding.UTF8);
                    // 해당 값을 이용하여 파일의 물리적 경로 생성 (실제 물리적 파일 경로를 설정해주세요.)
                    switch (customValueList[i])
                    {
                        case "CustomValue1":
                            downloadList.Add(System.IO.Path.Combine(TempPath, @"images" + m_PathChar + "Panorama" + m_PathChar + "ViewPhotos.jpg"));
                            break;
                        case "CustomValue2":
                            downloadList.Add(System.IO.Path.Combine(TempPath, @"images" + m_PathChar + "Scenery" + m_PathChar + "image" + m_PathChar + "CreativeImages.bmp"));
                            break;
                    }
                }
            }
            
            #endregion Custom Business Logic
            
            // 임시파일 물리적 경로설정
            //upload.SetTempPath = @"D:\temp";
            //upload.SetZipFileName = "download.zip";

            // DEXT5 Upload는 다운로드시 서버에서 보안을 위하여 확장자 체크를 합니다. (부모 경로 접근을 이용한 서버파일 다운로드 방지 등)
            // 아래 부분을 적용하시면, 설정한 값으로 서버에서 확장자 체크가 이루어집니다.
            // 1번째 인자는 0: 제한으로 설정, 1: 허용으로 설정, 두번째 인자는 확장자 목록 : jpg,exe (구분자,)
            //upload.SetDownloadCheckFileExtension(0, "exe,aspx,jsp");
            
            // DEXT5 Upload는 업로드시 서버에서 파일명에대한 제어를 위한 설정 기능을 제공합니다.
            //string[] tempWordList  = new string[1];
            //tempWordList[0] = "hacking";
            //upload.SetFileBlackWordList = tempWordList;
            
            upload.ProcessCustomDownload(context, downloadList);            
        }
        
    }

    private void Dext5_OpenDownloadBeforeInitializeEventEx(Raonwiz.Dext5.Process.Entity.UploadEventEntity parameterEntity)
    {
        // 파일 열기 및 다운로드시 발생하는 이벤트 입니다.

        //HttpContext context = parameterEntity.Context; //Context Value
        //string[] downloadFilePath = parameterEntity.DownloadFilePath; //DownloadFilePath Value
        //string[] downloadFileName = parameterEntity.DownloadFileName; //DownloadFileName Value
        //string[] downloadCustomValue = parameterEntity.DownloadCustomValue;  //DownloadCustomValue

        //parameterEntity.DownloadFilePath = downloadFilePath; //Change DownloadFilePath Value
        //parameterEntity.DownloadFileName = downloadFileName; //Change DownloadFileName Value
        //parameterEntity.UseDownloadServerFileName = true; //DownloadFileName 변경했을 경우 설정해야 합니다.

        //upload.SetCustomError("사용자오류");
        //upload.SetCustomError("999", "사용자오류"); /* Error Code를 설정하실 때에는 900이상의 3자리로 설정 */
    }

    private void Dext5_OpenDownloadCompleteEventEx(Raonwiz.Dext5.Process.Entity.UploadEventEntity parameterEntity)
    {
        // 파일 업로드 열기 및 다운로드시 발생하는 이벤트 입니다.

        //HttpContext context = parameterEntity.Context; //Context Value
        //string[] downloadFilePath = parameterEntity.DownloadFilePath; //DownloadFilePath Value
        //string[] downloadFileName = parameterEntity.DownloadFileName; //DownloadFileName Value
        //string[] downloadCustomValue = parameterEntity.DownloadCustomValue;  //DownloadCustomValue
    }
 
    public bool IsReusable {
        get {
            return false;
        }
    }

}