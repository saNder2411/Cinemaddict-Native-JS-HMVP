import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const COLOR_BAR = `#ffe800`;

export default class StatisticsUtils {

  static getCardsByHistoryDateRange(cards, dateFrom, dateTo) {
    if (dateFrom === undefined && dateTo === undefined) {
      return cards.filter((card) => card.historyDate);
    }

    return cards.filter((card) => {
      const historyDate = card.historyDate;

      return historyDate >= dateFrom && historyDate <= dateTo;
    });
  }

  static getGenresLabels(cards) {
    let genresLabels = cards.map((card) => card.genres)
      .reduce((acc, genres) => {
        return acc.concat(genres);
      }, []);

    genresLabels = new Set(genresLabels);

    return genresLabels;
  }

  static calcDataHistoryGenres(cards) {
    const dataHistoryGenres = {};
    const genresLabels = this.getGenresLabels(cards);

    genresLabels.forEach((it) => {
      dataHistoryGenres[it] = {
        amount: 0,
        color: COLOR_BAR,
      };
    });

    cards.forEach((card) => card.genres.forEach((genre) => dataHistoryGenres[genre].amount++));

    return dataHistoryGenres;
  }

  static renderStatsChart(statsCtx, cards, dateFrom, dateTo) {
    const cardsHistory = (dateFrom) ? this.getCardsByHistoryDateRange(cards, dateFrom, dateTo)
      : this.getCardsByHistoryDateRange(cards);

    const genresHistory = this.calcDataHistoryGenres(cardsHistory);
    const sortDataGenresHistory = Object.entries(genresHistory).sort((a, b) => b[1].amount - a[1].amount);

    return new Chart(statsCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: sortDataGenresHistory.map((it) => it[0]),
        datasets: [{
          data: sortDataGenresHistory.map((it) => it[1].amount),
          backgroundColor: sortDataGenresHistory.map((it) => it[1].color),
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
    const cardsHistory = this.getCardsByHistoryDateRange(cards);
    const genresHistory = this.calcDataHistoryGenres(cardsHistory);
    const sortDataGenresHistory = Object.entries(genresHistory)
      .sort((a, b) => b[1].amount - a[1].amount);

    const statsDefaultDate = {
      history: cardsHistory.length,
      topGenre: (sortDataGenresHistory.length > 0) ? sortDataGenresHistory[0][0] : `-`,
      allTimeH: 0,
      allTimeMin: 0,
    };

    cardsHistory.reduce((acc, card) => {
      if (card.runtime.includes(`h`)) {
        acc.allTimeH += +card.runtime.split(`h`)[0];
      }
      acc.allTimeMin += +card.runtime.slice(-3, -1);

      return acc;
    }, statsDefaultDate);

    const min = statsDefaultDate.allTimeMin % 60;
    const h = (statsDefaultDate.allTimeMin - min) / 60;

    statsDefaultDate.allTimeH += h;
    statsDefaultDate.allTimeMin = min;

    return statsDefaultDate;
  }
}
