<%@ WebHandler Language="C#" Class="dext5handler" %>

using System;
using System.Web;

public class dext5handler : IHttpHandler
{
    Raonwiz.Dext5.UploadHandler upload = null;

    public void ProcessRequest (HttpContext context) {
                
        upload = new Raonwiz.Dext5.UploadHandler();

        // 디버깅
        //upload.SetDebugMode(true, @"로그파일 경로");

        
        /*****************************************************
         * 클라이언트에서 파일마다 추가한 data값을 받는 핸들러 페이지 예제 입니다.
         * 아래의 업로드 관련 이벤트를 사용하셔서 해당 이벤트 안에서 값을 받으시면 됩니다.
         * 각 이벤트 함수 안의 내용을 보시면 추가한 data를 받는 로직이 있으니 참고하시면 됩니다.
        *****************************************************/


        ///////////////////////////////
        // 이벤트를 등록 처리
        ///////////////////////////////
        // 파일 저장전 이벤트 처리기 등록
        upload.UploadBeforeInitializeEventEx += new Raonwiz.Dext5.UploadHandlerBeforeInitializeDelegateEx(Dext5_UploadBeforeInitializeEventEx); 
        
        // 업로드 완료전 이벤트 처리기 등록
        upload.UploadCompleteBeforeEventEx += new Raonwiz.Dext5.UploadHandlerBeforeCompleteDelegateEx(Dext5_UploadCompleteBeforeEventEx); 
            
        // 업로드 완료후 이벤트 처리기 등록
        upload.UploadCompleteEventEx += new Raonwiz.Dext5.UploadHandlerDelegateEx(Dext5_UploadCompleteEventEx);

        // 다운로드 전 이벤트 처리기 등록
        //upload.OpenDownloadBeforeInitializeEventEx += new Raonwiz.Dext5.OpenDownloadBeforeInitializeDelegateEx(Dext5_OpenDownloadBeforeInitializeEventEx);
        
        // 다운로드 완료후 이벤트 처리기 등록
        //upload.OpenDownloadCompleteEventEx += new Raonwiz.Dext5.OpenDownloadHandlerDelegateEx(Dext5_OpenDownloadCompleteEventEx);
         
        ///////////////////////////////
        // 서버모듈 설정
        ///////////////////////////////

        // 실제 업로드 할 기본경로 설정 (가상경로와 물리적 경로로 설정 가능)
        // 폴더명 제일 뒤에 .과 공백이 있다면 제거하시고 설정해 주세요.(운영체제에서 지원되지 않는 문자열입니다.)

        //-------------------- [설정방법1] 물리적 경로 설정 시작 --------------------//
        /*
        // 해당 설정은 PhysicalPath를 DEXT5 Upload 제품폴더\dext5uploaddata\ 를 저장 Root 경로로 설정하는 내용입니다.
        string saveRootFolder = context.Request.PhysicalPath;
        saveRootFolder = saveRootFolder.Substring(0, context.Request.PhysicalPath.LastIndexOf(System.IO.Path.DirectorySeparatorChar));
        saveRootFolder = saveRootFolder.Substring(0, saveRootFolder.LastIndexOf(System.IO.Path.DirectorySeparatorChar));
        saveRootFolder = System.IO.Path.Combine(saveRootFolder, "dext5uploaddata");
        upload.SetPhysicalPath = saveRootFolder;

        // 임시파일 물리적 경로설정 ( SetPhysicalPath에 설정된 경로 + dext5temp )
        upload.SetTempPath = saveRootFolder + System.IO.Path.DirectorySeparatorChar + "dext5temp";
        */
        //-------------------- [설정방법1] 물리적 경로 설정 끝 --------------------//

        //-------------------- [설정방법2] 가상경로 설정 시작 --------------------//
        upload.SetVirtualPath = "/dext5uploaddata";

        // 임시파일 물리적 경로설정 ( SetVirtualPath에 설정된 경로 + dext5temp )
        upload.SetTempPath = context.Request.MapPath("/dext5uploaddata") + System.IO.Path.DirectorySeparatorChar + "dext5temp";
        //-------------------- [설정방법2] 가상경로 설정 끝 --------------------//

        // 위에 설정된 임시파일 물리적 경로에서 불필요한 파일을 삭제 처리하는 설정 (단위: 일)    
        upload.SetGarbageCleanDay = 2;
        
        // 환경설정파일 물리적 폴더 (서버 환경변수를 사용할 경우)
        //upload.SetConfigPhysicalPath = @"D:\Dext5UploadData\config";
        
        // 웹표준 모드에서 멀티 파일 다운로드시 zip 파일명을 설정
        //upload.SetZipFileName = "download.zip";

        // DEXT5 Upload는 업로드시 클라이언트와 서버에서 보안을 위하여 이중으로 확장자 체크를 합니다.
        // 서버 확장자 체크는 클라이언트에서 적용한 값으로 기본 설정되며, 
        // 아래 부분을 적용하시면, 설정한 값으로 서버에서 확장자 체크가 이루어집니다.
        // 1번째 인자는 0: 제한으로 설정, 1: 허용으로 설정, 두번째 인자는 확장자 목록 : jpg,exe (구분자,)
        //upload.SetUploadCheckFileExtension(0, "exe,aspx,jsp");

        // DEXT5 Upload는 업로드시 서버에서 파일명에대한 제어를 위한 설정 기능을 제공합니다.
        //string[] tempWordList  = new string[1];
        //tempWordList[0] = "hacking";
        //upload.SetFileBlackWordList = tempWordList;

        // DEXT5 Upload는 다운로드시 서버에서 보안을 위하여 확장자 체크를 합니다. (부모 경로 접근을 이용한 서버파일 다운로드 방지 등)
        // 아래 부분을 적용하시면, 설정한 값으로 서버에서 확장자 체크가 이루어집니다.
        // 1번째 인자는 0: 제한으로 설정, 1: 허용으로 설정, 두번째 인자는 확장자 목록 : jpg,exe (구분자,)
        //upload.SetDownloadCheckFileExtension(0, "exe,aspx,jsp");
    
        // 실제 실행부
        upload.Process(context);

        // 메모리 해제
        upload.Dispose();
    }

    private void Dext5_UploadBeforeInitializeEventEx(Raonwiz.Dext5.Process.Entity.UploadEventEntity parameterEntity)
    {
        // 파일 저장전 발생하는 이벤트 입니다.
        // 파일에 대한 저장 경로를 변경해야 하는 경우 사용합니다.
        // 아직 클라이언트 측으로 출력을 내보내기 전이므로, 이곳에서 Response값을 변경하시면 클라이언트로 적용된 값이 전달됩니다.


        /*************** 파일마다 추가한 data 값을 아래처럼 받으신 후 원하는 로직을 구현하시면 됩니다. ***************/
        HttpContext context = parameterEntity.Context; //Context Value

        string[] mark = upload.GetRequestValue(context, "mark");
        if (mark != null && mark.Length > 0)
        {
            // mark[0] 값을 이용하여 Business Logic 구현
        };
        /*************************************************************************************************/
        
        
        //string newFileLocation = parameterEntity.NewFileLocation; //NewFileLocation Value
        //string responseFileName = parameterEntity.ResponseFileName; //ResponseFileName Value

        //parameterEntity.NewFileLocation = newFileLocation; //Change NewFileLocation Value
        //parameterEntity.ResponseFileName = responseFileName; //Change ResponseFileName Value

        // upload.SetCustomError("사용자오류");
        // upload.SetCustomError("999", "사용자오류"); /* Error Code를 설정하실 때에는 900이상의 3자리로 설정 */
    }

    private void Dext5_UploadCompleteBeforeEventEx(Raonwiz.Dext5.Process.Entity.UploadEventEntity parameterEntity)
    {
        // 파일 업로드 완료전 발생하는 이벤트 입니다.
        // 업로드된 파일의 DRM을 해제와 같은 파일처리 작업이 필요할 경우 사용합니다.
        // 아직 클라이언트 측으로 출력을 내보내기 전이므로, 이곳에서 Response값을 변경하시면 클라이언트로 적용된 값이 전달됩니다.


        /*************** 파일마다 추가한 data 값을 아래처럼 받으신 후 원하는 로직을 구현하시면 됩니다. ***************/
        HttpContext context = parameterEntity.Context; //Context Value
        
        string[] mark = upload.GetRequestValue(context, "mark");
        if (mark != null && mark.Length > 0)
        {
            // mark[0] 값을 이용하여 Business Logic 구현
        };
        /*************************************************************************************************/
        
        
        //string newFileLocation = parameterEntity.NewFileLocation; //NewFileLocation Value
        //string responseFileServerPath = parameterEntity.ResponseFileServerPath; //ResponseFileServerPath Value
        //string responseFileName = parameterEntity.ResponseFileName; //ResponseFileName Value
        //string responseGroupId = parameterEntity.ResponseGroupId; //GroupId Value
        //string fileIndex = parameterEntity.FileIndex; //FileIndex Value - 마지막 파일은 index 뒤에 z가 붙습니다.

        //parameterEntity.NewFileLocation = newFileLocation; //Change NewFileLocation Value
        //parameterEntity.ResponseFileServerPath = responseFileServerPath; //Change ResponseFileServerPath Value
        //parameterEntity.ResponseFileName = responseFileName; //Change ResponseFileName Value
        //parameterEntity.ResponseCustomValue = "ResponseCustomValue"; //Set ResponseCustomValue (특수기호(:,::,*,|,\b)가 포함되면 ResponseCustomValue가 설정되지 않습니다.)
        //parameterEntity.ResponseGroupId = responseGroupId; //Change GroupId Value (특수기호(:,::,*,|,\b)가 포함되면 ResponseCustomValue가 설정되지 않습니다.)

        // upload.SetCustomError("사용자오류");
        // upload.SetCustomError("999", "사용자오류"); /* Error Code를 설정하실 때에는 900이상의 3자리로 설정 */
    }

    private void Dext5_UploadCompleteEventEx(Raonwiz.Dext5.Process.Entity.UploadEventEntity parameterEntity)
    {
        // 파일 업로드 완료후 발생하는 이벤트 입니다.    

        
        /*************** 파일마다 추가한 data 값을 아래처럼 받으신 후 원하는 로직을 구현하시면 됩니다. ***************/
        HttpContext context = parameterEntity.Context; //Context Value

        string[] mark = upload.GetRequestValue(context, "mark");
        if (mark != null && mark.Length > 0)
        {
            // mark[0] 값을 이용하여 Business Logic 구현
        };
        /*************************************************************************************************/
        
        
        //string newFileLocation = parameterEntity.NewFileLocation; //NewFileLocation Value
        //string responseFileServerPath = parameterEntity.ResponseFileServerPath; //ResponseFileServerPath Value
        //string responseFileName = parameterEntity.ResponseFileName; //ResponseFileName Value

        // 이미지 처리 관련 API
        using (Raonwiz.Dext5.Common.Dext5Image dextImage = new Raonwiz.Dext5.Common.Dext5Image())
        {
            try
            {
                //dextImage.JpegQuality = 100; // JPG 품질 (1 ~ 100)

                string tempFilePath = string.Empty;
                //string sourceFileFullPath = newFileLocation;

                // 동일 폴더에 이미지 썸네일 생성하기
                //tempFilePath = dextImage.MakeThumbnail(sourceFileFullPath, "", 200, 0, true);

                // 특정위치에 이미지 썸네일 생성하기
                //string targetFileFullPath = @"c:\temp\test_thumb.jpg";
                //tempFilePath = dextImage.MakeThumbnailEX(sourceFileFullPath, targetFileFullPath, 200, 0, false);

                // 이미지 포멧 변경
                //tempFilePath = dextImage.ConvertImageFormat(sourceFileFullPath, "", Raonwiz.Dext5.Common.Dext5ImageFormat.png, false, false);

                // 이미지 크기 변환
                //dextImage.ConvertImageSize(sourceFileFullPath, 500, 30);

                // 비율로 이미지 크기 변환
                //dextImage.ConvertImageSizeByPercent(sourceFileFullPath, 50);

                // 이미지 회전
                //dextImage.Rotate(sourceFileFullPath, 90);

                // 이미지 워터마크
                //string waterMarkFilePath = @"c:\temp\dext5_logo.png";
                //dextImage.SetImageWaterMark(sourceFileFullPath, waterMarkFilePath, "TOP", 10, "RIGHT", 10, 0);

                // 텍스트 워터마크
                //Raonwiz.Dext5.Common.Entity.TextWaterMark txtWaterMark = new Raonwiz.Dext5.Common.Entity.TextWaterMark("DEXT5 Upload", "굴림", 12, "#FF00FF");                
                //dextImage.SetTextWaterMark(sourceFileFullPath, txtWaterMark, "TOP", 10, "CENTER", 10, 0, 0);

                // 이미지 크기
                //System.Drawing.Size size = dextImage.GetImageSize(sourceFileFullPath);
                //int _width = size.Width;
                //int _height = size.Height;

                // EXIF 추출 (Exif standard 2.2, JEITA CP-2451)
                //Raonwiz.Dext5.Common.Exif.ExifEntity _exif = dextImage.GetExifEntityData(sourceFileFullPath);  
            }
            catch (Exception ex)
            {
                string errorMsg = ex.Message;
            }
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