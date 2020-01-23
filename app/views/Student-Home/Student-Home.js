const frameModule = require('tns-core-modules/ui/frame');
const dialogs = require('tns-core-modules/ui/dialogs');
const httpModule = require("tns-core-modules/http");
const { fromObject } = require('tns-core-modules/data/observable');
const applicationSettings = require("tns-core-modules/application-settings");
const ObservableArray = require("tns-core-modules/data/observable-array").ObservableArray;

var calendarObsArray = new ObservableArray();
var AfterDeleteLecture = new ObservableArray();
const obj = fromObject({
    firstname: '',
    teacherName: '',
    title: '',
    start: '',
    phone: '',
    calendarObsArray: [],
    AfterDeleteLecture: [],

});

exports.loaded = function(args) {
    const page = args.object;
    page.bindingContext = obj;
    console.log("Student home Page Loaded");

    let student = JSON.parse(applicationSettings.getString('user'));
    obj.firstname = student.firstname
    let studentID = student._id

    let today = new Date()
    let dayNew = today.getMonth() + 1 + '/' + today.getDate() + '/' + today.getFullYear()
    console.log("today:", today.getTime())

    httpModule.getJSON("https://final-project-lessons.herokuapp.com/lecture/student/" + studentID)
        .then((result) => {
            //console.log(result.data[4].date);
            let resFullDate = new Date(result.data[4].date)
            console.log(resFullDate.getTime())
                // if (today.getTime() > resFullDate.getTime())
                //     alert(result.data[4].date)
                //let dateRes = (resFullDate).getMonth() + 1 + '/' + (resFullDate).getDate() + '/' + (resFullDate).getFullYear()
                //console.log("dateRes:", typeof dateRes)
                // console.log("today:", dayNew)

            for (var i = 0; i < result.data.length; i++) {
                //if (today.getTime() > resFullDate.getTime()) {
                //obj.calendarObsArray.push(result.data[i]);
                obj.calendarObsArray = result.data;
                obj.teacherName = calendarObsArray[i].teacherName;
                obj.title = calendarObsArray[i].title;
                obj.phone = calendarObsArray[i].teacherPhone;
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
            obj.AfterDeleteLecture = obj.calendarObsArray
            httpModule.request({
                url: "https://final-project-lessons.herokuapp.com/lecture/" + obj.AfterDeleteLecture[index]._id,
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                content: JSON.stringify({

                })
            }).then((response) => {
                const result = response.content.toJSON();
                obj.AfterDeleteLecture = result.data;
                obj.calendarObsArray = obj.AfterDeleteLecture
            }, (e) => {});
        }
    });
}

exports.GoToViewList = function(args) {
    var topmost = frameModule.topmost();
    topmost.navigate("views/View-List/View-List");
}

exports.onHomeTap = function(args) {
    var topmost = frameModule.topmost();
    topmost.navigate("views/login/login");
}

exports.onProfile = function(args) {
    var topmost = frameModule.topmost();
    topmost.navigate("views/student-profile/student-profile");
}