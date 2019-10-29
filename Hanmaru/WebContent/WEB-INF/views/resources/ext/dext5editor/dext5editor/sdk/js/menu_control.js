var G_vertical = '\u000B';
var G_formfeed = '\u000C';

var strSelectedMenu = '0,0';
var strMenuStatus = '';

//1 : icon (1 : intro, 2 : guide, 3 : sample, 4 : setting, 5 : brace, 6 : serverinfo, 7 : js, 8 : net, 9 : java)
//2 : title flag (0 : false, 1 : true)
//3 : title
//4 : url

var arrFirstMenu = ['1' + G_vertical + '0' + G_vertical + '소개', '2' + G_vertical + '0' + G_vertical + '클라이언트 가이드', '3' + G_vertical + '0' + G_vertical + '샘플'];
var arrSecondMenu = [
    ['4' + G_vertical + '1' + G_vertical + '설치 및 기본설정' + G_vertical + 'html/dext5editorSdkMain.html'],
    ['4' + G_vertical + '0' + G_vertical + 'Settings',
     '5' + G_vertical + '0' + G_vertical + 'Methods',
     '5' + G_vertical + '0' + G_vertical + 'Events'],
    ['3' + G_vertical + '1' + G_vertical + '기본 에디터 생성' + G_vertical + 'sample/html/sample_editor.html',
     '3' + G_vertical + '1' + G_vertical + '동적 에디터 생성' + G_vertical + 'sample/html/sample_ajax.html',
     '3' + G_vertical + '1' + G_vertical + '다중 에디터' + G_vertical + 'sample/html/sample_multi_editor.html',
     '3' + G_vertical + '1' + G_vertical + '특정위치에 내용삽입' + G_vertical + 'sample/html/sample_insert_editor.html',
     '3' + G_vertical + '1' + G_vertical + 'Css Url 추가' + G_vertical + 'sample/html/sample_cssurl_editor.html',
     '3' + G_vertical + '1' + G_vertical + 'Html Url 불러오기' + G_vertical + 'sample/html/sample_loadhtml_editor.html',
     '3' + G_vertical + '1' + G_vertical + 'UI 컨트롤' + G_vertical + 'sample/html/sample_toolbar_editor.html',
     '3' + G_vertical + '1' + G_vertical + '포커스 제어' + G_vertical + 'sample/html/sample_cursor_editor.html',
     '3' + G_vertical + '1' + G_vertical + '사용자 이미지 처리' + G_vertical + 'sample/html/sample_upload_editor.html',
     '3' + G_vertical + '1' + G_vertical + '에디터 객체 컨트롤' + G_vertical + 'sample/html/sample_editor_dom.html',
     '3' + G_vertical + '1' + G_vertical + '웹 접근성 검증' + G_vertical + 'sample/html/sample_accessibility_validation.html',
     '3' + G_vertical + '1' + G_vertical + 'DOM 관리' + G_vertical + 'sample/html/sample_form_editor.html',
     '3' + G_vertical + '1' + G_vertical + '숨겨진 영역에서 생성' + G_vertical + 'sample/html/sample_display_none.html',
     '3' + G_vertical + '1' + G_vertical + '에디터 서명 삽입' + G_vertical + 'sample/html/sample_insert_signature.html',
     '3' + G_vertical + '1' + G_vertical + '해상도별 보기 페이지' + G_vertical + 'sample/html/sample_editor_view.html']
];
var arrThirdMenu = [
    [],
    [
        ['7' + G_vertical + '1' + G_vertical + 'InitXml' + G_vertical + 'html/client/_s_InitXml.html',
         '7' + G_vertical + '1' + G_vertical + 'InitServerXml' + G_vertical + 'html/client/_s_InitServerXml.html',
         '7' + G_vertical + '1' + G_vertical + 'InitVisible' + G_vertical + 'html/client/_s_InitVisible.html',
         '7' + G_vertical + '1' + G_vertical + 'EditorHolder' + G_vertical + 'html/client/_s_EditorHolder.html',
         '7' + G_vertical + '1' + G_vertical + 'IgnoreSameEditorName' + G_vertical + 'html/client/_s_IgnoreSameEditorName.html',
         '7' + G_vertical + '1' + G_vertical + 'DefaultMessage' + G_vertical + 'html/client/_s_DefaultMessage.html',
         '7' + G_vertical + '1' + G_vertical + 'DialogWindow' + G_vertical + 'html/client/_s_DialogWindow.html',
         '7' + G_vertical + '1' + G_vertical + 'Doctype' + G_vertical + 'html/client/_s_Doctype.html',
         '7' + G_vertical + '1' + G_vertical + 'EditorBorder' + G_vertical + 'html/client/_s_EditorBorder.html',
         '7' + G_vertical + '1' + G_vertical + 'FileFieldID' + G_vertical + 'html/client/_s_FileFieldID.html',
         '7' + G_vertical + '1' + G_vertical + 'FirstLoadMessage' + G_vertical + 'html/client/_s_FirstLoadMessage.html',
         '7' + G_vertical + '1' + G_vertical + 'FocusInitObjId' + G_vertical + 'html/client/_s_FocusInitObjId.html',
         '7' + G_vertical + '1' + G_vertical + 'FormattingList' + G_vertical + 'html/client/_s_FormattingList.html',
         '7' + G_vertical + '1' + G_vertical + 'NextTabElementId' + G_vertical + 'html/client/_s_NextTabElementId.html',
         '7' + G_vertical + '1' + G_vertical + 'SetValueObjId' + G_vertical + 'html/client/_s_SetValueObjId.html',
         '7' + G_vertical + '1' + G_vertical + 'TabIndexObjId' + G_vertical + 'html/client/_s_TabIndexObjId.html',
         '7' + G_vertical + '1' + G_vertical + 'UserFieldID,UserFieldValue' + G_vertical + 'html/client/_s_UserFieldID,UserFieldValue.html',
         '7' + G_vertical + '1' + G_vertical + 'ZIndex' + G_vertical + 'html/client/_s_ZIndex.html',
         '7' + G_vertical + '1' + G_vertical + 'License' + G_vertical + 'html/client/_s_License.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]MimeUse' + G_vertical + 'html/client/_s_MimeUse.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]MimeCharset' + G_vertical + 'html/client/_s_MimeCharset.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]MimeConentEncodingType' + G_vertical + 'html/client/_s_MimeConentEncodingType.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]MimeFileTypeFilter' + G_vertical + 'html/client/_s_MimeFileTypeFilter.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]MimeLocalOnly' + G_vertical + 'html/client/_s_MimeLocalOnly.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]MimeRemoveHeader' + G_vertical + 'html/client/_s_MimeRemoveHeader.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]PrintPreview' + G_vertical + 'html/client/_s_PrintPreview.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]PrintHeader' + G_vertical + 'html/client/_s_PrintHeader.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]PrintFooter' + G_vertical + 'html/client/_s_PrintFooter.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]TrustSites' + G_vertical + 'html/client/_s_TrustSites.html',
         '7' + G_vertical + '1' + G_vertical + 'XssUse' + G_vertical + 'html/client/_s_XssUse.html',
         '7' + G_vertical + '1' + G_vertical + 'XssAllowEventsAttribute' + G_vertical + 'html/client/_s_XssAllowEventsAttribute.html',
         '7' + G_vertical + '1' + G_vertical + 'XssRemoveTags' + G_vertical + 'html/client/_s_XssRemoveTags.html',
         '7' + G_vertical + '1' + G_vertical + 'XssRemoveEvents' + G_vertical + 'html/client/_s_XssRemoveEvents.html',
         '7' + G_vertical + '1' + G_vertical + 'TopMenu' + G_vertical + 'html/client/_s_TopMenu.html',
         '7' + G_vertical + '1' + G_vertical + 'ToolBar1' + G_vertical + 'html/client/_s_ToolBar1.html',
         '7' + G_vertical + '1' + G_vertical + 'ToolBar2' + G_vertical + 'html/client/_s_ToolBar2.html',
         '7' + G_vertical + '1' + G_vertical + 'StatusBar' + G_vertical + 'html/client/_s_StatusBar.html',
         '7' + G_vertical + '1' + G_vertical + 'StatusBarInitMode' + G_vertical + 'html/client/_s_StatusBarInitMode.html',
         '7' + G_vertical + '1' + G_vertical + 'RemoveItem' + G_vertical + 'html/client/_s_RemoveItem.html',
         '7' + G_vertical + '1' + G_vertical + 'RemoveContextItem' + G_vertical + 'html/client/_s_RemoveContextItem.html',
         '7' + G_vertical + '1' + G_vertical + 'FontSize' + G_vertical + 'html/client/_s_FontSize.html',
         '7' + G_vertical + '1' + G_vertical + 'FontFamily' + G_vertical + 'html/client/_s_FontFamily.html',
         '7' + G_vertical + '1' + G_vertical + 'UseLocalFont' + G_vertical + 'html/client/_s_UseLocalFont.html',
         '7' + G_vertical + '1' + G_vertical + 'UseRecentlyFont' + G_vertical + 'html/client/_s_UseRecentlyFont.html',
         '7' + G_vertical + '1' + G_vertical + 'LineHeight' + G_vertical + 'html/client/_s_LineHeight.html',
         '7' + G_vertical + '1' + G_vertical + 'RunTimes' + G_vertical + 'html/client/_s_RunTimes.html',
         '7' + G_vertical + '1' + G_vertical + 'Encoding' + G_vertical + 'html/client/_s_Encoding.html',
         '7' + G_vertical + '1' + G_vertical + 'IeCompatible' + G_vertical + 'html/client/_s_IeCompatible.html',
         '7' + G_vertical + '1' + G_vertical + 'Xmlnsname' + G_vertical + 'html/client/_s_Xmlnsname.html',
         '7' + G_vertical + '1' + G_vertical + 'Lang' + G_vertical + 'html/client/_s_Lang.html',
         '7' + G_vertical + '1' + G_vertical + 'Width' + G_vertical + 'html/client/_s_Width.html',
         '7' + G_vertical + '1' + G_vertical + 'Height' + G_vertical + 'html/client/_s_Height.html',
         '7' + G_vertical + '1' + G_vertical + 'SkinName' + G_vertical + 'html/client/_s_SkinName.html',
         '7' + G_vertical + '1' + G_vertical + 'DefaultFontFamily' + G_vertical + 'html/client/_s_DefaultFontFamily.html',
         '7' + G_vertical + '1' + G_vertical + 'DefaultFontSize' + G_vertical + 'html/client/_s_DefaultFontSize.html',
         '7' + G_vertical + '1' + G_vertical + 'DefaultLineHeight' + G_vertical + 'html/client/_s_DefaultLineHeight.html',
         '7' + G_vertical + '1' + G_vertical + 'ShowFontReal' + G_vertical + 'html/client/_s_ShowFontReal.html',
         '7' + G_vertical + '1' + G_vertical + 'Accessibility' + G_vertical + 'html/client/_s_Accessibility.html',
         '7' + G_vertical + '1' + G_vertical + 'ShowTopMenu' + G_vertical + 'html/client/_s_ShowTopMenu.html',
         '7' + G_vertical + '1' + G_vertical + 'ShowToolBar' + G_vertical + 'html/client/_s_ShowToolBar.html',
         '7' + G_vertical + '1' + G_vertical + 'Grouping' + G_vertical + 'html/client/_s_Grouping.html',
         '7' + G_vertical + '1' + G_vertical + 'ShowStatusBar' + G_vertical + 'html/client/_s_ShowStatusBar.html',
         '7' + G_vertical + '1' + G_vertical + 'StatusBarLoading' + G_vertical + 'html/client/_s_StatusBarLoading.html',
         '7' + G_vertical + '1' + G_vertical + 'ShowDialogPosition' + G_vertical + 'html/client/_s_ShowDialogPosition.html',
         '7' + G_vertical + '1' + G_vertical + 'SourceViewtype' + G_vertical + 'html/client/_s_SourceViewtype.html',
         '7' + G_vertical + '1' + G_vertical + 'WrapPtagToSource' + G_vertical + 'html/client/_s_WrapPtagToSource.html',
         '7' + G_vertical + '1' + G_vertical + 'UserCssUrl' + G_vertical + 'html/client/_s_UserCssUrl.html',
         '7' + G_vertical + '1' + G_vertical + 'XhtmlValue' + G_vertical + 'html/client/_s_XhtmlValue.html',
         '7' + G_vertical + '1' + G_vertical + 'ViewModeAutoWidth' + G_vertical + 'html/client/_s_ViewModeAutoWidth.html',
         '7' + G_vertical + '1' + G_vertical + 'ViewModeAutoHeight' + G_vertical + 'html/client/_s_ViewModeAutoHeight.html',
         '7' + G_vertical + '1' + G_vertical + 'SystemTitle' + G_vertical + 'html/client/_s_SystemTitle.html',
         '7' + G_vertical + '1' + G_vertical + 'TableAutoAdjust' + G_vertical + 'html/client/_s_TableAutoAdjust.html',
         '7' + G_vertical + '1' + G_vertical + 'UseRuler' + G_vertical + 'html/client/_s_UseRuler.html',
         '7' + G_vertical + '1' + G_vertical + 'AutoBodyFit' + G_vertical + 'html/client/_s_AutoBodyFit.html',
         '7' + G_vertical + '1' + G_vertical + 'ScrollOverflow' + G_vertical + 'html/client/_s_ScrollOverflow.html',
         '7' + G_vertical + '1' + G_vertical + 'UseHorizontalLine' + G_vertical + 'html/client/_s_UseHorizontalLine.html',
         '7' + G_vertical + '1' + G_vertical + 'ImageBaseUrl' + G_vertical + 'html/client/_s_ImageBaseUrl.html',
         '7' + G_vertical + '1' + G_vertical + 'ContextMenuDisable' + G_vertical + 'html/client/_s_ContextMenuDisable.html',
         '7' + G_vertical + '1' + G_vertical + 'EnterTag' + G_vertical + 'html/client/_s_EnterTag.html',
         '7' + G_vertical + '1' + G_vertical + 'FrameFullScreen' + G_vertical + 'html/client/_s_FrameFullScreen.html',
         '7' + G_vertical + '1' + G_vertical + 'ImgDefaultSize' + G_vertical + 'html/client/_s_ImgDefaultSize.html',
         '7' + G_vertical + '1' + G_vertical + 'AllowInoutdentText' + G_vertical + 'html/client/_s_AllowInoutdentText.html',
         '7' + G_vertical + '1' + G_vertical + 'TableDefaultWidth' + G_vertical + 'html/client/_s_TableDefaultWidth.html',
         '7' + G_vertical + '1' + G_vertical + 'TableDefaultHeight' + G_vertical + 'html/client/_s_TableDefaultHeight.html',
         '7' + G_vertical + '1' + G_vertical + 'TableDefaultClass' + G_vertical + 'html/client/_s_TableDefaultClass.html',
         '7' + G_vertical + '1' + G_vertical + 'TableDefaultInoutdent' + G_vertical + 'html/client/_s_TableDefaultInoutdent.html',
         '7' + G_vertical + '1' + G_vertical + 'TableInitInoutdent' + G_vertical + 'html/client/_s_TableInitInoutdent.html',
         '7' + G_vertical + '1' + G_vertical + 'TableDefaultTdHeight' + G_vertical + 'html/client/_s_TableDefaultTdHeight.html',
         '7' + G_vertical + '1' + G_vertical + 'TableRowMaxCount' + G_vertical + 'html/client/_s_TableRowMaxCount.html',
         '7' + G_vertical + '1' + G_vertical + 'TableColMaxCount' + G_vertical + 'html/client/_s_TableColMaxCount.html',
         '7' + G_vertical + '1' + G_vertical + 'AdjustCursorInTable' + G_vertical + 'html/client/_s_AdjustCursorInTable.html',
         '7' + G_vertical + '1' + G_vertical + 'TableClassList' + G_vertical + 'html/client/_s_TableClassList.html',
         '7' + G_vertical + '1' + G_vertical + 'TableLineStyleList' + G_vertical + 'html/client/_s_TableLineStyleList.html',
         '7' + G_vertical + '1' + G_vertical + 'TableNoResizeClass' + G_vertical + 'html/client/_s_TableNoResizeClass.html',
         '7' + G_vertical + '1' + G_vertical + 'ShowLineForBorderNone' + G_vertical + 'html/client/_s_ShowLineForBorderNone.html',
         '7' + G_vertical + '1' + G_vertical + 'UseMouseTableInoutdent' + G_vertical + 'html/client/_s_UseMouseTableInoutdent.html',
         '7' + G_vertical + '1' + G_vertical + 'SetDefaultStyle' + G_vertical + 'html/client/_s_SetDefaultStyle.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]PasteToImage' + G_vertical + 'html/client/_s_PasteToImage.html',
         '7' + G_vertical + '1' + G_vertical + 'EditorTabDisable' + G_vertical + 'html/client/_s_EditorTabDisable.html',
         '7' + G_vertical + '1' + G_vertical + 'RemoveSpaceInTagname' + G_vertical + 'html/client/_s_RemoveSpaceInTagname.html',
         '7' + G_vertical + '1' + G_vertical + 'ViewModeBrowserMenu' + G_vertical + 'html/client/_s_ViewModeBrowserMenu.html',
         '7' + G_vertical + '1' + G_vertical + 'ViewModeAllowCopy' + G_vertical + 'html/client/_s_ViewModeAllowCopy.html',
         '7' + G_vertical + '1' + G_vertical + 'DragAndDropAllow' + G_vertical + 'html/client/_s_DragAndDropAllow.html',
         '7' + G_vertical + '1' + G_vertical + 'FormListUrl' + G_vertical + 'html/client/_s_FormListUrl.html',
         '7' + G_vertical + '1' + G_vertical + 'Mode' + G_vertical + 'html/client/_s_Mode.html',
         '7' + G_vertical + '1' + G_vertical + 'Resizebar' + G_vertical + 'html/client/_s_Resizebar.html',
         '7' + G_vertical + '1' + G_vertical + 'DragResize' + G_vertical + 'html/client/_s_DragResize.html',
         '7' + G_vertical + '1' + G_vertical + 'RemoveComment' + G_vertical + 'html/client/_s_RemoveComment.html',
         '7' + G_vertical + '1' + G_vertical + 'UserHelpUrl' + G_vertical + 'html/client/_s_UserHelpUrl.html',
         '7' + G_vertical + '1' + G_vertical + 'EditorBodyEditable' + G_vertical + 'html/client/_s_EditorBodyEditable.html',
         '7' + G_vertical + '1' + G_vertical + 'UseCorrectInOutdent' + G_vertical + 'html/client/_s_UseCorrectInOutdent.html',
         '7' + G_vertical + '1' + G_vertical + 'Ie11Jaso' + G_vertical + 'html/client/_s_Ie11Jaso.html',
         '7' + G_vertical + '1' + G_vertical + 'AutoDestroy' + G_vertical + 'html/client/_s_AutoDestroy.html',
         '7' + G_vertical + '1' + G_vertical + 'EncryptParam' + G_vertical + 'html/client/_s_EncryptParam.html',
         '7' + G_vertical + '1' + G_vertical + 'UseHtml5mode' + G_vertical + 'html/client/_s_UseHtml5mode.html',
         '7' + G_vertical + '1' + G_vertical + 'DevelopLangage' + G_vertical + 'html/client/_s_DevelopLangage.html',
         '7' + G_vertical + '1' + G_vertical + 'HandlerUrl' + G_vertical + 'html/client/_s_HandlerUrl.html',
         '7' + G_vertical + '1' + G_vertical + 'HandlerUrlSaveForNotes' + G_vertical + 'html/client/_s_HandlerUrlSaveForNotes.html',
         '7' + G_vertical + '1' + G_vertical + 'ServerDomain' + G_vertical + 'html/client/_s_ServerDomain.html',
         '7' + G_vertical + '1' + G_vertical + 'ToSavePathURL' + G_vertical + 'html/client/_s_ToSavePathURL.html',
         '7' + G_vertical + '1' + G_vertical + 'ToSaveFilePathURL' + G_vertical + 'html/client/_s_ToSaveFilePathURL.html',
         '7' + G_vertical + '1' + G_vertical + 'SaveFolderNameRule' + G_vertical + 'html/client/_s_SaveFolderNameRule.html',
         '7' + G_vertical + '1' + G_vertical + 'SaveFileFolderNameRule' + G_vertical + 'html/client/_s_SaveFileFolderNameRule.html',
         '7' + G_vertical + '1' + G_vertical + 'SaveFileNameRule' + G_vertical + 'html/client/_s_SaveFileNameRule.html',
         '7' + G_vertical + '1' + G_vertical + 'ImageConvertFormat' + G_vertical + 'html/client/_s_ImageConvertFormat.html',
         '7' + G_vertical + '1' + G_vertical + 'ImageConvertWidth' + G_vertical + 'html/client/_s_ImageConvertWidth.html',
         '7' + G_vertical + '1' + G_vertical + 'ImageConvertHeight' + G_vertical + 'html/client/_s_ImageConvertHeight.html',
         '7' + G_vertical + '1' + G_vertical + 'ImageAutoFit' + G_vertical + 'html/client/_s_ImageAutoFit.html',
         '7' + G_vertical + '1' + G_vertical + 'AllowMediaFileType' + G_vertical + 'html/client/_s_AllowMediaFileType.html',
         '7' + G_vertical + '1' + G_vertical + 'AllowImageFileType' + G_vertical + 'html/client/_s_AllowImageFileType.html',
         '7' + G_vertical + '1' + G_vertical + 'AllowFlashFileType' + G_vertical + 'html/client/_s_AllowFlashFileType.html',
         '7' + G_vertical + '1' + G_vertical + 'AllowInsertFileType' + G_vertical + 'html/client/_s_AllowInsertFileType.html',
         '7' + G_vertical + '1' + G_vertical + 'AttachFileImage' + G_vertical + 'html/client/_s_AttachFileImage.html',
         '7' + G_vertical + '1' + G_vertical + 'PasteImageBase64' + G_vertical + 'html/client/_s_PasteImageBase64.html',
         '7' + G_vertical + '1' + G_vertical + 'EmptyTagRemove' + G_vertical + 'html/client/_s_EmptyTagRemove.html'],
        ['7' + G_vertical + '1' + G_vertical + 'DEXT5Editor' + G_vertical + 'html/client/_m_Dext5editor.html',
         '7' + G_vertical + '1' + G_vertical + 'getEditor' + G_vertical + 'html/client/_m_getEditor.html',
         '7' + G_vertical + '1' + G_vertical + 'setEditor' + G_vertical + 'html/client/_m_setEditor.html',
         '7' + G_vertical + '1' + G_vertical + 'getUserRuntimeMode' + G_vertical + 'html/client/_m_getUserRuntimeMode.html',
         '7' + G_vertical + '1' + G_vertical + 'getDext5Dom' + G_vertical + 'html/client/_m_getDext5Dom.html',
         '7' + G_vertical + '1' + G_vertical + 'getDext5BodyDom' + G_vertical + 'html/client/_m_getDext5BodyDom.html',
         '7' + G_vertical + '1' + G_vertical + 'setHtmlContents' + G_vertical + 'html/client/_m_setHtmlContents.html',
         '7' + G_vertical + '1' + G_vertical + 'setHtmlContentsEw' + G_vertical + 'html/client/_m_setHtmlContentsEw.html',
         '7' + G_vertical + '1' + G_vertical + 'getHtmlValueExWithDocType' + G_vertical + 'html/client/_m_getHtmlValueExWithDocType.html',
         '7' + G_vertical + '1' + G_vertical + 'setHtmlValueExWithDocType' + G_vertical + 'html/client/_m_setHtmlValueExWithDocType.html',
         '7' + G_vertical + '1' + G_vertical + 'getHtmlValueEx' + G_vertical + 'html/client/_m_getHtmlValueEx.html',
         '7' + G_vertical + '1' + G_vertical + 'setHtmlValueEx' + G_vertical + 'html/client/_m_setHtmlValueEx.html',
         '7' + G_vertical + '1' + G_vertical + 'getHtmlValue' + G_vertical + 'html/client/_m_getHtmlValue.html',
         '7' + G_vertical + '1' + G_vertical + 'setHtmlValue' + G_vertical + 'html/client/_m_setHtmlValue.html',
         '7' + G_vertical + '1' + G_vertical + 'getBodyValueEx' + G_vertical + 'html/client/_m_getBodyValueEx.html',
         '7' + G_vertical + '1' + G_vertical + 'setBodyValueEx' + G_vertical + 'html/client/_m_setBodyValueEx.html',
         '7' + G_vertical + '1' + G_vertical + 'getBodyValueExLikeDiv' + G_vertical + 'html/client/_m_getBodyValueExLikeDiv.html',
         '7' + G_vertical + '1' + G_vertical + 'setBodyValueExLikeDiv' + G_vertical + 'html/client/_m_setBodyValueExLikeDiv.html',
         '7' + G_vertical + '1' + G_vertical + 'getBodyValue' + G_vertical + 'html/client/_m_getBodyValue.html',
         '7' + G_vertical + '1' + G_vertical + 'setBodyValue' + G_vertical + 'html/client/_m_setBodyValue.html',
         '7' + G_vertical + '1' + G_vertical + 'getBodyTextValue' + G_vertical + 'html/client/_m_getBodyTextValue.html',
         '7' + G_vertical + '1' + G_vertical + 'setInsertHTML' + G_vertical + 'html/client/_m_setInsertHTML.html',
         '7' + G_vertical + '1' + G_vertical + 'setInsertHTMLEx' + G_vertical + 'html/client/_m_setInsertHTMLEx.html',
         '7' + G_vertical + '1' + G_vertical + 'setInsertText' + G_vertical + 'html/client/_m_setInsertText.html',
         '7' + G_vertical + '1' + G_vertical + 'loadHtmlValueExFromURL' + G_vertical + 'html/client/_m_loadHtmlValueExFromURL.html',
         '7' + G_vertical + '1' + G_vertical + 'getImages' + G_vertical + 'html/client/_m_getImages.html',
         '7' + G_vertical + '1' + G_vertical + 'getImagesEx' + G_vertical + 'html/client/_m_getImagesEx.html',
         '7' + G_vertical + '1' + G_vertical + 'getContentsUrl' + G_vertical + 'html/client/_m_getContentsUrl.html',
         '7' + G_vertical + '1' + G_vertical + 'getServerImages' + G_vertical + 'html/client/_m_getServerImages.html',
         '7' + G_vertical + '1' + G_vertical + 'getDeletedImageUrl' + G_vertical + 'html/client/_m_getDeletedImageUrl.html',
         '7' + G_vertical + '1' + G_vertical + 'getDeletedElementsUrl' + G_vertical + 'html/client/_m_getDeletedElementsUrl.html',
         '7' + G_vertical + '1' + G_vertical + 'addUserCssUrl' + G_vertical + 'html/client/_m_addUserCssUrl.html',
         '7' + G_vertical + '1' + G_vertical + 'clearUserCssUrl' + G_vertical + 'html/client/_m_clearUserCssUrl.html',
         '7' + G_vertical + '1' + G_vertical + 'setUserCssText' + G_vertical + 'html/client/_m_setUserCssText.html',
         '7' + G_vertical + '1' + G_vertical + 'clearUserCssText' + G_vertical + 'html/client/_m_clearUserCssText.html',
         '7' + G_vertical + '1' + G_vertical + 'getToSavePathUrl' + G_vertical + 'html/client/_m_getToSavePathUrl.html',
         '7' + G_vertical + '1' + G_vertical + 'setToSavePathUrl' + G_vertical + 'html/client/_m_setToSavePathUrl.html',
         '7' + G_vertical + '1' + G_vertical + 'setSize' + G_vertical + 'html/client/_m_setSize.html',
         '7' + G_vertical + '1' + G_vertical + 'setFocusToEditor' + G_vertical + 'html/client/_m_setFocusToEditor.html',
         '7' + G_vertical + '1' + G_vertical + 'setNextTabElementId' + G_vertical + 'html/client/_m_setNextTabElementId.html',
         '7' + G_vertical + '1' + G_vertical + 'setRulerPosition' + G_vertical + 'html/client/_m_setRulerPosition.html',
         '7' + G_vertical + '1' + G_vertical + 'setEditorBodyEditable' + G_vertical + 'html/client/_m_setEditorBodyEditable.html',
         '7' + G_vertical + '1' + G_vertical + 'setFullScreen' + G_vertical + 'html/client/_m_setFullScreen.html',
         '7' + G_vertical + '1' + G_vertical + 'isEmpty' + G_vertical + 'html/client/_m_isEmpty.html',
         '7' + G_vertical + '1' + G_vertical + 'isDirty' + G_vertical + 'html/client/_m_isDirty.html',
         '7' + G_vertical + '1' + G_vertical + 'setDirty' + G_vertical + 'html/client/_m_setDirty.html',
         '7' + G_vertical + '1' + G_vertical + 'loadAutoSaveHtml' + G_vertical + 'html/client/_m_loadAutoSaveHtml.html',
         '7' + G_vertical + '1' + G_vertical + 'getAccessibility' + G_vertical + 'html/client/_m_getAccessibility.html',
         '7' + G_vertical + '1' + G_vertical + 'setAccessibility' + G_vertical + 'html/client/_m_setAccessibility.html',
         '7' + G_vertical + '1' + G_vertical + 'getAccessibilityValidation' + G_vertical + 'html/client/_m_getAccessibilityValidation.html',
         '7' + G_vertical + '1' + G_vertical + 'setAccessibilityValidation' + G_vertical + 'html/client/_m_setAccessibilityValidation.html',
         '7' + G_vertical + '1' + G_vertical + 'setEditorMode' + G_vertical + 'html/client/_m_setEditorMode.html',
         '7' + G_vertical + '1' + G_vertical + 'setEditorBorder' + G_vertical + 'html/client/_m_setEditorBorder.html',
         '7' + G_vertical + '1' + G_vertical + 'selectAll' + G_vertical + 'html/client/_m_selectAll.html',
         '7' + G_vertical + '1' + G_vertical + 'show' + G_vertical + 'html/client/_m_show.html',
         '7' + G_vertical + '1' + G_vertical + 'hidden' + G_vertical + 'html/client/_m_hidden.html',
         '7' + G_vertical + '1' + G_vertical + 'showTopMenu' + G_vertical + 'html/client/_m_showTopMenu.html',
         '7' + G_vertical + '1' + G_vertical + 'showToolbar' + G_vertical + 'html/client/_m_showToolbar.html',
         '7' + G_vertical + '1' + G_vertical + 'showStatusbar' + G_vertical + 'html/client/_m_showStatusbar.html',
         '7' + G_vertical + '1' + G_vertical + 'setEditorChangeMode' + G_vertical + 'html/client/_m_setEditorChangeMode.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]dext5EncodeMime' + G_vertical + 'html/client/_m_dext5EncodeMime.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]dext5DecodeMime' + G_vertical + 'html/client/_m_dext5DecodeMime.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]doSaveHTML' + G_vertical + 'html/client/_m_doSaveHTML.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]doPrint' + G_vertical + 'html/client/_m_doPrint.html',
         '7' + G_vertical + '1' + G_vertical + '[PL]doPrintPreview' + G_vertical + 'html/client/_m_doPrintPreview.html'],
        ['7' + G_vertical + '1' + G_vertical + 'AfterChangeMode' + G_vertical + 'html/client/_e_AfterChangeMode.html',
         '7' + G_vertical + '1' + G_vertical + 'BeforeInsertUrl' + G_vertical + 'html/client/_e_BeforeInsertUrl.html',
         '7' + G_vertical + '1' + G_vertical + 'BeforePaste' + G_vertical + 'html/client/_e_Beforepaste.html',
         '7' + G_vertical + '1' + G_vertical + 'CustomAction' + G_vertical + 'html/client/_e_CustomAction.html',
         '7' + G_vertical + '1' + G_vertical + 'EditorLoaded' + G_vertical + 'html/client/_e_EditorLoaded.html',
         '7' + G_vertical + '1' + G_vertical + 'FullScreen' + G_vertical + 'html/client/_e_FullScreen.html',
         '7' + G_vertical + '1' + G_vertical + 'LanguageDefinition' + G_vertical + 'html/client/_e_LanguageDefinition.html',
         '7' + G_vertical + '1' + G_vertical + 'OnError' + G_vertical + 'html/client/_e_OnError.html',
         '7' + G_vertical + '1' + G_vertical + 'Resized' + G_vertical + 'html/client/_e_Resized.html',
         '7' + G_vertical + '1' + G_vertical + '[AD]EditorImg' + G_vertical + 'html/client/_e_EditorImg.html',
         '7' + G_vertical + '1' + G_vertical + '[AD]EditorInput' + G_vertical + 'html/client/_e_EditorInput.html',
         '7' + G_vertical + '1' + G_vertical + '[AD]EditorSelect' + G_vertical + 'html/client/_e_EditorSelect.html',
         '7' + G_vertical + '1' + G_vertical + '[AD]EditorTextarea' + G_vertical + 'html/client/_e_EditorTextarea.html']
    ],
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
            ['EditorHolder', '특정 영역에 생성', '특정 객체에 생성'],
            ['IgnoreSameEditorName', '임의로 변경 생성'],
            ['DefaultMessage', '에디터 디자인 영역에 기본으로 띄울 메세지를 설정'],
            ['DialogWindow', '에디터 팝업을 Iframe 외부 최 상단 페이지로 설정'],
            ['Doctype', '에디터 Doctype를 설정'],
            ['EditorBorder', '에디터 전체영역 보더 라인을 보이거나 숨기는 설정'],
            ['FileFieldID', '파일 업로드에 사용되는 File 태그의 name을 설정'],
            ['FirstLoadMessage', '에디터 생성 후 디자인영역에 텍스트, html 등을 띄움'],
            ['FocusInitObjId', '에디터 로드 후 설정한 아이디를 가진 객체에 포커스를 설정'],
            ['FormattingList', '에디터 기본 서식 메뉴에 노출할 서식 리스트를 설정'],
            ['NextTabElementId', 'Tab키를 입력하면 마지막 포커스가 설정한 아이디로 이동'],
            ['SetValueObjId', 'textarea에 ID 값을 설정하면 에디터 로드 후 textarea 내용이 에디터에 세팅'],
            ['TabIndexObjId', '에디터 로드 후 div 같은 객체에 포커스를 주고 싶을 때 tabindex를 0으로 설정할 id값'],
            ['UserFieldID,UserFieldValue', '파일 업로드에 사용되는 User 태그의 name과 value를 설정'],
            ['ZIndex', '에디터 배치 순서를 설정'],
            ['License', '라이선스 설정', '라이센스 설정', '발급받은 키 설정'],
            ['MimeUse', 'MIME 사용 여부를 설정'],
            ['MimeCharset', 'MIME에 사용할 문자 인코딩 형태를 설정', 'MIME에 사용할 문자 character encoding 형태를 설정'],
            ['MimeConentEncodingType', 'MIME 인코딩 시에 인코딩 방법을 설정'],
            ['MimeFileTypeFilter', 'MIME 인코딩 대상 파일을 설정'],
            ['MimeLocalOnly', 'MIME 인코딩 대상 파일 중에서 외부(Local PC가 아닌)도 포함 할 지를 설정'],
            ['MimeRemoveHeader', 'MIME 인코딩 생성 중에 Subject, DataData 및 X-Generator 값을 생성하지 않음'],
            ['PrintPreview', '인쇄 미리보기 기능 사용여부를 설정'],
            ['PrintHeader', '인쇄 시 Header 영역의 내용을 설정'],
            ['PrintFooter', '인쇄 시 Footer 영역의 내용을 설정'],
            ['TrustSites', '신뢰할 수 있는 사이트를 추가'],
            ['XssUse', '에디터 XSS 방지를 설정'],
            ['XssAllowEventsAttribute', '객체의 Attribute에 설정된 이벤트들을 허용할지 여부를 설정'],
            ['XssRemoveTags', '에디터에 입력되면 삭제할 태그를 설정'],
            ['XssRemoveEvents', '에디터에 입력되면 삭제할 이벤트를 설정'],
            ['TopMenu', '에디터의 메뉴바에서 메뉴를 표시하거나 숨기는 기능을 설정'],
            ['ToolBar1', '에디터의 상단(기본) 툴바의 메뉴를 표시하거나 숨기는 기능을 설정'],
            ['ToolBar2', '에디터의 하단(서식) 툴바의 메뉴를 표시하거나 숨기는 기능을 설정'],
            ['StatusBar', '에디터의 보기화면(statusBar) 메뉴를 원하는 탭으로 표시하거나 숨기는 기능을 설정'],
            ['StatusBarInitMode', '에디터 로드 시 보여질 보기화면(statusBar) 모드를 설정'],
            ['RemoveItem', '에디터에서 미표시 하려는 command를 설정'],
            ['RemoveContextItem', '에디터 우클릭 메뉴에서 미표시 하려는 command를 설정'],
            ['FontSize', '에디터 폰트 크기 메뉴에 노출할 크기 리스트를 설정'],
            ['FontFamily', '에디터 글꼴 메뉴에 노출할 폰트 리스트를 설정'],
            ['UseLocalFont', '에디터 글꼴 메뉴에 사용자 로컬 폰트 추가 여부를 설정'],
            ['UseRecentlyFont', '에디터 글꼴 메뉴에 최근사용 폰트 추가 여부를 설정'],
            ['LineHeight', '에디터 줄간격 메뉴에 노출할 줄간격 리스트를 설정'],
            ['RunTimes', '에디터 모드 설정', '웹표준모드', '플러그인모드'],
            ['Encoding', '에디터 디자인 모드에 사용할 문자 인코딩(character encoding) 형태를 설정'],
            ['IeCompatible', 'IE 랜더링 모드를 설정'],
            ['Xmlnsname', '에디터 디자인 모드에서 사용할 XHTML 문서정의 포함 유무를 설정'],
            ['Lang', '에디터에 로드 할 언어를 설정'],
            ['Width', '에디터의 너비값을 설정'],
            ['Height', '에디터의 높이값을 설정'],
            ['SkinName', '에디터의 스킨 색상을 설정'],
            ['DefaultFontFamily', '에디터 로드 시 사용할 기본 폰트를 설정'],
            ['DefaultFontSize', '에디터 로드 시 사용할 기본 폰트 크기를 설정'],
            ['DefaultLineHeight', '에디터 로드 시 사용할 기본 줄간격과 줄간격 Mode를 설정'],
            ['ShowFontReal', '에디터가 사용되는 곳에서의 실제 폰트명 및 크기를 설정'],
            ['Accessibility', '웹 접근성 단계 설정 및 웹 접근성 검증 항목 중 검증 하고자 하는 항목들을 선택하여 설정'],
            ['ShowTopMenu', '에디터 메뉴바를 보이거나 숨기는 기능을 설정'],
            ['ShowToolBar', '에디터의 상단, 하단 툴바를 보이거나 숨기는 기능을 설정'],
            ['Grouping', '에디터 아이콘 툴바 그룹핑을 설정'],
            ['ShowStatusBar', '에디터의 보기화면을 보이거나 숨기는 기능을 설정', '에디터의 statusBar를 보이거나 숨기는 기능을 설정'],
            ['StatusBarLoading', '에디터의 보기화면에서 디자인, HTML 및 미리보기, TEXT 탭 변경 시 로딩 텍스트 노출 여부를 설정', '에디터의 statusBar에서 디자인, HTML 및 미리보기, TEXT 탭 변경 시 로딩 텍스트 노출 여부를 설정'],
            ['ShowDialogPosition', '에디터 다이얼로그창이 표시될 위치를 설정'],
            ['SourceViewtype', '에디터 소스보기에서 html소스 정렬 여부를 설정'],
            ['WrapPtagToSource', 'set API가 실행될 때 block 태그를 제외한 태그는 ptag로 감싸는 설정'],
            ['UserCssUrl', '사용자가 만든 css를 에디터 영역에 설정', 'css를 항상 포함할지 여부를 설정'],
            ['XhtmlValue', '소스보기나 에디터 영역의 html 소스를 가져올 때 xhtml 형식으로 가져옴'],
            ['ViewModeAutoWidth', 'View 모드 시 에디터 안의 내용만큼 자동으로 width가 늘어남'],
            ['ViewModeAutoHeight', 'View 모드 시 에디터 안의 내용만큼 자동으로 height가 늘어남'],
            ['SystemTitle', '다이얼로그창 상단 문구 변경 시 설정'],
            ['TableAutoAdjust', '에디터에서 표 작성 및 수정 시 width, height를 자동 보정으로 설정'],
            ['UseRuler', '가로 눈금자 표시 사용여부를 설정'],
            ['AutoBodyFit', '가로 눈금자 사용 설정 시, 눈금자 포인터 위치 값 기준으로 줄내림 사용여부를 설정'],
            ['ScrollOverflow', '에디터 영역에 스크롤바를 설정'],
            ['UseHorizontalLine', '세로 기준선 표시 사용여부를 설정'],
            ['ImageBaseUrl', '에디터 이미지 기본 주소를 설정'],
            ['ContextMenuDisable', '에디터 안에서 마우스 우클릭 시 메뉴 표시 사용여부를 설정'],
            ['EnterTag', 'Enter 키를 눌렀을 때 사용하게 될 태그를 설정'],
            ['FrameFullScreen', '프레임일 경우 풀 스크린 아이콘 버튼 사용여부를 설정'],
            ['ImgDefaultSize', '이미지 다이얼로그창의 너비, 높이 기본값을 설정'],
            ['AllowInoutdentText', '표 전체 들여쓰기, 내어쓰기 또는 표 안에 텍스트만 들여쓰기, 내어쓰기 사용 여부를 설정'],
            ['TableDefaultWidth', '생성될 테이블의 너비를 설정'],
            ['TableDefaultHeight', '생성될 테이블의 높이를 설정'],
            ['TableDefaultClass', '생성될 테이블의 Class Name을 설정'],
            ['TableDefaultInoutdent', '표 들여쓰기, 내어쓰기 시 사용될 px 값을 설정'],
            ['TableInitInoutdent', '표 생성 시 들여쓰기 할 기본 px값을 설정'],
            ['TableDefaultTdHeight', '표 생성 시 td 기본 높이의 px값을 설정'],
            ['TableRowMaxCount', '표 삽입 시 행의 최대값을 설정'],
            ['TableColMaxCount', '표 삽입 시 열의 최대값을 설정'],
            ['AdjustCursorInTable', '에디터에서 자체 처리된 크롬, 오페라, 사파리 브라우저에서의 방향키로 셀간 커서 이동 기능 사용여부를 설정'],
            ['TableClassList', '테이블에 지정 가능한 class명을 설정'],
            ['TableLineStyleList', '테이블에 선모양 기본 스타일을 설정'],
            ['TableNoResizeClass', '테이블에 resize 사용여부를 설정'],
            ['ShowLineForBorderNone', '테이블에 선이 없을 경우 점선 사용여부를 설정'],
            ['UseMouseTableInoutdent', '마우스로 테이블 들여쓰기,내어쓰기 사용여부를 설정'],
            ['SetDefaultStyle', '에디터 로드 시 기본 스타일이 없을 경우 body 영역에 에디터 스타일을 설정'],
            ['PasteToImage', '에디터 마우스 우클릭 시 이미지로 붙여넣기 항목을 설정'],
            ['EditorTabDisable', '디자인영역에서 tab키 입력 시 공백 입력을 설정'],
            ['RemoveSpaceInTagname', '에디터 태그 이름에 공백을 제거'],
            ['ViewModeBrowserMenu', '에디터 View 모드에서 우클릭 시 브라우저 메뉴를 열리게 함'],
            ['ViewModeAllowCopy', '에디터 View 모드에서 키보드 단축키 ctrl+c 사용을 허용 설정'],
            ['DragAndDropAllow', '에디터 마우스 Drag&Drop으로 이미지를 추가'],
            ['FormListUrl', '에디터 템플릿 양식 파일경로를 설정'],
            ['Mode', '에디터의 작성영역 모드를 설정'],
            ['Resizebar', '에디터 높이를 조절 기능 사용여부를 설정'],
            ['DragResize', '에디터 또는 브라우저의 기본 리사이즈 사용여부를 설정'],
            ['RemoveComment', '에디터에 내용이 들어올 때 주석 삭제 여부를 설정'],
            ['UserHelpUrl', '에디터 사용자 매뉴얼 경로를 설정', '에디터 사용자 help 폴더 경로를 설정'],
            ['EditorBodyEditable', '디자인 영역에 작성 가능 여부를 설정'],
            ['UseCorrectInOutdent', '붙여넣기 시 p태그의 text-indent 또는 margin-left 값이 음수인 경우에 보정'],
            ['Ie11Jaso', 'ie11브라우저에서 에디터 사용 시 자소분리 현상 보정 여부를 설정'],
            ['AutoDestroy', '에디터 언로드 시 메모리 해제 여부를 설정'],
            ['EncryptParam', '에디터에서 파일을 업로드 할 경우 파라미터 암호화에 대한 설정'],
            ['UseHtml5mode', 'HTML5가 지원되는 브라우저에서 파일 업로드시 HTML5에서 지원되는 파일첨부기능 사용여부를 설정'],
            ['DevelopLangage', '개발 언어를 설정'],
            ['HandlerUrl', '에디터 handler url을 설정'],
            ['HandlerUrlSaveForNotes', 'IBM NOTES서버에서 파일을 받을 경로를 설정'],
            ['ServerDomain', '이미지, 미디어 파일을 올릴 때 웹 경로에 들어가는 업로드 된 파일의 도메인 부분을 설정'],
            ['ToSavePathURL', '이미지, Flash, Media 파일 등을 저장 할 때 서버에 연결 된 저장소의 URL 경로를 지정'],
            ['ToSaveFilePathURL', '이미지 또는 파일 삽입 등 저장 할 때 서버에 연결 된 저장소의 URL 경로를 지정'],
            ['SaveFolderNameRule', 'ToSavePathUrl에 설정된 폴더 하위들의 저장 체계를 설정'],
            ['SaveFileFolderNameRule', 'ToSaveFilePathUrl에 설정된 폴더 하위들의 저장 체계를 설정'],
            ['SaveFileNameRule', '웹에서 등록된 파일의 이름을 지정하는 규칙'],
            ['ImageConvertFormat', '이미지 파일 업로드시 bmp 파일이나 디지털 카메라로 찍은 고용량 이미지의 크기를 줄이고자 할 때 사용하는 옵션'],
            ['ImageConvertWidth', '이미지파일 업로드 시 저장될 이미지의 너비를 변환 할 때 사용하는 옵션'],
            ['ImageConvertHeight', '이미지파일 업로드 시 저장될 이미지의 높이를 변환 할 때 사용하는 옵션'],
            ['ImageAutoFit', '이미지파일 업로드시 에디터 화면 너비에 맞게 표시할지 여부를 설정'],
            ['AllowMediaFileType', '동영상 삽입 시 허용할 확장자를 설정'],
            ['AllowImageFileType', '이미지 삽입 시 허용할 확장자를 설정'],
            ['AllowFlashFileType', '플래시 삽입 시 허용할 확장자를 설정'],
            ['AllowInsertFileType', '파일 삽입 시 허용할 확장자를 설정'],
            ['AttachFileImage', '파일 삽입 시 파일 관련 이미지 삽입을 설정'],
            ['PasteImageBase64', '이미지를 붙여넣기 할 때 DEXT5 Handler를 사용하지 않고, IMG의 src 값을 base64로 처리'],
            ['EmptyTagRemove', '붙여넣기 할 때 P태그 안에 내용이 없으면 삭제처리']
        ],
        [
            ['DEXT5Editor', '생성'],
            ['getEditor', '생성된 에디터 리턴'],
            ['setEditor', '다중 에디터 사용 시 접근할 에디터 설정'],
            ['getUserRuntimeMode', 'Runtime Mode 리턴'],
            ['getDext5Dom', '디자인 영역의 documentElement Dom 리턴'],
            ['getDext5BodyDom', '디자인 영역의 Body Dom 리턴'],
            ['setHtmlContents', 'set 되는 소스에 따라서 에디터 형태에 맞게 다시 set'],
            ['setHtmlContentsEw', '에디터 생성 전에 호출 하여도 set하려는 소스를 별도로 가지고 있다가 에디터가 생성 완료되면 자동으로 set'],
            ['getHtmlValueExWithDocType', '에디터 디자인 영역의 HTML 소스를 리턴', '에디터 디자인 영역의 <DOCTYPE> 태그 포함된 HTML 소스를 리턴'],
            ['setHtmlValueExWithDocType', '에디터 디자인 영역에 HTML 소스를 입력', '에디터 디자인 영역에 <DOCTYPE> 태그 포함된 HTML 소스를 입력'],
            ['getHtmlValueEx', '에디터 디자인 영역의 HTML 소스에서 <html> 부터 </html>까지의 소스를 리턴'],
            ['setHtmlValueEx', '에디터 디자인 영역에 <html> 부터 </html>까지의 소스를 입력'],
            ['getHtmlValue', '에디터 디자인 영역의 HTML 소스에서 <html> 태그 내부의 소스를 리턴'],
            ['setHtmlValue', '에디터 디자인 영역에 <html> 태그 내부의 소스를 입력'],
            ['getBodyValueEx', '에디터 디자인 영역의 HTML 소스에서 <body> 부터 </body>까지의 소스를 리턴'],
            ['setBodyValueEx', '에디터 디자인 영역에 <body> 부터 </body>까지의 소스를 입력'],
            ['getBodyValueExLikeDiv', '에디터 디자인 영역의 HTML 소스에서 <body> 부터 </body>까지의 소스를 div태그로 리턴'],
            ['setBodyValueExLikeDiv', 'div 태그를 에디터 디자인 영역에 <body> 태그로 입력'],
            ['getBodyValue', '에디터 디자인 영역의 HTML 소스에서 <body> 태그 내부의 소스를 리턴'],
            ['setBodyValue', '에디터 디자인 영역에 <body> 태그 내부의 소스를 입력'],
            ['getBodyTextValue', '에디터 디자인 영역의 HTML 소스에서 <body> 태그 내부의 텍스트만 리턴'],
            ['setInsertHTML', '에디터 디자인 영역에서 커서가 있는 위치에 html 소스를 삽입'],
            ['setInsertHTMLEx', '에디터 디자인 영역에서 커서가 있는 위치 혹은 작성영역 제일 뒤에 html 소스를 삽입'],
            ['setInsertText', '에디터 디자인 영역에서 커서가 있는 위치에 text를 삽입'],
            ['loadHtmlValueExFromURL', '에디터 디자인 영역에 지정한 경로의 html 페이지를 띄움'],
            ['getImages', '에디터 디자인 영역에 있는 이미지 태그의 경로를 리턴'],
            ['getImagesEx', '에디터 디자인 영역에 있는 이미지 태그 경로와 body,table,cell의 background 경로 리턴'],
            ['getContentsUrl', '에디터 디자인 영역에 있는 모든 객체의 경로 리턴', '에디터 디자인 영역에 있는 이미지, 영상, 파일 등의 경로 리턴'],
            ['getServerImages', '에디터 디자인 영역에 있는 서버 이미지 태그 경로 리턴'],
            ['getDeletedImageUrl', '에디터에서 삭제한 이미지의 url 리턴'],
            ['getDeletedElementsUrl', '에디터에서 삭제한 elements의 url 리턴'],
            ['addUserCssUrl', '에디터에 사용자의 css를 적용'],
            ['clearUserCssUrl', '에디터에 적용된 css 경로를 제거'],
            ['setUserCssText', '에디터에 사용자의 css를 style tag로 적용'],
            ['clearUserCssText', '에디터에 적용되어 있는 style tag를 삭제'],
            ['getToSavePathUrl', '에디터에 설정된 ToSavePathUrl 값 리턴', '에디터에 설정된 서버에 연결 된 저장소의 URL 경로 값 리턴'],
            ['setToSavePathUrl', '에디터의 ToSavePathUrl 값을 설정', '에디터의 서버에 연결 된 저장소의 URL 경로 값을 설정'],
            ['setSize', '에디터 로드 후 에디터의 크기 설정'],
            ['setFocusToEditor', '에디터가 로드 된 후 지정한 에디터에 포커스를 노출'],
            ['setNextTabElementId', '포커스를 줄 객체 아이디를 설정 하고 tab키를 입력하면 마지막 포커스가 설정한 아이디로 이동'],
            ['setRulerPosition', '에디터 가로 눈금자 포인터의 위치 값을 설정'],
            ['setEditorBodyEditable', '에디터 body 영역 안에 작성 가능 여부를 설정'],
            ['setFullScreen', '에디터를 전체화면으로 설정'],
            ['isEmpty', '에디터 디자인 영역에 내용이 있는지 없는지를 체크'],
            ['isDirty', '에디터 내용이 변경 되었는지 확인 할 수 있는 설정'],
            ['setDirty', '에디터를 로드 후 현재 에디터에 작성중인 문서를 변경 되지 않은 초기 문서로 설정'],
            ['loadAutoSaveHtml', '에디터 localstorage에 들어간 마지막 저장 내용 리턴'],
            ['getAccessibility', '에디터에 설정된 웹 접근성 단계 리턴'],
            ['setAccessibility', '에디터의 웹 접근성 단계를 설정'],
            ['getAccessibilityValidation', '에디터에 작성된 항목 중 웹 접근성 검증 시 위반 여부를 확인'],
            ['setAccessibilityValidation', '웹 접근성 검증 시 위반 항목이 있으면 웹 접근성 검증 팝업 창에 위반 목록을 노출'],
            ['setEditorMode', '에디터를 view 또는 edit 모드로 변경'],
            ['setEditorBorder', '에디터 전체 영역을 감싸고 있는 Border의 노출 여부를 설정'],
            ['selectAll', '에디터 디자인 영역에서 작성 된 모든 내용을 선택'],
            ['show', '에디터를 화면에 표시'],
            ['hidden', '에디터를 화면에서 숨김'],
            ['showTopMenu', '에디터의 메뉴 바를 표시하거나 숨기는 기능을 설정'],
            ['showToolbar', '에디터의 툴바를 표시하거나 숨기는 기능을 설정'],
            ['showStatusbar', '상태 바를 표시하거나 숨기는 기능을 설정'],
            ['setEditorChangeMode', '상태바의 탭을 이동하는 기능을 설정'],
            ['dext5EncodeMime', '에디터에서 작성된 html을 MIME 형태로 인코딩'],
            ['dext5DecodeMime', 'mimeData를 decode'],
            ['doSaveHTML', '에디터에 작성한 소스를 html파일로 저장'],
            ['doPrint', '에디터에 작성한 소스를 프린트 '],
            ['doPrintPreview', '에디터에 작성한 소스를 프린트 미리보기 한 후 프린트']
        ],
        [
            ['AfterChangeMode', '에디터 보기화면 변경 후 이벤트가 발생', 'statusBar 변경 후 이벤트가 발생'],
            ['BeforeInsertUrl', '에디터에 파일 업로드 후 url 삽입 전에 발생'],
            ['BeforePaste', '에디터에 붙여넣기 전 이벤트가 발생'],
            ['CustomAction', '에디터에 custom icon을 추가하였을 때 icon 클릭 시 동작하는 메소드 '],
            ['EditorLoaded', '에디터가 로드 완료 되었을 때 발생', '에디터가 작업준비 되었을 때 발생'],
            ['FullScreen', '에디터 화면전환 시 발생', '에디터 전체화면, 기본화면 변환 시 발생'],
            ['LanguageDefinition', '에디터 생성 시 이벤트가 발생', '에디터에서 노출되는 아이콘명, 메세지 등을 변경'],
            ['OnError', '에러가 발생할 경우 발생'],
            ['Resized', '에디터 높이 리사이즈 완료 시 발생'],
            ['[AD]EditorImg', '관리자모드에서 img태그로 추가된 객체 더블클릭 시 이벤트가 발생'],
            ['[AD]EditorInput', '관리자모드에서 input태그로 추가된 객체를 더블클릭 시 이벤트가 발생'],
            ['[AD]EditorSelect', '관리자모드에서 select태그로 추가된 객체를 더블클릭 시 이벤트가 발생'],
            ['[AD]EditorTextarea', '관리자모드에서 textarea태그로 추가된 객체를 더블클릭 시 이벤트가 발생']
        ]
    ],
    [
        ['기본 에디터 생성'],
        ['동적 에디터 생성'],
        ['다중 에디터'],
        ['특정위치에 내용삽입'],
        ['Css Url 추가'],
        ['Html Url 불러오기'],
        ['UI 컨트롤'],
        ['포커스 제어'],
        ['사용자 이미지 처리'],
        ['에디터 객체 컨트롤'],
        ['웹 접근성 검증'],
        ['DOM 관리'],
        ['숨겨진 영역에서 생성'],
        ['에디터 서명 삽입'],
        ['해상도별 보기 페이지']
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