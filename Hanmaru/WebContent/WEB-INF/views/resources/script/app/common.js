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
		message = '' 
	}else{
		message = '1) 통화중 앱 크래시 현상 Fixed.'
	}
	return message;
}