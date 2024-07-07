export function makeElement<T extends keyof HTMLElementTagNameMap>(element: T) {
  const newElement = document.createElement(element);
  return newElement;
}
export function appendChild(parent: HTMLElement, child: HTMLElement) {
  parent.appendChild(child);
}
export function getBody() {
  return document.body;
}
