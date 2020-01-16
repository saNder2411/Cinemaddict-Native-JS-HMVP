import { FilterType } from '../const.js';

export default class Filter {
  static calcFilterValues(cards, property) {
    const [, watchlist, alreadyWatched, favorite] = property;
    return cards.reduce((sum, card) => {
      sum[watchlist] = (card.userDetails[watchlist]) ? ++sum[watchlist] : sum[watchlist];
      sum[alreadyWatched] = (card.userDetails[alreadyWatched]) ? ++sum[alreadyWatched] : sum[alreadyWatched];
      sum[favorite] = (card.userDetails[favorite]) ? ++sum[favorite] : sum[favorite];

      return sum;
    }, { [watchlist]: 0, [alreadyWatched]: 0, [favorite]: 0 });
  }

  static getWatchlistCards(cards) {
    return cards.filter((card) => card.userDetails.watchlist);
  }

  static getAlreadyWatchedCards(cards) {
    return cards.filter((card) => card.userDetails.alreadyWatched);
  }

  static getFavoriteCards(cards) {
    return cards.filter((card) => card.userDetails.favorite);
  }

  static getCardsByFilter(cards, filterType) {
    switch (filterType) {
      case FilterType.ALL:
        return cards;
      case FilterType.WATCHLIST:
        return this.getWatchlistCards(cards);
      case FilterType.ALREADY_WATCHED:
        return this.getAlreadyWatchedCards(cards);
      case FilterType.FAVORITE:
        return this.getFavoriteCards(cards);
    }
    return cards;
  }
}
