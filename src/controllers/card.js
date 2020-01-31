import CardComponent from '../components/card.js';
import CardDetailsComponent from '../components/card-details.js';
import CardModel from '../models/card.js';
import Render from '../utils/render';
import {ModeView, ModeRequest} from '../const.js';

const SHAKE_ANIMATION_TIMEOUT = 0.6;

const InteractiveElementsCard = {
  'film-card__poster': true,
  'film-card__title': true,
  'film-card__comments': true,
};

export default class CardController {
  constructor(container, onDataChange, onViewChange, onCommentDataDelete, onCommentDataAdd, onUserDetailsDataChange, api) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onCommentDataDelete = onCommentDataDelete;
    this._onCommentDataAdd = onCommentDataAdd;
    this._onUserDetailsDataChange = onUserDetailsDataChange;
    this._api = api;

    this._mode = ModeView.DEFAULT;
    this._cardId = null;

    this._cardComponent = null;
    this._cardDetailsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._showCardDetailsOnClick = this._showCardDetailsOnClick.bind(this);
    this._hideCardDetailsOnClick = this._hideCardDetailsOnClick.bind(this);
  }

  render(card, mode) {
    const oldCardComponent = this._cardComponent;
    const oldCardDetailsComponent = this._cardDetailsComponent;

    this._mode = mode;
    this._cardId = card.id;
    this._cardComponent = new CardComponent(card);
    this._cardDetailsComponent = new CardDetailsComponent(card);


    this._cardComponent.setElementsClickHandler(this._showCardDetailsOnClick);

    this._cardComponent.setWatchlistButtonClickHandler(() => {
      const newCard = CardModel.clone(card);

      newCard.userDetails.watchlist = !newCard.userDetails.watchlist;
      newCard.userDetails.watchingDate = new Date().toISOString();

      this._onDataChange(this, card, newCard);
    });

    this._cardComponent.setWatchedButtonClickHandler(() => {
      const newCard = CardModel.clone(card);

      newCard.userDetails.alreadyWatched = !newCard.userDetails.alreadyWatched;
      newCard.userDetails.watchingDate = new Date().toISOString();

      this._onDataChange(this, card, newCard);
    });

    this._cardComponent.setFavoriteButtonClickHandler(() => {
      const newCard = CardModel.clone(card);

      newCard.userDetails.favorite = !newCard.userDetails.favorite;
      newCard.userDetails.watchingDate = new Date().toISOString();

      this._onDataChange(this, card, newCard);
    });


    this._cardDetailsComponent.setHideCardDetailsClickHandler(this._hideCardDetailsOnClick);

    this._cardDetailsComponent.setSubmitFormHandler((formDataComment) => {
      const newCommentData = this._parseFormCommentData(formDataComment);

      this._cardDetailsComponent.setData({request: true});

      this._onCommentDataAdd(this, card, newCommentData);
    });

    this._cardDetailsComponent.setDeleteCommentButtonClickHandler((commentId) => {
      this._cardDetailsComponent.setData({deleteCommentId: commentId});

      this._onCommentDataDelete(this, card, commentId);
    });

    this._cardDetailsComponent.setUserDetailsClickHandler((userDetailsData, userRatingId) => {
      const newCard = CardModel.clone(card);

      newCard.userDetails = Object.assign({}, newCard.userDetails, userDetailsData);
      this._cardDetailsComponent.setData({request: true});

      this._onUserDetailsDataChange(this, card, newCard, userRatingId);
    });

    switch (mode) {
      case ModeView.DEFAULT:
        if (oldCardComponent && oldCardDetailsComponent) {
          Render.replace(oldCardComponent, this._cardComponent);
          Render.replace(oldCardDetailsComponent, this._cardDetailsComponent);
          this._hideCardDetailsOnClick();
        } else {
          Render.renderMarkup(this._container, this._cardComponent);
        }
        break;
      case ModeView.DETAILS:
        if (oldCardComponent && oldCardDetailsComponent) {
          Render.replace(oldCardComponent, this._cardComponent);
          Render.replace(oldCardDetailsComponent, this._cardDetailsComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        Render.renderMarkup(document.body.lastElementChild, this._cardDetailsComponent, Render.renderPosition().BEFOREBEGIN);
        break;
    }
  }

  _parseFormCommentData(formData) {
    return {
      'comment': formData.get(`comment`),
      'date': new Date().toISOString(),
      'emotion': formData.emotion,
    };
  }

  destroy() {
    Render.remove(this._cardComponent);
    Render.remove(this._cardDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  _loadsAndRenderCommentsOnClick() {
    this._api.getComments(this._cardId)
      .then(this._cardDetailsComponent.renderCommentsMarkup);
  }

  renderUpdatedComments(comments) {
    this._cardDetailsComponent.renderCommentsMarkup(comments);
  }

  deleteComment(commentId) {
    return this._cardDetailsComponent.removeComment(commentId);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._hideCardDetailsOnClick();
    }
  }

  _showCardDetailsOnClick(evt) {
    evt.preventDefault();

    if (InteractiveElementsCard[evt.target.className]) {
      this._onViewChange();
      this._mode = ModeView.DETAILS;

      Render.renderMarkup(document.body.lastElementChild, this._cardDetailsComponent, Render.renderPosition().BEFOREBEGIN);
      document.addEventListener(`keydown`, this._onEscKeyDown);

      this._loadsAndRenderCommentsOnClick();
    }
  }

  _hideCardDetailsOnClick() {
    this._cardDetailsComponent.reset();
    this._cardDetailsComponent.getElement().remove();
    this._mode = ModeView.DEFAULT;

    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._mode !== ModeView.DEFAULT) {
      this._hideCardDetailsOnClick();
    }
  }

  shake(modeRequest = false, userRatingId = false) {
    const isCommentAdd = modeRequest === ModeRequest.isCommentAdd ? true : false;
    const isUserDetailsChange = modeRequest === ModeRequest.isUserDetailsChange ? true : false;
    const externalData = {
      deleteCommentId: ``,
      userRatingId: isUserDetailsChange ? userRatingId : ``,
      request: false,
      errorCommentAddResponse: isCommentAdd,
      errorUserDetailsChangeResponse: isUserDetailsChange,
    };

    this._cardDetailsComponent.setData(externalData);
    this._cardDetailsComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT}s`;
    this._cardComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT}s`;

    setTimeout(() => {
      this._cardDetailsComponent.getElement().style.animation = `none`;
      this._cardComponent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT * 1000);
  }
}
