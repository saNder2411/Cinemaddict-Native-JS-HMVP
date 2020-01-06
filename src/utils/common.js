export default class Common {
  static getRandomNumberFromPeriod(max, min = 0) {
    return min + Math.floor((max - min) * Math.random());
  }

  static getRandomBoolean() {
    return Math.random() > 0.5;
  }

  static checksBoolean(test, positiveResult) {
    return test ? positiveResult : ``;
  }

  static getRandomDate(shiftInMin = 20000000, sign = -1) {
    const currentDate = new Date();
    const diffValue = sign * this.getRandomNumberFromPeriod(shiftInMin);

    currentDate.setMinutes(currentDate.getMinutes() + diffValue);

    return currentDate;
  }
}

