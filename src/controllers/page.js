import Render from '../utils/render.js';
import SortComponent from '../components/sort.js';
import NoCardsComponent from '../components/no-cards.js';
import StatisticComponent from '../components/statistic.js';
import CardsContainerComponent from '../components/cards-container.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import CardController from './card.js';
import {
  EXTRA_AMOUNT_CARDS, SHOWING_CARDS_AMOUNT_ON_START,
  SHOWING_CARDS_AMOUNT_BY_BUTTON, SortType
} from '../const.js';

const renderCards = (cardsContainer, cards, onDataChange, onViewChange) => {
  return cards.map((card) => {
    const cardController = new CardController(cardsContainer, onDataChange, onViewChange);
    cardController.render(card);

    return cardController;
  });
};

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


export default class PageController {
  constructor(container, cardsModel) {
    this._container = container;
    this._cardsModel = cardsModel;

    this._showedCardControllers = [];
    this._showingCardsAmount = SHOWING_CARDS_AMOUNT_ON_START;
    this._sortComponent = new SortComponent();
    this._noCardsComponent = new NoCardsComponent();
    this._statisticComponent = new StatisticComponent();
    this._cardsContainerComponent = new CardsContainerComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._mainCardsContainer = this._cardsContainerComponent.mainCardsContainer;
    this._topRatedCardsContainer = this._cardsContainerComponent.topRatedCardsContainer;
    this._mostCommentedCardsContainer = this._cardsContainerComponent.mostCommentedCardsContainer;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._cardsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const cards = this._cardsModel.getCards();
    const isCards = cards.length > 0;

    if (!isCards) {
      Render.renderMarkup(this._container, this._noCardsComponent);
      return;
    }

    Render.renderMarkup(this._container, this._sortComponent);
    // Render.renderMarkup(this._container, this._statisticComponent);
    Render.renderMarkup(this._container, this._cardsContainerComponent);

    this._renderCards(cards.slice(0, this._showingCardsAmount));
    this._renderExtraCards(cards);

    this._renderShowMoreButton();
  }

  _renderCards(cards) {
    const newCards = renderCards(this._mainCardsContainer, cards, this._onDataChange, this._onViewChange);
    this._showedCardControllers = this._showedCardControllers.concat(newCards);
    this._showingCardsAmount = this._showedCardControllers.length;
  }

  _removeCards() {
    this._mainCardsContainer.innerHTML = ``;
    this._showedCardControllers = [];
  }

  _renderExtraCards(cards) {
    renderExtraCards(this._topRatedCardsContainer, cards, this._onDataChange, this._onViewChange, `rating`);
    renderExtraCards(this._mostCommentedCardsContainer, cards, this._onDataChange, this._onViewChange, `amountComments`);
  }

  _removeExtraCards() {
    this._topRatedCardsContainer.innerHTML = ``;
    this._mostCommentedCardsContainer.innerHTML = ``;
  }

  _renderShowMoreButton() {
    Render.remove(this._showMoreButtonComponent);

    if (this._showingCardsAmount >= this._cardsModel.getCards().length) {
      return;
    }

    Render.renderMarkup(this._mainCardsContainer, this._showMoreButtonComponent, Render.renderPosition().AFTEREND);

    this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);
  }

  _onShowMoreButtonClick() {
    const prevCardsAmount = this._showingCardsAmount;
    const cards = this._cardsModel.getCards();

    this._showingCardsAmount += SHOWING_CARDS_AMOUNT_BY_BUTTON;

    this._renderCards(cards.slice(prevCardsAmount, this._showingCardsAmount));

    if (this._showingCardsAmount >= cards.length) {
      Render.remove(this._showMoreButtonComponent);
    }
  }

  _onDataChange(cardController, oldData, newData) {
    const isSuccess = this._cardsModel.updateCard(oldData.id, newData);

    if (isSuccess) {
      cardController.render(newData);
    }
  }

  _onViewChange() {
    this._showedCardControllers.forEach((cardController) => cardController.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedCards = [];
    const cards = this._cardsModel.getCards();

    switch (sortType) {
      case SortType.DATE:
        sortedCards = cards.slice().sort((a, b) => b.releaseDate - a.releaseDate);
        break;
      case SortType.RATING:
        sortedCards = cards.slice().sort((a, b) => b.rating - a.rating);
        break;
      case SortType.DEFAULT:
        sortedCards = cards.slice(0, this._showingCardsAmount);
        break;
    }

    this._removeCards();
    this._renderCards(sortedCards);

    if (sortType === SortType.DEFAULT) {
      this._renderShowMoreButton();
    } else {
      Render.remove(this._showMoreButtonComponent);
    }
  }

  _onFilterChange() {
    this._removeCards();
    this._renderCards(this._cardsModel.getCards().slice(0, SHOWING_CARDS_AMOUNT_ON_START));
    this._renderShowMoreButton();
  }
}
