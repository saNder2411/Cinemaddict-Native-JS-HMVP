import Utils from './utils.js';
import FilterComponent from './components/filter.js';
import SortingComponent from './components/sorting.js';
import StatisticComponent from './components/statistic.js';
import UserRankComponent from './components/user-rank.js';
import NoCardsComponent from './components/no-cards.js';
import CardsContainerComponent from './components/cards-container.js';
import CardComponent from './components/card.js';
import PopupDetailsComponent from './components/popup-details.js';
import ShowMoreButtonComponent from './components/show-more-button.js';
import { generateCards } from './mock/card.js';
import { generateComments } from './mock/comments.js';
import {
  AMOUNT_CARDS, EXTRA_AMOUNT_CARDS, AMOUNT_COMMENTS, SHOWING_CARDS_AMOUNT_ON_START,
  SHOWING_CARDS_AMOUNT_BY_BUTTON, VALUES_FOR_USER_RANK
} from './const.js';

const cards = generateCards(AMOUNT_CARDS);

const calcFilterValues = (arrCards, ...prop) => {
  const [watchList, watched, favorite] = prop;
  return arrCards.reduce((sum, card) => {
    sum[watchList] = (card[watchList]) ? ++sum[watchList] : sum[watchList];
    sum[watched] = (card[watched]) ? ++sum[watched] : sum[watched];
    sum[favorite] = (card[favorite]) ? ++sum[favorite] : sum[favorite];

    return sum;
  }, { [watchList]: 0, [watched]: 0, [favorite]: 0 });
};
const filterValues = calcFilterValues(cards, `watchList`, `watched`, `favorite`);


const siteHeader = document.querySelector(`.header`);
Utils.renderMarkup(siteHeader, new UserRankComponent(filterValues.watched, VALUES_FOR_USER_RANK).getElement());


const siteMain = document.querySelector(`.main`);
Utils.renderMarkup(siteMain, new FilterComponent(filterValues).getElement());
Utils.renderMarkup(siteMain, new SortingComponent().getElement());


const siteFooter = document.querySelector(`.footer`);
const footerStatistic = siteFooter.querySelector(`.footer__statistics p`);
footerStatistic.textContent = `${cards.length} movies inside`;


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

  const showPopupDetailsOnClick = () => {
    Utils.renderMarkup(siteFooter, popupDetailsComponent.getElement(), Utils.renderPosition().AFTERBEGIN);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const hidePopupDetailsOnClick = () => {
    popupDetailsComponent.getElement().remove();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const posterCard = cardComponent.getElement().querySelector(`.film-card__poster`);
  posterCard.addEventListener(`click`, showPopupDetailsOnClick);

  const titleCard = cardComponent.getElement().querySelector(`.film-card__title`);
  titleCard.addEventListener(`click`, showPopupDetailsOnClick);

  const commentsCard = cardComponent.getElement().querySelector(`.film-card__comments`);
  commentsCard.addEventListener(`click`, showPopupDetailsOnClick);

  const hidePopupDetails = popupDetailsComponent.getElement().querySelector(`.film-details__close-btn`);
  hidePopupDetails.addEventListener(`click`, hidePopupDetailsOnClick);

  Utils.renderMarkup(container, cardComponent.getElement());
};


const isCards = cards.length > 0;

if (isCards) {
  Utils.renderMarkup(siteMain, new StatisticComponent().getElement());

  const cardsList = new CardsContainerComponent().getElement();
  Utils.renderMarkup(siteMain, cardsList);
  const mainCardsContainer = cardsList.querySelector(`.films-list__container`);


  let showingCardsAmount = SHOWING_CARDS_AMOUNT_ON_START;
  cards.slice(0, showingCardsAmount).forEach((card) => renderCard(mainCardsContainer, card));


  const showMoreButtonComponent = new ShowMoreButtonComponent();
  Utils.renderMarkup(mainCardsContainer, showMoreButtonComponent.getElement(), Utils.renderPosition().AFTEREND);

  const onShowMoreButtonClick = () => {
    const prevCardsAmount = showingCardsAmount;
    showingCardsAmount += SHOWING_CARDS_AMOUNT_BY_BUTTON;

    cards.slice(prevCardsAmount, showingCardsAmount).forEach((card) => renderCard(mainCardsContainer, card));

    if (showingCardsAmount >= cards.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  };
  showMoreButtonComponent.getElement().addEventListener(`click`, onShowMoreButtonClick);


  const renderExtraCards = (arrCards, sortProp, container) => {
    arrCards
      .slice()
      .sort((a, b) => b[sortProp] - a[sortProp])
      .slice(0, EXTRA_AMOUNT_CARDS)
      .forEach((card) => card[sortProp] > 0 ? renderCard(container, card) : null);
  };

  const topRatedCardsContainer = cardsList.querySelector(`.films-list__container--top-rated`);
  const mostCommentedCardsContainer = cardsList.querySelector(`.films-list__container--most-commented`);
  renderExtraCards(cards, `rating`, topRatedCardsContainer);
  renderExtraCards(cards, `amountComments`, mostCommentedCardsContainer);
} else {
  Utils.renderMarkup(siteMain, new NoCardsComponent().getElement());
}

