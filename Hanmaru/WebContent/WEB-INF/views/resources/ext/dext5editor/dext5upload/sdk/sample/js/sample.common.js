//////////////////////////////////////////////////////////////////////////////////////////////////////
var G_vertical = '\u000B'; // 파일 구분자
var G_formfeed = '\u000C'; // 각 파일당 속성 구분자

//////////////////////////////////////////////////////////////////////////////////////////////////
// DEXT5 Upload API
//////////////////////////////////////////////////////////////////////////////////////////////////

// 전송시작
function fn_transfer(currUploadID) {
    if (currUploadID) {
        DEXT5UPLOAD.Transfer(currUploadID);
    } else {
        DEXT5UPLOAD.Transfer(G_UploadID);
    }
}

// 파일추가 대화창
function fn_openFileDialog(currUploadID) {
    if (currUploadID) {
        DEXT5UPLOAD.OpenFileDialog(currUploadID);
    } else {
        DEXT5UPLOAD.OpenFileDialog(G_UploadID);
    }
}

// 모든 파일삭제
function fn_deleteAllFile(currUploadID) {
    if (currUploadID) {
        DEXT5UPLOAD.DeleteAllFile(currUploadID);
    } else {
        DEXT5UPLOAD.DeleteAllFile(G_UploadID);
    }
}

// 선택한 파일삭제
function fn_deleteSelectedFile(currUploadID) {
    if (currUploadID) {
        DEXT5UPLOAD.DeleteSelectedFile(currUploadID);
    } else {
        DEXT5UPLOAD.DeleteSelectedFile(G_UploadID);
    }
}

// 선택한 파일 다운로드
function fn_downloadFile(currUploadID) {
    if (currUploadID) {
        DEXT5UPLOAD.DownloadFile(currUploadID);
    } else {
        DEXT5UPLOAD.DownloadFile(G_UploadID);
    }
}

// 모든파일 다운로드
function fn_downloadAllFile(currUploadID) {
    if (currUploadID) {
        DEXT5UPLOAD.DownloadAllFile(currUploadID);
    } else {
        DEXT5UPLOAD.DownloadAllFile(G_UploadID);
    }
}

// 전체 파일개수
function fn_getTotalFileCount(currUploadID) {
    if (currUploadID) {
        alert(DEXT5UPLOAD.GetTotalFileCount(currUploadID));
    } else {
        alert(DEXT5UPLOAD.GetTotalFileCount(G_UploadID));
    }
}

// 전체 파일크기(Bytes)
function fn_getTotalFileSize(currUploadID) {
    if (currUploadID) {
        alert(DEXT5UPLOAD.GetTotalFileSize(currUploadID));
    } else {
        alert(DEXT5UPLOAD.GetTotalFileSize(G_UploadID));
    }
}

// 업로드 모드 변경
function fn_setUploadMode(mode, currUploadID) {
    // mode : edit / view / open / download
    if (currUploadID) {
        DEXT5UPLOAD.SetUploadMode(mode, currUploadID);
    } else {
        DEXT5UPLOAD.SetUploadMode(mode, G_UploadID);
    }
}

// 업로드 보이기
function fn_uploadShow(currUploadID) {
    if (currUploadID) {
        DEXT5UPLOAD.Show(currUploadID);
    } else {
        DEXT5UPLOAD.Show(G_UploadID);
    }
}

// 업로드 숨기기
function fn_uploadHidden(currUploadID) {
    if (currUploadID) {
        DEXT5UPLOAD.Hidden(currUploadID);
    } else {
        DEXT5UPLOAD.Hidden(G_UploadID);
    }
}

// 업로드 스킨설정
function fn_setSkinColor(currUploadID) {
    if (currUploadID) {
        DEXT5UPLOAD.SetSkinColor('#ff0000', '#f7f140', '#33e8f5', '#c2ffd0', currUploadID);
    } else {
        DEXT5UPLOAD.SetSkinColor('#ff0000', '#f7f140', '#33e8f5', '#c2ffd0', G_UploadID);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////
// UTIL
//////////////////////////////////////////////////////////////////////////////////////////////////
function fn_RPAD(s, c, n) {
    if (!s || !c || s.length >= n) {
        return s;
    }

    var max = (n - s.length) / c.length;
    for (var i = 0; i < max; i++) {
        s += c;
    }

    return s;
}

// text
function fn_newTextToString(textNew) {
    var str = '-- 업로드 파일 정보 시작 --<br/>';
    str += fn_RPAD('RealFileName', ' ', 20) + ' : {0}<br/>';
    str += fn_RPAD('ServerFileName', ' ', 20) + ' : {1}<br/>';
    str += fn_RPAD('Guid', ' ', 20) + ' : {2}<br/>';
    str += fn_RPAD('Size', ' ', 20) + ' : {3}<br/>';
    str += fn_RPAD('UploadPath', ' ', 20) + ' : {4}<br/>';
    str += fn_RPAD('LogicalPath', ' ', 20) + ' : {5}<br/>';
    str += fn_RPAD('fileExtention', ' ', 20) + ' : {6}<br/>';
    str += fn_RPAD('LocalPath', ' ', 20) + ' : {7}<br/>';
    str += fn_RPAD('Mark', ' ', 20) + ' : {8}<br/>';
    str += fn_RPAD('ResponseCustomValue', ' ', 20) + ' : {9}<br/>';
    str += fn_RPAD('Order', ' ', 20) + ' : {10}<br/>';
    str += '-- 업로드 파일 정보 끝 --<br/>';

    var originalName = '';
    var uploadName = '';
    var guid = '';
    var size = '';
    var uploadPath = '';
    var logicalPath = '';
    var fileExtension = '';
    var localPath = '';
    var mark = '';
    var responseCustomValue = '';
    var order = '';

    var filesArr = textNew.split(G_vertical);
    var filesArrLen = filesArr.length;
    for (var i = 0; i < filesArrLen; i++) {
        var oneFileAttr = filesArr[i].split(G_formfeed);

        originalName += oneFileAttr[0];
        uploadName += oneFileAttr[1];
        guid += oneFileAttr[3];
        size += oneFileAttr[2];
        uploadPath += oneFileAttr[4];
        logicalPath += oneFileAttr[6];
        fileExtension += oneFileAttr[7];
        localPath += oneFileAttr[8];
        mark += oneFileAttr[9];
        responseCustomValue += oneFileAttr[10];
        order += oneFileAttr[11];

        if (i != filesArrLen - 1) {
            originalName += ',';
            uploadName += ',';
            guid += ',';
            size += ',';
            uploadPath += ',';
            logicalPath += ',';
            fileExtension += ',';
            localPath += ',';
            mark += ',';
            responseCustomValue += ',';
            order += ',';
        }
    }

    str = str.replace('{0}', originalName);
    str = str.replace('{1}', uploadName);
    str = str.replace('{2}', guid);
    str = str.replace('{3}', size);
    str = str.replace('{4}', uploadPath);
    str = str.replace('{5}', logicalPath);
    str = str.replace('{6}', fileExtension);
    str = str.replace('{7}', localPath);
    str = str.replace('{8}', mark);
    str = str.replace('{9}', responseCustomValue);
    str = str.replace('{10}', order);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}
function fn_delTextToString(textDel) {
    var str = '-- 삭제된 파일 정보 --<br/>';
    str += fn_RPAD('Key', ' ', 8) + ' : {0}<br/>';
    str += fn_RPAD('FileName', ' ', 8) + ' : {1}<br/>';
    str += fn_RPAD('Size', ' ', 8) + ' : {2}<br/><br/>';

    var sUniqKey = '';
    var sOriginalName = '';
    var sSize = '';

    var filesArr = textDel.split(G_vertical);
    var filesArrLen = filesArr.length;
    for (var i = 0; i < filesArrLen; i++) {
        var oneFileAttr = filesArr[i].split(G_formfeed);

        sUniqKey += oneFileAttr[0];
        sOriginalName += oneFileAttr[1];
        sSize += oneFileAttr[2];

        if (i != filesArrLen - 1) {
            sUniqKey += ',';
            sOriginalName += ',';
            sSize += ',';
        }
    }

    str = str.replace('{0}', sUniqKey);
    str = str.replace('{1}', sOriginalName);
    str = str.replace('{2}', sSize);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}
function fn_delTextToStringForLargeFile(textDel) {
    var str = '-- 삭제된 파일 정보 --<br/>';
    str += fn_RPAD('Key', ' ', 8) + ' : {0}<br/>';
    str += fn_RPAD('FileName', ' ', 8) + ' : {1}<br/>';
    str += fn_RPAD('Size', ' ', 8) + ' : {2}<br/>';
    str += fn_RPAD('LargeFiles', ' ', 8) + ' : {3}<br/><br/>';

    var sUniqKey = '';
    var sOriginalName = '';
    var sSize = '';
    var sLargeFiles = '';

    var filesArr = textDel.split(G_vertical);
    var filesArrLen = filesArr.length;
    for (var i = 0; i < filesArrLen; i++) {
        var oneFileAttr = filesArr[i].split(G_formfeed);

        sUniqKey += oneFileAttr[0];
        sOriginalName += oneFileAttr[1];
        sSize += oneFileAttr[2];
        sLargeFiles += oneFileAttr[3];

        if (i != filesArrLen - 1) {
            sUniqKey += ',';
            sOriginalName += ',';
            sSize += ',';
            sLargeFiles += ',';
        }
    }

    str = str.replace('{0}', sUniqKey);
    str = str.replace('{1}', sOriginalName);
    str = str.replace('{2}', sSize);
    str = str.replace('{3}', sLargeFiles);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}


// json
function fn_newJsonToString(jsonNew) {

    var str = '-- 업로드 파일 정보 시작 --<br/>';
    str += fn_RPAD('RealFileName', ' ', 20) + ' : {0}<br/>';
    str += fn_RPAD('ServerFileName', ' ', 20) + ' : {1}<br/>';
    str += fn_RPAD('Guid', ' ', 20) + ' : {2}<br/>';
    str += fn_RPAD('Size', ' ', 20) + ' : {3}<br/>';
    str += fn_RPAD('UploadPath', ' ', 20) + ' : {4}<br/>';
    str += fn_RPAD('LogicalPath', ' ', 20) + ' : {5}<br/>';
    str += fn_RPAD('fileExtention', ' ', 20) + ' : {6}<br/>';
    str += fn_RPAD('LocalPath', ' ', 20) + ' : {7}<br/>';
    str += fn_RPAD('Mark', ' ', 20) + ' : {8}<br/>';
    str += fn_RPAD('ResponseCustomValue', ' ', 20) + ' : {9}<br/>';
    str += fn_RPAD('Order', ' ', 20) + ' : {10}<br/>';
    str += '-- 업로드 파일 정보 끝 --<br/>';

    var originalName = jsonNew.originalName;
    var uploadName = jsonNew.uploadName;
    var guid = jsonNew.guid;
    var size = jsonNew.size;
    var uploadPath = jsonNew.uploadPath;
    var logicalPath = jsonNew.logicalPath;
    var fileExtension = jsonNew.extension;
    var localPath = jsonNew.localPath;
    var mark = jsonNew.mark;
    var responseCustomValue = jsonNew.responseCustomValue;
    var order = jsonNew.order;

    str = str.replace('{0}', originalName);
    str = str.replace('{1}', uploadName);
    str = str.replace('{2}', guid);
    str = str.replace('{3}', size);
    str = str.replace('{4}', uploadPath);
    str = str.replace('{5}', logicalPath);
    str = str.replace('{6}', fileExtension);
    str = str.replace('{7}', localPath);
    str = str.replace('{8}', mark);
    str = str.replace('{9}', responseCustomValue);
    str = str.replace('{10}', order);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}
function fn_newJsonToStringForLargeFile(jsonNew) {

    var str = '-- 업로드 파일 정보 시작 --<br/>';
    str += fn_RPAD('RealFileName', ' ', 20) + ' : {0}<br/>';
    str += fn_RPAD('ServerFileName', ' ', 20) + ' : {1}<br/>';
    str += fn_RPAD('Guid', ' ', 20) + ' : {2}<br/>';
    str += fn_RPAD('Size', ' ', 20) + ' : {3}<br/>';
    str += fn_RPAD('UploadPath', ' ', 20) + ' : {4}<br/>';
    str += fn_RPAD('LogicalPath', ' ', 20) + ' : {5}<br/>';
    str += fn_RPAD('fileExtention', ' ', 20) + ' : {6}<br/>';
    str += fn_RPAD('LocalPath', ' ', 20) + ' : {7}<br/>';
    str += fn_RPAD('Mark', ' ', 20) + ' : {8}<br/>';
    str += fn_RPAD('ResponseCustomValue', ' ', 20) + ' : {9}<br/>';
    str += fn_RPAD('Order', ' ', 20) + ' : {10}<br/>';
    str += fn_RPAD('LargeFiles', ' ', 20) + ' : {11}<br/>';
    str += '-- 업로드 파일 정보 끝 --<br/>';

    var originalName = jsonNew.originalName;
    var uploadName = jsonNew.uploadName;
    var guid = jsonNew.guid;
    var size = jsonNew.size;
    var uploadPath = jsonNew.uploadPath;
    var logicalPath = jsonNew.logicalPath;
    var fileExtension = jsonNew.extension;
    var localPath = jsonNew.localPath;
    var mark = jsonNew.mark;
    var responseCustomValue = jsonNew.responseCustomValue;
    var order = jsonNew.order;
    var largeFiles = jsonNew.largeFiles;

    str = str.replace('{0}', originalName);
    str = str.replace('{1}', uploadName);
    str = str.replace('{2}', guid);
    str = str.replace('{3}', size);
    str = str.replace('{4}', uploadPath);
    str = str.replace('{5}', logicalPath);
    str = str.replace('{6}', fileExtension);
    str = str.replace('{7}', localPath);
    str = str.replace('{8}', mark);
    str = str.replace('{9}', responseCustomValue);
    str = str.replace('{10}', order);
    str = str.replace('{11}', largeFiles);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}

function fn_newTextToStringForLargeFile(textNew) {
    var str = '-- 업로드 파일 정보 시작 --<br/>';
    str += fn_RPAD('RealFileName', ' ', 20) + ' : {0}<br/>';
    str += fn_RPAD('ServerFileName', ' ', 20) + ' : {1}<br/>';
    str += fn_RPAD('Guid', ' ', 20) + ' : {2}<br/>';
    str += fn_RPAD('Size', ' ', 20) + ' : {3}<br/>';
    str += fn_RPAD('UploadPath', ' ', 20) + ' : {4}<br/>';
    str += fn_RPAD('LogicalPath', ' ', 20) + ' : {5}<br/>';
    str += fn_RPAD('fileExtention', ' ', 20) + ' : {6}<br/>';
    str += fn_RPAD('LocalPath', ' ', 20) + ' : {7}<br/>';
    str += fn_RPAD('Mark', ' ', 20) + ' : {8}<br/>';
    str += fn_RPAD('ResponseCustomValue', ' ', 20) + ' : {9}<br/>';
    str += fn_RPAD('Order', ' ', 20) + ' : {10}<br/>';
    str += fn_RPAD('LargeFiles', ' ', 20) + ' : {11}<br/>';
    str += '-- 업로드 파일 정보 끝 --<br/>';

    var originalName = '';
    var uploadName = '';
    var guid = '';
    var size = '';
    var uploadPath = '';
    var logicalPath = '';
    var fileExtension = '';
    var localPath = '';
    var mark = '';
    var responseCustomValue = '';
    var order = '';
    var largeFiles = '';

    var filesArr = textNew.split(G_vertical);
    var filesArrLen = filesArr.length;
    for (var i = 0; i < filesArrLen; i++) {
        var oneFileAttr = filesArr[i].split(G_formfeed);

        originalName += oneFileAttr[0];
        uploadName += oneFileAttr[1];
        guid += oneFileAttr[3];
        size += oneFileAttr[2];
        uploadPath += oneFileAttr[4];
        logicalPath += oneFileAttr[6];
        fileExtension += oneFileAttr[7];
        localPath += oneFileAttr[8];
        mark += oneFileAttr[9];
        responseCustomValue += oneFileAttr[10];
        order += oneFileAttr[12];
        largeFiles += oneFileAttr[11];

        if (i != filesArrLen - 1) {
            originalName += ',';
            uploadName += ',';
            guid += ',';
            size += ',';
            uploadPath += ',';
            logicalPath += ',';
            fileExtension += ',';
            localPath += ',';
            mark += ',';
            responseCustomValue += ',';
            order += ',';
            largeFiles += ',';
        }
    }

    str = str.replace('{0}', originalName);
    str = str.replace('{1}', uploadName);
    str = str.replace('{2}', guid);
    str = str.replace('{3}', size);
    str = str.replace('{4}', uploadPath);
    str = str.replace('{5}', logicalPath);
    str = str.replace('{6}', fileExtension);
    str = str.replace('{7}', localPath);
    str = str.replace('{8}', mark);
    str = str.replace('{9}', responseCustomValue);
    str = str.replace('{10}', order);
    str = str.replace('{11}', largeFiles);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}

function fn_delJsonToString(jsonDel) {
    var str = '-- 삭제된 파일 정보 --<br/>';
    str += fn_RPAD('Key', ' ', 8) + ' : {0}<br/>';
    str += fn_RPAD('FileName', ' ', 8) + ' : {1}<br/>';
    str += fn_RPAD('Size', ' ', 8) + ' : {2}<br/><br/>';

    var uniqKey = jsonDel.uniqKey;
    var originalName = jsonDel.originalName;
    var size = jsonDel.size;

    var sUniqKey = '';
    var sOriginalName = '';
    var sSize = '';

    for (var i = 0; i < originalName.length; i++) {
        if (i != 0) {
            sUniqKey += ',';
            sOriginalName += ',';
            sSize += ',';
        }

        sUniqKey += uniqKey[i];
        sOriginalName += originalName[i];
        sSize += size[i];
    }

    str = str.replace('{0}', sUniqKey);
    str = str.replace('{1}', sOriginalName);
    str = str.replace('{2}', sSize);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}
function fn_delJsonToStringForLargeFile(jsonDel) {
    var str = '-- 삭제된 파일 정보 --<br/>';
    str += fn_RPAD('Key', ' ', 8) + ' : {0}<br/>';
    str += fn_RPAD('FileName', ' ', 8) + ' : {1}<br/>';
    str += fn_RPAD('Size', ' ', 8) + ' : {2}<br/>';
    str += fn_RPAD('LargeFiles', ' ', 8) + ' : {3}<br/><br/>';

    var uniqKey = jsonDel.uniqKey;
    var originalName = jsonDel.originalName;
    var size = jsonDel.size;
    var largeFiles = jsonDel.largeFiles;

    var sUniqKey = '';
    var sOriginalName = '';
    var sSize = '';
    var sLargeFiles = '';

    for (var i = 0; i < originalName.length; i++) {
        if (i != 0) {
            sUniqKey += ',';
            sOriginalName += ',';
            sSize += ',';
            sLargeFiles += ',';
        }

        sUniqKey += uniqKey[i];
        sOriginalName += originalName[i];
        sSize += size[i];
        sLargeFiles += largeFiles[i];
    }

    str = str.replace('{0}', sUniqKey);
    str = str.replace('{1}', sOriginalName);
    str = str.replace('{2}', sSize);
    str = str.replace('{3}', sLargeFiles);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}

// xml
function fn_newXmlToString(xmlNew) {
    var str = '-- 업로드 파일 정보 시작 --<br/>';
    str += fn_RPAD('RealFileName', ' ', 20) + ' : {0}<br/>';
    str += fn_RPAD('ServerFileName', ' ', 20) + ' : {1}<br/>';
    str += fn_RPAD('Guid', ' ', 20) + ' : {2}<br/>';
    str += fn_RPAD('Size', ' ', 20) + ' : {3}<br/>';
    str += fn_RPAD('UploadPath', ' ', 20) + ' : {4}<br/>';
    str += fn_RPAD('LogicalPath', ' ', 20) + ' : {5}<br/>';
    str += fn_RPAD('fileExtention', ' ', 20) + ' : {6}<br/>';
    str += fn_RPAD('LocalPath', ' ', 20) + ' : {7}<br/>';
    str += fn_RPAD('Mark', ' ', 20) + ' : {8}<br/>';
    str += fn_RPAD('ResponseCustomValue', ' ', 20) + ' : {9}<br/>';
    str += fn_RPAD('Order', ' ', 20) + ' : {10}<br/>';
    str += '-- 업로드 파일 정보 끝 --<br/>';

    var originalName = '';
    var uploadName = '';
    var guid = '';
    var size = '';
    var uploadPath = '';
    var logicalPath = '';
    var fileExtension = '';
    var localPath = '';
    var mark = '';
    var responseCustomValue = '';
    var order = '';

    var files = $(xmlNew).find('file');
    var filesLen = files.length;
    for (var i = 0; i < filesLen; i++) {

        originalName += $(files[i]).find('originalName').text();
        uploadName += $(files[i]).find('uploadName').text();
        guid += $(files[i]).find('guid').text();
        size += $(files[i]).find('size').text();
        uploadPath += $(files[i]).find('uploadPath').text();
        logicalPath += $(files[i]).find('logicalPath').text();
        fileExtension += $(files[i]).find('extension').text();
        localPath += $(files[i]).find('localPath').text();
        mark += $(files[i]).find('mark').text();
        responseCustomValue += $(files[i]).find('responseCustomValue').text();
        order += $(files[i]).find('order').text();

        if (i != filesLen - 1) {
            originalName += ',';
            uploadName += ',';
            guid += ',';
            size += ',';
            uploadPath += ',';
            logicalPath += ',';
            fileExtension += ',';
            localPath += ',';
            mark += ',';
            responseCustomValue += ',';
            order += ',';
        }
    }

    str = str.replace('{0}', originalName);
    str = str.replace('{1}', uploadName);
    str = str.replace('{2}', guid);
    str = str.replace('{3}', size);
    str = str.replace('{4}', uploadPath);
    str = str.replace('{5}', logicalPath);
    str = str.replace('{6}', fileExtension);
    str = str.replace('{7}', localPath);
    str = str.replace('{8}', mark);
    str = str.replace('{9}', responseCustomValue);
    str = str.replace('{10}', order);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}
function fn_newXmlToStringForLargeFile(xmlNew) {
    var str = '-- 업로드 파일 정보 시작 --<br/>';
    str += fn_RPAD('RealFileName', ' ', 20) + ' : {0}<br/>';
    str += fn_RPAD('ServerFileName', ' ', 20) + ' : {1}<br/>';
    str += fn_RPAD('Guid', ' ', 20) + ' : {2}<br/>';
    str += fn_RPAD('Size', ' ', 20) + ' : {3}<br/>';
    str += fn_RPAD('UploadPath', ' ', 20) + ' : {4}<br/>';
    str += fn_RPAD('LogicalPath', ' ', 20) + ' : {5}<br/>';
    str += fn_RPAD('fileExtention', ' ', 20) + ' : {6}<br/>';
    str += fn_RPAD('LocalPath', ' ', 20) + ' : {7}<br/>';
    str += fn_RPAD('Mark', ' ', 20) + ' : {8}<br/>';
    str += fn_RPAD('ResponseCustomValue', ' ', 20) + ' : {9}<br/>';
    str += fn_RPAD('Order', ' ', 20) + ' : {10}<br/>';
    str += fn_RPAD('LargeFiles', ' ', 20) + ' : {11}<br/>';
    str += '-- 업로드 파일 정보 끝 --<br/>';

    var originalName = '';
    var uploadName = '';
    var guid = '';
    var size = '';
    var uploadPath = '';
    var logicalPath = '';
    var fileExtension = '';
    var localPath = '';
    var mark = '';
    var responseCustomValue = '';
    var order = '';
    var largeFiles = '';
    
    var files = $(xmlNew).find('file');
    var filesLen = files.length;
    for (var i = 0; i < filesLen; i++) {

        originalName += $(files[i]).find('originalName').text();
        uploadName += $(files[i]).find('uploadName').text();
        guid += $(files[i]).find('guid').text();
        size += $(files[i]).find('size').text();
        uploadPath += $(files[i]).find('uploadPath').text();
        logicalPath += $(files[i]).find('logicalPath').text();
        fileExtension += $(files[i]).find('extension').text();
        localPath += $(files[i]).find('localPath').text();
        mark += $(files[i]).find('mark').text();
        responseCustomValue += $(files[i]).find('responseCustomValue').text();
        order += $(files[i]).find('order').text();
        largeFiles += $(files[i]).find('largeFiles').text();

        if (i != filesLen - 1) {
            originalName += ',';
            uploadName += ',';
            guid += ',';
            size += ',';
            uploadPath += ',';
            logicalPath += ',';
            fileExtension += ',';
            localPath += ',';
            mark += ',';
            responseCustomValue += ',';
            order += ',';
            largeFiles += ',';
        }
    }

    str = str.replace('{0}', originalName);
    str = str.replace('{1}', uploadName);
    str = str.replace('{2}', guid);
    str = str.replace('{3}', size);
    str = str.replace('{4}', uploadPath);
    str = str.replace('{5}', logicalPath);
    str = str.replace('{6}', fileExtension);
    str = str.replace('{7}', localPath);
    str = str.replace('{8}', mark);
    str = str.replace('{9}', responseCustomValue);
    str = str.replace('{10}', order);
    str = str.replace('{11}', largeFiles);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}
function fn_delXmlToString(xmlDel) {
    var str = '-- 삭제된 파일 정보 --<br/>';
    str += fn_RPAD('Key', ' ', 8) + ' : {0}<br/>';
    str += fn_RPAD('FileName', ' ', 8) + ' : {1}<br/>';
    str += fn_RPAD('Size', ' ', 8) + ' : {2}<br/><br/>';

    var sUniqKey = '';
    var sOriginalName = '';
    var sSize = '';

    var files = $(xmlDel).find('file');
    var filesLen = files.length;
    for (var i = 0; i < filesLen; i++) {

        sUniqKey += $(files[i]).find('uniqKey').text();
        sOriginalName += $(files[i]).find('originalName').text();
        sSize += $(files[i]).find('size').text();

        if (i != filesLen - 1) {
            sUniqKey += ',';
            sOriginalName += ',';
            sSize += ',';
        }
    }

    str = str.replace('{0}', sUniqKey);
    str = str.replace('{1}', sOriginalName);
    str = str.replace('{2}', sSize);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}
function fn_delXmlToStringForLargeFile(xmlDel) {
    var str = '-- 삭제된 파일 정보 --<br/>';
    str += fn_RPAD('Key', ' ', 8) + ' : {0}<br/>';
    str += fn_RPAD('FileName', ' ', 8) + ' : {1}<br/>';
    str += fn_RPAD('Size', ' ', 8) + ' : {2}<br/>';
    str += fn_RPAD('LargeFiles', ' ', 8) + ' : {3}<br/><br/>';

    var sUniqKey = '';
    var sOriginalName = '';
    var sSize = '';
    var sLargeFiles = '';

    var files = $(xmlDel).find('file');
    var filesLen = files.length;
    for (var i = 0; i < filesLen; i++) {

        sUniqKey += $(files[i]).find('uniqKey').text();
        sOriginalName += $(files[i]).find('originalName').text();
        sSize += $(files[i]).find('size').text();
        sLargeFiles += $(files[i]).find('largeFiles').text();

        if (i != filesLen - 1) {
            sUniqKey += ',';
            sOriginalName += ',';
            sSize += ',';
            sLargeFiles += ',';
        }
    }

    str = str.replace('{0}', sUniqKey);
    str = str.replace('{1}', sOriginalName);
    str = str.replace('{2}', sSize);
    str = str.replace('{3}', sLargeFiles);

    var logBox = document.getElementById("logBox");

    logBox.innerHTML += str;
}