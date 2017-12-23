/*

  tableCalendar : Class.



*/

var tableCalendar = function (){

    this.targetDate; // 기준점으로 넘어올 날짜
    this.year; // 연도
    this.month; // 월
    this.weekCnt; // 해당 연-월의 주차 수

    this.calLang; // 캘린더 header 표시 언어

    this.basicTemplate; // 날짜 항목 마다 기본적으로 표시될 템플릿
    this.firstDate; // 기준점 연-월의 첫 일
    this.lastDate; // 기준점 연-월의 마지막 일
    this.toDate; // 현재날짜
    this.thisDateCheck; // 현재날짜에 해당하는 연-월인지 확인값

    var tableCalendar = this; // class내에서 사용될 this 객체

    // init: 값 초기화
    this.init = function(date){

        this.setToDate();
        this.toDate = this.getToDate();
        this.targetDate = new Date(date);

        this.year = Number(this.targetDate.getFullYear());
        this.month = Number(this.targetDate.getMonth());

        this.setFirstDate();

        this.setLastDate();

        this.firstDate = this.getFirstDate();

        this.lastDate = this.getLastDate();
        // this.setTargetDate(); // setTargetDate: 기준점 날짜 설정
        this.weekCnt = countOfWeek();
        this.calLang = "ko";
        this.basicTemplate = "";

        this.thisDateCheck = this.checkThisDate();

    }

    // countOfWeek: 해당 월의 주 개수
    function countOfWeek(){

        // var firstDate = this.getFirstDate();
        // var lastDate = this.getLastDate();
        var lastDate = tableCalendar.lastDate.getDate();
        var monthSWeek = tableCalendar.firstDate.getDay();
        var weekCnt = parseInt( (parseInt(lastDate) + monthSWeek - 1) / 7 ) + 1;

        return weekCnt;

    }

    // renderCalendar: 달력 만들기
    this.renderCalendar = function (targetTag){

        var calendarTemplate = "";

        calendarTemplate += "<!-- calendar Table : start -->";
        calendarTemplate += "<table class=\"table table-bordered table-calender\">";
        calendarTemplate += this.headTemplate();
        calendarTemplate += this.weekTemplate();
        calendarTemplate += "</table>";
        calendarTemplate += "<!-- calendar Table : end -->";

        document.querySelector(targetTag).innerHTML = calendarTemplate;

    }

    // headTemplate: 달력의 header
    this.headTemplate = function (){

        if(this.calLang == "ko"){
            var dayArray = ["일", "월", "화", "수", "목", "금", "토"];
        }
        else{
            var dayArray = ["Sun", "Mon", "Tue", "Wen", "Thu", "Fri", "Sat"];
        }

        var headTemplate = "";
        headTemplate += "<!-- calendar Table headTemplate : start -->";
        headTemplate += "<thead>";
        headTemplate += "<tr>";

        for(var i=0; i<7; i++){

            headTemplate += "<th width=\"121\">";
            headTemplate += dayArray[i];
            headTemplate += "</th>";

        }

        headTemplate += "</tr>";
        headTemplate += "</thead>";
        headTemplate += "<!-- calendar Table headTemplate : end -->";
        headTemplate += "";

        return headTemplate;

    }

    // weekTemplate: 해당 주차 템플릿(tr)
    this.weekTemplate = function (){

        var templateCnt = this.weekCnt;

        var weekTemplate = "";
        weekTemplate += "<!-- calendar Table weekTemplate : start -->";
        weekTemplate += "<tbody>";

        var dayObj = {};

        for(var i=0; i<templateCnt; i++){

            var sDay = 1;

            if(i > 0){
                sDay = dayObj.end.date + 1;
            }

            dayObj = this.weekStartEnd(sDay);

            weekTemplate += "<tr class=\"c-week-template c-week-" + parseInt(i+1) + "\">";
            weekTemplate += this.dayTemplate(dayObj);
            weekTemplate += "</tr>";

        }

        weekTemplate += "</tbody>";
        weekTemplate += "<!-- calendar Table weekTemplate : end -->";
        weekTemplate += "";

        return weekTemplate;

    }

    // dayTemplate: 일별 템플릿(td)
    this.dayTemplate = function (dayObj){

        var dayTemplate = "";
        dayTemplate += "<!-- calendar Table dayTemplate : start -->";

        var sDay = dayObj.start.date; // 해당 주의 시작날짜.
        var sDayWeek = dayObj.start.day; // 해당 주의 시작요일
        var eDay = dayObj.end.date; // 해당 주의 종료날짜
        var eDayWeek = dayObj.end.day; // 해당 주의 종료 요일
        var templateDay =  parseInt(sDay); // <td>에 박힐 날짜

        for(var i=0; i<7; i++){

            var weekDayClass = "c-weekday-" + i;
            var dateClass = "c-date-" + templateDay;

            // 요일에 들어갈 날짜가 없을 때
            if(i < sDayWeek){
                dayTemplate += "<td class=\"" + weekDayClass + "\"></td>";
                continue;
            }

            if(i > eDayWeek){
                dayTemplate += "<td class=\"" + weekDayClass + "\"></td>";
                continue;
            }

            var dayTempateClass = weekDayClass + " " + dateClass;
            dayTemplate += "<td data-date=\"\" class=\"c-day-template " + dayTempateClass + "\">";

            // 오늘 날짜일 경우
            if(this.thisDateCheck == 1 && this.toDate.getDate() == templateDay){
                dayTemplate += "<span class=\"today_num num\">";
            }
            else{
                dayTemplate += "<span class=\"num\">";
            }

            dayTemplate += templateDay;
            dayTemplate += "</span>";
            // dayTemplate += "<div class=\"" + dateClass + "-div\">";
            dayTemplate += this.basicTemplate; // 설정된 기본 템플릿
            // dayTemplate += "</div>";
            dayTemplate += "</td>";

            templateDay ++ ; // 날짜값 증가

        }

        dayTemplate += "<!-- calendar Table dayTemplate : end -->";
        dayTemplate += "";

        return dayTemplate;

    }

    // weekStartEnd: 해당 주의 시작날짜를 기준으로 -: 해당 주의 시작요일-종료요일 찾기
    this.weekStartEnd = function (firstDay){

        var startJudgeDate = new Date(this.year, this.month, firstDay);
        var dayOfWeek = startJudgeDate.getDay();
        var startWeekDay = dayOfWeek;
        var startDate = firstDay;

        // 첫 시작요일이 일요일일 경우 종료
        if(dayOfWeek == 6){
            var endWeekDay = startWeekDay;
            var endDate = startDate;
        }
        else{
            // 현재 기준점 날짜의 마지막일
            var globalLastDay = this.lastDate.getDate();
            var lastDay = 6 - dayOfWeek;
            lastDay = lastDay + firstDay;

            if(lastDay > globalLastDay){
                lastDay = globalLastDay;
            }

            var endJudgeDate = new Date(this.year, this.month, lastDay);
            var dayOfWeek = endJudgeDate.getDay();

            var endWeekDay = dayOfWeek;
            var endDate = lastDay;

        }

        var startDay = {
            "day"  : startWeekDay, // 요일
            "date" : startDate // 날짜
        };

        var endDay = {
            "day"  : endWeekDay, // 요일
            "date" : endDate // 날짜
        };

        var seObj = {
            "start" : startDay, // 시작
            "end"   : endDay // 종료
        };

        return seObj;

    }

    // setBasicTemplate : 요일에 들어갈 기본템플릿 설정
    this.setBasicTemplate = function (basicTemplate){
        this.basicTemplate = basicTemplate;
    }

    // setTargetDate: 기준점 날짜 설정
    this.setTargetDate = function (date){
        this.targetDate = new Date(date);
        this.year = Number(this.targetDate.getFullYear());
        this.month = Number(this.targetDate.getMonth() + 1);
        this.weekCnt = this.countOfWeek();
    }

    // getTargetDate: 현재 기준날짜 return
    this.getTargetDate = function (){
        return this.targetDate;
    }

    // setLang: 기준 언어 설정
    this.setLang = function (lang){
        this.calLang = lang;
    }

    // getLang: 기준 언어 return;
    this.getLang = function (){
        return this.calLang;
    }

    // getYear: 현재 기준 연도 return;
    this.getYear = function (){
        return this.year;
    }

    // getMonth: 현재 기준 월 return; 표시 형식일 경우 +1 해서 사용해야함
    this.getMonth = function (){
        return this.month;
    }

    // getWeekCnt: 현재 연-월의 주차수 return;
    this.getWeekCnt = function (){
        return this.weekCnt;
    }

    // setFirstDate: 현재 연-월의 첫째날 설정
    this.setFirstDate = function (){
        this.firstDate  = new Date(this.year, this.month, 1);
    }

    // getFirstDate: 현재 연-월의 첫째날 return;
    this.getFirstDate = function (){
        return this.firstDate;
    }

    // setLastDate: 현재 연-월의 마지막날 설정
    this.setLastDate = function (){
        this.lastDate = new Date(this.year, (this.month + 1), 0);
    }

    // getLastDate: 현재 연-월의 마지막날 return;
    this.getLastDate = function (){
        return this.lastDate;
    }

    // setToDate: 오늘날짜 설정
    this.setToDate = function (){
        var toDate = new Date();
        this.toDate = toDate;
    }

    // getToDate: 오늘날짜 return;
    this.getToDate = function (){
        return this.toDate;
    }

    // checkThisDate: 현재 설정된 기준날짜가 오늘이 포함된 연-월 인지 확인
    this.checkThisDate = function (){

        var check;

        if(this.getYear() == this.toDate.getFullYear() &&
            this.getMonth() == (this.toDate.getMonth())){
            check = 1;
        }else{
            check = 0;
        }

        return check;

    }

    // getPrevDate: 현재 기준날짜에서 이전달- 첫째일 return;
    this.getPrevDate = function (){

        var thisDate = new Date(this.firstDate);
        var thisMonth = thisDate.getMonth();
        thisDate.setMonth(thisMonth - 1);

        return thisDate;

    }

    // getNextDate: 현재 기준날짜에서 다음달- 첫째일 return;
    this.getNextDate = function (){

        var thisDate = new Date(this.firstDate);
        var thisMonth = thisDate.getMonth();
        thisDate.setMonth(thisMonth + 1);

        return thisDate;

    }

    // movePrevMonth: 기준날짜를 이전달로 변경 - 사용 후 renderCalendar 사용하면됨.
    this.movePrevMonth = function (){
        var prevDate = new Date(this.getPrevDate());
        this.init(prevDate);
    }

    // setThisMonth: 기준날짜를 현재날짜로 설정 - 사용 후 renderCalendar 사용하면됨.
    this.setThisMonth = function (){
        var thisMonth = new Date(this.toDate);
        this.init(thisMonth);
    }

    // moveNextMonth: 기준날짜를 다음달로 변경 - 사용 후 renderCalendar 사용하면됨.
    this.moveNextMonth = function (){
        var nextDate = new Date(this.getNextDate());
        this.init(nextDate);
    }

    // getMoveDate: 넘어온 값으로 달 이동
    this.getMoveDate = function (cnt){

        var thisDate = new Date(this.firstDate);
        var thisMonth = thisDate.getMonth();
        thisDate.setMonth(thisMonth + (cnt));

        return thisDate;

    }

    // moveMonth: 기준날짜를 파라미터값에 따라 변경 - 사용 후 renderCalendar 사용하면됨.
    this.moveMonth = function (cnt){

        cnt = parseInt(cnt);

        if(cnt == 0){
            var moveDate = new Date(this.toDate);
        }
        else{
            var moveDate = new Date(this.getMoveDate(cnt));
        }

        this.init(moveDate);

    }

}
