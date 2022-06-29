import document from "document";
import { geolocation } from "geolocation";
import * as exercising from ".././views/exercising";
import {Workout, WorkoutType} from "./lib/workout";
import {Interval, IntervalType} from "./lib/interval";

let thisWorkout;

let intervals;

/**
 * Single view menu entry
 */

export function update() {
  document.getElementById("startWorkoutBtn").addEventListener("click", (evt) => {
    console.log("Touched startBtn");
    geolocation.getCurrentPosition(locationSuccess, locationError, {
      timeout: 60 * 1000
    });
  });
  document.getElementById("currentWorkout").text = thisWorkout.name;
  
  if (thisWorkout.workoutType) {
    document.getElementById("category").text = "Running";
    document.getElementById("runningImg").style.display = "inline";
    document.getElementById("cyclingImg").style.display = "none";
  }
  else {
    document.getElementById("category").text = "Cycling";
    document.getElementById("cyclingImg").style.display = "inline";
    document.getElementById("runningImg").style.display = "none";
  }
  
  let intervalList = document.getElementById("intervalList");
  
  let index = 0;
  while (index < intervals.length) {
    let interval = intervalList.getElementById("interval" + index.toString());
    interval.text = intervals[index].value.toString() + " " + intervals[index].unit;  
    index++;
  }
  while (index < intervalList.length-1) {
    let interval = intervalList.getElementById("interval" + index.toString());
    interval.style.display = "none";
    index++;
  }
}

function locationSuccess(position) {
  console.log(
    "Latitude: " + position.coords.latitude,
    "Longitude: " + position.coords.longitude
  );
 
  // start exercise
  exercising.init(intervals).then(exercising.update).catch((err) => {
    console.error(`Error loading view: ${err.message}`);
  });
}

function locationError(error) {
  // Could not connect to gps, try moving to a different location.
  console.log("Error: " + error.code, "Message: " + error.message);
}

export function init(workout) {
  thisWorkout = workout;
  intervals = thisWorkout.intervals;
  console.log("workout view clicked");
  return document.location.assign('views/workout.view');
}
