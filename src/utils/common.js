const MINUTES_IN_HOUR = 60;
const DEBOUNCE_TIMEOUT = 500;

export default class Common {
  static debounce(callback) {
    let lastTimeout = null;

    return (...parameters) => {

      if (lastTimeout) {
        clearTimeout(lastTimeout);
      }

      lastTimeout = setTimeout(() => {
        callback(...parameters);
      }, DEBOUNCE_TIMEOUT);
    };
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
      hours: `0`,
      minutes: `0`,
    };

    if (timeInMin < MINUTES_IN_HOUR) {
      runtime.minutes = (timeInMin < 10) ? `0${timeInMin}` : timeInMin;
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

