//////////////////////////////////////////////////////////////////////////////////////////////////////

var qs = (function (a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i) {
        var p = a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));

function fn_getHtmlValueEx(editorID) {
    document.getElementById("logBox").value += editorID + ' 작성 내용 : \n';
    document.getElementById("logBox").value += DEXT5.getHtmlValueEx(editorID) + '\n';
}

function fn_setHtmlValueEx(editorID) {
    DEXT5.setHtmlValueEx(document.getElementById("txtTestValue1").value, editorID);
}
function fn_setHtmlValueEx2(editorID) {
    DEXT5.setHtmlValueEx(document.getElementById("txtTestValue").value, editorID);
}

function fn_getBodyValue(editorID) {
    document.getElementById("logBox").value += editorID + ' 작성 내용 : \n';
    document.getElementById("logBox").value += DEXT5.getBodyValue(editorID) + '\n';
}

function fn_setBodyValue(editorID) {
    DEXT5.setBodyValue(document.getElementById("txtTestValue2").value, editorID);
}

// 에디터 내용 작성 유무
function fn_isEmpty(editorID) {
    alert('isEmpty : ' + DEXT5.isEmpty(editorID));
}

// HTML 소스 삽입
function fn_setInsertHtml(editorID) {
    DEXT5.setInsertHTML(document.getElementById("txtTestValue").value, editorID);
}

// CSS 삭제
function fn_removeCss(editorID) {
    var deleteAll = false; // true : 에디터 에서 사용하는 css link까지 모두 삭제
    DEXT5.clearUserCssUrl(deleteAll, editorID);
}

// UI 컨트롤 
function fn_showTopMenu(value, editorID) {
    DEXT5.showTopMenu(value, editorID);
}

function fn_showToolbar(value, editorID) {
    DEXT5.showToolbar(value, editorID);
}

function fn_showStatusbar(value, editorID) {
    DEXT5.showStatusbar(value, editorID);
}
function fn_setNextTabElementId() {
    DEXT5.setNextTabElementId("title");
}

// 서명삽입
function fn_setInsertSignature(editorID) {
    var _htmlValue = '<p>&nbsp;</p>';
    _htmlValue += '<p style="line-height: 1.5;"><b><span style=\'color: rgb(46, 116, 181); font-size: 9pt; font-family: "Calibri","sans-serif";\'>----------------------------------------------------------------------------------------------------------------------------------------------------------------</span></b></p>';
    _htmlValue += '<p style="line-height: 1.5;">&nbsp;<span style="font-size: 9pt;"><img style="width: 163px; height: 26px;" src="../images/signature.png"></span></p>';
    _htmlValue += '<p style="line-height: 1.5;"><span style="font-family: 맑은 고딕;"><span style="color: black; font-size: 11pt;"><b>Mail</b></span><span style="color: black; font-size: 11pt;"> : </span></span><a href="mailto:support@raonwiz.com"><span style="color: blue; font-size: 11pt; font-family: 맑은 고딕;">support@raonwiz.com</span></a></p>';
    _htmlValue += '<p style="line-height: 1.5;"><span style="font-family: 맑은 고딕;"><span style="color: black; font-size: 11pt;"><b>Tel</b></span><span style="color: black; font-size: 11pt;"> : 02-584-3908, <b>Fax</b> : 02-548-1177 </span></span></p>';
    _htmlValue += '<p style="line-height: 1.5;"><span style="font-family: 맑은 고딕;"><span style="color: black; font-size: 11pt;">06627 </span><span style="color: black; font-size: 11pt;">서울특별시 서초구 사임당로 174, 506호(서초동, 강남미래타워)</span></span></p>';
    _htmlValue += '<p style="line-height: 1.5;"><b><span style=\'color: rgb(46, 116, 181); font-size: 9pt; font-family: "Calibri","sans-serif";\'>----------------------------------------------------------------------------------------------------------------------------------------------------------------</span></b></p>';

    var _txtSetHtmlValue = document.getElementById("txtTestValue").value;

    if (_txtSetHtmlValue != '') {
        _htmlValue += '<hr style="height: 1px; width: 600px; text-align: left; background-color: rgb(0, 0, 0);">';
        _htmlValue += '<p><span style=\'font-family: "Tahoma","sans-serif"; font-size: 10pt;\'><b>From:</b></span> <span style="font-family: 굴림;font-size: 10pt;">라온담당자</span><br><span style=\'font-family: "Tahoma","sans-serif"; font-size: 10pt;\'><b>Sent:</b> 2016.01.01 09:00 AM<br><b>To:</b> support@raonwiz.com<br><b>Subject:</b> Subject</span></span></p>';
        _htmlValue += '<p><br></p>';
    }

    // setAPI 호출 하긴 전에 AddHtmlToSetValue를 호출하면 본문내용 앞/뒤에 원하는 html을 삽입하실 수 있습니다.
    // 두번째 파라미터 값이 0이면 앞에, 1이면 뒤에 적용됩니다.
    DEXT5.AddHtmlToSetValue(_htmlValue, 0, editorID);

    DEXT5.setBodyValue(_txtSetHtmlValue, editorID);
}