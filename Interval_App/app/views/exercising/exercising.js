import document from "document";
import { geolocation } from "geolocation";
import clock from "clock";
import { vibration } from "haptics";

import {Interval, IntervalType} from "../../lib/interval";
import * as completed from "../completed/completed";

let workout;
let intervals;
let index = 0;
let sessionStart = undefined;
let sessionResult = "00:00:000"
let durationText = undefined;

let interval;
let intervalStart;
let intervalTime = 0;
let intervalDistance = 0;

let totalTime = 0;
let totalDistance = 0; // total distance in m

let prevCoords = undefined;
let currentCoords;

let workoutData;
let intervalData;

/**
 * Single view menu entry
 */

export function update() {
  interval = intervals[index];
  document.getElementById("intervalTarget").text = interval.value.toString() + " " + interval.unit;
  
  clock.addEventListener("tick", (evt) => {
    if (durationText === undefined) {
      return;
    }

    totalTime = evt.date - sessionStart;
    const secs = Math.floor((totalTime / 1000) % 60);
    const mins = Math.floor((totalTime / 60000) % 60);
    const hours = Math.floor(totalTime / 3600000);
    durationText.text = [`0${hours}`.slice(-2), `0${mins}`.slice(-2), `0${secs}`.slice(-2)].join(':');
    
    intervalTime = Math.floor((evt.date - intervalStart) / 1000);
    if (interval.intervalType === IntervalType.TIME) {
      document.getElementById("currentValue").text = intervalTime + " s";
      if (intervalTime >= interval.value) {
        intervalCompleted();
      }
    }
  });
  
  // start continuously monitor gps
  var watchID = geolocation.watchPosition(newCoords, gpsFailed, { timeout: 60 * 1000 });
  
  durationText = document.getElementById("totalTime");
  durationText.text = "00:00:00";
}

export function init(theWorkout) {
  workout = theWorkout;
  intervals = theIntervals;

  workoutData = {
    name: workout.name,
    type: workout.workoutType,
    totalTime: 0,
    totalDistance: 0,
    intervals: new Array(intervals.length)
  }

  console.log("exercising view clicked"); 
  sessionStart = Date.now();
  clock.granularity = "seconds";
  
  return document.location.assign('exercising.view');
}

/*
* Add travelled distance to total distance.
*/
function newCoords(position) {
  console.log(
    "Latitude: " + position.coords.latitude,
    "Longitude: " + position.coords.longitude
  );

  if (prevCoords === undefined) {
    prevCoords = position.coords;
  }
  else {
    currentCoords = position.coords;
    // calculate travelled distance
    const R = 6371e3; // metres
    const CRAD = Math.PI/180; // constant that converts variable from degrees to radians
    const φ1 = prevCoords.latitude * CRAD; // φ, λ in radians
    const φ2 = currentCoords.latitude * CRAD;
    const Δφ = (currentCoords.latitude-prevCoords.latitude) * CRAD;
    const Δλ = (currentCoords.longitude-prevCoords.longitude) * CRAD;
    const sqrtHavsinΔφ = Math.sin(Δφ/2);
    const sqrtHavsinΔλ = Math.sin(Δλ/2);

    const a = sqrtHavsinΔφ * sqrtHavsinΔφ + Math.cos(φ1) * Math.cos(φ2) *
              sqrtHavsinΔλ * sqrtHavsinΔλ;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c; // in meters
    totalDistance += d;
    intervalDistance += d;
    
    if (interval.intervalType === IntervalType.DISTANCE) {
      document.getElementById("currentValue").text = intervalDistance.toFixed(0) + " m";
      if (intervalDistance >= interval.value) {
        intervalCompleted();
      }
    }
    prevCoords = currentCoords;
  }
}

function gpsFailed(error) {
  // Could not connect to gps, try moving to a different location.
  console.log("Error: " + error.code, "Message: " + error.message);
}

function intervalCompleted() {
  intervalData = {
    type: interval.intervalType,
    unit: interval.unit,
    target: interval.value,
    result: 0 // distance in meters if the interval type = time, else it is time in seconds
  }
  if (interval.intervalType === IntervalType.TIME) {
    intervalData.result = intervalDistance;
  }
  else {
    intervalData.result = intervalTime;
  }
  workoutData.intervals[index] = intervalData;

  index++;
  if (index === intervals.length) {
    workoutFinished();
  }
  else {
    // show interval completed screen
    vibration.start("nudge");
    intervalTime = 0;
    intervalDistance = 0;
    intervalStart = Date.now();
    interval = intervals[index];

    document.getElementById("intervalTarget").text = interval.value.toString() + " " + interval.unit;

    if (interval.intervalType === IntervalType.DISTANCE) {
      document.getElementById("currentValue").text = 0 + " m";
    }
    else if (interval.intervalType === IntervalType.TIME) {
      document.getElementById("currentValue").text = 0 + " s";
    }
    else if (interval.intervalType === IntervalType.CALORIES) {
      document.getElementById("currentValue").text = 0 + " cal";
    }
  }  
}

// when workout finishes: geolocation.clearWatch(watchID);
function workoutFinished() {
  geolocation.clearWatch(watchID);
  clock.granularity = "off";
  console.log("Workout finished");
  vibration.start("confirmation");  
  workoutData.totalDistance = totalDistance;
  workoutData.totalTime = totalTime;
  // show workout finished screen
  completed.init(workoutData).then(completed.update).catch((err) => {
    console.error(`Error loading view: ${err.message}`);
  });
}
