export default class Utils {
  static getRandomNumberFromPeriod(max, min = 0) {
    return min + Math.floor((max - min) * Math.random());
  }

  static getRandomBoolean() {
    return Math.random() > 0.5;
  }

  static checksBoolean(test, positiveResult) {
    return test ? positiveResult : ``;
  }

  static getRandomDate(shiftInMin = 20000000, sign = -1) {
    const currentDate = new Date();
    const diffValue = sign * this.getRandomNumberFromPeriod(shiftInMin);

    currentDate.setMinutes(currentDate.getMinutes() + diffValue);

    return currentDate;
  }

  static createElement(template) {
    const newElement = document.createElement(`div`);
    newElement.innerHTML = template;

    return newElement.firstElementChild;
  }

  static renderPosition() {
    return {
      AFTERBEGIN: `afterbrgin`,
      AFTEREND: `afterend`,
      BEFOREEND: `beforeend`,
      BEFOREBEGIN: `beforebegin`
    };
  }

  static renderMarkup(container, component, place = this.renderPosition().BEFOREEND) {
    switch (place) {
      case this.renderPosition().AFTERBEGIN:
        container.prepend(component.getElement());
        break;
      case this.renderPosition().AFTEREND:
        container.after(component.getElement());
        break;
      case this.renderPosition().BEFOREEND:
        container.append(component.getElement());
        break;
      case this.renderPosition().BEFOREBEGIN:
        container.before(component.getElement());
        break;
    }
  }

  static remove(component) {
    component.getElement().remove();
    component.removeElement();
  }

  static calcFilterValues(arrCards, ...prop) {
    const [isWatchlist, isWatched, isFavorite] = prop;
    return arrCards.reduce((sum, card) => {
      sum[isWatchlist] = (card[isWatchlist]) ? ++sum[isWatchlist] : sum[isWatchlist];
      sum[isWatched] = (card[isWatched]) ? ++sum[isWatched] : sum[isWatched];
      sum[isFavorite] = (card[isFavorite]) ? ++sum[isFavorite] : sum[isFavorite];

      return sum;
    }, { [isWatchlist]: 0, [isWatched]: 0, [isFavorite]: 0 });
  }

  static sortType() {
    return {
      DEFAULT: `default`,
      DATE: `date`,
      RATING: `rating`,
    };
  }

  static modeCard() {
    return {
      DEFAULT: `default`,
      DETAILS: `details`,
    };
  }

  static replace(oldComponent, newComponent) {
    const oldElement = oldComponent.getElement();
    const newElement = newComponent.getElement();

    if (oldElement && newElement) {
      oldElement.replaceWith(newElement);
    }
  }
}

