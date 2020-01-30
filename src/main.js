import Api from './api/index.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
import UserRankComponent from './components/user-rank.js';
import FilterController from './controllers/filter.js';
import PageController from './controllers/page.js';
import CardsModel from './models/cards.js';
import Render from './utils/render.js';

const StoreName = {
  STORE_PREFIX: `cinemaddict-localstorage`,
  STORE_VER: `v1`,
  COMMENTS_STORE_PREFIX: `cinemaddict-comment-localstorage`,
  COMMENTS_STORE_VER: `v1`,
};

const STORE_NAME = `${StoreName.STORE_PREFIX}-${StoreName.STORE_VER}`;
const COMMENTS_STORE_NAME = `${StoreName.COMMENTS_STORE_PREFIX}-${StoreName.COMMENTS_STORE_VER}`;
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
});

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, COMMENTS_STORE_NAME, window.localStorage);

const apiWithProvider = new Provider(api, store);
const cardsModel = new CardsModel();

const siteHeader = document.querySelector(`.header`);
const siteMain = document.querySelector(`.main`);
const footerStatistic = document.querySelector(`.footer__statistics p`);

const pageController = new PageController(siteMain, cardsModel, apiWithProvider);
const filterController = new FilterController(siteMain, cardsModel, pageController);

filterController.render();
pageController.renderLoadingMassage();

apiWithProvider.getCards()
  .then((cards) => {
    cardsModel.setCards(cards);

    const userRank = filterController.getUserRank();

    Render.renderMarkup(siteHeader, new UserRankComponent(userRank));
    pageController.render();
    footerStatistic.textContent = `${cards.length} movies inside`;
  });

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  if (!apiWithProvider.getSynchronize()) {
    apiWithProvider.sync();
  }
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

