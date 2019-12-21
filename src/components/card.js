import AbstractComponent from './abstract-component.js';
import Utils from '../utils.js';

const CLASS_ACTIVE = `film-card__controls-item--active`;


const createCardTemplate = (card) => {
  const { title, rating, releaseDate, runtime, genres, poster, thumbnailDescription, amountComments, isWatchlist, isWatched, isFavorite } = card;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate.getFullYear()}</span>
        <span class="film-card__duration">${runtime}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${thumbnailDescription}</p>
      <a class="film-card__comments">${amountComments} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${Utils.checksBoolean(isWatchlist, CLASS_ACTIVE)}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${Utils.checksBoolean(isWatched, CLASS_ACTIVE)}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${Utils.checksBoolean(isFavorite, CLASS_ACTIVE)}">Mark as favorite</button>
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

  setElementClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  setWatchlistButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
      .addEventListener(`click`, handler);
  }

  setWatchedButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
      .addEventListener(`click`, handler);
  }

  setFavoriteButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
      .addEventListener(`click`, handler);
  }
}
