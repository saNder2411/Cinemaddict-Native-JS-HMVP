import { FilterType } from '../const.js';

export default class Filter {
  static calcFilterValues(cards, property) {
    const [, watchlist, history, favorites] = property;
    return cards.reduce((sum, card) => {
      sum[watchlist] = (card[watchlist]) ? ++sum[watchlist] : sum[watchlist];
      sum[history] = (card[history]) ? ++sum[history] : sum[history];
      sum[favorites] = (card[favorites]) ? ++sum[favorites] : sum[favorites];

      return sum;
    }, { [watchlist]: 0, [history]: 0, [favorites]: 0 });
  }

  static getWatchlistCards(cards) {
    return cards.filter((card) => card.watchlist);
  }

  static getHistoryCards(cards) {
    return cards.filter((card) => card.history);
  }

  static getFavoriteCards(cards) {
    return cards.filter((card) => card.favorites);
  }

  static getCardsByFilter(cards, filterType) {
    switch (filterType) {
      case FilterType.ALL:
        return cards;
      case FilterType.WATCHLIST:
        return this.getWatchlistCards(cards);
      case FilterType.HISTORY:
        return this.getHistoryCards(cards);
      case FilterType.FAVORITES:
        return this.getFavoriteCards(cards);
    }
    return cards;
  }
}
