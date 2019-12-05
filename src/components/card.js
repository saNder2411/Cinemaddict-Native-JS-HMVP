import { getRandomBoolean } from '../utils.js';

const MAX_LENGTH_DESCRIPTION = 140;
const CLASS_ACTIVE = `film-card__controls-item--active`;

const getThumbnailDescription = (descriptions, maxLength) => {
  const description = descriptions.filter(getRandomBoolean).slice(0, 3).join(` `);

  return (description.length > maxLength) ? `${description.slice(0, maxLength - 1)}…` : description;
};

const createCardTemplate = (card) => {
  const { title, rating, releaseDate, runtime, genres, poster, descriptions, amountComments, watchList, watched, favorite } = card;
  const watchListClass = watchList ? CLASS_ACTIVE : ``;
  const watchedClass = watched ? CLASS_ACTIVE : ``;
  const favoriteClass = favorite ? CLASS_ACTIVE : ``;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${releaseDate.getFullYear()}</span>
        <span class="film-card__duration">${runtime}</span>
        <span class="film-card__genre">${genres[0]}</span>
      </p>
      <img src="./images/posters/${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${getThumbnailDescription(descriptions, MAX_LENGTH_DESCRIPTION)}</p>
      <a class="film-card__comments">${amountComments} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${watchListClass}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${watchedClass}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${favoriteClass}">Mark as favorite</button>
      </form>
    </article>`
  );
};

const createCardsContainerTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container">
      </div>
    </section>

    <section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container">
      </div>
    </section>

    <section class="films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container">
      </div>
    </section>
  </section>`
);

export { createCardTemplate, createCardsContainerTemplate };
