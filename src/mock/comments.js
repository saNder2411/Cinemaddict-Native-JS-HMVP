import Common from '../utils/common.js';

const AuthorNames = [`Jonas Hilton`, `Cassandra Saunders`, `Tessa Johnson`, `Ellie-Rose Bostock`, `Cassian Croft`,
  `April Hays`, `Angharad Lowe`, `Ella-Rose Bean`, `Imani Shelton`, `Kaitlyn Vance`];
const AuthorMessages = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`,
  `Almost two hours? Seriously?`];
const UrlEmojis = [`./images/emoji/angry.png`, `./images/emoji/puke.png`, `./images/emoji/sleeping.png`, `./images/emoji/smile.png`];

const generateComment = () => {
  const shift = 60;
  return {
    id: null,
    urlEmoji: UrlEmojis[Common.getRandomNumberFromPeriod(UrlEmojis.length)],
    text: AuthorMessages[Common.getRandomNumberFromPeriod(AuthorMessages.length)],
    author: AuthorNames[Common.getRandomNumberFromPeriod(AuthorNames.length)],
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
