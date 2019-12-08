import { createMenuTemplate } from './components/menu.js';
import { createUserRankTemplate } from './components/user-rank.js';
import { createCardsContainerTemplate } from './components/cards-container.js';
import { createCardTemplate } from './components/card.js';
import { createPopupDetailsTemplate } from './components/popup-details.js';
import { createShowMoreButtonTemplate } from './components/show-more-button.js';
import { generateCards } from './mock/card.js';
import { generateComments } from './mock/comments.js';
import {
  AMOUNT_CARDS, EXTRA_AMOUNT_CARDS, AMOUNT_COMMENTS, SHOWING_CARDS_AMOUNT_ON_START,
  SHOWING_CARDS_AMOUNT_BY_BUTTON, VALUES_FOR_USER_RANK
} from './const.js';

const renderMarkup = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};


const siteMain = document.querySelector(`.main`);
renderMarkup(siteMain, createCardsContainerTemplate());
const cardsList = siteMain.querySelector(`.films`);
const mainCardsContainer = cardsList.querySelector(`.films-list__container`);
const cards = generateCards(AMOUNT_CARDS);
let showingCardsAmount = SHOWING_CARDS_AMOUNT_ON_START;
cards.slice(0, showingCardsAmount).forEach((card) => renderMarkup(mainCardsContainer, createCardTemplate(card)));


renderMarkup(mainCardsContainer, createShowMoreButtonTemplate(), `afterend`);
const showMoreButton = cardsList.querySelector(`.films-list__show-more`);
const onShowMoreButtonClick = () => {
  const prevCardsAmount = showingCardsAmount;
  showingCardsAmount += SHOWING_CARDS_AMOUNT_BY_BUTTON;

  cards.slice(prevCardsAmount, showingCardsAmount).forEach((card) => renderMarkup(mainCardsContainer, createCardTemplate(card)));

  if (showingCardsAmount >= cards.length) {
    showMoreButton.remove();
  }
};
showMoreButton.addEventListener(`click`, onShowMoreButtonClick);


const topRatedCardsContainer = cardsList.querySelector(`.films-list__container--top-rated`);
const mostCommentedCardsContainer = cardsList.querySelector(`.films-list__container--most-commented`);
const renderExtraCards = (arrCards, sortProp, container) => {
  arrCards
    .slice()
    .sort((a, b) => b[sortProp] - a[sortProp])
    .slice(0, EXTRA_AMOUNT_CARDS)
    .forEach((card) => card[sortProp] > 0 ? renderMarkup(container, createCardTemplate(card)) : null);
};
renderExtraCards(cards, `rating`, topRatedCardsContainer);
renderExtraCards(cards, `amountComments`, mostCommentedCardsContainer);


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
renderMarkup(siteMain, createMenuTemplate(filterValues), `afterbegin`);


const siteHeader = document.querySelector(`.header`);
renderMarkup(siteHeader, createUserRankTemplate(filterValues.watched, ...VALUES_FOR_USER_RANK));


const siteFooter = document.querySelector(`.footer`);
const footerStat = siteFooter.querySelector(`.footer__statistics p`);
const comments = generateComments(AMOUNT_COMMENTS);
footerStat.textContent = `${cards.length} movies inside`;
// renderMarkup(siteFooter, createPopupDetailsTemplate(cards[0], comments), `afterend`);
