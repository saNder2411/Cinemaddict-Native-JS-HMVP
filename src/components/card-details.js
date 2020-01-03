import AbstractSmartComponent from './abstract-smart-component.js';
import Common from '../utils/common.js';
import moment from 'moment';
import { MAX_RATING } from '../const.js';
import he from 'he';

const createGenresMarkup = (genres) => {
  const title = genres.length > 1 ? `Genres` : `Genre`;

  return (
    `<td class="film-details__term">${title}</td>
    <td class="film-details__cell">
      ${genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join(`\n`)}
    </td >`
  );
};

const createUserRatingMarkup = (maxRating) => {
  return new Array(maxRating)
    .fill(``)
    .map((markup, i) => {
      markup = (
        `<input type="radio" name="score" class="film-details__user-rating-input visually-hidden" value="${i + 1}"
          id="rating-${i + 1}" ${Common.checksBoolean((i === maxRating - 1), `checked`)}>
        <label class="film-details__user-rating-label" for="rating-${i + 1}">${i + 1}</label>`
      );
      return markup;
    })
    .join(`\n`);
};

const createUserRatingContainerMarkup = (poster, title) => {
  return (
    `<div class="form-details__middle-container">
      <section class="film-details__user-rating-wrap">
        <div class="film-details__user-rating-controls">
          <button class="film-details__watched-reset" type="button">Undo</button>
        </div>

        <div class="film-details__user-score">
          <div class="film-details__user-rating-poster">
            <img src="./images/posters/${poster}" alt="film-poster" class="film-details__user-rating-img">
          </div>

          <section class="film-details__user-rating-inner">
            <h3 class="film-details__user-rating-title">${title}</h3>

            <p class="film-details__user-rating-feelings">How you feel it?</p>

            <div class="film-details__user-rating-score">
              ${createUserRatingMarkup(MAX_RATING)}
            </div>
          </section>
        </div>
      </section>
    </div>`
  );
};

const createImageEmojiMarkup = (emojiSrc) => {
  return emojiSrc ? (`<img src="${emojiSrc}" width="55" height="55" alt="emoji">`) : ``;
};


const createCardDetailsTemplate = (card, option = {}) => {
  const { releaseDate, comments } = card;
  const { watchlist, history, favorites, emojiSrc, currentCommentText } = option;
  const date = `${moment(releaseDate).format(`DD MMMM YYYY`)}`;

  const createCommentsMarkup = (arrComments) => {
    return arrComments.map((comment) => {
      const text = he.encode(comment.text);
      const commentDate = moment(comment.date).fromNow();
      return (
        `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="${comment.urlEmoji ? comment.urlEmoji : `./images/emoji/smile.png`}" width="55" height="55" alt="emoji">
          </span>
          <div>
            <p class="film-details__comment-text">${text}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${comment.author}</span>
              <span class="film-details__comment-day">${commentDate}</span>
              <button id="${comment.id}" class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`
      );
    })
      .join(`\n`);
  };

  return (
    `<section id="${card.id}" class="film-details" style="animation: none">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="./images/posters/${card.poster}" alt="">

              <p class="film-details__age">${card.ageLimit}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${card.title}</h3>
                  <p class="film-details__title-original">Original: ${card.title}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${card.rating}</p>
                  <p class="film-details__user-rating">Your rate ${Common.checksBoolean(history, card.yourRate)}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${card.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${card.writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${card.actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${date}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${card.runtime}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${card.country}</td>
                </tr>
                <tr class="film-details__row">
                  ${createGenresMarkup(card.genres)}
                </tr>
              </table>

              <p class="film-details__film-description">
              ${card.descriptions}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${Common.checksBoolean(watchlist, `checked`)}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist" >Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${Common.checksBoolean(history, `checked`)}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite"${Common.checksBoolean(favorites, `checked`)}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>
        ${Common.checksBoolean(history, createUserRatingContainerMarkup(card.poster, card.title))}
        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

            <ul class="film-details__comments-list">
              ${createCommentsMarkup(comments)}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">${createImageEmojiMarkup(emojiSrc)}</div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${currentCommentText ? currentCommentText : ``}</textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="neutral-face">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-gpuke" value="grinning">
                <label class="film-details__emoji-label" for="emoji-gpuke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="grinning">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class CardDetails extends AbstractSmartComponent {
  constructor(card) {
    super();
    this._card = card;
    this._watchlist = this._card.watchlist;
    this._history = this._card.history;
    this._favorites = this._card.favorites;
    this._emojiSrc = ``;
    this._currentCommentText = ``;
    this._hideCardDetailsHandler = null;
    this._deleteCommentButtonClickHandler = null;
    this._submitFormHandler = null;

    this._subscribeOnEvents();
    this._disinfectsCommentText();
  }

  getTemplate() {
    return createCardDetailsTemplate(this._card, {
      watchlist: this._watchlist,
      history: this._history,
      favorites: this._favorites,
      emojiSrc: this._emojiSrc,
      currentCommentText: this._currentCommentText,
    });
  }

  _disinfectsCommentText() {
    this._card.comments.forEach((it) => {
      it.text = he.encode(it.text);
    });
  }

  setHideCardDetailsClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`)
      .addEventListener(`click`, handler);

    this._hideCardDetailsHandler = handler;
  }

  setSubmitFormHandler(handler) {
    const form = this.getElement().querySelector(`.film-details__inner`);

    form.addEventListener(`keydown`, (evt) => {
      const isCtrlKey = evt.ctrlKey;
      const isEnterKey = evt.key === `Enter`;
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
      const TextareaValue = form.elements[`comment`].value;
      this._currentCommentText = TextareaValue;

      if (isEscKey) {
        evt.stopPropagation();
      }

      if (isCtrlKey && isEnterKey && TextareaValue) {
        const newCommentData = this._getData(form);
        handler(newCommentData);
        this._currentCommentText = ``;
        // form.submit();
      }
    });

    this._submitFormHandler = handler;
  }

  _parseFormData(formData) {
    return {
      id: null,
      urlEmoji: this._emojiSrc,
      text: formData.get(`comment`),
      author: null,
      date: new Date(),
    };
  }

  _getData(form) {
    const formData = new FormData(form);

    return this._parseFormData(formData);
  }

  setDeleteCommentButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__comments-list`)
      .addEventListener(`click`, (evt) => {
        evt.preventDefault();

        if (evt.target.tagName !== `BUTTON`) {
          return;
        }

        handler(+evt.target.id);
      });

    this._deleteCommentButtonClickHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelector(`#watchlist`)// в этом месте по id селектору не работает
      .addEventListener(`click`, () => {
        this._watchlist = !this._watchlist;

        this.reRender();
      });

    element.querySelector(`#watched`)
      .addEventListener(`click`, () => {
        this._history = !this._history;

        this.reRender();
      });

    element.querySelector(`#favorite`)
      .addEventListener(`click`, () => {
        this._favorites = !this._favorites;

        this.reRender();
      });

    element.querySelector(`.film-details__emoji-list`)
      .addEventListener(`click`, (evt) => {
        if (evt.target.tagName === `IMG`) {
          this._emojiSrc = evt.target.src;

          this.reRender();
        }
      });

    element.querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, (evt) => {
        this._currentCommentText = evt.target.value;
      });
  }

  recoveryListeners() {
    this._subscribeOnEvents();
    this.setHideCardDetailsClickHandler(this._hideCardDetailsHandler);
    this.setDeleteCommentButtonClickHandler(this._deleteCommentButtonClickHandler);
    this.setSubmitFormHandler(this._submitFormHandler);
  }

  reset() {
    this._watchlist = this._card.watchlist;
    this._history = this._card.history;
    this._favorites = this._card.favorites;
    this._emojiSrc = ``;
    this._currentCommentText = ``;

    this.reRender();
  }
}
