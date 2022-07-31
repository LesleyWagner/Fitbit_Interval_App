export const IntervalType = {
  DISTANCE: 0,
  TIME: 1,
  CALORIES: 2
}

export class Interval {
  intervalType = "IntervalType.DISTANCE;"
  unit = "meters";
  value = 0; // in seconds, meters or calories
  type = "intervalPool"; // pool type, required for tile list component

  constructor() {
  }

  setValue(value) {
    // check conditions
    this.value = value;
  }

  setType(intervalType) {
    // check conditions
    this.intervalType = intervalType;
  }

  render() {

  }
}