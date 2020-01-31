export default class Store {
  constructor(key, commentsKey, storage) {
    this._storeKey = key;
    this._commentsStoreKey = commentsKey;
    this._storage = storage;
  }

  getAll() {
    try {
      return JSON.parse(this._storage.getItem(this._storeKey));
    } catch (err) {
      return {};
    }
  }

  setItem(key, value) {
    const store = this.getAll();

    this._storage.setItem(this._storeKey, JSON.stringify(Object.assign({}, store, {[key]: value})));
  }

  removeItem(key) {
    const store = this.getAll();

    delete store[key];

    this._storage.setItem(this._storeKey, JSON.stringify(Object.assign({}, store)));
  }

  removeCommentIdInCard(commentId) {
    const storeCards = Object.values(this.getAll());

    storeCards.forEach((card) => {
      const indexDeleteComment = card.comments.indexOf(commentId);
      if (indexDeleteComment !== -1) {
        card.comments.splice(indexDeleteComment, 1);
        this.setItem(card.id, Object.assign({}, card, {offline: true}));
      }
    });
  }

  getComments() {
    try {
      const soreComments = this._storage.getItem(this._commentsStoreKey);
      return soreComments ? JSON.parse(soreComments) : {};
    } catch (err) {
      return {};
    }
  }

  setCommentItem(key, value) {
    const storeComments = this.getComments();

    this._storage.setItem(this._commentsStoreKey, JSON.stringify(Object.assign({}, storeComments, {[key]: value})));
  }

  removeCommentItem(commentId) {
    const storeComments = this.getComments();

    delete storeComments[commentId];

    this._storage.setItem(this._commentsStoreKey, JSON.stringify(Object.assign({}, storeComments)));
  }
}
