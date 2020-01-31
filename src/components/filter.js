import AbstractComponent from './abstract-component.js';
import {FilterType} from '../const.js';


const createFiltersTemplate = (filterValues) => {
  const {watchlist, alreadyWatched, favorite} = filterValues;

  return (
    `<nav class="main-navigation">
      <a href="#all" id="${FilterType.ALL}" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" id="${FilterType.WATCHLIST}" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlist}</span></a>
      <a href="#history" id="${FilterType.ALREADY_WATCHED}" class="main-navigation__item">History <span class="main-navigation__item-count">${alreadyWatched}</span></a>
      <a href="#favorites" id="${FilterType.FAVORITE}" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorite}</span></a>
      <a href="#stats" id="${FilterType.STATISTICS}" class="main-navigation__item main-navigation__item--additional">Stats</a>
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

      if (evt.target.tagName === `A`) {
        this.getElement().querySelector(`.main-navigation__item--active`)
          .classList.remove(`main-navigation__item--active`);

        evt.target.classList.add(`main-navigation__item--active`);

        handler(evt.target.id);
      }
    });
  }

  setStatsClickHandler(handler) {
    this.setFilterClickHandler(handler);
  }
}
