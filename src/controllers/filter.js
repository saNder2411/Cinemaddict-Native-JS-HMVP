import FilterComponent from '../components/filter.js';
import { FilterType } from '../const.js';
import Render from '../utils/render.js';
import Filter from '../utils/filter.js';

export default class FilterController {
  constructor(container, cardsModel) {
    this._container = container;
    this._cardsModel = cardsModel;

    this._activeFilterType = FilterType.All;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._cardsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allCards = this._cardsModel.getCardsAll();
    const filterValues = Filter.calcFilterValues(allCards, Object.values(FilterType));
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filterValues);
    this._filterComponent.setFilterClickHandler(this._onFilterChange);

    if (oldComponent) {
      Render.replace(oldComponent, this._filterComponent);
    } else {
      Render.renderMarkup(container, this._filterComponent);
    }
  }

  getFilterComponent() {
    return this._filterComponent;
  }

  _onFilterChange(filterType) {
    if (filterType !== FilterType.STATISTICS) {
      this._cardsModel.setFilter(filterType);
      this._activeFilterType = filterType;
    }
  }

  _onDataChange() {
    this.render();
  }
}
