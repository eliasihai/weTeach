var frameModule = require('tns-core-modules/ui/frame');
var dialogs = require('tns-core-modules/ui/dialogs');
const httpModule = require("tns-core-modules/http");
const { fromObject } = require('tns-core-modules/data/observable');
const applicationSettings = require("tns-core-modules/application-settings");
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;

var calendarObsArray = new ObservableArray();
var AfterDeleteLecture = new ObservableArray();

const obj = fromObject({
    user: JSON.parse(applicationSettings.getString('user')),
    studentName: '',
    firstNameTitle: '',
    title: '',
    start: '',
    studentPhone: '',
    calendarObsArray: [],
    AfterDeleteLecture: [],

});

exports.loaded = function(args) {
    const page = args.object;
    page.bindingContext = obj;
    console.log("Teacher Page Loaded");
    obj.firstNameTitle = obj.user.firstname


    let teacher = JSON.parse(applicationSettings.getString('user'));
    console.log("teacher id:", teacher._id)
    let teacherID = teacher._id

    httpModule.getJSON("https://final-project-lessons.herokuapp.com/lecture/teacher/" + teacherID)
        .then((result) => {
            console.log(result.data)
            for (var i = 0; i < result.data.length; i++) {
                obj.calendarObsArray = result.data;
                obj.studentName = calendarObsArray[i].studentName;
                obj.studentPhone = calendarObsArray[i].studentPhone;
                obj.start = calendarObsArray[i].start;

            }
        }, (e) => {
            console.error(Error);
        });
};

exports.onItemTap = function(args) {
    const index = args.index;
    dialogs.action({
        message: "Are you want to delete this lecture?",
        cancelButtonText: "Cancel",
        actions: ["Yes"]
    }).then(function(result) {
        console.log("Dialog result: " + result);
        if (result == "Yes") {
            console.log("index: ", index)
            console.log("dsadsa", obj.calendarObsArray[index]._id)

            httpModule.request({
                url: "https://final-project-lessons.herokuapp.com/lecture/" + obj.calendarObsArray[index]._id,
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify({

                })
            }).then((response) => {
                const result = response.content.toJSON();
                obj.calendarObsArray = result.data;
            }, (e) => {});
        }
    });
}

exports.calTap = function(args) {
    const button = args.object;
    const page = button.page;
    const frame = page.frame;
    frame.navigate('views/calendar/calendar')
}