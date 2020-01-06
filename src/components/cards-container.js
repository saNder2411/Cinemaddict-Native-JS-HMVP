import AbstractComponent from './abstract-component.js';

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

export default class CardsContainer extends AbstractComponent {
  constructor() {
    super();

    this.mainCardsContainer = this.getElement().querySelector(`.films-list__container`);
    this.topRatedCardsContainer = this.getElement().querySelector(`.films-list__container--top-rated`);
    this.mostCommentedCardsContainer = this.getElement().querySelector(`.films-list__container--most-commented`);
  }

  getTemplate() {
    return createCardsContainerTemplate();
  }
}
