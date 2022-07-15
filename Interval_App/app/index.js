import document from "document";
import * as workout_view from "./views/workoutView";
import {Workout, WorkoutType} from "./lib/workout";
import {Interval, IntervalType} from "./lib/interval";

let workoutList = document.getElementById("workoutList");
// let items = list.getElementsByClassName("list-item");

let workouts = [new Workout(), new Workout(), new Workout(), new Workout(), new Workout(), new Workout(), new Workout(),
               new Workout(), new Workout(), new Workout(), new Workout(), new Workout(), new Workout(), new Workout()];

workouts[0].name = "bullshit";
workouts[1].name = "fucked up";
workouts[2].name = "metcon";
workouts[3].name = "pullups";
workouts[4].name = "big annie";
workouts[5].name = "dummy"; // added because the last element in the workout list is cut off

let bullshitIntervals = [new Interval(), new Interval(), new Interval(), new Interval()];
bullshitIntervals[0].intervalType = IntervalType.DISTANCE;
bullshitIntervals[0].unit = "meters";
bullshitIntervals[0].value = 400;
bullshitIntervals[1].intervalType = IntervalType.TIME;
bullshitIntervals[1].unit = "seconds";
bullshitIntervals[1].value = 60;
bullshitIntervals[2].intervalType = IntervalType.DISTANCE;
bullshitIntervals[2].unit = "meters";
bullshitIntervals[2].value = 400;
bullshitIntervals[3].intervalType = IntervalType.CALORIES;
bullshitIntervals[3].unit = "calories";
bullshitIntervals[3].value = 30;

workouts[0].intervals = bullshitIntervals;
workouts[0].workoutType = WorkoutType.RUNNING;

// items.forEach((element, index) => {
//   console.log(`${element.text}`);
//   let touch = element.getElementById("touch");
//   touch.addEventListener("click", (evt) => {
//     console.log(`touched: ${index}`);
//     workout_view.init(workouts[index]).then(workout_view.update).catch((err) => {
//       console.error(`Error loading view: ${err.message}`);
//     })
//   });
// });

let NUM_ELEMS = 6;

workoutList.delegate = {
  getTileInfo: (index) => {
    return workouts[index];
  },
  configureTile: (tile, workout) => {
    console.log(`Item: ${workout.name}`)
    if (workout.type == "workoutPool") {
      tile.getElementById("text").text = workout.name;
      tile.getElementById("touch").addEventListener("click", evt => {
        console.log(`touched: ${workout.name}`);
        workout_view.init(workout).then(workout_view.update).catch((err) => {
          console.error(`Error loading view: ${err.message}`);
        })  
      });
    }
  }
};

// length must be set AFTER delegate
workoutList.length = NUM_ELEMS;