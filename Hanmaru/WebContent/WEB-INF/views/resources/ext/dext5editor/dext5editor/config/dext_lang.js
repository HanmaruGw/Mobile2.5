/*
Copyright (c) 2013, Raonwiz Technology Inc. All rights reserved.
 - 날짜/시간 삽입 config
*/
var DEXT_LANG_CONFIG = {
    /*
    작성예시)
              아래사항은 예약키워드입니다.
              YYYY:년(4자), YY:년(2자), MM:월, DD:일, Month:월명, Day:요일명
              hh:시, mm:분, ss:초, AMPM:오전 또는 오후
    */
dateTime: {
        common_date: ['YYYY-MM-DD', 'YY-MM-DD', 'YYYY/MM/DD', 'YY/MM/DD', 'YYYY.MM.DD', 'YY.MM.DD'],

        common_time: ['hh:mm:ss', 'hh:mm', 'hh:mm:ss AMPM', 'hh:mm AMPM'],

        date_kokr: {
            date: ['YYYY년 MM월 DD일', 'YY년 MM월 DD일', 'YYYY년 MM월 DD일 Day', 'YY년 MM월 DD일 Day'],
            Day: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
            Month: []
        },

        date_jajp: {
            date: ['YYYY年 MM月 DD日', 'YY年 MM月 DD日', 'YYYY年 MM月 DD日 Day', 'YY年 MM月 DD日 Day'],
            Day: ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
            Month: []
        },

        date_zhcn: {
            date: ['YYYY年 MM月 DD日', 'YY年 MM月 DD日', 'YYYY年 MM月 DD日 Day', 'YY年 MM月 DD日 Day'],
            Day: ['星期日', '星期月', '星期火', '星期水', '星期木', '星期金', '星期土'],
            Month: []
        },

        date_zhtw: {
            date: ['YYYY年 MM月 DD日', 'YY年 MM月 DD日', 'YYYY年 MM月 DD日 Day', 'YY年 MM月 DD日 Day'],
            Day: ['星期日', '星期月', '星期火', '星期水', '星期木', '星期金', '星期土'],
            Month: []
        },

        date_enus: {
            date: ['Month DD, YYYY', 'Month DD, YY', 'Day Month DD, YYYY', 'Day Month DD, YY'],
            Day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            Month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        },

        date_vivn: {
            date: ['ngày DD tháng MM năm YYYY', 'ngày DD tháng MM năm YY', 'Day, ngày DD tháng MM năm YYYY', 'Day, ngày DD tháng MM năm YY'],
            Day: ['chủ nhật', 'thứ hai', 'thứ ba', 'thứ tư', 'thứ năm', 'thứ sáu', 'thứ bảy'],
            Month: []
        }
    }
}