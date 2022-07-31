export const WorkoutType = {
  CYCLING: 0,
  RUNNING: 1
}

export class Workout {
  name = "";
  workoutType = WorkoutType.CYCLING;
  intervals = [];
  type = "workoutPool"; // pool type, required for tile list component


  constructor() {
  }

  insert(interval) {

  }

  remove(interval) {

  }

  render() {

  }
}
