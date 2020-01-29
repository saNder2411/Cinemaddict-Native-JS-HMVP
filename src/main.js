import API from './api/index.js';
import UserRankComponent from './components/user-rank.js';
import FilterController from './controllers/filter.js';
import PageController from './controllers/page.js';
import CardsModel from './models/cards.js';
import Render from './utils/render.js';

const AUTHORIZATION = `Basic er883jdzbdf`;
const END_POINT = `https://htmlacademy-es-10.appspot.com/cinemaddict`;

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      document.title += `[SW]`;
    })
    .catch(() => {
      document.title += `[no SW]`;
    });
})

const api = new API(END_POINT, AUTHORIZATION);
const cardsModel = new CardsModel();

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const footerStatistic = document.querySelector(`.footer__statistics p`);

const pageController = new PageController(siteMain, cardsModel, api);
const filterController = new FilterController(siteMain, cardsModel, pageController);

filterController.render();
pageController.renderLoadingMassage();

api.getCards()
  .then((cards) => {
    cardsModel.setCards(cards);

    const userRank = filterController.getUserRank();

    Render.renderMarkup(siteHeader, new UserRankComponent(userRank));
    pageController.render();
    footerStatistic.textContent = `${cards.length} movies inside`;
  });


