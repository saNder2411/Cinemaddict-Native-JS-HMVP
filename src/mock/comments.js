import Common from '../utils/common.js';
import moment from 'moment';

const AUTHOR_NAMES = [`Jonas Hilton`, `Cassandra Saunders`, `Tessa Johnson`, `Ellie-Rose Bostock`, `Cassian Croft`,
  `April Hays`, `Angharad Lowe`, `Ella-Rose Bean`, `Imani Shelton`, `Kaitlyn Vance`];
const AUTHOR_MESSAGES = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`,
  `Almost two hours? Seriously?`];
const URL_EMOJI = [`angry.png`, `puke.png`, `sleeping.png`, `smile.png`, `trophy.png`];

const generateComment = () => {
  const shift = 60;
  return {
    urlEmoji: URL_EMOJI[Common.getRandomNumberFromPeriod(URL_EMOJI.length)],
    text: AUTHOR_MESSAGES[Common.getRandomNumberFromPeriod(AUTHOR_MESSAGES.length)],
    author: AUTHOR_NAMES[Common.getRandomNumberFromPeriod(AUTHOR_NAMES.length)],
    day: moment(Common.getRandomDate(shift)).fromNow(),
  };
};

const generateComments = (amount) => new Array(amount).fill(``).map(generateComment);

export { generateComments };
