import { createMenuTemplate } from './components/menu.js';
import { createUserRankTemplate } from './components/user-rank.js';
import { createCardsContainerTemplate } from './components/cards-container.js';
import { createCardTemplate } from './components/card.js';
import { createPopupDetailsTemplate } from './components/popup-details.js';
import { createShowMoreButtonTemplate } from './components/show-more-button.js';
import { generateCards } from './mock/card.js';
import { generateComments } from './mock/comments.js';

const AMOUNT_CARDS = 15;
const EXTRA_AMOUNT_CARDS = 2;
const AMOUNT_COMMENTS = 10;

const renderMarkup = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};


const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

renderMarkup(siteHeader, createUserRankTemplate());
renderMarkup(siteMain, createMenuTemplate());
renderMarkup(siteMain, createCardsContainerTemplate());


const cardsList = siteMain.querySelector(`.films`);
const mainCardsContainer = cardsList.querySelector(`.films-list__container`);
const cards = generateCards(AMOUNT_CARDS);

cards.forEach((card) => renderMarkup(mainCardsContainer, createCardTemplate(card)));


const topRatedCardsContainer = cardsList.querySelector(`.films-list__container--top-rated`);
const mostCommentedCardsContainer = cardsList.querySelector(`.films-list__container--most-commented`);

const renderExtraCards = (arrCards, sortProp, container) => {
  arrCards
    .slice()
    .sort((a, b) => b[sortProp] - a[sortProp])
    .slice(0, EXTRA_AMOUNT_CARDS)
    .forEach((card) => renderMarkup(container, createCardTemplate(card)));
};

renderExtraCards(cards, `rating`, topRatedCardsContainer);
renderExtraCards(cards, `amountComments`, mostCommentedCardsContainer);


const comments = generateComments(AMOUNT_COMMENTS);
renderMarkup(siteFooter, createPopupDetailsTemplate(cards[0], comments), `afterend`);

renderMarkup(cardsList, createShowMoreButtonTemplate());

