var G_vertical = '\u000B';
var G_formfeed = '\u000C';

var strSelectedMenu = '0,0';
var strMenuStatus = '';

//1 : icon (1 : intro, 2 : guide, 3 : sample, 4 : setting, 5 : brace, 6 : serverinfo, 7 : js, 8 : net, 9 : java)
//2 : title flag (0 : false, 1 : true)
//3 : title
//4 : url

var arrFirstMenu = ['1' + G_vertical + '0' + G_vertical + '소개', '2' + G_vertical + '0' + G_vertical + '클라이언트 가이드', '2' + G_vertical + '0' + G_vertical + '서버 가이드(.NET)', '2' + G_vertical + '0' + G_vertical + '서버 가이드(JAVA)', '2' + G_vertical + '0' + G_vertical + '기타 가이드', '3' + G_vertical + '0' + G_vertical + '샘플'];
var arrSecondMenu = [
    ['4' + G_vertical + '1' + G_vertical + '설치 및 기본설정' + G_vertical + 'html/dext5uploadSdkMain.html'],
    ['4' + G_vertical + '0' + G_vertical + 'Settings',
     '5' + G_vertical + '0' + G_vertical + 'Methods',
     '5' + G_vertical + '0' + G_vertical + 'Events'],
    ['5' + G_vertical + '0' + G_vertical + 'Properties',
     '5' + G_vertical + '0' + G_vertical + 'Methods',
     '5' + G_vertical + '0' + G_vertical + 'Image Methods',
     '5' + G_vertical + '0' + G_vertical + 'Events',
     '6' + G_vertical + '0' + G_vertical + '서버 설정 가이드'],
    ['5' + G_vertical + '0' + G_vertical + 'Methods',
     '5' + G_vertical + '0' + G_vertical + 'Image Methods',
     '5' + G_vertical + '0' + G_vertical + 'Events',
     '6' + G_vertical + '0' + G_vertical + '서버 설정 가이드'],
    ['2' + G_vertical + '1' + G_vertical + '서버에서 환경설정 파일 읽기' + G_vertical + 'html/etc/_Sample1.html',
     '2' + G_vertical + '1' + G_vertical + '파라미터 추가 후 서버에서 받는 방법' + G_vertical + 'html/etc/_Sample2.html',
     '2' + G_vertical + '1' + G_vertical + '파일 추가할 때 각 파일에 특정 정보 추가 후 서버에서 받는 방법' + G_vertical + 'html/etc/_Sample3.html',
     '2' + G_vertical + '1' + G_vertical + '파일을 원하는 파일명으로 변환하는 방법' + G_vertical + 'html/etc/_Sample4.html',
     '2' + G_vertical + '1' + G_vertical + '서버 이벤트에서 업로드 된 파일 정보 얻는 방법' + G_vertical + 'html/etc/_Sample5.html',
     '2' + G_vertical + '1' + G_vertical + '서버 커스텀 다운로드 핸들러에서 커스텀 에러 처리 방법' + G_vertical + 'html/etc/_Sample6.html'],
    ['3' + G_vertical + '1' + G_vertical + '기본 업로드' + G_vertical + 'sample/html/sample_upload.html',
     '3' + G_vertical + '1' + G_vertical + '기본 다운로드' + G_vertical + 'sample/html/sample_download.html',
     '3' + G_vertical + '1' + G_vertical + '동적 생성' + G_vertical + 'sample/html/sample_ajax.html',
     '3' + G_vertical + '1' + G_vertical + '보안컨텐츠 다운로드' + G_vertical + 'sample/html/sample_custom_download.html',
     '3' + G_vertical + '1' + G_vertical + '다중 업로드' + G_vertical + 'sample/html/sample_multi_upload.html',
     '3' + G_vertical + '1' + G_vertical + '다중 다운로드' + G_vertical + 'sample/html/sample_multi_download.html',
     '3' + G_vertical + '1' + G_vertical + '다운로드 모드 설정' + G_vertical + 'sample/html/sample_download_mode.html',
     '3' + G_vertical + '1' + G_vertical + '편집모드 이벤트' + G_vertical + 'sample/html/sample_edit_event.html',
     '3' + G_vertical + '1' + G_vertical + '보기모드 이벤트' + G_vertical + 'sample/html/sample_view_event.html',
     '3' + G_vertical + '1' + G_vertical + 'File 테그 연동' + G_vertical + 'sample/html/sample_inputfile_upload.html',
     '3' + G_vertical + '1' + G_vertical + '폴더 구조로 업로드' + G_vertical + 'sample/html/sample_folder_upload.html',
     '3' + G_vertical + '1' + G_vertical + '폴더 구조로 업로드 옵션' + G_vertical + 'sample/html/sample_folder_upload_option.html',
     '3' + G_vertical + '1' + G_vertical + '폴더 구조로 다운로드' + G_vertical + 'sample/html/sample_folder_download.html',
     '3' + G_vertical + '1' + G_vertical + '이미지 미리보기' + G_vertical + 'sample/html/sample_img_preview.html',
     '3' + G_vertical + '1' + G_vertical + '졍렬/파일 순서 바꾸기' + G_vertical + 'sample/html/sample_file_sort.html',
     '3' + G_vertical + '1' + G_vertical + '대용량 설정' + G_vertical + 'sample/html/sample_large_file.html',
     '3' + G_vertical + '1' + G_vertical + 'Drop Zone' + G_vertical + 'sample/html/sample_drop_zone.html',
     '3' + G_vertical + '1' + G_vertical + '양식모드' + G_vertical + 'sample/html/sample_form_mode.html',
     '3' + G_vertical + '1' + G_vertical + '저장경로 설정 방법' + G_vertical + 'sample/html/sample_set_save_folder.html',
     '3' + G_vertical + '1' + G_vertical + '커스텀버튼 추가' + G_vertical + 'sample/html/sample_custom_button.html',
     '3' + G_vertical + '1' + G_vertical + '편집/보기 모드 동시 사용' + G_vertical + 'sample/html/sample_upload_view.html',
     '3' + G_vertical + '1' + G_vertical + '파라미터 추가' + G_vertical + 'sample/html/sample_add_formdata.html',
     '3' + G_vertical + '1' + G_vertical + '각 파일에 data 추가하는 방법' + G_vertical + 'sample/html/sample_set_mark_value.html',
     '3' + G_vertical + '1' + G_vertical + '팝업창이 플러그인에 가려질 때' + G_vertical + 'sample/html/sample_set_popup_mode.html',
     '3' + G_vertical + '1' + G_vertical + '업로드 경로 암호화' + G_vertical + 'sample/html/sample_path_encrypt.html']
];
var arrThirdMenu = [
    [],
    [
        ['7' + G_vertical + '1' + G_vertical + 'InitXml' + G_vertical + 'html/client/_s_InitXml.html',
         '7' + G_vertical + '1' + G_vertical + 'InitServerXml' + G_vertical + 'html/client/_s_InitServerXml.html',
         '7' + G_vertical + '1' + G_vertical + 'InitVisible' + G_vertical + 'html/client/_s_InitVisible.html',
         '7' + G_vertical + '1' + G_vertical + 'UploadHolder' + G_vertical + 'html/client/_s_UploadHolder.html',
         '7' + G_vertical + '1' + G_vertical + 'IgnoreSameUploadName' + G_vertical + 'html/client/_s_IgnoreSameUploadName.html',
         '7' + G_vertical + '1' + G_vertical + 'License' + G_vertical + 'html/client/_s_License.html',
         '7' + G_vertical + '1' + G_vertical + 'Runtimes' + G_vertical + 'html/client/_s_Runtimes.html',
         '7' + G_vertical + '1' + G_vertical + 'PluginVersion' + G_vertical + 'html/client/_s_PluginVersion.html',
         '7' + G_vertical + '1' + G_vertical + 'Width' + G_vertical + 'html/client/_s_Width.html',
         '7' + G_vertical + '1' + G_vertical + 'Height' + G_vertical + 'html/client/_s_Height.html',
         '7' + G_vertical + '1' + G_vertical + 'SkinName' + G_vertical + 'html/client/_s_SkinName.html',
         '7' + G_vertical + '1' + G_vertical + 'CssRootPath' + G_vertical + 'html/client/_s_CssRootPath.html',
         '7' + G_vertical + '1' + G_vertical + 'CustomColor' + G_vertical + 'html/client/_s_CustomColor.html',
         '7' + G_vertical + '1' + G_vertical + 'CustomWebFileColor' + G_vertical + 'html/client/_s_CustomWebFileColor.html',
         '7' + G_vertical + '1' + G_vertical + 'Lang' + G_vertical + 'html/client/_s_Lang.html',
         '7' + G_vertical + '1' + G_vertical + 'Mode' + G_vertical + 'html/client/_s_Mode.html',
         '7' + G_vertical + '1' + G_vertical + 'Views' + G_vertical + 'html/client/_s_Views.html',
         '7' + G_vertical + '1' + G_vertical + 'ImgPreview' + G_vertical + 'html/client/_s_ImgPreview.html',
         '7' + G_vertical + '1' + G_vertical + 'ShowStatusBar' + G_vertical + 'html/client/_s_ShowStatusBar.html',
         '7' + G_vertical + '1' + G_vertical + 'ShowHeaderBar' + G_vertical + 'html/client/_s_ShowHeaderBar.html',
         '7' + G_vertical + '1' + G_vertical + 'ShowButtonBarEdit' + G_vertical + 'html/client/_s_ShowButtonBarEdit.html',
         '7' + G_vertical + '1' + G_vertical + 'ShowEditAlign' + G_vertical + 'html/client/_s_ShowEditAlign.html',
         '7' + G_vertical + '1' + G_vertical + 'ShowButtonBarView' + G_vertical + 'html/client/_s_ShowButtonBarView.html',
         '7' + G_vertical + '1' + G_vertical + 'ShowViewAlign' + G_vertical + 'html/client/_s_ShowViewAlign.html',
         '7' + G_vertical + '1' + G_vertical + 'ButtonBarPosition' + G_vertical + 'html/client/_s_ButtonBarPosition.html',
         '7' + G_vertical + '1' + G_vertical + 'BorderStyle' + G_vertical + 'html/client/_s_BorderStyle.html',
         '7' + G_vertical + '1' + G_vertical + 'MaxOneFileSize' + G_vertical + 'html/client/_s_MaxOneFileSize.html',
         '7' + G_vertical + '1' + G_vertical + 'MaxTotalFileSize' + G_vertical + 'html/client/_s_MaxTotalFileSize.html',
         '7' + G_vertical + '1' + G_vertical + 'MaxTotalFileCount' + G_vertical + 'html/client/_s_MaxTotalFileCount.html',
         '7' + G_vertical + '1' + G_vertical + 'HideListInfo' + G_vertical + 'html/client/_s_HideListInfo.html',
         '7' + G_vertical + '1' + G_vertical + 'Extension' + G_vertical + 'html/client/_s_Extension.html',
         '7' + G_vertical + '1' + G_vertical + 'MultiFileSelect' + G_vertical + 'html/client/_s_MultiFileSelect.html',
         '7' + G_vertical + '1' + G_vertical + 'ListViewDbclick' + G_vertical + 'html/client/_s_ListViewDbclick.html',
         '7' + G_vertical + '1' + G_vertical + 'ListViewDragAndDrop' + G_vertical + 'html/client/_s_ListViewDragAndDrop.html',
         '7' + G_vertical + '1' + G_vertical + 'ResumeUpload' + G_vertical + 'html/client/_s_ResumeUpload.html',
         '7' + G_vertical + '1' + G_vertical + 'ResumeDownload' + G_vertical + 'html/client/_s_ResumeDownload.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]FolderTransfer' + G_vertical + 'html/client/_s_FolderTransfer.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]Timeout' + G_vertical + 'html/client/_s_Timeout.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]AutomaticConnection' + G_vertical + 'html/client/_s_AutomaticConnection.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]ShowFolderView' + G_vertical + 'html/client/_s_ShowFolderView.html',
         '7' + G_vertical + '1' + G_vertical + 'HideContextMenu' + G_vertical + 'html/client/_s_HideContextMenu.html',
         '7' + G_vertical + '1' + G_vertical + 'UseSizeColumn' + G_vertical + 'html/client/_s_UseSizeColumn.html',
         '7' + G_vertical + '1' + G_vertical + 'RemoveContextItem' + G_vertical + 'html/client/_s_RemoveContextItem.html',
         '7' + G_vertical + '1' + G_vertical + 'LargeFiles' + G_vertical + 'html/client/_s_LargeFiles.html',
         '7' + G_vertical + '1' + G_vertical + 'FileSort' + G_vertical + 'html/client/_s_FileSort.html',
         '7' + G_vertical + '1' + G_vertical + 'FileMoveContextMenu' + G_vertical + 'html/client/_s_FileMoveContextMenu.html',
         '7' + G_vertical + '1' + G_vertical + 'CompleteEventResetUse' + G_vertical + 'html/client/_s_CompleteEventResetUse.html',
         '7' + G_vertical + '1' + G_vertical + 'UserMessage' + G_vertical + 'html/client/_s_UserMessage.html',
         '7' + G_vertical + '1' + G_vertical + 'DisableAlertMessage' + G_vertical + 'html/client/_s_DisableAlertMessage.html',
         '7' + G_vertical + '1' + G_vertical + 'AllowedZeroFileSize' + G_vertical + 'html/client/_s_AllowedZeroFileSize.html',
         '7' + G_vertical + '1' + G_vertical + 'UploadTransferWindow' + G_vertical + 'html/client/_s_UploadTransferWindow.html',
         '7' + G_vertical + '1' + G_vertical + 'UseLogoImage' + G_vertical + 'html/client/_s_UseLogoImage.html',
         '7' + G_vertical + '1' + G_vertical + 'SilentUpload' + G_vertical + 'html/client/_s_SilentUpload.html',
         '7' + G_vertical + '1' + G_vertical + 'SilentDownload' + G_vertical + 'html/client/_s_SilentDownload.html',
         '7' + G_vertical + '1' + G_vertical + '[HTML]SilentDownloadEx' + G_vertical + 'html/client/_s_SilentDownloadEx.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]DefaultDownloadPath' + G_vertical + 'html/client/_s_DefaultDownloadPath.html',
         '7' + G_vertical + '1' + G_vertical + '[HTML]TransferBackgroundStyle' + G_vertical + 'html/client/_s_TransferBackgroundStyle.html',
         '7' + G_vertical + '1' + G_vertical + 'UseDropzone' + G_vertical + 'html/client/_s_UseDropzone.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]UseScriptEventControl' + G_vertical + 'html/client/_s_UseScriptEventControl.html',
         '7' + G_vertical + '1' + G_vertical + 'UseDbclickOpen' + G_vertical + 'html/client/_s_UseDbclickOpen.html',
         '7' + G_vertical + '1' + G_vertical + '[HTML]AllowOpenExtension' + G_vertical + 'html/client/_s_AllowOpenExtension.html',
         '7' + G_vertical + '1' + G_vertical + 'EncryptParam' + G_vertical + 'html/client/_s_EncryptParam.html',
         '7' + G_vertical + '1' + G_vertical + 'UseAddEvent' + G_vertical + 'html/client/_s_UseAddEvent.html',
         '7' + G_vertical + '1' + G_vertical + 'UseDeleteEvent' + G_vertical + 'html/client/_s_UseDeleteEvent.html',
         '7' + G_vertical + '1' + G_vertical + 'UseViewOrOpenEvent' + G_vertical + 'html/client/_s_UseViewOrOpenEvent.html',
         '7' + G_vertical + '1' + G_vertical + 'UseUploadingCancelEvent' + G_vertical + 'html/client/_s_UseUploadingCancelEvent.html',
         '7' + G_vertical + '1' + G_vertical + 'UseDownloadEvent' + G_vertical + 'html/client/_s_UseDownloadEvent.html',
         '7' + G_vertical + '1' + G_vertical + 'UseAfterAddEvent' + G_vertical + 'html/client/_s_UseAfterAddEvent.html',
         '7' + G_vertical + '1' + G_vertical + 'UseAfterAddEndTimeEvent' + G_vertical + 'html/client/_s_UseAfterAddEndTimeEvent.html',
         '7' + G_vertical + '1' + G_vertical + 'UseDeleteEndTimeEvent' + G_vertical + 'html/client/_s_UseDeleteEndTimeEvent.html',
         '7' + G_vertical + '1' + G_vertical + 'UseAfterDownloadEvent' + G_vertical + 'html/client/_s_UseAfterDownloadEvent.html',
         '7' + G_vertical + '1' + G_vertical + 'UseFinishDownloadedEvent' + G_vertical + 'html/client/_s_UseFinishDownloadedEvent.html',
         '7' + G_vertical + '1' + G_vertical + 'DevelopLangage' + G_vertical + 'html/client/_s_DevelopLangage.html',
         '7' + G_vertical + '1' + G_vertical + 'HandlerUrl' + G_vertical + 'html/client/_s_HandlerUrl.html',
         '7' + G_vertical + '1' + G_vertical + 'ViewerHandlerUrl' + G_vertical + 'html/client/_s_ViewerHandlerUrl.html',
         '7' + G_vertical + '1' + G_vertical + 'DownloadHandlerUrl' + G_vertical + 'html/client/_s_DownloadHandlerUrl.html',
         '7' + G_vertical + '1' + G_vertical + 'UploadMethodHtml4' + G_vertical + 'html/client/_s_UploadMethodHtml4.html',
         '7' + G_vertical + '1' + G_vertical + 'ChunkSize' + G_vertical + 'html/client/_s_ChunkSize.html',
         '7' + G_vertical + '1' + G_vertical + 'FolderNameRule' + G_vertical + 'html/client/_s_FolderNameRule.html',
         '7' + G_vertical + '1' + G_vertical + 'FileNameRule' + G_vertical + 'html/client/_s_FileNameRule.html',
         '7' + G_vertical + '1' + G_vertical + 'FileNameRuleEx' + G_vertical + 'html/client/_s_FileNameRuleEx.html',
         '7' + G_vertical + '1' + G_vertical + '[HTML]AddExtIcon' + G_vertical + 'html/client/_s_AddExtIcon.html'],
        ['7' + G_vertical + '1' + G_vertical + 'Dext5Upload' + G_vertical + 'html/client/_m_Dext5Upload.html',
         '7' + G_vertical + '1' + G_vertical + 'Transfer' + G_vertical + 'html/client/_m_Transfer.html',
         '7' + G_vertical + '1' + G_vertical + 'TransferEx' + G_vertical + 'html/client/_m_TransferEx.html',
         '7' + G_vertical + '1' + G_vertical + 'AddUploadedFile' + G_vertical + 'html/client/_m_AddUploadedFile.html',
         '7' + G_vertical + '1' + G_vertical + 'AddUploadedFileAsArray' + G_vertical + 'html/client/_m_AddUploadedFileAsArray.html',
         '7' + G_vertical + '1' + G_vertical + 'AddUploadedFileWithGetFileSize' + G_vertical + 'html/client/_m_AddUploadedFileWithGetFileSize.html',
         '7' + G_vertical + '1' + G_vertical + 'AddUploadedFileEx' + G_vertical + 'html/client/_m_AddUploadedFileEx.html',
         '7' + G_vertical + '1' + G_vertical + 'AddUploadedFileExAsArray' + G_vertical + 'html/client/_m_AddUploadedFileExAsArray.html',
         '7' + G_vertical + '1' + G_vertical + 'AddUploadedFileExWithGetFileSize' + G_vertical + 'html/client/_m_AddUploadedFileExWithGetFileSize.html',
         '7' + G_vertical + '1' + G_vertical + 'AddDropZoneFile' + G_vertical + 'html/client/_m_AddDropZoneFile.html',
         '7' + G_vertical + '1' + G_vertical + 'OpenFileDialog' + G_vertical + 'html/client/_m_OpenFileDialog.html',
         '7' + G_vertical + '1' + G_vertical + 'DeleteAllFile' + G_vertical + 'html/client/_m_DeleteAllFile.html',
         '7' + G_vertical + '1' + G_vertical + 'DeleteSelectedFile' + G_vertical + 'html/client/_m_DeleteSelectedFile.html',
         '7' + G_vertical + '1' + G_vertical + 'Destroy' + G_vertical + 'html/client/_m_Destroy.html',
         '7' + G_vertical + '1' + G_vertical + 'OpenSelectedFile' + G_vertical + 'html/client/_m_OpenSelectedFile.html',
         '7' + G_vertical + '1' + G_vertical + 'Cancel' + G_vertical + 'html/client/_m_Cancel.html',
         '7' + G_vertical + '1' + G_vertical + 'FileSort' + G_vertical + 'html/client/_m_FileSort.html',
         '7' + G_vertical + '1' + G_vertical + 'GetSelectedFileCount' + G_vertical + 'html/client/_m_GetSelectedFileCount.html',
         '7' + G_vertical + '1' + G_vertical + 'GetTotalFileCount' + G_vertical + 'html/client/_m_GetTotalFileCount.html',
         '7' + G_vertical + '1' + G_vertical + 'GetTotalFileSize' + G_vertical + 'html/client/_m_GetTotalFileSize.html',
         '7' + G_vertical + '1' + G_vertical + 'GetUploadNameSet' + G_vertical + 'html/client/_m_GetUploadNameSet.html',
         '7' + G_vertical + '1' + G_vertical + 'ResetUpload' + G_vertical + 'html/client/_m_ResetUpload.html',
         '7' + G_vertical + '1' + G_vertical + 'GetNewUploadListForJson' + G_vertical + 'html/client/_m_GetNewUploadListForJson.html',
         '7' + G_vertical + '1' + G_vertical + 'GetSelectedNewUploadListForJson' + G_vertical + 'html/client/_m_GetSelectedNewUploadListForJson.html',
         '7' + G_vertical + '1' + G_vertical + 'GetAllFileListForJson' + G_vertical + 'html/client/_m_GetAllFileListForJson.html',
         '7' + G_vertical + '1' + G_vertical + 'GetSelectedAllFileListForJson' + G_vertical + 'html/client/_m_GetSelectedAllFileListForJson.html',
         '7' + G_vertical + '1' + G_vertical + 'GetAllFileMergeListForJson' + G_vertical + 'html/client/_m_GetAllFileMergeListForJson.html',
         '7' + G_vertical + '1' + G_vertical + 'GetDeleteListForJson' + G_vertical + 'html/client/_m_GetDeleteListForJson.html',
         '7' + G_vertical + '1' + G_vertical + 'GetNewUploadListForXml' + G_vertical + 'html/client/_m_GetNewUploadListForXml.html',
         '7' + G_vertical + '1' + G_vertical + 'GetSelectedNewUploadListForXml' + G_vertical + 'html/client/_m_GetSelectedNewUploadListForXml.html',
         '7' + G_vertical + '1' + G_vertical + 'GetAllFileListForXml' + G_vertical + 'html/client/_m_GetAllFileListForXml.html',
         '7' + G_vertical + '1' + G_vertical + 'GetSelectedAllFileListForXml' + G_vertical + 'html/client/_m_GetSelectedAllFileListForXml.html',
         '7' + G_vertical + '1' + G_vertical + 'GetAllFileMergeListForXml' + G_vertical + 'html/client/_m_GetAllFileMergeListForXml.html',
         '7' + G_vertical + '1' + G_vertical + 'GetDeleteListForXml' + G_vertical + 'html/client/_m_GetDeleteListForXml.html',
         '7' + G_vertical + '1' + G_vertical + 'GetNewUploadListForText' + G_vertical + 'html/client/_m_GetNewUploadListForText.html',
         '7' + G_vertical + '1' + G_vertical + 'GetSelectedNewUploadListForText' + G_vertical + 'html/client/_m_GetSelectedNewUploadListForText.html',
         '7' + G_vertical + '1' + G_vertical + 'GetAllFileListForText' + G_vertical + 'html/client/_m_GetAllFileListForText.html',
         '7' + G_vertical + '1' + G_vertical + 'GetSelectedAllFileListForText' + G_vertical + 'html/client/_m_GetSelectedAllFileListForText.html',
         '7' + G_vertical + '1' + G_vertical + 'GetAllFileMergeListForText' + G_vertical + 'html/client/_m_GetAllFileMergeListForText.html',
         '7' + G_vertical + '1' + G_vertical + 'GetDeleteListForText' + G_vertical + 'html/client/_m_GetDeleteListForText.html',
         '7' + G_vertical + '1' + G_vertical + 'DownloadFile' + G_vertical + 'html/client/_m_DownloadFile.html',
         '7' + G_vertical + '1' + G_vertical + 'DownloadAllFile' + G_vertical + 'html/client/_m_DownloadAllFile.html',
         '7' + G_vertical + '1' + G_vertical + 'SetUploadMode' + G_vertical + 'html/client/_m_SetUploadMode.html',
         '7' + G_vertical + '1' + G_vertical + 'Show' + G_vertical + 'html/client/_m_Show.html',
         '7' + G_vertical + '1' + G_vertical + 'Hidden' + G_vertical + 'html/client/_m_Hidden.html',
         '7' + G_vertical + '1' + G_vertical + 'SetSkinColor' + G_vertical + 'html/client/_m_SetSkinColor.html',
         '7' + G_vertical + '1' + G_vertical + 'MoveFile' + G_vertical + 'html/client/_m_MoveFile.html',
         '7' + G_vertical + '1' + G_vertical + 'SetFileInfo' + G_vertical + 'html/client/_m_SetFileInfo.html',
         '7' + G_vertical + '1' + G_vertical + 'AddFormData' + G_vertical + 'html/client/_m_AddFormData.html',
         '7' + G_vertical + '1' + G_vertical + 'AddLocalFileObject' + G_vertical + 'html/client/_m_AddLocalFileObject.html',
         '7' + G_vertical + '1' + G_vertical + 'SetSelectItem' + G_vertical + 'html/client/_m_SetSelectItem.html',
         '7' + G_vertical + '1' + G_vertical + 'SetSelectItemEx' + G_vertical + 'html/client/_m_SetSelectItemEx.html',
         '7' + G_vertical + '1' + G_vertical + 'SetFileMark' + G_vertical + 'html/client/_m_SetFileMark.html',
         '7' + G_vertical + '1' + G_vertical + 'SetSize' + G_vertical + 'html/client/_m_SetSize.html',
         '7' + G_vertical + '1' + G_vertical + 'GetUploadCompleteState' + G_vertical + 'html/client/_m_GetUploadCompleteState.html',
         '7' + G_vertical + '1' + G_vertical + 'ResetUploadCompleteState' + G_vertical + 'html/client/_m_ResetUploadCompleteState.html',
         '7' + G_vertical + '1' + G_vertical + 'GetUserRuntimeMode' + G_vertical + 'html/client/_m_GetUserRuntimeMode.html',
         '7' + G_vertical + '1' + G_vertical + 'SetAllowOrLimitExtension' + G_vertical + 'html/client/_m_SetAllowOrLimitExtension.html',
         '7' + G_vertical + '1' + G_vertical + 'GetFileSize' + G_vertical + 'html/client/_m_GetFileSize.html',
         '7' + G_vertical + '1' + G_vertical + 'SetLargeFile' + G_vertical + 'html/client/_m_SetLargeFile.html',
         '7' + G_vertical + '1' + G_vertical + 'SetMaxOneFileSize' + G_vertical + 'html/client/_m_SetMaxOneFileSize.html',
         '7' + G_vertical + '1' + G_vertical + 'SetMaxTotalFileSize' + G_vertical + 'html/client/_m_SetMaxTotalFileSize.html',
         '7' + G_vertical + '1' + G_vertical + 'SetMaxTotalFileCount' + G_vertical + 'html/client/_m_SetMaxTotalFileCount.html',
         '7' + G_vertical + '1' + G_vertical + 'SetItemStyle' + G_vertical + 'html/client/_m_SetItemStyle.html',
         '7' + G_vertical + '1' + G_vertical + 'SetConfig' + G_vertical + 'html/client/_m_SetConfig.html',
         '7' + G_vertical + '1' + G_vertical + 'SetUploadedFile' + G_vertical + 'html/client/_m_SetUploadedFile.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]AddLocalFileDirectlyEX' + G_vertical + 'html/client/_m_AddLocalFileDirectlyEX.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]AddHttpHeaderEx' + G_vertical + 'html/client/_m_AddHttpHeaderEx.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]DoOpenFileEx' + G_vertical + 'html/client/_m_DoOpenFileEx.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]DoSaveAndOpenEx' + G_vertical + 'html/client/_m_DoSaveAndOpenEx.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]DoSaveAndFolderOpenEx' + G_vertical + 'html/client/_m_DoSaveAndFolderOpenEx.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]DoSaveFileEx' + G_vertical + 'html/client/_m_DoSaveFileEx.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]DoSaveAllFilesEx' + G_vertical + 'html/client/_m_DoSaveAllFilesEx.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]DoSelectFolder' + G_vertical + 'html/client/_m_DoSelectFolder.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]GetFolderPathName' + G_vertical + 'html/client/_m_GetFolderPathName.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]DoPrintFileEx' + G_vertical + 'html/client/_m_DoPrintFileEx.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]GetFileObjectList' + G_vertical + 'html/client/_m_GetFileObjectList.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]GetItemInfoList' + G_vertical + 'html/client/_m_GetItemInfoList.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]GetItemCount' + G_vertical + 'html/client/_m_GetItemCount.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]SetDefaultSavePath' + G_vertical + 'html/client/_m_SetDefaultSavePath.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]SetFolderTransfer' + G_vertical + 'html/client/_m_SetFolderTransfer.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]SetPopupMode' + G_vertical + 'html/client/_m_SetPopupMode.html'],
        ['7' + G_vertical + '1' + G_vertical + 'onLanguageDefinition' + G_vertical + 'html/client/_e_onLanguageDefinition.html',
         '7' + G_vertical + '1' + G_vertical + 'OnCreationComplete' + G_vertical + 'html/client/_e_OnCreationComplete.html',
         '7' + G_vertical + '1' + G_vertical + 'BeforeAddItem' + G_vertical + 'html/client/_e_BeforeAddItem.html',
         '7' + G_vertical + '1' + G_vertical + 'AfterAddItem' + G_vertical + 'html/client/_e_AfterAddItem.html',
         '7' + G_vertical + '1' + G_vertical + 'AfterAddItemEndTime' + G_vertical + 'html/client/_e_AfterAddItemEndTime.html',
         '7' + G_vertical + '1' + G_vertical + 'BeforeDeleteItem' + G_vertical + 'html/client/_e_BeforeDeleteItem.html',
         '7' + G_vertical + '1' + G_vertical + 'DeleteItemEndTime' + G_vertical + 'html/client/_e_DeleteItemEndTime.html',
         '7' + G_vertical + '1' + G_vertical + 'OnTransfer_Start' + G_vertical + 'html/client/_e_OnTransfer_Start.html',
         '7' + G_vertical + '1' + G_vertical + 'OnTransfer_Complete' + G_vertical + 'html/client/_e_OnTransfer_Complete.html',
         '7' + G_vertical + '1' + G_vertical + 'UploadingCancel' + G_vertical + 'html/client/_e_UploadingCancel.html',
         '7' + G_vertical + '1' + G_vertical + 'SelectItem' + G_vertical + 'html/client/_e_SelectItem.html',
         '7' + G_vertical + '1' + G_vertical + 'BeforeFileViewOrOpen' + G_vertical + 'html/client/_e_BeforeFileViewOrOpen.html',
         '7' + G_vertical + '1' + G_vertical + 'BeforeFileDownload' + G_vertical + 'html/client/_e_BeforeFileDownload.html',
         '7' + G_vertical + '1' + G_vertical + 'AfterDownload' + G_vertical + 'html/client/_e_AfterDownload.html',
         '7' + G_vertical + '1' + G_vertical + 'FinishDownloaded' + G_vertical + 'html/client/_e_FinishDownloaded.html',
         '7' + G_vertical + '1' + G_vertical + 'OnError' + G_vertical + 'html/client/_e_OnError.html',
         '7' + G_vertical + '1' + G_vertical + 'DropZoneAddItem' + G_vertical + 'html/client/_e_DropZoneAddItem.html',
         '7' + G_vertical + '1' + G_vertical + 'CustomAction' + G_vertical + 'html/client/_e_CustomAction.html']
    ],
    [
        ['8' + G_vertical + '1' + G_vertical + 'SetTempPath' + G_vertical + 'html/server_net/_p_SetTempPath.html',
         '8' + G_vertical + '1' + G_vertical + 'SetPhysicalPath' + G_vertical + 'html/server_net/_p_SetPhysicalPath.html',
         '8' + G_vertical + '1' + G_vertical + 'SetVirtualPath' + G_vertical + 'html/server_net/_p_SetVirtualPath.html',
         '8' + G_vertical + '1' + G_vertical + 'SetConfigPhysicalPath' + G_vertical + 'html/server_net/_p_SetConfigPhysicalPath.html',
         '8' + G_vertical + '1' + G_vertical + 'SetZipFileName' + G_vertical + 'html/server_net/_p_SetZipFileName.html',
         '8' + G_vertical + '1' + G_vertical + 'SetFileBlackWordList' + G_vertical + 'html/server_net/_p_SetFileBlackWordList.html',
         '8' + G_vertical + '1' + G_vertical + 'SetGarbageCleanDay' + G_vertical + 'html/server_net/_p_SetGarbageCleanDay.html',
         '8' + G_vertical + '1' + G_vertical + 'SetDownloadRootPath' + G_vertical + 'html/server_net/_p_SetDownloadRootPath.html',
         '8' + G_vertical + '1' + G_vertical + 'SetAllowExtensionSpecialSymbol' + G_vertical + 'html/server_net/_p_SetAllowExtensionSpecialSymbol.html',
         '8' + G_vertical + '1' + G_vertical + 'SetViewerJsPath' + G_vertical + 'html/server_net/_p_SetViewerJsPath.html',
         '8' + G_vertical + '1' + G_vertical + 'SetViewerJs2Path' + G_vertical + 'html/server_net/_p_SetViewerJs2Path.html',
         '8' + G_vertical + '1' + G_vertical + 'SetViewerCssPath' + G_vertical + 'html/server_net/_p_SetViewerCssPath.html',
         '8' + G_vertical + '1' + G_vertical + 'SetViewerLoadingImagePath' + G_vertical + 'html/server_net/_p_SetViewerLoadingImagePath.html',
         '8' + G_vertical + '1' + G_vertical + 'SetViewerBrokenImagePath' + G_vertical + 'html/server_net/_p_SetViewerBrokenImagePath.html'],
        ['8' + G_vertical + '1' + G_vertical + 'SetDebugMode' + G_vertical + 'html/server_net/_m_SetDebugMode.html',
         '8' + G_vertical + '1' + G_vertical + 'SetUploadCheckFileExtension' + G_vertical + 'html/server_net/_m_SetUploadCheckFileExtension.html',
         '8' + G_vertical + '1' + G_vertical + 'SetDownloadCheckFileExtension' + G_vertical + 'html/server_net/_m_SetDownloadCheckFileExtension.html',
         '8' + G_vertical + '1' + G_vertical + 'SetCustomError' + G_vertical + 'html/server_net/_m_SetCustomError.html',
         '8' + G_vertical + '1' + G_vertical + 'SetNetworkCredentials' + G_vertical + 'html/server_net/_m_SetNetworkCredentials.html'],
        ['8' + G_vertical + '1' + G_vertical + 'MakeThumbnail' + G_vertical + 'html/server_net/_im_MakeThumbnail.html',
         '8' + G_vertical + '1' + G_vertical + 'MakeThumbnailEX' + G_vertical + 'html/server_net/_im_MakeThumbnailEX.html',
         '8' + G_vertical + '1' + G_vertical + 'ConvertImageFormat' + G_vertical + 'html/server_net/_im_ConvertImageFormat.html',
         '8' + G_vertical + '1' + G_vertical + 'ConvertImageSize' + G_vertical + 'html/server_net/_im_ConvertImageSize.html',
         '8' + G_vertical + '1' + G_vertical + 'ConvertImageSizeByPercent' + G_vertical + 'html/server_net/_im_ConvertImageSizeByPercent.html',
         '8' + G_vertical + '1' + G_vertical + 'Rotate' + G_vertical + 'html/server_net/_im_Rotate.html',
         '8' + G_vertical + '1' + G_vertical + 'SetImageWaterMark' + G_vertical + 'html/server_net/_im_SetImageWaterMark.html',
         '8' + G_vertical + '1' + G_vertical + 'SetTextWaterMark' + G_vertical + 'html/server_net/_im_SetTextWaterMark.html',
         '8' + G_vertical + '1' + G_vertical + 'GetImageSize' + G_vertical + 'html/server_net/_im_GetImageSize.html',
         '8' + G_vertical + '1' + G_vertical + 'GetExifEntityData' + G_vertical + 'html/server_net/_im_GetExifData.html'],
        ['8' + G_vertical + '1' + G_vertical + 'UploadBeforeInitialize' + G_vertical + 'html/server_net/_e_UploadBeforeInitialize.html',
         '8' + G_vertical + '1' + G_vertical + 'UploadCompleteBefore' + G_vertical + 'html/server_net/_e_UploadCompleteBefore.html',
         '8' + G_vertical + '1' + G_vertical + 'UploadComplete' + G_vertical + 'html/server_net/_e_UploadComplete.html',
         '8' + G_vertical + '1' + G_vertical + 'OpenDownloadBeforeInitialize' + G_vertical + 'html/server_net/_e_OpenDownloadBeforeInitialize.html',
         '8' + G_vertical + '1' + G_vertical + 'OpenDownloadComplete' + G_vertical + 'html/server_net/_e_OpenDownloadComplete.html'],
        ['8' + G_vertical + '1' + G_vertical + 'MaxRequestLength' + G_vertical + 'html/server_net/_sc_MaxRequestLength.html',
         '8' + G_vertical + '1' + G_vertical + 'Timeout' + G_vertical + 'html/server_net/_sc_Timeout.html',
         '8' + G_vertical + '1' + G_vertical + 'Cross Origin Resource Sharing(CORS)' + G_vertical + 'html/server_net/_sc_Cors.html']
    ],
    [
        ['9' + G_vertical + '1' + G_vertical + 'SetDebugMode' + G_vertical + 'html/server_java/_m_SetDebugMode.html',
         '9' + G_vertical + '1' + G_vertical + 'SetTempPath' + G_vertical + 'html/server_java/_m_SetTempPath.html',
         '9' + G_vertical + '1' + G_vertical + 'SetPhysicalPath' + G_vertical + 'html/server_java/_m_SetPhysicalPath.html',
         '9' + G_vertical + '1' + G_vertical + 'SetVirtualPath' + G_vertical + 'html/server_java/_m_SetVirtualPath.html',
         '9' + G_vertical + '1' + G_vertical + 'SetConfigPhysicalPath' + G_vertical + 'html/server_java/_m_SetConfigPhysicalPath.html',
         '9' + G_vertical + '1' + G_vertical + 'SetZipFileName' + G_vertical + 'html/server_java/_m_SetZipFileName.html',
         '9' + G_vertical + '1' + G_vertical + 'SetUploadCheckFileExtension' + G_vertical + 'html/server_java/_m_SetUploadCheckFileExtension.html',
         '9' + G_vertical + '1' + G_vertical + 'SetFileBlackWordList' + G_vertical + 'html/server_java/_m_SetFileBlackWordList.html',
         '9' + G_vertical + '1' + G_vertical + 'SetDownloadCheckFileExtension' + G_vertical + 'html/server_java/_m_SetDownloadCheckFileExtension.html',
         '9' + G_vertical + '1' + G_vertical + 'SetGarbageCleanDay' + G_vertical + 'html/server_java/_m_SetGarbageCleanDay.html',
         '9' + G_vertical + '1' + G_vertical + 'SetDownloadRootPath' + G_vertical + 'html/server_java/_m_SetDownloadRootPath.html',
         '9' + G_vertical + '1' + G_vertical + 'SetAllowExtensionSpecialSymbol' + G_vertical + 'html/server_java/_m_SetAllowExtensionSpecialSymbol.html',
         '9' + G_vertical + '1' + G_vertical + 'SetContextPath' + G_vertical + 'html/server_java/_m_SetContextPath.html',
         '9' + G_vertical + '1' + G_vertical + 'SetStartPhysicalPathSlashAllowed' + G_vertical + 'html/server_java/_m_SetStartPhysicalPathSlashAllowed.html',
         '9' + G_vertical + '1' + G_vertical + 'SetNtlmAuthentication' + G_vertical + 'html/server_java/_m_SetNtlmAuthentication.html',
         '9' + G_vertical + '1' + G_vertical + 'SetViewerJsPath' + G_vertical + 'html/server_java/_m_SetViewerJsPath.html',
         '9' + G_vertical + '1' + G_vertical + 'SetViewerJs2Path' + G_vertical + 'html/server_java/_m_SetViewerJs2Path.html',
         '9' + G_vertical + '1' + G_vertical + 'SetViewerCssPath' + G_vertical + 'html/server_java/_m_SetViewerCssPath.html',
         '9' + G_vertical + '1' + G_vertical + 'SetViewerLoadingImagePath' + G_vertical + 'html/server_java/_m_SetViewerLoadingImagePath.html',
         '9' + G_vertical + '1' + G_vertical + 'SetViewerBrokenImagePath' + G_vertical + 'html/server_java/_m_SetViewerBrokenImagePath.html'],
        ['9' + G_vertical + '1' + G_vertical + 'MakeThumbnail' + G_vertical + 'html/server_java/_im_MakeThumbnail.html',
         '9' + G_vertical + '1' + G_vertical + 'MakeThumbnailEX' + G_vertical + 'html/server_java/_im_MakeThumbnailEX.html',
         '9' + G_vertical + '1' + G_vertical + 'ConvertImageFormat' + G_vertical + 'html/server_java/_im_ConvertImageFormat.html',
         '9' + G_vertical + '1' + G_vertical + 'ConvertImageSize' + G_vertical + 'html/server_java/_im_ConvertImageSize.html',
         '9' + G_vertical + '1' + G_vertical + 'ConvertImageSizeByPercent' + G_vertical + 'html/server_java/_im_ConvertImageSizeByPercent.html',
         '9' + G_vertical + '1' + G_vertical + 'Rotate' + G_vertical + 'html/server_java/_im_Rotate.html',
         '9' + G_vertical + '1' + G_vertical + 'SetImageWaterMark' + G_vertical + 'html/server_java/_im_SetImageWaterMark.html',
         '9' + G_vertical + '1' + G_vertical + 'SetTextWaterMark' + G_vertical + 'html/server_java/_im_SetTextWaterMark.html',
         '9' + G_vertical + '1' + G_vertical + 'GetImageSize' + G_vertical + 'html/server_java/_im_GetImageSize.html',
         '9' + G_vertical + '1' + G_vertical + 'GetExifEntityData' + G_vertical + 'html/server_java/_im_GetExifData.html'],
        ['9' + G_vertical + '1' + G_vertical + 'UploadBeforeInitialize' + G_vertical + 'html/server_java/_e_UploadBeforeInitialize.html',
         '9' + G_vertical + '1' + G_vertical + 'UploadCompleteBefore' + G_vertical + 'html/server_java/_e_UploadCompleteBefore.html',
         '9' + G_vertical + '1' + G_vertical + 'UploadComplete' + G_vertical + 'html/server_java/_e_UploadComplete.html',
         '9' + G_vertical + '1' + G_vertical + 'OpenDownloadBeforeInitialize' + G_vertical + 'html/server_java/_e_OpenDownloadBeforeInitialize.html',
         '9' + G_vertical + '1' + G_vertical + 'OpenDownloadComplete' + G_vertical + 'html/server_java/_e_OpenDownloadComplete.html'],
        ['9' + G_vertical + '1' + G_vertical + 'MimeType' + G_vertical + 'html/server_java/_sc_MimeType.html',
         '9' + G_vertical + '1' + G_vertical + 'Multipart가 설정에 의해 미리 읽히는 경우' + G_vertical + 'html/server_java/_sc_MultipartReadAhead.html',
         '9' + G_vertical + '1' + G_vertical + 'Cross Origin Resource Sharing(CORS)' + G_vertical + 'html/server_java/_sc_Cors.html']
    ],
    [],
    []
];

var arrSearchWordMenu = [
    [
        ['설치', '기본설정', '설치 및 기본설정']
    ],
    [
        [
            ['InitXml', 'XML파일 설정', '환경설정파일 설정', '설정파일 URL 설정'],
            ['InitServerXml', 'XML파일 암호화', '환경설정파일 암호화'],
            ['InitVisible', '화면 표시 여부', '화면 노출 여부'],
            ['UploadHolder', '특정 영역에 생성', '특정 객체에 생성'],
            ['IgnoreSameUploadName', '임의로 변경 생성'],
            ['License', '라이선스 설정', '라이센스 설정', '발급받은 키 설정'],
            ['Runtimes', '업로드 모드 설정', '웹표준모드', '플러그인모드'],
            ['PluginVersion', '우선순위 cab버전 설정'],
            ['Width', '넓이 설정'],
            ['Height', '높이 설정'],
            ['SkinName', '스킨 색상 설정'],
            ['CssRootPath', '사용자가 만든 css 폴더 경로 설정', '다른 css 폴더 경로 설정'],
            ['CustomColor', '색상을 사용자가 원하는 색상으로 변경 설정'],
            ['CustomWebFileColor', '웹경로의 파일의 배경색 설정', '업로드된 파일의 배경색 설정'],
            ['Lang', '언어 설정'],
            ['Mode', '모드 설정', '편집모드 보기모드'],
            ['Views', '파일 목록 보기 형태 설정'],
            ['ImgPreview', '이미지 미리보기 창 기능 설정'],
            ['ShowStatusBar', '상태바를 표시하는 기능 설정', '상태바를 숨기는 기능 설정'],
            ['ShowHeaderBar', '상단을 표시하는 기능 설정', '상단을 숨기는 기능 설정'],
            ['ShowButtonBarEdit', '편집모드일 때 버튼바 영역에 노출 할 버튼 설정'],
            ['ShowEditAlign', '편집모드일 때 버튼 위치 설정'],
            ['ShowButtonBarView', ' 보기모드일 때 버튼바 영역에 노출 할 버튼 설정'],
            ['ShowViewAlign', '보기모드일 때 버튼 위치 설정'],
            ['ButtonBarPosition', '버튼바 영역 위치 설정'],
            ['BorderStyle', '추가된 파일들을 구분할 선 스타일 설정'],
            ['MaxOneFileSize', '파일당 용량제한 설정', '파일별 용량제한 설정'],
            ['MaxTotalFileSize', '총 업로드 될 파일의 용량제한 설정', '모든 파일의 용량제한 설정'],
            ['MaxTotalFileCount', '최대 파일 개수 제한값 설정'],
            ['HideListInfo', '업로드 영역 중앙에 보여지는 가이드 문구를 표시하는 기능 설정', '업로드 영역 중앙에 보여지는 가이드 문구를 숨기는 기능 설정'],
            ['Extension', '파일 확장자 허용 설정', '파일 확장자 제한 설정'],
            ['MultiFileSelect', '파일 추가시 여러개 파일 선택 또는 한개씩만 선택 후 적용 설정'],
            ['ListViewDbclick', '더블클릭 이벤트에 의해 파일선택 창이 열리도록 설정'],
            ['ListViewDragAndDrop', '드래그 앤 드랍해서 파일추가할 수 있도록 설정'],
            ['ResumeUpload', '이어올리기 설정'],
            ['ResumeDownload', '이어받기 설정'],
            ['FolderTransfer', '폴더 구조 업로드 설정'],
            ['Timeout', '서버로부터 응답이 지연 되는 경우 이어받기 시도 시간 설정'],
            ['AutomaticConnection', '묻지 않고 계속 업로드 시도 사용 설정', '묻지 않고 계속 다운로드 시도 사용 설정'],
            ['ShowFolderView', '폴더 올리기시 폴더로 진행할지 설정', '폴더 올리기시 파일로 보일지 설정'],
            ['HideContextMenu', 'context menu 사용 여부 설정', '우 클릭 메뉴 사용 여부 설정'],
            ['UseSizeColumn', '파일크기 항목 노출 여부 설정'],
            ['RemoveContextItem', 'context menu에서 삭제 할 항목 설정', '우 클릭 메뉴에서 삭제 할 항목 설정'],
            ['LargeFiles', '대용량 텍스트 노출 기능 설정'],
            ['FileSort', '파일 정렬 기능 설정'],
            ['FileMoveContextMenu', '파일이동 메뉴를 우클릭 메뉴에 추가할지 여부 설정'],
            ['CompleteEventResetUse', '업로드 완료 이벤트에서 ResetUpload API 사용여부 설정'],
            ['UserMessage', '버튼 영역 왼쪽에 문구 입력 설정', '버튼 영역 오른쪽에 문구 입력 설정'],
            ['DisableAlertMessage', '모든 confirm창을 표시하는 기능 설정', '모든 confirm창을 숨기는 기능 설정'],
            ['AllowedZeroFileSize', '0byte 파일 업로드 허용 설정'],
            ['UploadTransferWindow', '전송창 UI 설정'],
            ['UseLogoImage', '전송창 Logo 설정'],
            ['SilentUpload', '전송창 노출 여부 설정'],
            ['SilentDownload', '다운로드 전송창 노출 여부 설정'],
            ['SilentDownloadEx', '다운로드 진행 팝업창 노출 설정', '서버에서 처리되는 다운로드 된 파일사이즈 체크 여부 설정'],
            ['DefaultDownloadPath', '다운로드 시 저장경로 설정'],
            ['TransferBackgroundStyle', '배경화면의 스타일 지정'],
            ['UseDropzone', 'Drop Zone 이벤트 함수 사용 설정'],
            ['UseScriptEventControl', '플러그인 모드에서 발생하는 이벤트 수신 여부 설정'],
            ['UseDbclickOpen', '더블클릭 시 파일열기 사용 설정'],
            ['AllowOpenExtension', '열기 동작시 popup으로 열기할 확장자 설정', '열기 동작시 팝업으로 열기할 확장자 설정'],
            ['EncryptParam', '전송하는 파라미터 암호화 여부 설정'],
            ['UseAddEvent', '파일 추가 전 이벤트 함수 사용 설정'],
            ['UseDeleteEvent', '파일 삭제 전 이벤트 함수 사용 설정'],
            ['UseViewOrOpenEvent', '파일 열기 전 이벤트 함수 사용 설정'],
            ['UseUploadingCancelEvent', '파일 전송 취소 이벤트 함수 사용 설정'],
            ['UseDownloadEvent', '파일 다운로드 전 이벤트 함수 사용 설정'],
            ['UseAfterAddEvent', '파일 추가 후 이벤트 함수 사용 설정'],
            ['UseAfterAddEndTimeEvent', '모든 파일추가 완료 후 이벤트 함수 사용 설정'],
            ['UseDeleteEndTimeEvent', '파일 삭제 후 이벤트 함수 사용 설정'],
            ['UseAfterDownloadEvent', '파일 다운로드 후 이벤트 함수 사용 설정'],
            ['UseFinishDownloadedEvent', '파일 다운로드 후 이벤트 함수 사용 설정'],
            ['DevelopLangage', '개발 언어 설정'],
            ['HandlerUrl', 'Upload Handler URL 설정', '업로드 Handler URL 설정', '파일 전송을 받아주는 URL 설정'],
            ['ViewerHandlerUrl', 'Viewer URL 설정', 'Viewer 페이지 URL 설정'],
            ['DownloadHandlerUrl', 'Download Handler URL 설정', '다운로드 Handler URL 설정'],
            ['UploadMethodHtml4', 'HTML4 환경에서 업로드모드 설정', 'HTML4 모드인 경우 서버에서 개별 파일 Max Size Check 여부 설정'],
            ['ChunkSize', '분할 전송 크기 설정'],
            ['FolderNameRule', '폴더 하위들의 저장 체계 설정', '서버 저장 경로 설정'],
            ['FileNameRule', '저장할 파일의 이름을 지정하는 규칙 설정', '서버 저장 파일명 규칙 설정'],
            ['FileNameRuleEx', '파일명이 중복될 때 파일명 변경 방식 설정'],
            ['AddExtIcon', '존재하지 않는 파일 확장자 icon의 경우 이미지 아이콘 파일 추가 후 설정']
        ],
        [
            ['Dext5Upload', '생성'],
            ['Transfer', '전송 시작'],
            ['TransferEx', '전송 시작', '파일추가 완료 후 파일 전송'],
            ['AddUploadedFile', '이미 업로드 되어 있는 파일 추가'],
            ['AddUploadedFileAsArray', '이미 업로드 되어 있는 파일을 배열로 추가'],
            ['AddUploadedFileWithGetFileSize', '서버에서 파일 크기를 구하여 이미 업로드 되어 있는 파일을 추가'],
            ['AddUploadedFileEx', '이미 업로드 되어 있는 파일 추가', '사용자 헤더 추가한 경우 사용'],
            ['AddUploadedFileExAsArray', '이미 업로드 되어 있는 파일을 배열로 추가', '사용자 헤더 추가한 경우 사용'],
            ['AddUploadedFileExWithGetFileSize', '서버에서 파일 크기를 구하여 이미 업로드 되어 있는 파일을 추가', '사용자 헤더 추가한 경우 사용'],
            ['AddDropZoneFile', 'DropZone에 Drag&Drop한 파일을 업로드리스트에 추가', 'DropZone에 드래그앤드랍한 파일을 업로드리스트에 추가'],
            ['OpenFileDialog', '파일 선택 다이얼로그 열기'],
            ['DeleteAllFile', '모든 파일 제거'],
            ['DeleteSelectedFile', '선택된 파일 제거'],
            ['Destroy', '업로드 제거'],
            ['OpenSelectedFile', '선택된 파일 열기'],
            ['Cancel', '전송 취소'],
            ['FileSort', '파일 정렬'],
            ['GetSelectedFileCount', '선택된 항목개수', '선택된 파일개수'],
            ['GetTotalFileCount', '전체 파일개수'],
            ['GetTotalFileSize', '전체 파일크기'],
            ['GetUploadNameSet', '업로드 네임', '업로드 이름'],
            ['ResetUpload', '업로드 초기화'],
            ['GetNewUploadListForJson', '전송완료 후 새롭게 업로드 된 파일 리스트 json 형태로 추출'],
            ['GetSelectedNewUploadListForJson', '선택된 파일중 사용자가 추가한 파일 리스트를 json 형태로 추출'],
            ['GetAllFileListForJson', '전송완료 후 새롭게 업로드 된 파일과 이미 업로드된 파일 리스트 모두 json 형태로 추출'],
            ['GetSelectedAllFileListForJson', '선택된 모든 파일 리스트를 json 형태로 추출'],
            ['GetAllFileMergeListForJson', '전송완료 후 새롭게 업로드 된 파일과 이미 업로드된 파일 리스트 모두를 순서대로 json 형태로 추출'],
            ['GetDeleteListForJson', '전송완료 후 업로드 되었던 파일 중 삭제된 파일 리스트를 json 형태로 추출'],
            ['GetNewUploadListForXml', '전송완료 후 새롭게 업로드 된 파일 리스트 Xml 형태로 추출'],
            ['GetSelectedNewUploadListForXml', '선택된 파일중 사용자가 추가한 파일 리스트를 Xml 형태로 추출'],
            ['GetAllFileListForXml', '전송완료 후 새롭게 업로드 된 파일과 이미 업로드된 파일 리스트 모두 Xml 형태로 추출'],
            ['GetSelectedAllFileListForXml', '선택된 모든 파일 리스트를 Xml 형태로 추출'],
            ['GetAllFileMergeListForXml', '전송완료 후 새롭게 업로드 된 파일과 이미 업로드된 파일 리스트 모두를 순서대로 Xml 형태로 추출'],
            ['GetDeleteListForXml', '전송완료 후 업로드 되었던 파일 중 삭제된 파일 리스트를 Xml 형태로 추출'],
            ['GetNewUploadListForText', '전송완료 후 새롭게 업로드 된 파일 리스트 Text 형태로 추출'],
            ['GetSelectedNewUploadListForText', '선택된 파일중 사용자가 추가한 파일 리스트를 Text 형태로 추출'],
            ['GetAllFileListForText', '전송완료 후 새롭게 업로드 된 파일과 이미 업로드된 파일 리스트 모두 Text 형태로 추출'],
            ['GetSelectedAllFileListForText', '선택된 모든 파일 리스트를 Text 형태로 추출'],
            ['GetAllFileMergeListForText', '전송완료 후 새롭게 업로드 된 파일과 이미 업로드된 파일 리스트 모두를 순서대로 Text 형태로 추출'],
            ['GetDeleteListForText', '전송완료 후 업로드 되었던 파일 중 삭제된 파일 리스트를 Text 형태로 추출'],
            ['DownloadFile', '선택된 파일 다운로드'],
            ['DownloadAllFile', '모든 파일 다운로드'],
            ['SetUploadMode', '업로드 모드 설정'],
            ['Show', '업로드 표시', '업로드 보이기 설정'],
            ['Hidden', '업로드 숨김 설정'],
            ['SetSkinColor', '업로드 색상을 사용자가 원하는 색상으로 설정'],
            ['MoveFile', '파일 순서 변경'],
            ['SetFileInfo', '파일명에 붙일 특정 문자열 설정'],
            ['AddFormData', '파일 업로드시 별도 파라미터 설정'],
            ['AddLocalFileObject', '파일 태그와 업로드 연동이 필요한 경우 파일을 추가'],
            ['SetSelectItem', '파일의 순서로 파일 선택'],
            ['SetSelectItemEx', '파일의 uniqueKey로 파일 선택'],
            ['SetFileMark', '파일 업로드시 파일에 특정 정보 추가'],
            ['SetSize', '업로드 크기 변경'],
            ['GetUploadCompleteState', '전송완료 되었는지 확인'],
            ['ResetUploadCompleteState', '전송완료 상태를 다시 false로 reset'],
            ['GetUserRuntimeMode', '현재 업로드 Runtime Mode 확인'],
            ['SetAllowOrLimitExtension', '파일 확장자 허용 설정', '파일 확장자 제한 설정'],
            ['GetFileSize', '파일 사이즈 요청'],
            ['SetLargeFile', '대용량 설정'],
            ['SetMaxOneFileSize', '파일당 용량제한 설정', '파일별 용량제한 설정'],
            ['SetMaxTotalFileSize', '총 업로드 될 파일의 용량제한 설정', '모든 파일의 용량제한 설정'],
            ['SetMaxTotalFileCount', '최대 파일 개수 제한값 설정'],
            ['SetItemStyle', '파일명 스타일 변경'],
            ['SetConfig', '업로드 설정 값 변경'],
            ['SetUploadedFile', '이미 업로드 되어 있는 웹파일의 정보 변경'],
            ['AddLocalFileDirectlyEX', '로컬파일 추가'],
            ['AddHttpHeaderEx', 'HTTP Header 설정'],
            ['DoOpenFileEx', '선택된 파일 열기'],
            ['DoSaveAndOpenEx', '파일을 로컬에 저장한 후 저장한 파일 열기'],
            ['DoSaveAndFolderOpenEx', '파일을 로컬에 저장한 후 파일이 저장된 폴더 열기'],
            ['DoSaveFileEx', '파일을 로컬에 저장할 때 zip파일로 저장'],
            ['DoSaveAllFilesEx', '모든 파일을 로컬에 저장할 때 zip파일로 저장'],
            ['DoSelectFolder', '폴더 선택 다이얼로그 열기'],
            ['GetFolderPathName', '선택된 폴더경로 추출'],
            ['DoPrintFileEx', '선택된 파일 인쇄'],
            ['GetFileObjectList', '파일객체 추출'],
            ['GetItemInfoList', '파일리스트의 정보 추출'],
            ['GetItemCount', '항목개수 추출'],
            ['SetDefaultSavePath', '다운로드 경로 설정'],
            ['SetFolderTransfer', '폴더 구조 업로드 설정'],
            ['SetPopupMode', '업로드 위에 div형태의 팝업을 띄울때 설정']
        ],
        [
            ['onLanguageDefinition', '각 Text의 문구를 바꾸기 원할 때 사용'],
            ['OnCreationComplete', '객체의 생성이 완료되었을 때 발생'],
            ['BeforeAddItem', '파일 추가 전 발생'],
            ['AfterAddItem', '파일 추가 후 발생'],
            ['AfterAddItemEndTime', '파일 추가 완료 후 발생'],
            ['BeforeDeleteItem', '파일 삭제 전 발생'],
            ['DeleteItemEndTime', '파일 삭제 후 발생'],
            ['OnTransfer_Start', '파일 전송 시작 전 발생'],
            ['OnTransfer_Complete', '파일 전송 완료시 발생', '파일 전송 완료되었을 때 발생'],
            ['UploadingCancel', '전송 취소시 발생', '전송 취소했을때 발생'],
            ['SelectItem', '파일 선택 후 발생'],
            ['BeforeFileViewOrOpen', '파일 열기 전 발생'],
            ['BeforeFileDownload', '파일 다운로드 전 발생'],
            ['AfterDownload', '파일 다운로드 후 발생'],
            ['FinishDownloaded', '모든 파일 다운로드 후 발생'],
            ['OnError', '에러가 발생할 경우 발생'],
            ['DropZoneAddItem', 'DropZone에 파일을 Drop 후 발생', 'DropZone에 파일을 드랍 후 발생'],
            ['CustomAction', '커스텀버튼 클릭 시 발생']
        ]
    ],
    [
        [
            ['SetTempPath', '업로드 또는 다운로드시 임시파일에 대한 폴더 설정'],
            ['SetPhysicalPath', '실제 업로드 할 기본경로를 물리적 경로로 설정'],
            ['SetVirtualPath', '실제 업로드 할 기본경로를 가상 경로로 설정'],
            ['SetConfigPhysicalPath', '환경설정파일을 서버에서 관리하고, 서버에 저장된 환경설정파일을 사용할 경우 사용'],
            ['SetZipFileName', '웹표준 모드에서 멀티 파일 다운로드시 zip 파일명을 설정'],
            ['SetFileBlackWordList', '업로드시 서버에서 파일명에대한 제어를 위하여 설정'],
            ['SetGarbageCleanDay', '설정된 임시파일에 대한 폴더에서 불필요한 파일을 삭제 처리하기 위하여 설정'],
            ['SetDownloadRootPath', '클라이언트에서 다운로드 또는 열기 경로 설정시 경로의 앞부분 일부를 서버에서 설정할 경우 사용'],
            ['SetAllowExtensionSpecialSymbol', '특정 특수문자에 대하여 빈값으로 치환되지 않도록 하기 원할 경우 설정'],
            ['SetViewerJsPath', 'dext5upload/js/dext5upload.viewer.js 파일의 경로를 설정'],
            ['SetViewerJs2Path', 'dext5upload/js/dext5upload.base64.js 파일의 경로를 설정'],
            ['SetViewerCssPath', 'dext5upload/css/dext5viewer.min.css 파일의 경로를 설정'],
            ['SetViewerLoadingImagePath', 'dext5upload/images/loading.gif 파일의 경로를 설정'],
            ['SetViewerBrokenImagePath', 'dext5upload/images/broken.png 파일의 경로를 설정']
        ],
        [
            ['SetDebugMode', '업로드,다운로드 등등의 모든 서버 동작 중 발생되는 로그를 출력하기 위하여 사용'],
            ['SetUploadCheckFileExtension', '업로드시 서버 확장자 체크'],
            ['SetDownloadCheckFileExtension', '다운로드시 서버 확장자 체크'],
            ['SetCustomError', '업로드 또는 다운로드시 서버에서 특정 상황에 따른 에러처리를 할 경우 사용'],
            ['SetNetworkCredentials', '네트워크 드라이브의 인증 정보를 설정']
        ],
        [
            ['MakeThumbnail', '파일 업로드 시 이미지 파일인 경우 동일 폴더에 이미지에 대한 Thumbnail 처리를 할 경우 사용'],
            ['MakeThumbnailEX', '파일 업로드 시 이미지 파일인 경우 특정 위치에 이미지에 대한 Thumbnail 처리를 할 경우 사용'],
            ['ConvertImageFormat', '파일 업로드 시 이미지 파일인 경우 이미지의 Format을 변경할 경우 사용'],
            ['ConvertImageSize', '파일 업로드 시 이미지 파일인 경우 이미지 크기를 변환할 경우 사용'],
            ['ConvertImageSizeByPercent', '파일 업로드 시 이미지 파일인 경우 이미지 크기를 비율로 변환할 경우 사용'],
            ['Rotate', '파일 업로드 시 이미지 파일인 경우 이미지를 회전할 경우 사용'],
            ['SetImageWaterMark', '파일 업로드 시 이미지 파일인 경우 이미지 워터마크를 적용할 경우 사용'],
            ['SetTextWaterMark', '파일 업로드 시 이미지 파일인 경우 텍스트 워터마크를 적용할 경우 사용'],
            ['GetImageSize', '파일 업로드 시 이미지 파일인 경우 이미지의 크기정보를 얻으려고 할 때 사용'],
            ['GetExifEntityData', '파일 업로드 시 이미지 파일인 경우 이미지의 EXIF 정보를 추출하려는 경우 사용']
        ],
        [
            ['UploadBeforeInitialize', '파일 업로드시 서버에 저장하기 전에 발생'],
            ['UploadCompleteBefore', '파일 업로드시 서버에 저장한 후 바로 발생'],
            ['UploadComplete', '파일 업로드시 서버에 저장한 후 Response하기 바로 전에 발생'],
            ['OpenDownloadBeforeInitialize', '파일 열기 또는 다운로드 전에 발생'],
            ['OpenDownloadComplete', '파일 열기 또는 다운로드 후에 발생']
        ],
        [
            ['MaxRequestLength', 'MaxRequestLength 설정', '요청되는 ContentLength의 최대값을 설정할 때 사용'],
            ['Timeout', 'Timeout 설정'],
            ['Cross Origin Resource Sharing(CORS)', 'Web Server와 WAS Server가 분리되어 Handler가 Cross Origin Resource Sharing(CORS) 설정이 필요한 경우 설정']
        ]
    ],
    [
        [
            ['SetDebugMode', '업로드,다운로드 등등의 모든 서버 동작 중 발생되는 로그를 콘솔 또는 서버로그에 출력하기 위하여 설정'],
            ['SetTempPath', '업로드 또는 다운로드시 임시파일에 대한 폴더를 설정하기 위하여 사용'],
            ['SetPhysicalPath', '실제 업로드 할 기본경로를 물리적 경로로 설정'],
            ['SetVirtualPath', '실제 업로드 할 기본경로를 가상 경로로 설정'],
            ['SetConfigPhysicalPath', '환경설정파일을 서버에서 관리하고, 서버에 저장된 환경설정파일을 사용할 경우 사용'],
            ['SetZipFileName', '웹표준 모드에서 멀티 파일 다운로드시 zip 파일명을 설정'],
            ['SetUploadCheckFileExtension', '업로드시 서버 확장자 체크'],
            ['SetFileBlackWordList', '업로드시 서버에서 파일명에대한 제어를 위하여 설정'],
            ['SetDownloadCheckFileExtension', '다운로드시 서버 확장자 체크'],
            ['SetGarbageCleanDay', '설정된 임시파일에 대한 폴더에서 불필요한 파일을 삭제 처리하기 위하여 설정'],
            ['SetDownloadRootPath', '클라이언트에서 다운로드 또는 열기 경로 설정시 경로의 앞부분 일부를 서버에서 설정할 경우 사용'],
            ['SetAllowExtensionSpecialSymbol', '특정 특수문자에 대하여 빈값으로 치환되지 않도록 하기 원할 경우 설정'],
            ['SetContextPath', '서버 설정에 Context Path가 선언되어 있다면 설정'],
            ['SetStartPhysicalPathSlashAllowed', 'PhysicalPath값을 /로 시작되도록 허용할 경우 설정'],
            ['SetNtlmAuthentication', '네트워크 드라이브의 인증 정보 설정'],
            ['SetViewerJsPath', 'dext5upload/js/dext5upload.viewer.js 파일의 경로를 설정'],
            ['SetViewerJs2Path', 'dext5upload/js/dext5upload.base64.js 파일의 경로를 설정'],
            ['SetViewerCssPath', 'dext5upload/css/dext5viewer.min.css 파일의 경로를 설정'],
            ['SetViewerLoadingImagePath', 'dext5upload/images/loading.gif 파일의 경로를 설정'],
            ['SetViewerBrokenImagePath', 'dext5upload/images/broken.png 파일의 경로를 설정']
        ],
        [
            ['MakeThumbnail', '파일 업로드 시 이미지 파일인 경우 동일 폴더에 이미지에 대한 Thumbnail 처리를 할 경우 사용'],
            ['MakeThumbnailEX', '파일 업로드 시 이미지 파일인 경우 특정 위치에 이미지에 대한 Thumbnail 처리를 할 경우 사용'],
            ['ConvertImageFormat', '파일 업로드 시 이미지 파일인 경우 이미지의 Format을 변경할 경우 사용'],
            ['ConvertImageSize', '파일 업로드 시 이미지 파일인 경우 이미지 크기를 변환할 경우 사용'],
            ['ConvertImageSizeByPercent', '파일 업로드 시 이미지 파일인 경우 이미지 크기를 비율로 변환할 경우 사용'],
            ['Rotate', '파일 업로드 시 이미지 파일인 경우 이미지를 회전할 경우 사용'],
            ['SetImageWaterMark', '파일 업로드 시 이미지 파일인 경우 이미지 워터마크를 적용할 경우 사용'],
            ['SetTextWaterMark', '파일 업로드 시 이미지 파일인 경우 텍스트 워터마크를 적용할 경우 사용'],
            ['GetImageSize', '파일 업로드 시 이미지 파일인 경우 이미지의 크기정보를 얻으려고 할 때 사용'],
            ['GetExifEntityData', '파일 업로드 시 이미지 파일인 경우 이미지의 EXIF 정보를 추출하려는 경우 사용']
        ],
        [
            ['UploadBeforeInitialize', '파일 업로드시 서버에 저장하기 전에 발생'],
            ['UploadCompleteBefore', '파일 업로드시 서버에 저장한 후 바로 발생'],
            ['UploadComplete', '파일 업로드시 서버에 저장한 후 Response하기 바로 전에 발생'],
            ['OpenDownloadBeforeInitialize', '파일 열기 또는 다운로드 전에 발생'],
            ['OpenDownloadComplete', '파일 열기 또는 다운로드 후에 발생']
        ],
        [
            ['MimeType', 'MimeType 설정'],
            ['Multipart가 설정에 의해 미리 읽히는 경우', 'Multipart가 설정에 의해 미리 읽히는 경우에 대한 처리'],
            ['Cross Origin Resource Sharing(CORS)', 'Web Server와 WAS Server가 분리되어 Handler가 Cross Origin Resource Sharing(CORS) 설정이 필요한 경우 설정']
        ]
    ],
    [
        ['서버 환경설정 파일', '서버에서 환경설정 파일 읽기'],
        ['파라미터 추가', '파라미터 서버에서 받는 방법', '파라미터 추가 후 서버에서 받는 방법'],
        ['파일의 특정 정보 서버에서 받는 방법', '파일에 특정 정보 추가', '파일에 특정 정보 추가 후 서버에서 받는 방법', '파일 추가할 때 각 파일에 특정 정보 추가 후 서버에서 받는 방법'],
        ['파일명 변경', '파일명 변환', '파일을 원하는 파일명으로 변환하는 방법'],
        ['업로드 된 파일 정보 얻는 방법', '서버 이벤트에서 업로드 된 파일 정보 얻는 방법'],
        ['커스텀 다운로드 핸들러에서 커스텀 에러 처리 방법', '서버 커스텀 다운로드 핸들러에서 커스텀 에러 처리 방법']
    ],
    [
        ['기본 업로드'],
        ['기본 다운로드'],
        ['동적 생성'],
        ['보안컨텐츠 다운로드'],
        ['다중 업로드'],
        ['다중 다운로드'],
        ['다운로드 모드 설정'],
        ['편집모드 이벤트'],
        ['보기모드 이벤트'],
        ['File 테그 연동'],
        ['폴더 구조로 업로드'],
        ['폴더 구조로 업로드 옵션'],
        ['폴더 구조로 다운로드'],
        ['이미지 미리보기'],
        ['졍렬/파일 순서 바꾸기'],
        ['대용량 설정'],
        ['Drop Zone'],
        ['양식모드'],
        ['저장경로 설정 방법'],
        ['커스텀버튼 추가'],
        ['편집/보기 모드 동시 사용'],
        ['파라미터 추가'],
        ['각 파일에 data 추가하는 방법'],
        ['팝업창이 플러그인에 가려질 때'],
        ['업로드 경로 암호화']
    ]
];

function fnMenuSetting(bThridMenu, bSearchMenuClick) {
    if (bSearchMenuClick) {
        document.getElementById("search_word").value = "";
        document.getElementById('search_list').innerHTML = "";
        document.getElementById("search_list").style.display = "none";
    }

    var arrSelectedMenu = strSelectedMenu.split(',');
    var arrMenu = [];
    var strSelectedContentsUrl = '';

    var arrSelectedMenuLength = arrSelectedMenu.length;

    var arrMenuStatus = strMenuStatus.split(',');
    var arrMenuStatusLength = arrMenuStatus.length;

    if (arrSelectedMenuLength == 1 && (strMenuStatus == arrSelectedMenu[0] || (arrMenuStatusLength == 2 && arrMenuStatus[0] == arrSelectedMenu[0]))) {
        strMenuStatus = '';
    } else if (!bThridMenu && arrSelectedMenuLength == 2 && strMenuStatus == arrSelectedMenu[0] + ',' + arrSelectedMenu[1]) {
        strMenuStatus = arrSelectedMenu[0];
    } else {
        if (bThridMenu) {
            if (arrSelectedMenuLength == 2) {
                strMenuStatus = arrSelectedMenu[0];
            } else if (arrSelectedMenuLength == 3) {
                strMenuStatus = arrSelectedMenu[0] + ',' + arrSelectedMenu[1];
            }
        } else {
            strMenuStatus = strSelectedMenu;
        }
    }

    var arrFirstMenuLength = arrFirstMenu.length;

    for (var i = 0; i < arrFirstMenuLength; i++) {
        var arrSpFirstMenu = arrFirstMenu[i].split(G_vertical);
        var strFirstMenu = fnGetMenuText(arrSpFirstMenu[0], arrSpFirstMenu[1], arrSpFirstMenu[2]);

        if (((!bThridMenu && strMenuStatus.indexOf(i.toString()) == 0) || bThridMenu) && arrSelectedMenu[0] == i.toString()) {
            arrMenu[arrMenu.length] = '<li><a href="javascript:strSelectedMenu=\'' + i + '\';fnMenuSetting(false, false);" class="depth1"><i class="icon open"></i>' + strFirstMenu + '</a>';
        } else {
            arrMenu[arrMenu.length] = '<li><a href="javascript:strSelectedMenu=\'' + i + '\';fnMenuSetting(false, false);" class="depth1"><i class="icon close"></i>' + strFirstMenu + '</a>';
        }
        
        if (((!bThridMenu && strMenuStatus.indexOf(i.toString()) == 0) || bThridMenu) && arrSelectedMenu[0] == i.toString()) {
            var arrSecondMenuLength = arrSecondMenu[i].length;

            arrMenu[arrMenu.length] = '<ul>';

            for (var j = 0; j < arrSecondMenuLength; j++) {
                var arrSpSecondMenu = arrSecondMenu[i][j].split(G_vertical);
                var strSecondMenu = fnGetMenuText(arrSpSecondMenu[0], arrSpSecondMenu[1], arrSpSecondMenu[2]);
                var strFnMenuSetting = '';

                if (arrSpSecondMenu.length == 4) {
                    strFnMenuSetting = 'fnMenuSetting(true, false);';
                } else {
                    strFnMenuSetting = 'fnMenuSetting(false, false);';
                }

                arrMenu[arrMenu.length] = '<li><a href="javascript:strSelectedMenu=\'' + i + ',' + j + '\';' + strFnMenuSetting + '" class="depth2';
                if (((!bThridMenu && strMenuStatus.indexOf(i.toString() + ',' + j.toString()) == 0) || bThridMenu) && arrSelectedMenu[1] == j.toString()) {
                    if (arrSpSecondMenu.length == 4) {
                        arrMenu[arrMenu.length] = ' on"><i class="icon none"></i>';
                        strSelectedContentsUrl = arrSpSecondMenu[3];
                    } else {
                        arrMenu[arrMenu.length] = '"><i class="icon open"></i>';
                    }
                } else {
                    if (arrSpSecondMenu.length == 4) {
                        arrMenu[arrMenu.length] = '"><i class="icon none"></i>';
                    } else {
                        arrMenu[arrMenu.length] = '"><i class="icon close"></i>';
                    }
                }
                arrMenu[arrMenu.length] = strSecondMenu + '</a></li>';
                
                if (((!bThridMenu && strMenuStatus.indexOf(i.toString() + ',' + j.toString()) == 0) || bThridMenu) && arrSelectedMenu[1] == j.toString()) {
                    if (!!arrThirdMenu[i][j]) {
                        var arrThirdMenuLength = arrThirdMenu[i][j].length;

                        arrMenu[arrMenu.length] = '<ul>';

                        for (var k = 0; k < arrThirdMenuLength; k++) {
                            var arrSpThirdMenu = arrThirdMenu[i][j][k].split(G_vertical);
                            var strThirdMenu = fnGetMenuText(arrSpThirdMenu[0], arrSpThirdMenu[1], arrSpThirdMenu[2]);

                            if (arrSelectedMenu[2] == k.toString()) {
                                arrMenu[arrMenu.length] = '<li><a href="javascript:strSelectedMenu=\'' + i + ',' + j + ',' + k + '\';fnMenuSetting(true, false);" class="depth3 on">' + strThirdMenu + '</a></li>';
                                strSelectedContentsUrl = arrSpThirdMenu[3];
                            } else {
                                arrMenu[arrMenu.length] = '<li><a href="javascript:strSelectedMenu=\'' + i + ',' + j + ',' + k + '\';fnMenuSetting(true, false);" class="depth3">' + strThirdMenu + '</a></li>';
                            }
                        }

                        arrMenu[arrMenu.length] = '</ul>';
                    }
                }
            }

            arrMenu[arrMenu.length] = '</ul>';
        }

        arrMenu[arrMenu.length] = '</li>';
    }

    strPreSelectedMenu = strSelectedMenu;

    document.getElementById('side_menu').innerHTML = arrMenu.join("");

    if (!!strSelectedContentsUrl && strSelectedContentsUrl != '')
        fnContentsSetting(strSelectedContentsUrl);
}

function fnGetMenuText(strIcon, strTitleFlag, strTitle) {

    var strMenuText = '';

    switch (strIcon) {
        case "1":
            strMenuText += '<i class="icon icon_intro"></i>';
            break;
        case "2":
            strMenuText += '<i class="icon icon_guide"></i>';
            break;
        case "3":
            strMenuText += '<i class="icon icon_sample"></i>';
            break;
        case "4":
            strMenuText += '<i class="icon icon_setting"></i>';
            break;
        case "5":
            strMenuText += '<i class="icon icon_brace"></i>';
            break;
        case "6":
            strMenuText += '<i class="icon icon_serverinfo"></i>';
            break;
        case "7":
            strMenuText += '<i class="icon icon_js"></i>';
            break;
        case "8":
            strMenuText += '<i class="icon icon_net"></i>';
            break;
        case "9":
            strMenuText += '<i class="icon icon_ja"></i>';
            break;
        default:
            break;
    }

    switch (strTitleFlag) {
        case "0":
            strMenuText += '<span>' + strTitle + '</span>';
            break;
        case "1":
            strMenuText += '<span title="' + strTitle + '">' + strTitle + '</span>';
            break;
        default:
            break;
    }

    return strMenuText;

}

function fnContentsSetting(strSelectedContentsUrl) {

    document.getElementById("contentsFrame").src = strSelectedContentsUrl;

}

function fnKeyPressEvent(e) {
    if (e.keyCode == 13) {
        fnSearch();
        return false;
    }
}

function fnSearch() {

    document.getElementById('search_list').innerHTML = "";
    document.getElementById("search_list").style.display = "none";

    var strSearchWord = document.getElementById("search_word");
    var strSearchWordValue = strSearchWord.value;

    if (strSearchWordValue == '') {
        alert("검색어를 입력해주세요.");
        return;
    }

    var arrSearchMenuList = [];

    var arrFirstMenuLength = arrSearchWordMenu.length;
    for (var i = 0; i < arrFirstMenuLength; i++) {
        var arrSecondMenuLength = arrSearchWordMenu[i].length;
        for (var j = 0; j < arrSecondMenuLength; j++) {
            var arrThirdMenuLength = arrSearchWordMenu[i][j].length;
            for (var k = 0; k < arrThirdMenuLength; k++) {
                var objSearchMenu = arrSearchWordMenu[i][j][k];
                if (typeof objSearchMenu === 'string') {
                    if (objSearchMenu.toLowerCase().indexOf(strSearchWordValue.toLowerCase()) > -1 && (arrSearchMenuList.length == 0 || arrSearchMenuList[arrSearchMenuList.length - 1] != i.toString() + "," + j.toString()))
                        arrSearchMenuList[arrSearchMenuList.length] = i.toString() + "," + j.toString();
                } else {
                    var arrSearchMenuLength = objSearchMenu.length;
                    for (var l = 0; l < arrSearchMenuLength; l++) {
                        if (objSearchMenu[l].toLowerCase().indexOf(strSearchWordValue.toLowerCase()) > -1 && (arrSearchMenuList.length == 0 || arrSearchMenuList[arrSearchMenuList.length - 1] != i.toString() + "," + j.toString() + "," + k.toString()))
                            arrSearchMenuList[arrSearchMenuList.length] = i.toString() + "," + j.toString() + "," + k.toString();
                    }
                }
            }
        }
    }

    var arrSearchMenuListLength = arrSearchMenuList.length;
    if (arrSearchMenuListLength == 1) {
        strSelectedMenu = arrSearchMenuList[0];
        fnMenuSetting(true, false);
        strSearchWord.value = '';
    } else if (arrSearchMenuListLength > 1) {
        var arrSearchList = [];
        arrSearchList[arrSearchList.length] = '<ul>';

        for (var i = 0; i < arrSearchMenuListLength; i++) {
            var strSearchMenuText = '';
            var arrSpSearchMenuList = arrSearchMenuList[i].split(',');
            var arrSpSearchMenuListLength = arrSpSearchMenuList.length;
            if (arrSpSearchMenuListLength == 1) {
                strSearchMenuText += arrFirstMenu[parseInt(arrSpSearchMenuList[0], 10)].split(G_vertical)[2];
            } else if (arrSpSearchMenuListLength == 2) {
                strSearchMenuText += arrFirstMenu[parseInt(arrSpSearchMenuList[0], 10)].split(G_vertical)[2];
                strSearchMenuText += ' &gt; ' + arrSecondMenu[parseInt(arrSpSearchMenuList[0], 10)][parseInt(arrSpSearchMenuList[1], 10)].split(G_vertical)[2];
            } else if (arrSpSearchMenuListLength == 3) {
                strSearchMenuText += arrFirstMenu[parseInt(arrSpSearchMenuList[0], 10)].split(G_vertical)[2];
                strSearchMenuText += ' &gt; ' + arrSecondMenu[parseInt(arrSpSearchMenuList[0], 10)][parseInt(arrSpSearchMenuList[1], 10)].split(G_vertical)[2];
                strSearchMenuText += ' &gt; ' + arrThirdMenu[parseInt(arrSpSearchMenuList[0], 10)][parseInt(arrSpSearchMenuList[1], 10)][parseInt(arrSpSearchMenuList[2], 10)].split(G_vertical)[2];
            }

            arrSearchList[arrSearchList.length] = '<li title="' + strSearchMenuText + '"><a href="javascript:strSelectedMenu=\'' + arrSearchMenuList[i] + '\';fnMenuSetting(true, true);">' + strSearchMenuText + '</a></li>';
        }

        arrSearchList[arrSearchList.length] = '</ul>';

        document.getElementById('search_list').innerHTML = arrSearchList.join("");
        document.getElementById('search_list').style.display = "";
    } else if (arrSearchMenuListLength == 0) {
        alert("검색 결과가 존재하지 않습니다.");
        strSearchWord.focus();
    }

}

function fnIndex() {

    document.getElementById("search_word").value = "";
    document.getElementById('search_list').innerHTML = "";
    document.getElementById("search_list").style.display = "none";

    strSelectedMenu = '';
    fnMenuSetting(false, false);

    var fnIframeLoad = function () {
        var iIndexContentsRowCount = 0;
        var arrIndexContents = [];

        var arrFirstSearchWordMenuLength = arrSearchWordMenu.length;

        for (var i = 0; i < arrFirstSearchWordMenuLength; i++) {

            var arrSecondSearchWordMenuLength = arrSearchWordMenu[i].length;
            for (var j = 0; j < arrSecondSearchWordMenuLength; j++) {

                var arrThirdIndexContents = [];
                var arrThirdSearchWordMenuLength = arrSearchWordMenu[i][j].length;
                for (var k = 0; k < arrThirdSearchWordMenuLength; k++) {

                    if (typeof arrSearchWordMenu[i][j][k] === 'string') {
                        arrThirdIndexContents[arrThirdIndexContents.length] = '<td><a href="javascript:parent.strSelectedMenu=\'' + i + ',' + j + '\';parent.fnMenuSetting(true, false);" title="' + arrSearchWordMenu[i][j][k] + '">' + arrSearchWordMenu[i][j][k] + '</a></td>';
                    } else {
                        var arrFourthIndexContents = [];
                        var arrFourthSearchWordMenuLength = arrSearchWordMenu[i][j][k].length;
                        for (var l = 0; l < arrFourthSearchWordMenuLength; l++) {
                            arrFourthIndexContents[arrFourthIndexContents.length] = '<td><a href="javascript:parent.strSelectedMenu=\'' + i + ',' + j + ',' + k + '\';parent.fnMenuSetting(true, false);" title="' + arrSearchWordMenu[i][j][k][l] + '">' + arrSearchWordMenu[i][j][k][l] + '</a></td>';
                        }

                        if (arrFourthSearchWordMenuLength < 4) {
                            for (var m = 0; m < 4 - arrFourthSearchWordMenuLength; m++) {
                                arrFourthIndexContents[arrFourthIndexContents.length] = '<td></td>';
                            }
                        }

                        var strTitleText = '';
                        strTitleText += arrFirstMenu[i].split(G_vertical)[2];
                        strTitleText += ' &gt; ' + arrSecondMenu[i][j].split(G_vertical)[2];
                        strTitleText += ' &gt; ' + arrThirdMenu[i][j][k].split(G_vertical)[2];

                        iIndexContentsRowCount++;
                        if (iIndexContentsRowCount % 2 == 0) {
                            arrIndexContents[arrIndexContents.length] = '<tr class="tb_color">';
                        } else {
                            arrIndexContents[arrIndexContents.length] = '<tr>';
                        }
                        arrIndexContents[arrIndexContents.length] = '<th><a href="javascript:parent.strSelectedMenu=\'' + i + ',' + j + ',' + k + '\';parent.fnMenuSetting(true, false);" title="' + strTitleText + '">' + strTitleText + '</a></th>';
                        arrIndexContents[arrIndexContents.length] = arrFourthIndexContents.join("");
                        arrIndexContents[arrIndexContents.length] = '</tr>';
                    }

                }

                if (arrThirdIndexContents.length != 0) {
                    if (arrThirdSearchWordMenuLength < 4) {
                        for (var m = 0; m < 4 - arrThirdSearchWordMenuLength; m++) {
                            arrThirdIndexContents[arrThirdIndexContents.length] = '<td></td>';
                        }
                    }

                    var strTitleText = '';
                    strTitleText += arrFirstMenu[i].split(G_vertical)[2];
                    strTitleText += ' &gt; ' + arrSecondMenu[i][j].split(G_vertical)[2];

                    iIndexContentsRowCount++;
                    if (iIndexContentsRowCount % 2 == 0) {
                        arrIndexContents[arrIndexContents.length] = '<tr class="tb_color">';
                    } else {
                        arrIndexContents[arrIndexContents.length] = '<tr>';
                    }
                    arrIndexContents[arrIndexContents.length] = '<th><a href="javascript:parent.strSelectedMenu=\'' + i + ',' + j + '\';parent.fnMenuSetting(true, false);" title="' + strTitleText + '">' + strTitleText + '</a></th>';
                    arrIndexContents[arrIndexContents.length] = arrThirdIndexContents.join("");
                    arrIndexContents[arrIndexContents.length] = '</tr>';
                }

            }

        }

        document.all.contentsFrame.contentDocument.getElementById("index_contents").innerHTML = arrIndexContents.join("");
        removeEvent(objIframe, 'load', fnIframeLoad);
    }

    var objIframe = document.getElementById("contentsFrame");
    addEvent(objIframe, 'load', fnIframeLoad, false);
    objIframe.src = 'searchIndex.html';
    
}

function addEvent(element, event, func, useCapture) {
    if (element.addEventListener) { element.addEventListener(event, func, useCapture); } else if (element.attachEvent) { element.attachEvent('on' + event, func); }
}

function removeEvent(element, event, func, useCapture) {
    if (element.removeEventListener) { element.removeEventListener(event, func, useCapture); } else if (element.detachEvent) { element.detachEvent('on' + event, func); }
}