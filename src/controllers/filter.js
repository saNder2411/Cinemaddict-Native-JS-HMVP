import FilterComponent from '../components/filter.js';
import StatisticsComponent from '../components/statistics.js';
import {FilterType} from '../const.js';
import Render from '../utils/render.js';
import Filter from '../utils/filter.js';
import Common from '../utils/common.js';

const ValuesForUserRank = [1, 10, 11, 20];

export default class FilterController {
  constructor(container, cardsModel, pageController) {
    this._container = container;
    this._cardsModel = cardsModel;
    this._pageController = pageController;

    this._activeFilterType = FilterType.All;
    this._filterComponent = null;
    this._statsComponent = null;
    this._userRank = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._showStats = this._showStats.bind(this);

    this._cardsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allCards = this._cardsModel.getCardsAll();
    const filterValues = Filter.calcFilterValues(allCards, Object.values(FilterType));
    const oldFilterComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filterValues);
    this._filterComponent.setFilterClickHandler(this._onFilterChange);

    if (oldFilterComponent) {
      Render.replace(oldFilterComponent, this._filterComponent);
    } else {
      Render.renderMarkup(container, this._filterComponent);
    }


    const dateTo = new Date();
    const dateFrom = null;
    const userRank = Common.calcUserRank(filterValues.alreadyWatched, ...ValuesForUserRank);
    const oldStatsComponent = this._statsComponent;

    this._userRank = userRank;
    this._statsComponent = new StatisticsComponent(allCards, dateFrom, dateTo, userRank);
    this._filterComponent.setStatsClickHandler(this._showStats);

    if (oldStatsComponent) {
      Render.replace(oldStatsComponent, this._statsComponent);
      this._statsComponent.hide();
    } else {
      Render.renderMarkup(container, this._statsComponent);
      this._statsComponent.hide();
    }
  }

  getUserRank() {
    return this._userRank;
  }

  _showStats(filterType) {
    if (filterType === FilterType.STATISTICS) {
      this._pageController.hide();
      this._statsComponent.show();

      return;
    }

    this._pageController.show();
    this._statsComponent.hide();
  }

  _onFilterChange(filterType) {
    if (filterType !== FilterType.STATISTICS) {
      this._cardsModel.setFilter(filterType);
      this._activeFilterType = filterType;
      this._pageController.preventSortDefault();
    }
  }

  _onDataChange() {
    this.render();
  }
}
