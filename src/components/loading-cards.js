import AbstractComponent from './abstract-component.js';

const createLoadingCardsTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">Loading...</h2>
    </section>
  </section>`
);

export default class LoadingCards extends AbstractComponent {
  getTemplate() {
    return createLoadingCardsTemplate();
  }
}
