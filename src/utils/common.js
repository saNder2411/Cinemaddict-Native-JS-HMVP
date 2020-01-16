import { MINUTES_IN_HOUR } from '../const.js';

export default class Common {
  static checksBoolean(test, positiveResult) {
    return test ? positiveResult : ``;
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

  static getTimeInHoursAndMinutes(timeInMin) {
    const runtime = {
      hours: ``,
      minutes: ``,
    };
    if (timeInMin < MINUTES_IN_HOUR) {
      runtime.minute = (timeInMin < 10) ? `0${timeInMin}` : timeInMin;
      return runtime;
    }
    runtime.minutes = timeInMin % MINUTES_IN_HOUR;
    runtime.hours = (timeInMin - runtime.minutes) / MINUTES_IN_HOUR;

    return runtime;
  }

  static getRuntimeInString(time) {
    return (time.hours) ? `${time.hours}h ${time.minutes}m` : `${time.minutes}m`;
  }
}

