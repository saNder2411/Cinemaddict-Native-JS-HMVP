const MAX_RATING = 9;
const AMOUNT_CARDS = 107;
const EXTRA_AMOUNT_CARDS = 2;
const SHOWING_CARDS_AMOUNT_ON_START = 5;
const SHOWING_CARDS_AMOUNT_BY_BUTTON = 5;
const ValuesForUserRank = [1, 10, 11, 20];
const MINUTES_IN_HOUR = 60;
const AUTHORIZATION = `Basic er883jdzbdw`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;
const InteractiveElementsCard = {
  'film-card__poster': true,
  'film-card__title': true,
  'film-card__comments': true,
};
const SortType = {
  DEFAULT: `default`,
  DATE: `date`,
  RATING: `rating`,
};

const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  DETAILS: `details`,
};

const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  ALREADY_WATCHED: `alreadyWatched`,
  FAVORITE: `favorite`,
  STATISTICS: `statistics`,
};

export {
  MAX_RATING, AMOUNT_CARDS, EXTRA_AMOUNT_CARDS,
  SHOWING_CARDS_AMOUNT_ON_START, SHOWING_CARDS_AMOUNT_BY_BUTTON,
  ValuesForUserRank, InteractiveElementsCard,
  SortType, Mode, FilterType, AUTHORIZATION, END_POINT, MINUTES_IN_HOUR
};
