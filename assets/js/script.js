var currDayEl = $("#currentDay");
var currDay = moment();
var startTime = "9:00 AM";    //0900 hours or 9AM
var endTime = "5:00 PM";     //1800 hours or 5PM
var schedule = [];
var scheduleTask = {
    date: null,
    time: null,
    task: "",
}

function outputToday() {
    currDayEl.text("Today is " + currDay.format('dddd') + ", " + currDay.format("MMMM Do") + ", " + currDay.format("YYYY"));
}

function outputSchedule() {
    var timeRange = timeDiff(startTime, endTime);
    var scheduleEl = $('#schedule');
    var currHour = parseInt(currDay.format("H"), 10);
    var timeRel = "";
    var textDisabled = " disabled ";

    for(var i = 0; i <= timeRange; i++) {
        var tempTime = moment(startTime, "hh:mm A");
        var tempHour = parseInt(tempTime.add(i, 'hours').format("H"), 10);
        if(tempHour < currHour)
            timeRel = "past";
        else if(tempHour === currHour) {
            timeRel = "present";
            textDisabled = " ";
        } else
            timeRel = "future";
        var rowEl = $("<div class='row time-block " + timeRel + "'>");
        var timeEl = $("<div class='col-lg-1 col-2 hour'>")
        timeEl.html("<b>" + tempTime.format('hh:mm A') + "</b>");
        timeEl.appendTo(rowEl);
        
        var taskEl = $("<textarea" + textDisabled + "id='task' class='col-lg-10 col-8 task description'>");
        taskEl.appendTo(rowEl);

        var saveBtn = $("<div class='col-lg-1 col-2 saveBtn'>");
        saveBtn.html("<i class='far fa-save'></i>")
        saveBtn.appendTo(rowEl);
        rowEl.appendTo(scheduleEl);
    }
}

function timeDiff(start, end) {
    start = moment(start, "hh:mm A");
    end = moment(end, "hh:mm A");

    return Math.abs(start.diff(end, 'hours'));
}

outputToday();
outputSchedule();