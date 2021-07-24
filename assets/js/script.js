var currDay = moment();
var startTime = "9:00 AM";    //0900 hours or 9AM
var endTime = "5:00 PM";     //1800 hours or 5PM
var timeRange = 0;
var schedule = [];
var scheduleEl = $('#schedule');
var oneHour = 1000 * 60 * 60;
var timeout = 0;

// Output today's day and date to header
function outputToday() {
    var currDayEl = $("#currentDay");
    currDayEl.text("Today is " + currDay.format('dddd') + ", " + currDay.format("MMMM Do") + ", " + currDay.format("YYYY"));
}

// Output Schedule to page
function outputSchedule() {
    loadSchedule();     // Check if a schedule already exists
    var currHour = parseInt(currDay.format("H"), 10);
    var timeRel = "";
    var textDisabled = " disabled ";

    // Build Scheduler for the day.
    for(var i = 0; i < schedule.length; i++) {
        var tempTime = moment(startTime, "hh:mm A");
        var tempHour = parseInt(tempTime.add(i, 'hours').format("H"), 10);

        if(tempHour < currHour)             // Compares hourly schedule with current time
            timeRel = "past";
        else if(tempHour === currHour) {
            timeRel = "present";
            textDisabled = " ";
        } else
            timeRel = "future";
        
        // Build row elements
        var rowEl = $("<div class='row time-block " + timeRel + "'>");
        var timeEl = $("<div class='col-lg-1 col-2 hour'>")
        timeEl.html("<b>" + schedule[i].time + "</b>");
        timeEl.appendTo(rowEl);
        
        var taskEl = $("<textarea" + textDisabled + "id='task' class='col-lg-10 col-8 task description'>");
        taskEl.text(schedule[i].task);
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

    return Math.abs(start.diff(end, 'hours'));      // Return time difference between start and end times.
}

function saveSchedule() {
    localStorage.setItem('schedule', JSON.stringify(schedule));     // Save schedule array to localStorage
}

function loadSchedule() {
    timeRange = timeDiff(startTime, endTime);           // Get business hours
    schedule = localStorage.getItem('schedule');        // Get data from localStorage
    
    if(schedule) {                          // Check if data is present
        schedule = JSON.parse(schedule);
    } else {                                // Data is not present, build an empty schedule
        schedule = [];
        for(var i = 0; i <= timeRange; i++) {
            var tempTime = moment(startTime, "hh:mm A");
            tempTime.add(i, 'hours').format("H");
            var tempTaskObj = { time: tempTime.format("hh:mm A"), task: "" };
            schedule.push(tempTaskObj);
        }
    }
}

function timeToNextHour() {
    var tempTime = currDay.clone();
    tempTime.add(1, 'hours').startOf('hour');
    timeout = tempTime.diff(currDay) % oneHour;   // Set timeout to milliseconds to the next hour
}

function clearPage() {
    scheduleEl.html("");
}

function renderPage() {
    clearPage();
    timeToNextHour();
    outputToday();
    outputSchedule();

    $('.saveBtn').click(function() {
        var tempTime = $(this).siblings()[0].innerText;
        var tempTask = $(this).siblings()[1].value;
        var tempIndex = schedule.findIndex(find => tempTime === find.time);
    
        schedule[tempIndex].task = tempTask;
    
        saveSchedule();
    });

    setTimeout(renderPage, timeout);     // Update the schedule on the hour.
};

$(document).ready(function() {      // Do this stuff when document has finished loading
    renderPage();
});
