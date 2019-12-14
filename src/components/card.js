import AbstractComponent from './abstract-component.js';
import Utils from '../utils.js';

const MAX_LENGTH_DESCRIPTION = 140;
const CLASS_ACTIVE = `film-card__controls-item--active`;
const MAX_AMOUNT_OFFERS = 3;

const getThumbnailDescription = (descriptions, maxLength, amountOffers) => {
  const description = descriptions.filter(Utils.getRandomBoolean).slice(0, amountOffers).join(` `);

  return (description.length > maxLength) ? `${description.slice(0, maxLength - 1)}…` : description;
};

const createCardTemplate = (card) => {
  const { title, rating, releaseDate, runtime, genres, poster, descriptions, amountComments, watchList, watched, favorite } = card;

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
      <p class="film-card__description">${getThumbnailDescription(descriptions, MAX_LENGTH_DESCRIPTION, MAX_AMOUNT_OFFERS)}</p>
      <a class="film-card__comments">${amountComments} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${Utils.checksBoolean(watchList, CLASS_ACTIVE)}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${Utils.checksBoolean(watched, CLASS_ACTIVE)}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${Utils.checksBoolean(favorite, CLASS_ACTIVE)}">Mark as favorite</button>
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
}
