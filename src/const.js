const MAX_RATING = 9;
const AMOUNT_CARDS = 7;
const EXTRA_AMOUNT_CARDS = 2;
const SHOWING_CARDS_AMOUNT_ON_START = 5;
const SHOWING_CARDS_AMOUNT_BY_BUTTON = 5;
const valuesForUserRank = [1, 10, 11, 20];
const interactiveElementsCard = {
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
  HISTORY: `history`,
  FAVORITES: `favorites`,
};

export {
  MAX_RATING, AMOUNT_CARDS, EXTRA_AMOUNT_CARDS,
  SHOWING_CARDS_AMOUNT_ON_START, SHOWING_CARDS_AMOUNT_BY_BUTTON,
  valuesForUserRank, interactiveElementsCard,
  SortType, Mode, FilterType
};
