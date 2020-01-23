var observableModule = require("tns-core-modules/data/observable");
const Observable = require("tns-core-modules/data/observable").Observable;
const isAndroid = require("tns-core-modules/platform").isAndroid;
const TimePicker = require("tns-core-modules/ui/time-picker");
const applicationSettings = require("tns-core-modules/application-settings");
const httpModule = require("tns-core-modules/http");
const frameModule = require('tns-core-modules/ui/frame');
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;
const ListPicker = require("tns-core-modules/ui/list-picker").ListPicker;

var listPickerPhones = new ListPicker();

function EventViewModel() {
    var viewModel = observableModule.fromObject({
        user: JSON.parse(applicationSettings.getString('user')),
        teacher: JSON.parse(applicationSettings.getString('teacher')),
        calanderEvents: JSON.parse(applicationSettings.getString('lecture')),
        day: '',
        month: '',
        year: '',
        startHour: '',
        endHour: '',
        Date: '',
        teacherName: '',
        studentName: '',
        teacherPhone: '',
        studentPhone: '',
        phone: '',
        listPickerPhones: [],
        index: 2,
        selectedItem: ""
    });
    return viewModel;
}

const eventCtrl = new EventViewModel();

exports.onAdd = function() {
    console.log("Start Hour selected", eventCtrl.startHour)
    console.log("End Hour selected", eventCtrl.endHour)
    console.log('User is: ', eventCtrl.user.firstname)
    console.log("Date:", eventCtrl.Date)
    httpModule.request({
        url: "https://final-project-lessons.herokuapp.com/lecture/Insert",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({
            teacherID: eventCtrl.teacher._id,
            studentID: eventCtrl.user._id,
            teacherName: eventCtrl.teacher.firstname + ' ' + eventCtrl.teacher.lastname,
            studentName: eventCtrl.user.firstname + ' ' + eventCtrl.user.lastname,
            teacherPhone: eventCtrl.teacher.phone,
            studentPhone: eventCtrl.user.phone,
            date: eventCtrl.Date,
            start: eventCtrl.startHour,
            end: eventCtrl.endHour,
            title: eventCtrl.teacher.subject,
        })
    }).then((response) => {
        const result = response.content.toJSON();
        console.log(result)

        if (result.status === 'ok') {
            alert('Lesson has been added')
        }
        var topmost = frameModule.topmost();
        topmost.navigate("views/Student-Home/Student-Home");
    }, (err) => {
        console.log("err post=", err);
    })
}

exports.pageLoaded = function(args) {
    const page = args.object;
    page.bindingContext = eventCtrl;
    var gotData = page.navigationContext;
    const container = page.getViewById("container");
    console.log("Add event by teacher page");
    const d = new Date(gotData.date);
    eventCtrl.day = d.getDate();
    eventCtrl.month = d.getMonth() + 1;
    eventCtrl.year = d.getFullYear();
    eventCtrl.Date = d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear();
    console.log("eventCtrl.Date:", eventCtrl.Date);

    for (let i = 0; i < eventCtrl.calanderEvents.length; i++) {
        console.log("eventCtrl.calanderEvents[i].studentPhone: ", eventCtrl.calanderEvents[i].studentPhone)
        eventCtrl.listPickerPhones.push(eventCtrl.calanderEvents[i].studentPhone)
            //eventCtrl.items = ["Batman", "Joker", "Bane", eventCtrl.calanderEvents[i].teacherName]
    }

    const listPicker = new ListPicker();
    listPicker.items = [
        "dasdasdsads",
        "NativeScript Core - TypeScript",
        "NativeScript Angular",
        "NativeScript Vue",
        "NativeScript Code Sharing",
        "NativeScript Sidekick"
    ];
    listPicker.selectedIndex = 0;

    container.addChild(listPicker);
}

function onListPickerLoaded(args) {
    const listPicker = args.object;
    listPicker.on("selectedIndexChange", (lpargs) => {
        const picker = lpargs.object;
        console.log(`ListPicker selected value: ${picker.selectedValue} ListPicker selected index: ${picker.selectedIndex}`);
    });
}
exports.onListPickerLoaded = onListPickerLoaded;

exports.onTapPhone = function(args) {

}

exports.onPickerLoadedStart = function(eventData) {
    const timePicker = eventData.object;
    console.log("Start :", timePicker);
    timePicker.android.setIs24HourView(java.lang.Boolean.TRUE);
    timePicker.hour = 00;
    timePicker.minute = 00;

    timePicker.on("timeChange", (args) => {
        // args is of type PropertyChangeData
        console.log("Start TIME picked: ", timePicker.hour, "Minutes: ", timePicker.minute);
        eventCtrl.startHour = timePicker.hour;
        eventCtrl.minute = timePicker.minute;
    })
}

exports.onPickerLoadedEnd = function(eventData) {
    const timePicker = eventData.object;
    console.log("End :", timePicker);
    timePicker.android.setIs24HourView(java.lang.Boolean.TRUE);
    timePicker.hour = 00;
    timePicker.minute = 00;

    timePicker.on("timeChange", (args) => {
        // args is of type PropertyChangeData
        console.log("End TIME picked: ", timePicker.hour, timePicker.minute);
        eventCtrl.endHour = timePicker.hour;
        eventCtrl.minute = timePicker.minute;
    })
}