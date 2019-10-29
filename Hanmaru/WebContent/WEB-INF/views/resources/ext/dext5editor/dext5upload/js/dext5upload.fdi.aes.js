/*
 Copyright (c) 2015, Raonwiz Technology Inc. All rights reserved.
 https://code.google.com/p/crypto-js/
 hmac-sha256 
*/
var G_hmac=null;function arrayBufferToWordArray(a){a=new Uint8Array(a);for(var b=[],c=0;c<a.length;c+=4)b.push(a[c]<<24|a[c+1]<<16|a[c+2]<<8|a[c+3]);return CryptoJS.lib.WordArray.create(b,a.length)}function D5FileDataIntegrity(a,b,c){var d="";null==G_hmac&&(G_hmac=CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256,b));a=arrayBufferToWordArray(a);G_hmac.update(a);c&&(d=G_hmac.finalize(),G_hmac=null);return d}
function D5FileDataEncryption(a,b,c){b=(b+"0000000000000000").substr(0,16);b=CryptoJS.enc.Utf8.parse(b);b=CryptoJS.algo.AES.createEncryptor(b,{iv:b});c=[];a=arrayBufferToWordArray(a);c.push(b.process(a));c.push(b.finalize());return c}
function FileReadBySliceForIntegrity(a,b){var c=a.size,d=0,f=function(a,b,c){var d=new FileReader;a=c.slice(a,b+a);d.onload=e;d.readAsArrayBuffer(a)},e=function(e){null==e.target.error?(d+=e.target.result.byteLength,b(e.target.result,d,c),d>=c||setTimeout(f.bind(null,d,1048576,a),10)):b(null,d,0)};f(d,1048576,a)}
function convertWordArrayToUint8Array(a){var b=a.words.length,c=new Uint8Array(b<<2),d=0,f,e;for(e=0;e<b;e++)f=a.words[e],c[d++]=f>>24,c[d++]=f>>16&255,c[d++]=f>>8&255,c[d++]=f&255;return c}function convertUint8ArrayToWordArray(a){for(var b=[],c=0,d=a.length;c<d;)b.push(a[c++]<<24|a[c++]<<16|a[c++]<<8|a[c++]);return{sigBytes:4*b.length,words:b}}function convertUint8ArrayToBinaryString(a){var b,c=a.length,d="";for(b=0;b<c;b++)d+=String.fromCharCode(a[b]);return d}
function convertBinaryStringToUint8Array(a){var b,c=a.length,d=new Uint8Array(c);for(b=0;b<c;b++)d[b]=a.charCodeAt(b);return d};
