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

    return newElement.firstChild;
  }

  static renderPosition() {
    return {
      AFTERBEGIN: `afterbrgin`,
      AFTEREND: `afterend`,
      BEFOREEND: `beforeend`
    };
  }

  static renderMarkup(container, element, place = this.renderPosition().BEFOREEND) {
    switch (place) {
      case this.renderPosition().AFTERBEGIN:
        container.prepend(element);
        break;
      case this.renderPosition().AFTEREND:
        container.after(element);
        break;
      case this.renderPosition().BEFOREEND:
        container.append(element);
        break;
    }
  }

}

