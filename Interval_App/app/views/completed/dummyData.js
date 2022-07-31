import { Workout, WorkoutType } from "../../lib/workout";
import {Interval, IntervalType} from "../../lib/interval";

export const dummyData = {
    name: "Barry",
    type: WorkoutType.RUNNING,
    totalTime: 100,
    totalDistance: 3000,
    intervals: [
        {
            type: IntervalType.DISTANCE,
            unit: "meters",
            target: 500,
            result: 40 // distance in meters if the interval type = time, else it is time in seconds
        },
        {
            type: IntervalType.TIME,
            unit: "seconds",
            target: 20,
            result: 2200 // distance in meters if the interval type = time, else it is time in seconds
        },
        {
            type: IntervalType.DISTANCE,
            unit: "meters",
            target: 300,
            result: 40 // distance in meters if the interval type = time, else it is time in seconds
        }
    ]
}