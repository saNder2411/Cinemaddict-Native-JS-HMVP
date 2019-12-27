import Render from './utils/render.js';
import Filter from './utils/filter.js';
import FilterController from './controllers/filter.js';
import UserRankComponent from './components/user-rank.js';
import PageController from './controllers/page.js';
import CardsModel from './models/cards.js';
import { generateCards } from './mock/card.js';
import { AMOUNT_CARDS, VALUES_FOR_USER_RANK, FilterType } from './const.js';

const cards = generateCards(AMOUNT_CARDS);
const cardsModel = new CardsModel();
cardsModel.setCards(cards);
const filterValues = Filter.calcFilterValues(cards, Object.values(FilterType));

const siteHeader = document.querySelector(`.header`);
Render.renderMarkup(siteHeader, new UserRankComponent(filterValues.history, VALUES_FOR_USER_RANK));

const siteMain = document.querySelector(`.main`);
const filterController = new FilterController(siteMain, cardsModel);
filterController.render();

const pageController = new PageController(siteMain, cardsModel);
pageController.render();

const footerStatistic = document.querySelector(`.footer__statistics p`);
footerStatistic.textContent = `${cards.length} movies inside`;

