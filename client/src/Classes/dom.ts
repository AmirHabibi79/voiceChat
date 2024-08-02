export default class DOM {
  private _body: HTMLElement;
  private _document: Document;

  constructor() {
    this._body = document.body;
    this._document = document;
  }
  makeElement<T extends keyof HTMLElementTagNameMap>(element: T) {
    const newElement = document.createElement(element);
    return newElement;
  }
  getElementByClass<T extends HTMLElement>(className: string) {
    const element: T = this._document.querySelector("." + className);
    return element;
  }
  appendChild(parent: HTMLElement, child: HTMLElement) {
    parent.appendChild(child);
  }
  appendChildren(parent: HTMLElement, children: HTMLElement[]) {
    children.forEach(function (child) {
      parent.appendChild(child);
    });
  }
  removeTextContent(element: HTMLElement) {
    element.textContent = "";
  }
  removeElement(element: HTMLElement) {
    element.remove();
  }
  getBody() {
    return this._body;
  }
  appendToBody(child: HTMLElement) {
    this._body.appendChild(child);
  }
  setInnerHTML<T extends HTMLElement>(element: T, innerHTML: string) {
    element.innerHTML = innerHTML;
  }
  setPlaceholder<T extends HTMLInputElement>(element: T, placeholder: string) {
    element.placeholder = placeholder;
  }
  AddClassList<T extends HTMLElement>(element: T, classList: string[]) {
    element.classList.add(...classList);
  }
  removeClassList<T extends HTMLElement>(element: T, classList: string[]) {
    element.classList.remove(...classList);
  }
}
