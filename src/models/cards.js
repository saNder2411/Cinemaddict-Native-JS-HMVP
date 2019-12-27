import Filter from '../utils/filter.js';
import { FilterType } from '../const.js';

export default class Cards {
  constructor() {
    this._cards = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getCards() {
    return Filter.getCardsByFilter(this._cards, this._activeFilterType);
  }

  getCardsAll() {
    return this._cards;
  }

  setCards(cards) {
    this._cards = Array.from(cards);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._filterChangeHandlers.forEach((handler) => handler());
  }

  updateCard(id, card) {
    const index = this._cards.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._cards = [].concat(this._cards.slice(0, index), card, this._cards.slice(index + 1));

    this._dataChangeHandlers.forEach((handler) => handler());

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }
}
