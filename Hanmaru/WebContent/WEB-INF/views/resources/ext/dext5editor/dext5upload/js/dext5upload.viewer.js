var dext5uploadBrowser=function(){var b=navigator.userAgent.toLowerCase(),a=window.opera,a={ie:-1<b.search("trident")||-1<b.search("msie")||-1<b.search("edge/12")?!0:!1,edge:/(edge)\/((\d+)?[\w\.]+)/i.test(b)?!0:!1,opera:!!a&&a.version,webkit:-1<b.indexOf(" applewebkit/"),mac:-1<b.indexOf("macintosh"),quirks:"BackCompat"==document.compatMode,mobile:-1<b.indexOf("mobile"),iOS:/(ipad|iphone|ipod)/.test(b),isCustomDomain:function(a){if(!this.ie)return!1;var b=a.domain;a=DEXT5UPLOAD.util.getDocWindow(a).location.hostname;
return b!=a&&b!="["+a+"]"},isHttps:"https:"==location.protocol,HTML5Supported:!0};a.gecko="Gecko"==navigator.product&&!a.webkit&&!a.opera;a.ie&&(a.gecko=!1);a.webkit&&(-1<b.indexOf("chrome")?(a.chrome=!0,-1<b.indexOf("opr")&&(a.opera=!0,a.chrome=!1)):a.safari=!0);var c;a.ieVersion=0;a.ie&&(c=a.quirks||!document.documentMode?-1<b.indexOf("msie")?parseFloat(b.match(/msie (\d+)/)[1]):-1<b.indexOf("trident")?parseFloat(b.match(/rv:([\d\.]+)/)[1]):-1<b.indexOf("edge/12")||-1<b.indexOf("edge/13")?12:7:
document.documentMode,a.ieVersion=c,a.ie11=11==c,a.ie10=10==c,a.ie9=9==c,a.ie8=8==c,a.ie7=7==c,a.ie6=7>c||a.quirks);a.gecko&&(c=b.match(/rv:([\d\.]+)/))&&(c=c[1].split("."),c=1E4*c[0]+100*(c[1]||0)+1*(c[2]||0));a.webkit&&(c=parseFloat(b.match(/ applewebkit\/(\d+)/)[1]));a.HTML5Supported="File"in window&&"FileReader"in window&&"Blob"in window;a.WorkerSupported="Worker"in window;return a}();
dext5uploadAjax=function(){var b=function(){if(!dext5uploadBrowser.ie||"file:"!=location.protocol){try{return new XMLHttpRequest}catch(a){}try{return new ActiveXObject("Msxml2.XHLHTTP")}catch(b){}try{return new ActiveXObject("Microsoft.XMLHTTP")}catch(c){}}return null},a=function(a){return 4==a.readyState&&(200<=a.status&&300>a.status||304==a.status||0===a.status||1223==a.status)},c=function(b){return a(b)?b.responseText:null},g=function(b){if(a(b)){var h=b.responseXML;return h?h:b.responseText}return null},
d=function(a,h,c){var d=!!h,e=b();if(!e)return null;e.open("GET",a,d);d&&(e.onreadystatechange=function(){4==e.readyState&&(h(c(e)),e=null)});try{e.send(null)}catch(f){return null}setTimeout(function(){d||e.abort()},5E3);return d?"":c(e)},k=function(a,c,d,g){var e=!!d,f=b();if(!f)return null;f.open("POST",a,e);f.setRequestHeader("Content-Type","application/x-www-form-urlencoded;charset=UTF-8");e&&(f.onreadystatechange=function(){4==f.readyState&&(d(g(f)),f=null)});try{f.send(c)}catch(k){return null}setTimeout(function(){e||
f.abort()},5E3);return e?"":g(f)};return{load:function(a,b){return d(a,b,c)},loadXml:function(a,b){return d(a,b,g)},postData:function(a,b,d){return k(a,b,d,c)},postFileData:function(a,b){return postFileData(a,b)},createXMLHttpRequest:function(){return b()}}}();function dext5uploadAjaxText(b,a){dext5uploadAjax.postData(b+"&t="+(new Date).getTime(),"",function(b){a(b)})}
function dext5uploadCheckDownloadComplete(b,a,c,g){var d=c;if(1==a){a=""+("d01"+Dext5Base64._trans_unitAttributeDelimiter+"vdc"+Dext5Base64._trans_unitDelimiter);a+="d29"+Dext5Base64._trans_unitAttributeDelimiter+b+Dext5Base64._trans_unitDelimiter;if(null==g||void 0==g)g="1";b=Dext5Base64.makeEncryptParamFinal(g,a);d+=b.name+"="+b.value+"&t="+(new Date).getTime()}else d+="dext5CMD=vdc&viewerguid="+b+"&t="+(new Date).getTime();var k=1,l=setInterval(function(){k++;var a=dext5uploadAjax.createXMLHttpRequest();
a.open("GET",d,!1);a.onreadystatechange=function(){if(4==a.readyState)if(200==a.status){var b=a.responseText;""!=b&&(0==b.indexOf("ok")?(clearInterval(l),window.close()):20==k&&(clearInterval(l),window.close()))}else if(400<=a.status&&600>a.status||0==a.status)clearInterval(l),window.close()};a.send(null)},3E3)};
