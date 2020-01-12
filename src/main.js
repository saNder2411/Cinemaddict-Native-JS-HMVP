import UserRankComponent from './components/user-rank.js';
import FilterController from './controllers/filter.js';
import PageController from './controllers/page.js';
import StatisticsComponent from './components/statistics.js';
import CardsModel from './models/cards.js';
import Render from './utils/render.js';
import Filter from './utils/filter.js';
import Common from './utils/common.js';
import { generateCards } from './mock/card.js';
import { AMOUNT_CARDS, valuesForUserRank, FilterType } from './const.js';

const cards = generateCards(AMOUNT_CARDS);
const cardsModel = new CardsModel();
cardsModel.setCards(cards);
const filterValues = Filter.calcFilterValues(cards, Object.values(FilterType));

const siteHeader = document.querySelector(`.header`);
const userRank = Common.calcUserRank(filterValues.history, ...valuesForUserRank);
Render.renderMarkup(siteHeader, new UserRankComponent(userRank));

const siteMain = document.querySelector(`.main`);
const filterController = new FilterController(siteMain, cardsModel);
filterController.render();

const pageController = new PageController(siteMain, cardsModel);
pageController.render();

const dateTo = new Date();
const dateFrom = null;

const statsComponent = new StatisticsComponent(cardsModel.getCardsAll(), dateFrom, dateTo, userRank);
Render.renderMarkup(siteMain, statsComponent);
statsComponent.hide();

const filterComponent = filterController.getFilterComponent();

filterComponent.setFilterClickHandler((filterType) => {
  if (filterType === FilterType.STATISTICS) {
    pageController.hide();
    statsComponent.show();
    return;
  }

  pageController.show();
  statsComponent.hide();
});

const footerStatistic = document.querySelector(`.footer__statistics p`);
footerStatistic.textContent = `${cards.length} movies inside`;

