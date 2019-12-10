import Utils from "../utils";

const AUTHOR_NAMES = [`Jonas Hilton`, `Cassandra Saunders`, `Tessa Johnson`, `Ellie-Rose Bostock`, `Cassian Croft`,
  `April Hays`, `Angharad Lowe`, `Ella-Rose Bean`, `Imani Shelton`, `Kaitlyn Vance`];
const AUTHOR_MESSAGES = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`,
  `Almost two hours? Seriously?`];
const URL_EMOJI = [`angry.png`, `puke.png`, `sleeping.png`, `smile.png`, `trophy.png`];

const formateDate = (date) => {
  const diff = Date.now() - date.getTime();
  const minInMs = 60000;
  const hour = minInMs * 60;

  if (diff < minInMs) {
    return `now`;
  } else if (diff >= minInMs && diff < minInMs * 3) {
    return `a minute ago`;
  } else if (diff >= minInMs * 3 && diff < hour) {
    return `a few minutes ago`;
  } else if (diff >= hour && diff < hour * 2) {
    return `a hour ago`;
  } else if (diff >= hour * 2 && diff < hour * 24) {
    return `a few hours ago`;
  } else if (diff >= hour * 24 && diff < hour * 24 * 2) {
    return `a day ago`;
  } else if (diff >= hour * 2 && diff < hour * 24 * 3) {
    return `a two day ago`;
  }

  return `a ${Math.floor(diff / (60000 * 60 * 24))} day ago`;
};

const generateComment = () => {
  const shift = 7000;
  return {
    urlEmoji: URL_EMOJI[Utils.getRandomNumberFromPeriod(URL_EMOJI.length)],
    text: AUTHOR_MESSAGES[Utils.getRandomNumberFromPeriod(AUTHOR_MESSAGES.length)],
    author: AUTHOR_NAMES[Utils.getRandomNumberFromPeriod(AUTHOR_NAMES.length)],
    day: formateDate(Utils.getRandomDate(shift)),
  };
};

const generateComments = (amount) => new Array(amount).fill(``).map(generateComment);

export { generateComments };
