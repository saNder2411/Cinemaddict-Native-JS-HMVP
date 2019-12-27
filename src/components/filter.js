import AbstractComponent from './abstract-component.js';
import { FilterType } from '../const.js';

const createFiltersTemplate = (filterValues) => {
  const { watchlist, history, favorites } = filterValues;

  return (
    `<nav class="main-navigation">
      <a href="#all" id="${FilterType.ALL}" class="main-navigation__item">All movies</a>
      <a href="#watchlist" id="${FilterType.WATCHLIST}" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
      <a href="#history" id="${FilterType.HISTORY}" class="main-navigation__item">History <span class="main-navigation__item-count">${history}</span></a>
      <a href="#favorites" id="${FilterType.FAVORITES}" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites}</span></a>
      <a href="#stats" class="main-navigation__item main-navigation__item--additional main-navigation__item--active">Stats</a>
    </nav>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filterValues) {
    super();
    this._filterValues = filterValues;
  }

  getTemplate() {
    return createFiltersTemplate(this._filterValues);
  }

  setFilterClickHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (!evt.target.classList.contains(`main-navigation__item--additional`)) {
        this.getElement().querySelector(`.main-navigation__item--active`)
          .classList.remove(`main-navigation__item--active`);

        evt.target.classList.add(`main-navigation__item--active`);

        handler(evt.target.id);
      }
    });
  }
}
