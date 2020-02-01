import nanoid from 'nanoid';
import Card from '../models/card.js';
import Comment from '../models/comment.js';

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
    this._isSynchronized = true;
  }

  getCards() {
    if (this._isOnLine()) {
      return this._api.getCards()
        .then((cards) => {
          cards.forEach((card) => this._store.setItem(card.id, card.getModelToRAW()));
          return cards;
        });
    }

    const storeCards = Object.values(this._store.getAll());

    this._isSynchronized = false;

    return Promise.resolve(Card.parseCards(storeCards));
  }

  updateCard(oldCardId, modCard) {
    if (this._isOnLine()) {
      return this._api.updateCard(oldCardId, modCard)
        .then((newCard) => {
          this._store.setItem(newCard.id, newCard.getModelToRAW());
          return newCard;
        });
    }

    const fakeUpdateCard = Card.parseCard(Object.assign({}, modCard.getModelToRAW(), {id: oldCardId}));

    this._isSynchronized = false;
    this._store.setItem(oldCardId, Object.assign({}, fakeUpdateCard.getModelToRAW(), {offline: true}));

    return Promise.resolve(fakeUpdateCard);
  }

  _getCommentsCardFromStore(cardId) {
    const storeCard = Object.values(this._store.getAll()).find((card) => card.id === cardId);
    const storeComments = Object.values(this._store.getComments());
    const comments = [];

    storeCard.comments.forEach((id) => {
      const comment = storeComments.find((it) => it.id === id);
      if (comment) {
        comments.push(comment);
      }
    });

    return comments.length > 0 ? Comment.parseComments(comments) : comments;
  }

  getComments(cardId) {
    if (this._isOnLine()) {
      return this._api.getComments(cardId)
        .then((comments) => {
          comments.forEach((comment) => this._store.setCommentItem(comment.id, comment.getModelToRAW()));
          return comments;
        });
    }

    const comments = this._getCommentsCardFromStore(cardId);

    return Promise.resolve(comments);
  }

  addComment(cardId, newCommentData) {
    if (this._isOnLine()) {
      return this._api.addComment(cardId, newCommentData)
        .then((data) => {
          this._store.setItem(data.card.id, data.card.getModelToRAW());

          data.comments.forEach((comment) => this._store.setCommentItem(comment.id, comment.getModelToRAW()));

          return data;
        });
    }

    const storeCard = Object.values(this._store.getAll()).find((card) => card.id === cardId);
    const storeCardComments = this._getCommentsCardFromStore(cardId);
    const fakeNewCommentId = nanoid();
    const fakeNewComment = Comment.parseComment(Object.assign({}, {id: fakeNewCommentId, author: `User Name`}, newCommentData));

    storeCard.comments.push(fakeNewCommentId);
    storeCardComments.push(fakeNewComment);

    this._isSynchronized = false;
    this._store.setItem(cardId, Object.assign({}, storeCard, {offline: true}));
    this._store.setCommentItem(fakeNewCommentId, Object.assign({}, fakeNewComment.getModelToRAW(), {offline: true}));
    const result = {
      card: Card.parseCard(storeCard),
      comments: storeCardComments,
    };

    return Promise.resolve(result);
  }

  deleteComment(commentId) {
    if (this._isOnLine()) {
      return this._api.deleteComment(commentId)
        .then(() => {
          this._store.removeCommentItem(commentId);
          this._store.removeCommentIdInCard(commentId);
        });
    }

    this._isSynchronized = false;
    this._store.removeCommentItem(commentId);
    this._store.removeCommentIdInCard(commentId);

    return Promise.resolve();
  }

  sync() {
    if (this._isOnLine()) {
      const storeCards = Object.values(this._store.getAll());
      const storeComments = Object.values(this._store.getComments());

      return this._api.sync(storeCards)
        .then((response) => {
          storeCards
            .forEach((card) => {
              if (card.offline) {
                this._store.removeItem(card.id);
              }
            });

          storeComments.forEach((comment) => {
            this._store.removeCommentItem(comment.id);
          });

          const updateCards = response.updated;

          updateCards.forEach((card) => {
            this._store.setItem(card.id, card);
          });

          this._isSynchronized = true;

          return Promise.resolve();
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  getSynchronize() {
    return this._isSynchronized;
  }

  _isOnLine() {
    return window.navigator.onLine;
  }
}
