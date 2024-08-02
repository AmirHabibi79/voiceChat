import DOM from "./dom";
import Tostify from "toastify-js";
export default class UI {
  private _dom: DOM;
  constructor() {
    this._dom = new DOM();
  }
  makeModal(heading: string, onClose: () => void, shouldClose: boolean) {
    const self = this;
    const modal = this._dom.makeElement("div");

    const randomClass = "modal_" + Date.now().toString();
    this._dom.AddClassList(modal, [
      randomClass,
      "absolute",
      "w-full",
      "h-full",
      "left-0",
      "top-0",
      "bg-[rgba(0,0,0,0.4)]",
      "flex",
      "items-center",
      "justify-center",
    ]);
    window.addEventListener(
      "click",
      function (event) {
        if (shouldClose)
          if ((event.target as Element).classList.contains(randomClass)) {
            self._dom.removeElement(modal);
            onClose();
          }
      },
      true
    );

    const modalBody = this._dom.makeElement("div");

    this._dom.AddClassList(modalBody, [
      "bg-white",
      "rounded-sm",
      "p-2",
      "flex",
      "flex-col",
      "items-center",
    ]);
    const headingSpan = this._dom.makeElement("span");
    this._dom.AddClassList(headingSpan, ["pb-3"]);
    this._dom.setInnerHTML(headingSpan, heading);
    this._dom.appendChild(modalBody, headingSpan);
    this._dom.appendChild(modal, modalBody);
    return { Modal: modal, ModalBody: modalBody };
  }
  makeSubmitButton(placeholder: string) {
    const button = this._dom.makeElement("button");
    this._dom.AddClassList(button, [
      "bg-green-500",
      "p-1",
      "text-white",
      "font-bold",
      "rounded-sm",
      "w-full",
    ]);
    this._dom.setInnerHTML(button, placeholder);
    button.type = "submit";
    return button;
  }
  makeInput(placeholder: string) {
    const input = this._dom.makeElement("input");
    input.dir = "rtl";
    this._dom.AddClassList(input, ["p-2", "font-medium", "border-[0.5px]"]);
    this._dom.setPlaceholder(input, placeholder);
    return input;
  }
  makeForm(onSubmit: (event: SubmitEvent) => void) {
    const form = this._dom.makeElement("form");
    this._dom.AddClassList(form, ["flex", "flex-col", "items-center", "gap-2"]);
    form.onsubmit = function (event) {
      event.preventDefault();
      onSubmit(event);
    };
    return form;
  }
  makeButton(innerHTML: string, onClick: (event: MouseEvent) => void) {
    const button = this._dom.makeElement("button");
    this._dom.AddClassList(button, [
      "px-2",
      "py-1",
      "bg-blue-500",
      "rounded-sm",
      "text-white",
      "font-semibold",
    ]);
    button.onclick = onClick;
    this._dom.setInnerHTML(button, innerHTML);
    return button;
  }
  makeWrapper(horizontal: boolean) {
    const wrapper = this._dom.makeElement("div");
    if (horizontal)
      this._dom.AddClassList(wrapper, ["flex", "items-center", "gap-2", "p-2"]);
    else
      this._dom.AddClassList(wrapper, [
        "flex",
        "flex-col",
        "items-center",
        "gap-2",
        "p-2",
      ]);
    return wrapper;
  }
  makeBadge(innerHTML: string) {
    const badge = this._dom.makeElement("span");
    this._dom.AddClassList(badge, [
      "px-2",
      "py-1",
      "rounded-sm",
      "bg-gray-200",
      "text-gray-600",
      "font-light",
    ]);
    this._dom.setInnerHTML(badge, innerHTML);
    return badge;
  }
  makeOption(option: { innerHTML: string; value: string }) {
    const newOption = this._dom.makeElement("option");
    newOption.innerHTML = option.innerHTML;
    newOption.value = option.value;
    return newOption;
  }
  makeSelect(
    lable: string,
    options: { innerHTML: string; value: string }[],
    onChange: (event: Event) => void
  ) {
    const self = this;
    const lableBadge = this.makeBadge(lable);
    const select = this._dom.makeElement("select");
    this._dom.AddClassList(select, ["px-2", "py-1"]);
    select.onchange = onChange;
    options.forEach(function (option) {
      const newOption = self.makeOption(option);
      self._dom.appendChild(select, newOption);
    });
    const wrapper = this.makeWrapper(true);

    this._dom.appendChildren(wrapper, [select, lableBadge]);
    return { select, wrapper };
  }
  makeHeading(innerHTML: string) {
    const heading = this._dom.makeElement("h1");
    this._dom.AddClassList(heading, ["font-bold", "text-2xl"]);
    this._dom.setInnerHTML(heading, innerHTML);
    return heading;
  }
  makeSmallHeading(innerHTML: string) {
    const heading = this._dom.makeElement("h2");
    this._dom.AddClassList(heading, ["!text-lg", "!font-medium"]);
    this._dom.setInnerHTML(heading, innerHTML);

    return heading;
  }
  makeErrorToast(text: string) {
    Tostify({
      text,
      style: {
        background: "red",
      },
      close: true,
    }).showToast();
    // Toast.toast({
    //   message: text,
    //   type: "is-info",
    //   pauseOnHover: true,
    //   duration: 10000,
    // });
  }
}
