import CardComponent from '../components/card.js';
import CardDetailsComponent from '../components/card-details.js';
import CardModel from '../models/card.js';
import Render from '../utils/render';
import { InteractiveElementsCard, Mode } from '../const.js';

export default class CardController {
  constructor(container, onDataChange, onViewChange, onCommentDataDelete, onCommentDataAdd) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._onCommentDataDelete = onCommentDataDelete;
    this._onCommentDataAdd = onCommentDataAdd;

    this._mode = Mode.DEFAULT;

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

    this._cardComponent = new CardComponent(card);
    this._cardDetailsComponent = new CardDetailsComponent(card);

    this._cardComponent.setElementsClickHandler(this._showCardDetailsOnClick);

    this._cardComponent.setWatchlistButtonClickHandler(() => {
      const newCard = CardModel.clone(card);
      newCard.userDetails.watchlist = !newCard.userDetails.watchlist;

      this._onDataChange(this, card, newCard);
    });

    this._cardComponent.setWatchedButtonClickHandler(() => {
      const newCard = CardModel.clone(card);
      newCard.userDetails.alreadyWatched = !newCard.userDetails.alreadyWatched;

      this._onDataChange(this, card, newCard);
    });

    this._cardComponent.setFavoriteButtonClickHandler(() => {
      const newCard = CardModel.clone(card);
      newCard.userDetails.favorite = !newCard.userDetails.favorite;

      this._onDataChange(this, card, newCard);
    });

    this._cardDetailsComponent.setHideCardDetailsClickHandler(this._hideCardDetailsOnClick);

    this._cardDetailsComponent.setDeleteCommentButtonClickHandler((commentId) => {
      this._onCommentDataDelete(this, card, commentId);
    });

    this._cardDetailsComponent.setSubmitFormHandler((newCommentData) => {
      this._onCommentDataAdd(this, card, newCommentData);
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldCardComponent && oldCardDetailsComponent) {
          Render.replace(oldCardComponent, this._cardComponent);
          Render.replace(oldCardDetailsComponent, this._cardDetailsComponent);
          this._hideCardDetailsOnClick();
        } else {
          Render.renderMarkup(this._container, this._cardComponent);
        }
        break;
      case Mode.ADDING:
        if (oldCardComponent && oldCardDetailsComponent) {
          Render.replace(oldCardComponent, this._cardComponent);
          Render.replace(oldCardDetailsComponent, this._cardDetailsComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        Render.renderMarkup(document.body.lastElementChild, this._cardDetailsComponent, Render.renderPosition().BEFOREBEGIN);
        break;
    }
  }

  _parseFormData(formData) {
    return {
      'id': null,
      'author': null,
      'comment': formData.get(`comment`),
      'date': new Date(),
      'emotion': formData.emotion,
    };
  }

  destroy() {
    Render.remove(this._cardComponent);
    Render.remove(this._cardDetailsComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
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
      this._mode = Mode.DETAILS;
      Render.renderMarkup(document.body.lastElementChild, this._cardDetailsComponent, Render.renderPosition().BEFOREBEGIN);
      document.addEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _hideCardDetailsOnClick() {
    this._cardDetailsComponent.reset();
    this._cardDetailsComponent.getElement().remove();
    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._hideCardDetailsOnClick();
    }
  }
}
