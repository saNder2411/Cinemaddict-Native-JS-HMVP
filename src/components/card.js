import AbstractComponent from './abstract-component.js';
import Common from '../utils/common.js';
import moment from 'moment';

const CLASS_ACTIVE = `film-card__controls-item--active`;
const MAX_LENGTH_DESCRIPTION = 140;

const getThumbnailDescriptions = (description, maxLength) =>
  description.length > maxLength ? `${description.slice(0, maxLength - 1)}…` : description;

const createCardTemplate = (card) => {
  const {
    comments,
    cardInfo: {
      title,
      totalRating,
      poster,
      release: {
        date,
      },
      runtime,
      genre,
      description,
    },
    userDetails: {
      watchlist,
      alreadyWatched,
      favorite,
    },
  } = card;

  const duration = Common.getTimeInHoursAndMinutes(runtime);
  const formatDuration = Common.getRuntimeInString(duration);
  const thumbnailDescription = getThumbnailDescriptions(description, MAX_LENGTH_DESCRIPTION);
  const formatData = moment(date).format(`YYYY`);
  const isWatchlist = watchlist ? CLASS_ACTIVE : ``;
  const isAlreadyWatched = alreadyWatched ? CLASS_ACTIVE : ``;
  const isFavorite = favorite ? CLASS_ACTIVE : ``;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${totalRating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${formatData}</span>
        <span class="film-card__duration">${formatDuration}</span>
        <span class="film-card__genre">${genre[0]}</span>
      </p>
      <img src="./${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${thumbnailDescription}</p>
      <a class="film-card__comments">${comments.length} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${isWatchlist}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isAlreadyWatched}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavorite}">Mark as favorite</button>
      </form>
    </article>`
  );
};


export default class Card extends AbstractComponent {
  constructor(card) {
    super();
    this._card = card;
  }

  getTemplate() {
    return createCardTemplate(this._card);
  }

  setElementsClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  setWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, Common.debounce(handler));
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, Common.debounce(handler));
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, Common.debounce(handler));
  }
}
