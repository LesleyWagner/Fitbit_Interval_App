import document from "document";
import { geolocation } from "geolocation";
import {Interval, IntervalType} from "./lib/interval";
import clock from "clock";

let intervals;
let index = 0;
let sessionStart = undefined;
let sessionResult = "00:00:000"
let durationText = undefined;

let interval;
let intervalStart;
let totalTime = 0;
let totalDistance = 0; // total distance in m
let intervalValue = 0; // time in ms or distance in m or calories in cal
let prevCoords;
let currentCoords;

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
  const secs = Math.floor((now / 1000) % 60);
  const mins = Math.floor((now / 60000) % 60);
  const hours = Math.floor(now / 3600000);
  durationText.text = [`0${hours}`.slice(-2), `0${mins}`.slice(-2), `0${secs}`.slice(-2)].join(':');
    
  if (interval.intervalType === IntervalType.TIME) {
    intervalTime = evt.date - intervalStart;
    document.getElementById("currentValue").text = (intervalTime/1000).toString() + " s";
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

export function init(theIntervals) {
  intervals = theIntervals;
  console.log("exercising view clicked"); 
  sessionStart = new Date();
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
  prevCoords = currentCoords;
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
  
  if (interval.intervalType === IntervalType.DISTANCE) {
    intervalValue += d;
    document.getElementById("currentValue").text = (intervalValue).toString() + " m";
    if (intervalValue >= interval.value) {
      intervalCompleted();
    }
  }
}

function gpsFailed(error) {
  // Could not connect to gps, try moving to a different location.
  console.log("Error: " + error.code, "Message: " + error.message);
}

function intervalCompleted() {
  index++;
  if (index === intervals.length) {
    workoutFinished();
  }
  else {
    // show interval completed screen
    update();
    interval = intervals[index];
    document.getElementById("intervalTarget").text = interval.value.toString() + " " + interval.unit;
    intervalStart = new date();
    intervalValue = 0;
  }  
}

// when workout finishes: geolocation.clearWatch(watchID);
function workoutFinished() {
  geolocation.clearWatch(watchID);
  clock.granularity = "off";
  // show workout finished screen
}
