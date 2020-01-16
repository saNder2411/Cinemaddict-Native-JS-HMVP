export default class Card {
  constructor(data) {
    this.id = data[`id`];
    this.comments = data[`comments`];
    this.cardInfo = {};
    this.cardInfo.title = data[`film_info`][`title`];
    this.cardInfo.alternativeTitle = data[`film_info`][`alternative_title`];
    this.cardInfo.totalRating = data[`film_info`][`total_rating`];
    this.cardInfo.poster = data[`film_info`][`poster`];
    this.cardInfo.ageRating = data[`film_info`][`age_rating`];
    this.cardInfo.director = data[`film_info`][`director`];
    this.cardInfo.writers = data[`film_info`][`writers`];
    this.cardInfo.actors = data[`film_info`][`actors`];
    this.cardInfo.release = {};
    this.cardInfo.release.date = data[`film_info`][`release`][`date`];
    this.cardInfo.release.releaseCountry = data[`film_info`][`release`][`release_country`];
    this.cardInfo.runtime = data[`film_info`][`runtime`];
    this.cardInfo.genre = data[`film_info`][`genre`];
    this.cardInfo.description = data[`film_info`][`description`];
    this.userDetails = {};
    this.userDetails.personalRating = data[`user_details`][`personal_rating`];
    this.userDetails.watchlist = data[`user_details`][`watchlist`];
    this.userDetails.alreadyWatched = data[`user_details`][`already_watched`];
    this.userDetails.watchingDate = data[`user_details`][`watching_date`];
    this.userDetails.favorite = data[`user_details`][`favorite`];
  }

  toRAW() {
    return {
      "id": this.id,
      "comments": this.comments,
      "film_info": {
        "title": this.cardInfo.title,
        "alternative_title": this.cardInfo.alternativeTitle,
        "total_rating": this.cardInfo.totalRating,
        "poster": this.cardInfo.poster,
        "age_rating": this.cardInfo.ageRating,
        "director": this.cardInfo.director,
        "writers": this.cardInfo.writers,
        "actors": this.cardInfo.actors,
        "release": {
          "date": this.cardInfo.release.date,
          "release_country": this.cardInfo.release.releaseCountry
        },
        "runtime": this.cardInfo.runtime,
        "genre": this.cardInfo.genre,
        "description": this.cardInfo.description
      },
      "user_details": {
        "personal_rating": this.userDetails.personalRating,
        "watchlist": this.userDetails.watchlist,
        "already_watched": this.userDetails.alreadyWatched,
        "watching_date": this.userDetails.watchingDate,
        "favorite": this.userDetails.favorite
      }
    };
  }

  static parseCard(result) {
    return new Card(result);
  }

  static parseCards(result) {
    return result.map(Card.parseCard);
  }

  static clone(card) {
    return new Card(card.toRAW());
  }
}
