import { createCardTemplate, createCardsContainerTemplate } from './components/card.js';
import { createPopupDetailsTemplate } from './components/popup-details.js';
import { createMenuTemplate } from './components/menu.js';
import { createShowMoreButtonTemplate } from './components/show-more-button.js';
import { createUserRankTemplate } from './components/user-rank.js';

const CARD_COUNT = 5;
const EXTRA_CARD_COUNT = 2;
const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const siteFooter = document.querySelector(`.footer`);

const renderTemplate = (container, template, renderCount = 1, place = `beforeend`) => {
  for (let i = 0; i < renderCount; i++) {
    container.insertAdjacentHTML(place, template);
  }
};

renderTemplate(siteHeader, createUserRankTemplate());
renderTemplate(siteMain, createMenuTemplate());
renderTemplate(siteMain, createCardsContainerTemplate());
renderTemplate(siteFooter, createPopupDetailsTemplate(), undefined, `afterend`);

const cardsList = siteMain.querySelector(`.films-list`);
const mainCardsContainer = cardsList.querySelector(`.films-list__container`);
const extraCardsContainers = siteMain.querySelectorAll(`.films-list--extra .films-list__container`);

renderTemplate(mainCardsContainer, createCardTemplate(), CARD_COUNT);
renderTemplate(cardsList, createShowMoreButtonTemplate());
extraCardsContainers.forEach((container) => renderTemplate(container, createCardTemplate(), EXTRA_CARD_COUNT));
