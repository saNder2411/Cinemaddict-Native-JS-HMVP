import { MAX_RATING } from '../const.js';
import Common from '../utils/common.js';
import { generateComments } from '../mock/comments.js';

const TITLES = [
  `The Lord of the Rings`, `Terminator 2: Judgment Day`, `The Shawshank Redemption`, `Forrest Gump`,
  `Schindler\`s List`, `The Green Mile`, `The Godfather`, `The Matrix`, `Gladiator`, `Aliens`,
  `The Intouchables`, `The Silence of the Lambs`, `Pirates of the Caribbean`, `Inception`, `Pulp Fiction`
];
const GENRES = [
  `Action`, `Adventure`, `Animation`, `Biography`, `Comedy`, `Crime`, `Drama`, `Family`, `Fantasy`,
  `Film-Noir`, `History`, `Horror`, `Music`, `Musical`, `Mystery`, `Romance`, `Sci-Fi`, `Sport`,
  `Thriller`, `War`, `Western`
];
const URL_POSTERS = [
  `made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `the-dance-of-life.jpg`,
  `santa-claus-conquers-the-martians.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`
];
const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`, `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`, `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`, `In rutrum ac purus sit amet tempus.`
];
const DIRECTORS = [
  `Steven Spielberg`, `Martin Scorsese`, `Alfred Hitchcock`, `Stanley Kubrick`, `Quentin Tarantino`,
  `Orson Welles`, `Francis Ford Coppola`, `Ridley Scott`, `Akira Kurosawa`, `David Lynch`
];
const WRITERS = [
  `Billy Wilder`, `Charlie Kaufman`, `Woody Allen`, `Robert Towne`, `Ethan Coen and Joel Coen`,
  `William Goldman`, `Paul Schrader`, `Oliver Stone`
];
const ACTORS = [
  `Judi Dench`, `Robert De Niro`, `Leonardo DiCaprio`, `Morgan Freeman`, `Tom Hanks`, `Anthony Hopkins`,
  `Samuel L. Jackson`, `Frances McDormand`, `Liam Neeson`, `Denzel Washington`, `Will Smith`
];
const COUNTRY = [`USA`, `Italy`, `France`, `Germany`, `British`];
const AGE_LIMIT_MAX = 18;
const MAX_AMOUNT_OFFERS = 3;
const MAX_LENGTH_DESCRIPTION = 140;

const getRandomRating = (maxRating, minRating = 5) => (
  `${Common.getRandomNumberFromPeriod(maxRating, minRating)}.${Common.getRandomNumberFromPeriod(maxRating)}`
);

const getRandomRuntime = () => {
  const minutes = Common.getRandomNumberFromPeriod(60);
  const hours = Common.getRandomNumberFromPeriod(3);

  if (hours) {
    return `${hours}h ${(minutes < 10) ? `0${minutes}` : minutes}m`;
  }

  return `${(minutes < 10) ? `0${minutes}` : minutes}m`;
};

const getThumbnailDescriptions = (descriptions, maxLength, amountOffers) => {
  const description = descriptions.filter(Common.getRandomBoolean).slice(0, amountOffers).join(` `);

  return (description.length > maxLength) ? `${description.slice(0, maxLength - 1)}…` : description;
};

const generateCard = () => {
  const comments = generateComments(Common.getRandomNumberFromPeriod(10));
  return {
    id: null,
    poster: URL_POSTERS[Common.getRandomNumberFromPeriod(URL_POSTERS.length)],
    ageLimit: `${Common.getRandomNumberFromPeriod(AGE_LIMIT_MAX + 1, 7)}`,
    title: TITLES[Common.getRandomNumberFromPeriod(TITLES.length)],
    rating: getRandomRating(MAX_RATING + 1),
    yourRate: Common.getRandomNumberFromPeriod(MAX_RATING + 1),
    director: DIRECTORS[Common.getRandomNumberFromPeriod(DIRECTORS.length)],
    writers: WRITERS.filter(Common.getRandomBoolean).slice(0, Common.getRandomNumberFromPeriod(4, 1)).join(`, `),
    actors: ACTORS.filter(Common.getRandomBoolean).slice(0, Common.getRandomNumberFromPeriod(4, 1)).join(`, `),
    releaseDate: Common.getRandomDate(),
    runtime: getRandomRuntime(),
    country: COUNTRY[Common.getRandomNumberFromPeriod(COUNTRY.length)],
    genres: GENRES.filter(Common.getRandomBoolean).slice(2, 6),
    descriptions: DESCRIPTIONS,
    thumbnailDescription: getThumbnailDescriptions(DESCRIPTIONS, MAX_LENGTH_DESCRIPTION, MAX_AMOUNT_OFFERS),
    comments,
    watchlist: Common.getRandomBoolean(),
    history: Common.getRandomBoolean(),
    favorites: Common.getRandomBoolean(),
  };
};

const generateCards = (amount) => new Array(amount)
  .fill(``)
  .map((card, i) => {
    card = generateCard();
    card.id = i;
    return card;
  });

export { generateCards };
