import { saveToLocalStorage } from "../utils";
import DOM from "../Classes/dom";
import UI from "../Classes/ui";

const dom = new DOM();
const Ui = new UI();

export default function UserNameModal(shouldClose: boolean) {
  return new Promise<string>(function (resolve, reject) {
    const { Modal, ModalBody } = Ui.makeModal(
      "نام خود را وارد کنید",
      () => resolve(""),
      shouldClose
    );
    const enterNameForm = Ui.makeForm(function (event) {
      const value = nameInput.value;

      saveToLocalStorage("username", value);
      dom.removeElement(Modal);
      resolve(value);
    });
    const nameInput = Ui.makeInput("نام");
    nameInput.required = true;
    nameInput.autofocus = true;
    const submitButton = Ui.makeSubmitButton("تایید");
    dom.appendChild(enterNameForm, nameInput);
    dom.appendChild(enterNameForm, submitButton);
    dom.appendChild(ModalBody, enterNameForm);
    dom.appendToBody(Modal);
    nameInput.focus();
  });
}
