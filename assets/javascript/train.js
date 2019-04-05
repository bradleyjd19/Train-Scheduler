// Hold all script until page loads
$(document).ready(function() {

// Initialize Firebase
var config = {
  apiKey: "AIzaSyCottS3OMlDc23Pfaq3gF9CF-KP0qIWWCQ",
  authDomain: "train-scheduler-77597.firebaseapp.com",
  databaseURL: "https://train-scheduler-77597.firebaseio.com",
  projectId: "train-scheduler-77597",
  storageBucket: "train-scheduler-77597.appspot.com",
  messagingSenderId: "131494731696"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#submit-button").on("click", function(event) {
  event.preventDefault();

  var train = $("#train-name").val().trim();
  var dest = $("#destination").val().trim();
  var start = $("#start-time").val().trim();
  var freq = $("#frequency").val().trim();

  database.ref().push({
    train: train,
    dest: dest,
    start: start,
    freq: freq
  })

  $("#train-name").val("");
  $("#destination").val("");
  $("#start-time").val("");
  $("#frequency").val("");

  var trainSound = document.getElementById("train-sound");
  trainSound.play()
  trainSound.volume = 0.1;  
});

database.ref().limitToLast(10).on("child_added", function(childSnapshot) {
  var newRow = $("<tr>");
  var newTrain = $("<td>");
  var newDest = $("<td>");
  var newFreq = $("<td>");
  var newArrival = $("<td>");
  var newAway = $("<td>");

  var parseStart = childSnapshot.val().start;
  var trainStart = moment(parseStart, "HH:mm:").subtract(1, "years");
  var trainFreq = childSnapshot.val().freq;
  
  var diffTime = moment().diff(moment(trainStart), "minutes");
  var timeRemainder = diffTime % trainFreq;
  var minutesTrain = trainFreq - timeRemainder;
  var nextTrain = moment().add(minutesTrain, "minutes");
  var nextTrainFormatted = moment(nextTrain).format("hh:mm A");

  newTrain.text(childSnapshot.val().train);
  newDest.text(childSnapshot.val().dest);
  newFreq
    .text(childSnapshot.val().freq)
    .attr("id", "center-cell");
  newAway
    .text(nextTrainFormatted)
    .attr("id", "center-cell");
  newArrival
    .text(minutesTrain)
    .attr("id", "center-cell");

  newRow
    .append(newTrain)
    .append(newDest)
    .append(newFreq)
    .append(newAway)    
    .append(newArrival);

  $("#table-data").append(newRow);
})


});

