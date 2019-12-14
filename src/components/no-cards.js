import AbstractComponent from './abstract-component.js';

const createNoCardsTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  </section>`
);

export default class NoCards extends AbstractComponent {
  getTemplate() {
    return createNoCardsTemplate();
  }
}
