import { createMenuTemplate } from './components/menu.js';
import { createUserRankTemplate } from './components/user-rank.js';
import { createCardTemplate, createCardsContainerTemplate } from './components/card.js';
// import { createPopupDetailsTemplate } from './components/popup-details.js';
import { createShowMoreButtonTemplate } from './components/show-more-button.js';
import { generateCards } from './mock/card.js';

const AMOUNT_CARDS = 15;
const EXTRA_AMOUNT_CARDS = 2;

const renderMarkup = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
// const siteFooter = document.querySelector(`.footer`);

renderMarkup(siteHeader, createUserRankTemplate());
renderMarkup(siteMain, createMenuTemplate());
renderMarkup(siteMain, createCardsContainerTemplate());
// renderMarkup(siteFooter, createPopupDetailsTemplate(), undefined, `afterend`);

const cardsList = siteMain.querySelector(`.films-list`);
const mainCardsContainer = cardsList.querySelector(`.films-list__container`);
const cards = generateCards(AMOUNT_CARDS);

cards.forEach((card) => renderMarkup(mainCardsContainer, createCardTemplate(card)));

const extraCardsContainers = siteMain.querySelectorAll(`.films-list--extra .films-list__container`);
const topRatedCardsContainer = extraCardsContainers[0];
const mostCommentedCardsContainer = extraCardsContainers[extraCardsContainers.length - 1];

const renderExtraCards = (arrCards, sortProp, container) => {
  arrCards
    .slice()
    .sort((a, b) => b[sortProp] - a[sortProp])
    .slice(0, EXTRA_AMOUNT_CARDS)
    .forEach((card) => renderMarkup(container, createCardTemplate(card)));
};

renderExtraCards(cards, `rating`, topRatedCardsContainer);
renderExtraCards(cards, `amountComments`, mostCommentedCardsContainer);

renderMarkup(cardsList, createShowMoreButtonTemplate());

