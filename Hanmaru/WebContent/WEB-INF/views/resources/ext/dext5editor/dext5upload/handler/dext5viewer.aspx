<%@ Page Language="C#" %>
<%
    using (Raonwiz.Dext5.UploadHandler upload = new Raonwiz.Dext5.UploadHandler())
    {
        // 디버깅
        //upload.SetDebugMode(true, @"로그파일 경로");
        
        upload.Viewer(this.Context);
    }
%>