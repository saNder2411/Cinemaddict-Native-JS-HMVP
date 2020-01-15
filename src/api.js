import CardModel from './models/card.js';
import CommentModel from './models/comment.js';

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const ResponseStatusOkPeriod = {
  MIN: 200,
  MAX: 300,
};

const checkStatus = (response) => {
  if (response.status >= ResponseStatusOkPeriod.MIN && response.status < ResponseStatusOkPeriod.MAX) {
    return response;
  } else {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
};

export default class API {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;

    this._setCommentsCard = this._setCommentsCard.bind(this);
    this._getCommentsCard = this._getCommentsCard.bind(this);
  }

  _load({ url, method = Method.GET, headers = new Headers(), body = null }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, { method, headers, body })
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  getCards() {
    return this._load({ url: `movies` })
      .then((response) => response.json())
      .then(this._setCommentsCard)
      .then((cards) => Promise.all(cards));
  }

  _setCommentsCard(cards) {
    return cards.map(this._getCommentsCard);
  }

  _getCommentsCard(card) {
    return this._load({ url: `comments/${card[`id`]}` })
      .then((response) => response.json())
      .then(CommentModel.parseComments)
      .then((comments) => {
        card[`loadComments`] = comments;
        return card;
      })
      .then(CardModel.parseCard);
  }

  updateCard(oldCardId, newCard) {
    return this._load({
      url: `movies/${oldCardId}`,
      method: Method.PUT,
      headers: new Headers({ 'Content-Type': `application/json` }),
      body: JSON.stringify(newCard.toRAW()),
    })
      .then((response) => response.json())
      .then(CardModel.parseCard);

  }

  createComment() {

  }

  deleteComment() {

  }
}
