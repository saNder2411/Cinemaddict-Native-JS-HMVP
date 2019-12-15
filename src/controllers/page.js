import Utils from '../utils.js';
import SortComponent from '../components/sort.js';
import NoCardsComponent from '../components/no-cards.js';
import StatisticComponent from '../components/statistic.js';
import CardComponent from '../components/card.js';
import PopupDetailsComponent from '../components/popup-details.js';
import CardsContainerComponent from '../components/cards-container.js';
import ShowMoreButtonComponent from '../components/show-more-button.js';
import { generateComments } from '../mock/comments.js';
import {
  EXTRA_AMOUNT_CARDS, AMOUNT_COMMENTS,
  SHOWING_CARDS_AMOUNT_ON_START, SHOWING_CARDS_AMOUNT_BY_BUTTON
} from '../const.js';

const renderCard = (container, card) => {
  const comments = generateComments(AMOUNT_COMMENTS);
  const cardComponent = new CardComponent(card);
  const popupDetailsComponent = new PopupDetailsComponent(card, comments);

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      popupDetailsComponent.getElement().remove();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const showPopupDetailsOnClick = (evt) => {
    evt.preventDefault();

    if (evt.target.className === `film-card__poster` || evt.target.className === `film-card__title` || evt.target.className === `film-card__comments`) {
      Utils.renderMarkup(document.body.lastElementChild, popupDetailsComponent, Utils.renderPosition().BEFOREBEGIN);
      document.addEventListener(`keydown`, onEscKeyDown);
    }
  };

  const hidePopupDetailsOnClick = () => {
    popupDetailsComponent.getElement().remove();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  cardComponent.setElementClickHandler(showPopupDetailsOnClick);
  popupDetailsComponent.setHidePopupClickHandler(hidePopupDetailsOnClick);

  Utils.renderMarkup(container, cardComponent);
};

const renderExtraCards = (arrCards, sortProp, container) => {
  arrCards
    .slice()
    .sort((a, b) => b[sortProp] - a[sortProp])
    .slice(0, EXTRA_AMOUNT_CARDS)
    .forEach((card) => card[sortProp] > 0 ? renderCard(container, card) : null);
};

const renderCards = (cardsContainer, cards) => cards.forEach((card) => renderCard(cardsContainer, card));


export default class PageController {
  constructor(container) {
    this._container = container;
    this._sortComponent = new SortComponent();
    this._noCardsComponent = new NoCardsComponent();
    this._statisticComponent = new StatisticComponent();
    this._cardsContainerComponent = new CardsContainerComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }

  render(cards) {
    const isCards = cards.length > 0;

    if (!isCards) {
      Utils.renderMarkup(this._container, this._noCardsComponent);
      return;
    }
    Utils.renderMarkup(this._container, this._sortComponent);
    Utils.renderMarkup(this._container, this._statisticComponent);
    Utils.renderMarkup(this._container, this._cardsContainerComponent);

    const mainCardsContainer = this._container.querySelector(`.films-list__container`);

    let showingCardsAmount = SHOWING_CARDS_AMOUNT_ON_START;

    const renderShowMoreButton = () => {
      if (showingCardsAmount >= cards.length) {
        return;
      }

      Utils.renderMarkup(mainCardsContainer, this._showMoreButtonComponent, Utils.renderPosition().AFTEREND);

      const onShowMoreButtonClick = () => {
        const prevCardsAmount = showingCardsAmount;
        showingCardsAmount += SHOWING_CARDS_AMOUNT_BY_BUTTON;

        renderCards(mainCardsContainer, cards.slice(prevCardsAmount, showingCardsAmount));

        if (showingCardsAmount >= cards.length) {
          Utils.remove(this._showMoreButtonComponent);
        }
      };

      this._showMoreButtonComponent.setShowMoreClickHandler(onShowMoreButtonClick);
    };

    renderCards(mainCardsContainer, cards.slice(0, showingCardsAmount));
    renderShowMoreButton();

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      let sortedCards = [];

      switch (sortType) {
        case Utils.sortType().DATE:
          sortedCards = cards.slice().sort((a, b) => b.releaseDate - a.releaseDate);
          break;
        case Utils.sortType().RATING:
          sortedCards = cards.slice().sort((a, b) => b.rating - a.rating);
          break;
        case Utils.sortType().DEFAULT:
          sortedCards = cards.slice(0, showingCardsAmount);
          break;
      }

      mainCardsContainer.innerHTML = ``;

      renderCards(mainCardsContainer, sortedCards);

      if (sortType === Utils.sortType().DEFAULT) {
        renderShowMoreButton();
      } else {
        Utils.remove(this._showMoreButtonComponent);
      }
    });

    const topRatedCardsContainer = this._container.querySelector(`.films-list__container--top-rated`);
    const mostCommentedCardsContainer = this._container.querySelector(`.films-list__container--most-commented`);

    renderExtraCards(cards, `rating`, topRatedCardsContainer);
    renderExtraCards(cards, `amountComments`, mostCommentedCardsContainer);
  }
}
