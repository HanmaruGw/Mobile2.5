function validateEmail(email) {
	var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
	return re.test(email);
}

function formatNumber(value) {
	return value.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

function getAndroidDownloadUrl(){
	return 'https://m.halla.com/download/hanmaru-release.apk';
}

function getIosDownloadUrl(){
	return 'itms-services://?action=download-manifest&url=https://m.halla.com/download/hanmaru.plist';
}


function getVersionHistory(agent){
	var message = '';
	if(agent == 'android'){
		message = '1) 결재문서 첨부파일 누락현상 수정 , 2) 메일리스트 검색조건 누락현상 수정 , 3) G-EAC 배포 사이트 링크 변경'
	}else{
		message = '1) 결재문서 첨부파일 누락현상 수정 , 2) 메일리스트 검색조건 누락현상 수정 , 3) G-EAC 배포 사이트 링크 변경'
	}
	return message;
}