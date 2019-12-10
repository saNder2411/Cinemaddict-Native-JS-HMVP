import Utils from "../utils";

const createCardsContainerTemplate = () => {
  const topRatedClass = `films-list__container--top-rated`;
  const mostCommentedClass = `films-list__container--most-commented`;

  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

        <div class="films-list__container">
        </div>
      </section>

      <section class="films-list--extra">
        <h2 class="films-list__title">Top rated</h2>

        <div class="films-list__container ${topRatedClass}">
        </div>
      </section>

      <section class="films-list--extra">
        <h2 class="films-list__title">Most commented</h2>

        <div class="films-list__container ${mostCommentedClass}">
        </div>
      </section>
    </section>`
  );
};

export default class CardsContainer {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createCardsContainerTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = Utils.createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
