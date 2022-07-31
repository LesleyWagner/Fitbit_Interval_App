import document from "document";
import { IntervalType } from "../../lib/interval";

const listLength = 20;

let workoutData;

/**
 * Single view menu entry
 */
 export function update() {
    document.getElementById("saveBtn").addEventListener("click", (evt) => {
        console.log("Touched saveBtn");
    });
    document.getElementById("discardBtn").addEventListener("click", (evt) => {
        console.log("Touched discardBtn");
    });
    document.getElementById("currentWorkout").text = workoutData.name;
    
    if (workoutData.type) {
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
    while (index < workoutData.intervals.length) {
      let intervalItem = intervalList.getElementById("interval" + index.toString());
      let target = intervalItem.getElementById("target");
      let result = intervalItem.getElementById("result");
      let interval = workoutData.intervals[index];
      let resultUnit = interval.type === IntervalType.TIME ? "m" : "s";
      target.text = interval.target.toString() + " " + interval.unit;
      result.text = interval.result.toString() + " " + resultUnit;
      index++;
    }
    while (index < listLength) {
      let interval = intervalList.getElementById("interval" + index.toString());
      interval.style.display = "none";
      index++;
    }
  }

export function init(data) {
    workoutData = data;

    console.log("completed view clicked"); 
    console.log(workoutData.name);

    return document.location.replace('./resources/views/completed.view');
}