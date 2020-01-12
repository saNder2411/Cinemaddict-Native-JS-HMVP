import { TimeShiftInMin } from '../const.js';

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

  static getRandomDate(shiftInMin = TimeShiftInMin.YEAR * 20, sign = -1) {
    const currentDate = new Date();
    const diffValue = sign * this.getRandomNumberFromPeriod(shiftInMin);

    currentDate.setMinutes(currentDate.getMinutes() + diffValue);

    return currentDate;
  }

  static calcUserRank(amountWatched, minValRank, middleJrValRank, middleValRank, maxValRank) {
    let rank = ``;
    if (amountWatched >= minValRank && amountWatched <= middleJrValRank) {
      rank = `novice`;
    } else if (amountWatched >= middleValRank && amountWatched <= maxValRank) {
      rank = `fan`;
    } else if (amountWatched > maxValRank) {
      rank = `movie buff`;
    }
    return rank;
  }
}

