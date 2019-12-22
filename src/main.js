import Utils from './utils.js';
import FilterComponent from './components/filter.js';
import UserRankComponent from './components/user-rank.js';
import PageController from './controllers/page.js';
import { generateCards } from './mock/card.js';
import { AMOUNT_CARDS, VALUES_FOR_USER_RANK } from './const.js';

const cards = generateCards(AMOUNT_CARDS);
const filterValues = Utils.calcFilterValues(cards, `isWatchlist`, `isWatched`, `isFavorite`);

const siteHeader = document.querySelector(`.header`);
Utils.renderMarkup(siteHeader, new UserRankComponent(filterValues.isWatched, VALUES_FOR_USER_RANK));

const siteMain = document.querySelector(`.main`);
Utils.renderMarkup(siteMain, new FilterComponent(filterValues));

const pageController = new PageController(siteMain);
pageController.render(cards);

const footerStatistic = document.querySelector(`.footer__statistics p`);
footerStatistic.textContent = `${cards.length} movies inside`;

