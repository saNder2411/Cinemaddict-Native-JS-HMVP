import API from './api.js';
import UserRankComponent from './components/user-rank.js';
import FilterController from './controllers/filter.js';
import PageController from './controllers/page.js';
import StatisticsComponent from './components/statistics.js';
import CardsModel from './models/cards.js';
import Render from './utils/render.js';
import Filter from './utils/filter.js';
import Common from './utils/common.js';
import { ValuesForUserRank, FilterType, END_POINT, AUTHORIZATION } from './const.js';


const dateTo = new Date();
const dateFrom = null;

const api = new API(END_POINT, AUTHORIZATION);
const cardsModel = new CardsModel();

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const footerStatistic = document.querySelector(`.footer__statistics p`);

api.getCards()
  .then((cards) => {
    cardsModel.setCards(cards);


    const filterValues = Filter.calcFilterValues(cardsModel.getCardsAll(), Object.values(FilterType));
    const userRank = Common.calcUserRank(filterValues.alreadyWatched, ...ValuesForUserRank);

    const filterController = new FilterController(siteMain, cardsModel);
    const pageController = new PageController(siteMain, cardsModel, api);
    const statsComponent = new StatisticsComponent(cardsModel.getCardsAll(), dateFrom, dateTo, userRank);

    Render.renderMarkup(siteHeader, new UserRankComponent(userRank));
    filterController.render();
    pageController.render();
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

    footerStatistic.textContent = `${cards.length} movies inside`;
  });


