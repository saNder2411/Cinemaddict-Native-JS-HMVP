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
    this._callHandlers(this._filterChangeHandlers);
  }

  removeComment(card, idDeletedComment) {
    const indexDeleted = card.comments.findIndex((it) => it.id === idDeletedComment);

    if (indexDeleted === -1) {
      return false;
    }

    card.comments = []
      .concat(card.comments.slice(0, indexDeleted), card.comments.slice(indexDeleted + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addComment(card, newCommentData) {
    newCommentData.id = -card.comments.length;
    card.comments = [].concat(newCommentData, card.comments);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateCard(id, card) {
    const index = this._cards.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._cards = [].concat(this._cards.slice(0, index), card, this._cards.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
