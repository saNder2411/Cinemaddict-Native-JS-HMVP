const getRandomNumberFromPeriod = (max, min = 0) => (min + Math.floor((max - min) * Math.random()));

const getRandomBoolean = () => (Math.random() > 0.5);

const checksBoolean = (test, positiveResult) => test ? positiveResult : ``;

const getRandomDate = (shiftInMin = 20000000, sign = -1) => {
  const currentDate = new Date();
  const diffValue = sign * getRandomNumberFromPeriod(shiftInMin);

  currentDate.setMinutes(currentDate.getMinutes() + diffValue);

  return currentDate;
};

export { getRandomNumberFromPeriod, getRandomBoolean, checksBoolean, getRandomDate };
