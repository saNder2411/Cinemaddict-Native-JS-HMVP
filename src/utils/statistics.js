import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const COLOR_BAR = `#ffe800`;

export default class StatisticsUtils {

  static getCardsByWatchingDateRange(cards, dateFrom, dateTo) {
    if (dateFrom === undefined && dateTo === undefined) {
      return cards.filter((card) => card.userDetails.watchingDate);
    }

    return cards.filter((card) => {
      const watchingDate = new Date(card.userDetails.watchingDate).getTime();

      return watchingDate >= dateFrom && watchingDate <= dateTo;
    });
  }

  static getGenreLabels(cards) {
    let genreLabels = cards.map((card) => card.cardInfo.genre)
      .reduce((acc, genres) => {
        return acc.concat(genres);
      }, []);

    genreLabels = new Set(genreLabels);

    return genreLabels;
  }

  static calcDataGenre(cards) {
    const dataGenre = {};
    const genreLabels = this.getGenreLabels(cards);

    genreLabels.forEach((it) => {
      dataGenre[it] = {
        amount: 0,
        color: COLOR_BAR,
      };
    });

    cards.forEach((card) => card.cardInfo.genre.forEach((it) => dataGenre[it].amount++));

    return dataGenre;
  }

  static renderStatsChart(statsCtx, cards, dateFrom, dateTo) {
    const cardsAlreadyWatched = (dateFrom) ? this.getCardsByWatchingDateRange(cards, dateFrom, dateTo)
      : this.getCardsByWatchingDateRange(cards);

    const genresAlreadyWatched = this.calcDataGenre(cardsAlreadyWatched);
    const sortDataGenresAlreadyWatched = Object.entries(genresAlreadyWatched).sort((a, b) => b[1].amount - a[1].amount);

    return new Chart(statsCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: sortDataGenresAlreadyWatched.map((it) => it[0]),
        datasets: [{
          data: sortDataGenresAlreadyWatched.map((it) => it[1].amount),
          backgroundColor: sortDataGenresAlreadyWatched.map((it) => it[1].color),
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20
            },
            anchor: `start`,
            align: `start`,
            color: `#ffffff`,
            offset: 50,
          }
        },
        legend: {
          display: false,
        },
        tooltips: {
          titleFontSize: 20,
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: false,
              display: true,
              fontSize: 20,
              fontColor: `#ffffff`,
              fontFamily: `Open sans`,
              padding: 110,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true,
              display: false,
            }
          }]
        },
      }
    });
  }

  static calcStatsDefaultData(cards) {
    const cardsAlreadyWatched = this.getCardsByWatchingDateRange(cards);
    const genresAlreadyWatched = this.calcDataGenre(cardsAlreadyWatched);
    const sortDataGenresAlreadyWatched = Object.entries(genresAlreadyWatched)
      .sort((a, b) => b[1].amount - a[1].amount);

    const statsDefaultDate = {
      alreadyWatched: cardsAlreadyWatched.length,
      topGenre: (sortDataGenresAlreadyWatched.length > 0) ? sortDataGenresAlreadyWatched[0][0] : `-`,
      allRuntime: 0,
    };

    cardsAlreadyWatched.reduce((acc, card) => {
      acc.allRuntime += card.cardInfo.runtime;

      return acc;
    }, statsDefaultDate);

    return statsDefaultDate;
  }
}
