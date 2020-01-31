import AbstractSmartComponent from './abstract-smart-component.js';
import StatsUtils from '../utils/statistics.js';
import Common from '../utils/common.js';

const DateById = {
  'statistic-all-time': null,
  'statistic-today': new Date().setHours(0, 0, 0),
  'statistic-week': new Date().setDate(new Date().getDate() - 7),
  'statistic-month': new Date().setMonth(new Date().getMonth() - 1),
  'statistic-year': new Date().setFullYear(new Date().getFullYear() - 1),
};

const createStatsTemplate = (option = {}) => {
  const {cards, rank} = option;
  const {alreadyWatched, topGenre, allRuntime} = StatsUtils.calcStatsDefaultData(cards);
  const allDuration = Common.getTimeInHoursAndMinutes(allRuntime);

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">${rank}</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
        <label for="statistic-all-time" class="statistic__filters-label">All time</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
        <label for="statistic-today" class="statistic__filters-label">Today</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
        <label for="statistic-week" class="statistic__filters-label">Week</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
        <label for="statistic-month" class="statistic__filters-label">Month</label>

        <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
        <label for="statistic-year" class="statistic__filters-label">Year</label>
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${alreadyWatched} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
<p class="statistic__item-text">${allDuration.hours}<span class="statistic__item-description">h</span>${allDuration.minutes}<span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(cards, dateFrom, dateTo, rank) {
    super();
    this._cards = cards;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;
    this._rank = rank;
    this._statsChart = null;

    this._renderChart();
  }

  getTemplate() {
    return createStatsTemplate({
      cards: this._cards,
      rank: this._rank,
    });
  }

  _renderChart() {
    const statsCtx = this.getElement().querySelector(`.statistic__chart`);

    this._resetChart();
    this._statsChart = StatsUtils.renderStatsChart(statsCtx, this._cards, this._dateFrom, this._dateTo);
  }

  _resetChart() {
    if (this._statsChart) {
      this._statsChart.destroy();
      this._statsChart = null;
    }
  }

  reRender(cards, dateFrom, dateTo, rank) {
    this._cards = cards;
    this._dateFrom = dateFrom;
    this._dateTo = dateTo;
    this._rank = rank;

    super.reRender();
    this._renderChart();
  }

  show() {
    super.show();
    this.reRender(this._cards, this._dateFrom, this._dateTo, this._rank);
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`.statistic__filters`)
      .addEventListener(`click`, (evt) => {

        if (evt.target.tagName !== `INPUT`) {
          return;
        }

        this._dateFrom = DateById[evt.target.id];
        this.reRender(this._cards, this._dateFrom, this._dateTo, this._rank);
        this._setActiveItem(evt.target.id);
      });
  }

  _setActiveItem(filterItemId) {
    const item = this.getElement().querySelector(`#${filterItemId}`);

    if (item) {
      item.checked = true;
    }
  }

  recoveryListeners() {
    this._subscribeOnEvents();
  }
}
