import Render from '../utils/render.js';
import SortComponent from '../components/sort.js';
import NoCardsComponent from '../components/no-cards.js';
import LoadingCardsComponent from '../components/loading-cards.js';
import CardsContainerComponent from '../components/cards-container.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import CardController from './card.js';
import { SortType, ModeView, ModeRequest } from '../const.js';

const ShowingCardsAmount = {
  ON_START: 5,
  BY_BUTTON: 5,
  EXTRA_CARDS: 2,
};

const renderCards = (cardsContainer, cards, onDataChange, onViewChange, onCommentDataDelete, onCommentDataAdd, onUserDetailsDataChange, api) => {
  return cards.map((card) => {
    const cardController = new CardController(cardsContainer, onDataChange, onViewChange, onCommentDataDelete, onCommentDataAdd, onUserDetailsDataChange, api);
    cardController.render(card, ModeView.DEFAULT);

    return cardController;
  });
};

const renderExtraCards = (container, cards, onDataChange, onViewChange, onCommentDataDelete, onCommentDataAdd, onUserDetailsDataChange, sortProp, api) => {
  return cards
    .slice()
    .sort((a, b) => {
      if (a[sortProp] instanceof Array) {
        return b[sortProp].length - a[sortProp].length;
      }
      return b.cardInfo[sortProp] - a.cardInfo[sortProp];
    })
    .slice(0, ShowingCardsAmount.EXTRA_CARDS)
    .map((card) => {
      const cardController = new CardController(container, onDataChange, onViewChange, onCommentDataDelete, onCommentDataAdd, onUserDetailsDataChange, api);
      const sortPropValue = card[sortProp] instanceof Array ? card[sortProp].length : card.cardInfo[sortProp];

      if (sortPropValue > 0) {
        cardController.render(card, ModeView.DEFAULT);
      }

      return cardController;
    });
};


export default class PageController {
  constructor(container, cardsModel, api) {
    this._container = container;
    this._cardsModel = cardsModel;
    this._api = api;

    this._showedCardControllers = [];
    this._showedExtraCardControllers = [];
    this._showingCardsAmount = ShowingCardsAmount.ON_START;
    this._sortComponent = new SortComponent();
    this._noCardsComponent = new NoCardsComponent();
    this._loadingCardsComponent = new LoadingCardsComponent();
    this._cardsContainerComponent = new CardsContainerComponent();
    this._mainCardsContainer = this._cardsContainerComponent.mainCardsContainer;
    this._topRatedCardsContainer = this._cardsContainerComponent.topRatedCardsContainer;
    this._mostCommentedCardsContainer = this._cardsContainerComponent.mostCommentedCardsContainer;
    this._showMoreButtonComponent = new ShowMoreButtonComponent();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onCommentDataDelete = this._onCommentDataDelete.bind(this);
    this._onCommentDataAdd = this._onCommentDataAdd.bind(this);
    this._onUserDetailsDataChange = this._onUserDetailsDataChange.bind(this);
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

  renderLoadingMassage() {
    Render.renderMarkup(this._container, this._sortComponent);
    Render.renderMarkup(this._container, this._loadingCardsComponent);
  }

  render() {
    const cards = this._cardsModel.getCards();
    const allCards = this._cardsModel.getCardsAll();
    const isCards = cards.length > 0;
    Render.remove(this._loadingCardsComponent);

    if (!isCards) {
      Render.renderMarkup(this._container, this._noCardsComponent);
      return;
    }

    Render.renderMarkup(this._container, this._cardsContainerComponent);

    this._renderCards(cards.slice(0, this._showingCardsAmount));
    this._renderExtraCards(allCards);

    this._renderShowMoreButton();
  }

  _renderCards(cards) {
    const newCards = renderCards(this._mainCardsContainer, cards, this._onDataChange, this._onViewChange, this._onCommentDataDelete, this._onCommentDataAdd, this._onUserDetailsDataChange, this._api);
    this._showedCardControllers = this._showedCardControllers.concat(newCards);
    this._showingCardsAmount = this._showedCardControllers.length;
  }

  _renderExtraCards(cards) {
    const newExtraCardsRating = renderExtraCards(this._topRatedCardsContainer, cards, this._onDataChange, this._onViewChange, this._onCommentDataDelete, this._onCommentDataAdd, this._onUserDetailsDataChange, `totalRating`, this._api);
    const newExtraCardsComment = renderExtraCards(this._mostCommentedCardsContainer, cards, this._onDataChange, this._onViewChange, this._onCommentDataDelete, this._onCommentDataAdd, this._onUserDetailsDataChange, `comments`, this._api);
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

    this._showingCardsAmount += ShowingCardsAmount.BY_BUTTON;

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
    const isSuccess = this._cardsModel.updateCard(card.id, newDataCard);

    if (isSuccess) {
      this._updateCards(this._showingCardsAmount);
      cardController.render(newDataCard, ModeView.DEFAULT);
    }
  }

  _onDataChange(cardController, card, newDataCard) {
    this._api.updateCard(card.id, newDataCard)
      .then((cardModel) => {
        this._isSuccessDataChange(cardController, card, cardModel);
      })
      .catch(() => {
        cardController.shake();
      });
  }

  _isSuccessCommentDataAdd(cardController, oldDataCard, newDataCard, newComments) {
    const isSuccessCardDataChange = this._cardsModel.updateCard(oldDataCard.id, newDataCard);

    if (isSuccessCardDataChange) {
      this._updateCards(this._showingCardsAmount);
      cardController.render(newDataCard, ModeView.DETAILS);
      cardController.renderUpdatedComments(newComments);
    }
  }

  _onCommentDataAdd(cardController, oldDataCard, newCommentData) {
    this._api.addComment(oldDataCard.id, newCommentData)
      .then((result) => {
        this._isSuccessCommentDataAdd(cardController, oldDataCard, result.card, result.comments);
      })
      .catch(() => {
        this._isErrorDataChange(cardController, oldDataCard, ModeRequest.isCommentAdd);
      });
  }

  _isSuccessCommentDataDelete(cardController, card, commentId) {
    const isSuccessCommentDataDelete = this._cardsModel.removeComment(card, commentId);

    if (isSuccessCommentDataDelete) {
      const newListComments = cardController.deleteComment(commentId);
      this._updateCards(this._showingCardsAmount);
      cardController.render(card, ModeView.DETAILS);
      cardController.renderUpdatedComments(newListComments);
    }
  }

  _onCommentDataDelete(cardController, card, commentId) {
    this._api.deleteComment(commentId)
      .then(() => {
        this._isSuccessCommentDataDelete(cardController, card, commentId);
      })
      .catch(() => {
        this._isErrorDataChange(cardController, card);
      });
  }

  _isSuccessUserRatingDataChange(cardController, card, newDataCard) {
    const isSuccess = this._cardsModel.updateCard(card.id, newDataCard);

    if (isSuccess) {
      this._updateCards(this._showingCardsAmount);
      const newListComments = cardController.deleteComment();
      cardController.render(newDataCard, ModeView.DETAILS);
      cardController.renderUpdatedComments(newListComments);
    }
  }

  _onUserDetailsDataChange(cardController, oldDataCard, newDataCard, userRatingId) {
    this._api.updateCard(oldDataCard.id, newDataCard)
      .then((cardModel) => {
        this._isSuccessUserRatingDataChange(cardController, oldDataCard, cardModel);
      })
      .catch(() => {
        this._isErrorDataChange(cardController, oldDataCard, ModeRequest.isUserDetailsChange, userRatingId);
      });
  }

  _isErrorDataChange(cardController, card, modeRequest = ``, userRatingId = ``) {
    const newListComments = cardController.deleteComment();
    cardController.render(card, ModeView.DETAILS);
    cardController.renderUpdatedComments(newListComments);
    cardController.shake(modeRequest, userRatingId);
  }

  _onViewChange() {
    this._showedCardControllers.forEach((cardController) => cardController.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    let sortedCards = [];
    const cards = this._cardsModel.getCards();

    switch (sortType) {
      case SortType.DATE:
        sortedCards = cards.slice().sort((a, b) => new Date(b.cardInfo.release.date).getTime() - new Date(a.cardInfo.release.date).getTime());
        break;
      case SortType.RATING:
        sortedCards = cards.slice().sort((a, b) => b.cardInfo.totalRating - a.cardInfo.totalRating);
        break;
      case SortType.DEFAULT:
        sortedCards = cards.slice(0, this._showingCardsAmount);
        break;
    }

    this._removeCards();
    this._renderCards(sortedCards);
    this._renderExtraCards(this._cardsModel.getCardsAll());

    if (sortType === SortType.DEFAULT) {
      this._renderShowMoreButton();
    } else {
      Render.remove(this._showMoreButtonComponent);
    }

  }

  _onFilterChange() {
    this._updateCards(ShowingCardsAmount.ON_START);
  }
}
