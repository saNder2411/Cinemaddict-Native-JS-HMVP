import CardModel from '../models/card.js';
import CommentModel from '../models/comment.js';

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

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  _load({ url, method = Method.GET, headers = new Headers(), body = null }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, { method, headers, body })
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }

  sync(data) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      headers: new Headers({ 'Content-Type': `application/json` }),
      body: JSON.stringify(data)
    })
      .then((response) => response.json());
  }

  getCards() {
    return this._load({ url: `movies` })
      .then((response) => response.json())
      .then(CardModel.parseCards);
  }

  updateCard(oldCardId, modDataCard) {
    return this._load({
      url: `movies/${oldCardId}`,
      method: Method.PUT,
      headers: new Headers({ 'Content-Type': `application/json` }),
      body: JSON.stringify(modDataCard.toRAW()),
    })
      .then((response) => response.json())
      .then(CardModel.parseCard);
  }

  getComments(cardId) {
    return this._load({ url: `comments/${cardId}` })
      .then((response) => response.json())
      .then(CommentModel.parseComments);
  }

  addComment(cardId, newCommentData) {
    return this._load({
      url: `comments/${cardId}`,
      method: Method.POST,
      headers: new Headers({ 'Content-Type': `application/json` }),
      body: JSON.stringify(newCommentData),
    })
      .then((response) => response.json())
      .then((result) => {
        const card = CardModel.parseCard(result.movie);
        const comments = CommentModel.parseComments(result.comments);

        return {
          card,
          comments,
        };
      });
  }

  deleteComment(commentId) {
    return this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });
  }
}
