import CardComponent from '../components/card.js';
import CardDetailsComponent from '../components/card-details.js';
import Render from '../utils/render';
import { generateComments } from '../mock/comments.js';
import { INTERACTIVE_ELEMENTS_CARD, AMOUNT_COMMENTS, Mode } from '../const.js';

export default class CardController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.DEFAULT;

    this._comments = generateComments(AMOUNT_COMMENTS);
    this._cardComponent = null;
    this._cardDetailsComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._showCardDetailsOnClick = this._showCardDetailsOnClick.bind(this);
    this._hideCardDetailsOnClick = this._hideCardDetailsOnClick.bind(this);
  }

  render(card) {
    const oldCardComponent = this._cardComponent;
    const oldCardDetailsComponent = this._cardDetailsComponent;

    this._cardComponent = new CardComponent(card);
    this._cardDetailsComponent = new CardDetailsComponent(card, this._comments);

    this._cardComponent.setElementClickHandler(this._showCardDetailsOnClick);

    this._cardComponent.setWatchlistButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        watchlist: !card.watchlist,
      }));
    });

    this._cardComponent.setWatchedButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        history: !card.history,
      }));
    });

    this._cardComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {
        favorites: !card.favorites,
      }));
    });

    this._cardDetailsComponent.setHideCardDetailsClickHandler(this._hideCardDetailsOnClick);

    if (oldCardComponent && oldCardDetailsComponent) {
      Render.replace(oldCardComponent, this._cardComponent);
      Render.replace(oldCardDetailsComponent, this._cardDetailsComponent);
    } else {
      Render.renderMarkup(this._container, this._cardComponent);
    }
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._cardDetailsComponent.reset();
      this._cardDetailsComponent.getElement().remove();
      this._mode = Mode.DEFAULT;
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

  _showCardDetailsOnClick(evt) {
    evt.preventDefault();

    if (INTERACTIVE_ELEMENTS_CARD[evt.target.className]) {
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
