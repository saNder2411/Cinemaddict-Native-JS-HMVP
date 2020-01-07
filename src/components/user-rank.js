import AbstractComponent from './abstract-component.js';

const createUserRankTemplate = (amountWatched, minValRank, middleJrValRank, middleValRank, maxValRank) => {
  let rank = ``;

  if (amountWatched >= minValRank && amountWatched <= middleJrValRank) {
    rank = `novice`;
  } else if (amountWatched >= middleValRank && amountWatched <= maxValRank) {
    rank = `fan`;
  } else if (amountWatched > maxValRank) {
    rank = `movie buff`;
  }

  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>
    `
  );
};

export default class UserRank extends AbstractComponent {
  constructor(amountWatched, rankValues) {
    super();
    this._amountWatched = amountWatched;
    this._rankValues = rankValues;
  }

  getTemplate() {
    return createUserRankTemplate(this._amountWatched, ...this._rankValues);
  }
}
