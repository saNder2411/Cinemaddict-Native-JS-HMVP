const createUserRankTemplate = (amountWatched) => {
  let rank = ``;

  if (amountWatched >= 1 && amountWatched <= 10) {
    rank = `novice`;
  } else if (amountWatched >= 11 && amountWatched <= 20) {
    rank = `fan`;
  } else if (amountWatched > 20) {
    rank = `movie buff`;
  }

  return (
    `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${rank}</span>
    </p>`
  );
};

export { createUserRankTemplate };
