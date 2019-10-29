$(function(){
	var android_domain = 'https://dev1.exs-mobile.com:38080/download';
	var ios_domain = 'https:///www.exs-mobile.com/wp-content/uploads/app';
	
	$('.btn_download.android').click(function(){
		$(location).attr('href', android_domain+'/hdbsncM-android.apk');
	});
	
	$('.btn_download.ios').click(function(){
		$(location).attr('href', 'itms-services://?action=download-manifest&url='+ios_domain+'/hdbsncM.plist');
	});
});

//$(function(){
// var android_domain = 'https://hanmaru.exs-mobile.com:38080/download';
//// var ios_domain = 'https://hanmaru.exs-mobile.com:38080/download';
// var ios_domain = 'https://www.exs-mobile.com/wp-content/uploads/app'
//  
// $('.btn_download.android').click(function(){
//	 $(location).attr('href', android_domain+'/hdbsncM-android.apk');
// });
// 
// $('.btn_download.ios').click(function(){
//	 $(location).attr('href', 'itms-services://?action=download-manifest&url='+ios_domain+'/hdbsncM.plist');
// });
//});