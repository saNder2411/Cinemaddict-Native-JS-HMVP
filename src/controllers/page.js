import Render from '../utils/render.js';
import SortComponent from '../components/sort.js';
import NoCardsComponent from '../components/no-cards.js';
import CardsContainerComponent from '../components/cards-container.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import CardController from './card.js';
import {
  EXTRA_AMOUNT_CARDS, SHOWING_CARDS_AMOUNT_ON_START,
  SHOWING_CARDS_AMOUNT_BY_BUTTON, SortType, Mode
} from '../const.js';

const renderCards = (cardsContainer, cards, onDataChange, onViewChange, onCommentDataDelete, onCommentDataAdd) => {
  return cards.map((card) => {
    const cardController = new CardController(cardsContainer, onDataChange, onViewChange, onCommentDataDelete, onCommentDataAdd);
    cardController.render(card, Mode.DEFAULT);

    return cardController;
  });
};

const renderExtraCards = (container, cards, onDataChange, onViewChange, onCommentDataDelete, onCommentDataAdd, sortProp) => {
  return cards
    .slice()
    .sort((a, b) => {
      if (a[sortProp] instanceof Array) {
        return b[sortProp].length - a[sortProp].length;
      }
      return b[sortProp] - a[sortProp];
    })
    .slice(0, EXTRA_AMOUNT_CARDS)
    .map((card) => {
      const cardController = new CardController(container, onDataChange, onViewChange, onCommentDataDelete, onCommentDataAdd);
      const sortPropValue = card[sortProp] instanceof Array ? card[sortProp].length : card[sortProp];

      if (sortPropValue > 0) {
        cardController.render(card, Mode.DEFAULT);
      }

      return cardController;
    });
};


export default class PageController {
  constructor(container, cardsModel) {
    this._container = container;
    this._cardsModel = cardsModel;

    this._showedCardControllers = [];
    this._showedExtraCardControllers = [];
    this._showingCardsAmount = SHOWING_CARDS_AMOUNT_ON_START;
    this._sortComponent = new SortComponent();
    this._noCardsComponent = new NoCardsComponent();
    this._cardsContainerComponent = new CardsContainerComponent();
    this._mainCardsContainer = this._cardsContainerComponent.mainCardsContainer;
    this._topRatedCardsContainer = this._cardsContainerComponent.topRatedCardsContainer;
    this._mostCommentedCardsContainer = this._cardsContainerComponent.mostCommentedCardsContainer;
    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onCommentDataDelete = this._onCommentDataDelete.bind(this);
    this._onCommentDataAdd = this._onCommentDataAdd.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._cardsModel.setFilterChangeHandler(this._onFilterChange);
  }

  show() {
    this._sortComponent.show();
    this._cardsContainerComponent.show();
  }

  hide() {
    this._sortComponent.hide();
    this._cardsContainerComponent.hide();
  }

  render() {
    const cards = this._cardsModel.getCards();
    const allCards = this._cardsModel.getCardsAll();
    const isCards = cards.length > 0;

    if (!isCards) {
      Render.renderMarkup(this._container, this._noCardsComponent);
      return;
    }

    Render.renderMarkup(this._container, this._sortComponent);
    Render.renderMarkup(this._container, this._cardsContainerComponent);

    this._renderCards(cards.slice(0, this._showingCardsAmount));
    this._renderExtraCards(allCards);

    this._renderShowMoreButton();
  }

  _renderCards(cards) {
    const newCards = renderCards(this._mainCardsContainer, cards, this._onDataChange, this._onViewChange, this._onCommentDataDelete, this._onCommentDataAdd);
    this._showedCardControllers = this._showedCardControllers.concat(newCards);
    this._showingCardsAmount = this._showedCardControllers.length;
  }

  _renderExtraCards(cards) {
    const newExtraCardsRating = renderExtraCards(this._topRatedCardsContainer, cards, this._onDataChange, this._onViewChange, this._onCommentDataDelete, this._onCommentDataAdd, `rating`);
    const newExtraCardsComment = renderExtraCards(this._mostCommentedCardsContainer, cards, this._onDataChange, this._onViewChange, this._onCommentDataDelete, this._onCommentDataAdd, `comments`);
    this._showedExtraCardControllers = this._showedExtraCardControllers.concat(newExtraCardsRating, newExtraCardsComment);
  }

  _removeCards() {
    this._showedCardControllers.forEach((cardController) => cardController.destroy());
    this._showedCardControllers = [];

    this._showedExtraCardControllers.forEach((cardController) => cardController.destroy());
    this._showedExtraCardControllers = [];
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

  _updateCards(count) {
    this._removeCards();
    this._renderCards(this._cardsModel.getCards().slice(0, count));
    this._renderExtraCards(this._cardsModel.getCardsAll());
    this._renderShowMoreButton();
  }

  _isSuccessDataChange(cardController, card, newDataCard) {
    if (newDataCard) {
      const isSuccess = this._cardsModel.updateCard(card.id, newDataCard);

      if (isSuccess) {
        cardController.render(newDataCard, Mode.DEFAULT);
      }
      return;
    }

    const isSuccess = this._cardsModel.updateCard(card.id, card);

    if (isSuccess) {
      this._updateCards(this._showingCardsAmount);
      cardController.render(card, Mode.ADDING);
    }
  }

  _onDataChange(cardController, card, newDataCard) {
    this._isSuccessDataChange(cardController, card, newDataCard);
  }

  _onCommentDataDelete(cardController, card, commentId) {
    if (card.comments.findIndex((it) => it.id === commentId) !== -1) {
      this._cardsModel.removeComment(card, commentId);
      this._isSuccessDataChange(cardController, card, undefined);
    }
  }

  _onCommentDataAdd(cardController, card, newCommentData) {
    this._cardsModel.addComment(card, newCommentData);
    this._isSuccessDataChange(cardController, card, undefined);
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
    this._updateCards(SHOWING_CARDS_AMOUNT_ON_START);
  }
}
