export default class DOM {
  private _body: HTMLElement;
  constructor() {
    this._body = document.body;
  }
  makeElement<T extends keyof HTMLElementTagNameMap>(element: T) {
    const newElement = document.createElement(element);
    return newElement;
  }
  appendChild(parent: HTMLElement, child: HTMLElement) {
    parent.appendChild(child);
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
  setOnClick<T extends HTMLElement>(
    element: T,
    onClick: (event: MouseEvent) => void
  ) {
    element.onclick = onClick;
  }
}
