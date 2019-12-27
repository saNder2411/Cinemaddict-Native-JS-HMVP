export default class Render {
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

  static replace(oldComponent, newComponent) {
    const oldElement = oldComponent.getElement();
    const newElement = newComponent.getElement();

    if (oldElement && newElement) {
      oldElement.replaceWith(newElement);
    }
  }
}
