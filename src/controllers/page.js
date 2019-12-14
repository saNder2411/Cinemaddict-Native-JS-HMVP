import Utils from '../utils.js';
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
    const targetClassName = evt.target.className;
    if (targetClassName === `film-card__poster` || targetClassName === `film-card__title` || targetClassName === `film-card__comments`) {
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


export default class PageController {
  constructor(container) {
    this._container = container;
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
    Utils.renderMarkup(this._container, this._statisticComponent);
    Utils.renderMarkup(this._container, this._cardsContainerComponent);

    const mainCardsContainer = this._container.querySelector(`.films-list__container`);

    let showingCardsAmount = SHOWING_CARDS_AMOUNT_ON_START;
    cards.slice(0, showingCardsAmount).forEach((card) => renderCard(mainCardsContainer, card));

    Utils.renderMarkup(mainCardsContainer, this._showMoreButtonComponent, Utils.renderPosition().AFTEREND);

    const onShowMoreButtonClick = () => {
      const prevCardsAmount = showingCardsAmount;
      showingCardsAmount += SHOWING_CARDS_AMOUNT_BY_BUTTON;

      cards.slice(prevCardsAmount, showingCardsAmount)
        .forEach((card) => renderCard(mainCardsContainer, card));

      if (showingCardsAmount >= cards.length) {
        Utils.remove(this._showMoreButtonComponent);
      }
    };

    this._showMoreButtonComponent.setShowMoreClickHandler(onShowMoreButtonClick);


    const renderExtraCards = (arrCards, sortProp, container) => {
      arrCards
        .slice()
        .sort((a, b) => b[sortProp] - a[sortProp])
        .slice(0, EXTRA_AMOUNT_CARDS)
        .forEach((card) => card[sortProp] > 0 ? renderCard(container, card) : null);
    };

    const topRatedCardsContainer = this._container.querySelector(`.films-list__container--top-rated`);
    const mostCommentedCardsContainer = this._container.querySelector(`.films-list__container--most-commented`);
    renderExtraCards(cards, `rating`, topRatedCardsContainer);
    renderExtraCards(cards, `amountComments`, mostCommentedCardsContainer);
  }
}
