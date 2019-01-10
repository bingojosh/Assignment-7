$(document).ready(function(){

    var config = {
        apiKey: "AIzaSyDJdG7vO1Kvvc0zIT8AgZ5bPMXdm1UGcYU",
        authDomain: "assignment-7-1ea9e.firebaseapp.com",
        databaseURL: "https://assignment-7-1ea9e.firebaseio.com",
        projectId: "assignment-7-1ea9e",
        storageBucket: "assignment-7-1ea9e.appspot.com",
        messagingSenderId: "39301850121"
    };
    firebase.initializeApp(config);

    var database = firebase.database();

    $("#submit").on("click", function(event){
        event.preventDefault();

        var name = $("#trainName").val().trim()
        var destination = $("#destination").val().trim()
        var departure = $("#departure").val().trim()
        var frequency = $("#frequency").val().trim()

        database.ref("/trainData").push({
            name : name,
            destination : destination,
            departure : departure,
            frequency : frequency
        });

        $("form").trigger("reset");
    })

    database.ref("/trainData").on("child_added", function(snapshot){
        var name = snapshot.val().name
        var destination = snapshot.val().destination
        var departure = snapshot.val().departure
        var frequency = snapshot.val().frequency
        tablePrint(name, destination, departure, frequency)
    }, function(errorObject){
        console.log("There was an error " + errorObject)
    })

    setInterval(() => {
        $("#tbody").html("");
        database.ref("/trainData").on("value",(snapshot) => {
            database.ref("/trainData").on("child_added", function(snapshot){
                var name = snapshot.val().name
                var destination = snapshot.val().destination
                var departure = snapshot.val().departure
                var frequency = snapshot.val().frequency
                tablePrint(name, destination, departure, frequency)
            }, function(errorObject){
                console.log("There was an error " + errorObject)
            })
        })
    }, 60000)

})

function tablePrint(name, destination, departure, frequency){
    var departureConverted = moment(departure, "HH:mm").subtract(1, "years");
        diffTime = moment().diff(moment(departureConverted), "minutes");
        nextTrain = frequency - (diffTime % frequency);
        nextTrainTime = moment(moment().add(nextTrain, "minutes")).format("hh:mm");
        markup = `<tr><td>${name}</td><td>${destination}</td><td>${frequency}</td><td>${nextTrainTime}</td><td>${nextTrain}</td></tr>`
    $("#tbody").append(markup)
}