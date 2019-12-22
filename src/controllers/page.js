import Utils from '../utils.js';
import SortComponent from '../components/sort.js';
import NoCardsComponent from '../components/no-cards.js';
import StatisticComponent from '../components/statistic.js';
import CardsContainerComponent from '../components/cards-container.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import CardController from './card.js';
import {
  EXTRA_AMOUNT_CARDS, SHOWING_CARDS_AMOUNT_ON_START,
  SHOWING_CARDS_AMOUNT_BY_BUTTON
} from '../const.js';


const renderExtraCards = (container, cards, onDataChange, onViewChange, sortProp) => {
  cards
    .slice()
    .sort((a, b) => b[sortProp] - a[sortProp])
    .slice(0, EXTRA_AMOUNT_CARDS)
    .map((card) => {
      const cardController = new CardController(container, onDataChange, onViewChange);

      if (card[sortProp] > 0) {
        cardController.render(card);
      }

      return cardController;
    });
};

const renderCards = (cardsContainer, cards, onDataChange, onViewChange) => {
  return cards.map((card) => {
    const cardController = new CardController(cardsContainer, onDataChange, onViewChange);
    cardController.render(card);

    return cardController;
  });
};


export default class PageController {
  constructor(container) {
    this._container = container;

    this._cards = [];
    this._showedCardControllers = [];
    this._showingCardsAmount = SHOWING_CARDS_AMOUNT_ON_START;
    this._sortComponent = new SortComponent();
    this._noCardsComponent = new NoCardsComponent();
    this._statisticComponent = new StatisticComponent();
    this._cardsContainerComponent = new CardsContainerComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._mainCardsContainer = this._cardsContainerComponent.getElement().querySelector(`.films-list__container`);

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(cards) {
    this._cards = cards;

    const isCards = cards.length > 0;

    if (!isCards) {
      Utils.renderMarkup(this._container, this._noCardsComponent);
      return;
    }

    Utils.renderMarkup(this._container, this._sortComponent);
    // Utils.renderMarkup(this._container, this._statisticComponent);
    Utils.renderMarkup(this._container, this._cardsContainerComponent);

    const newCards = renderCards(this._mainCardsContainer, this._cards.slice(0, this._showingCardsAmount), this._onDataChange, this._onViewChange);
    this._showedCardControllers = this._showedCardControllers.concat(newCards);

    this._renderShowMoreButton();

    const topRatedCardsContainer = this._container.querySelector(`.films-list__container--top-rated`);
    const mostCommentedCardsContainer = this._container.querySelector(`.films-list__container--most-commented`);

    renderExtraCards(topRatedCardsContainer, this._cards, this._onDataChange, this._onViewChange, `rating`);
    renderExtraCards(mostCommentedCardsContainer, this._cards, this._onDataChange, this._onViewChange, `amountComments`);
  }

  _renderShowMoreButton() {
    if (this._showingCardsAmount >= this._cards.length) {
      return;
    }

    Utils.renderMarkup(this._mainCardsContainer, this._showMoreButtonComponent, Utils.renderPosition().AFTEREND);

    this._showMoreButtonComponent.setShowMoreClickHandler(() => {
      const prevCardsAmount = this._showingCardsAmount;
      this._showingCardsAmount += SHOWING_CARDS_AMOUNT_BY_BUTTON;

      const newCards = renderCards(this._mainCardsContainer, this._cards.slice(prevCardsAmount, this._showingCardsAmount), this._onDataChange, this._onViewChange);
      this._showedCardControllers = this._showedCardControllers.concat(newCards);

      if (this._showingCardsAmount >= this._cards.length) {
        Utils.remove(this._showMoreButtonComponent);
      }
    });
  }

  _onDataChange(cardController, oldData, newData) {
    const index = this._cards.findIndex((card) => card === oldData);
    if (index === -1) {
      return;
    }

    this._cards.splice(index, 1, newData);
    cardController.render(this._cards[index]);
  }

  _onViewChange() {
    this._showedCardControllers.forEach((cardController) => cardController.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedCards = [];

    switch (sortType) {
      case Utils.sortType().DATE:
        sortedCards = this._cards.slice().sort((a, b) => b.releaseDate - a.releaseDate);
        break;
      case Utils.sortType().RATING:
        sortedCards = this._cards.slice().sort((a, b) => b.rating - a.rating);
        break;
      case Utils.sortType().DEFAULT:
        sortedCards = this._cards.slice(0, this._showingCardsAmount);
        break;
    }

    this._mainCardsContainer.innerHTML = ``;

    const newCards = renderCards(this._mainCardsContainer, sortedCards, this._onDataChange, this._onViewChange);
    this._showedCardControllers = newCards;

    if (sortType === Utils.sortType().DEFAULT) {
      this._renderShowMoreButton();
    } else {
      Utils.remove(this._showMoreButtonComponent);
    }
  }
}
