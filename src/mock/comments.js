import Common from '../utils/common.js';

const AUTHOR_NAMES = [`Jonas Hilton`, `Cassandra Saunders`, `Tessa Johnson`, `Ellie-Rose Bostock`, `Cassian Croft`,
  `April Hays`, `Angharad Lowe`, `Ella-Rose Bean`, `Imani Shelton`, `Kaitlyn Vance`];
const AUTHOR_MESSAGES = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`,
  `Almost two hours? Seriously?`];
const URL_EMOJI = [`./images/emoji/angry.png`, `./images/emoji/puke.png`, `./images/emoji/sleeping.png`, `./images/emoji/smile.png`];

const generateComment = () => {
  const shift = 60;
  return {
    id: null,
    urlEmoji: URL_EMOJI[Common.getRandomNumberFromPeriod(URL_EMOJI.length)],
    text: AUTHOR_MESSAGES[Common.getRandomNumberFromPeriod(AUTHOR_MESSAGES.length)],
    author: AUTHOR_NAMES[Common.getRandomNumberFromPeriod(AUTHOR_NAMES.length)],
    date: Common.getRandomDate(shift),
  };
};

const generateComments = (amount) => new Array(amount)
  .fill(``)
  .map((comment, i) => {
    comment = generateComment();
    comment.id = i;
    return comment;
  });

export { generateComments };
