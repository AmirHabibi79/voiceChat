import DOM from "../Classes/dom";
import Socket from "../Classes/socket";
import UI from "../Classes/ui";

const dom = new DOM();
const Ui = new UI();

export default function NewRoom(socket: Socket) {
  const newRoomWrapper = Ui.makeWrapper(true);
  dom.AddClassList(newRoomWrapper, ["justify-end"]);
  const newRoomForm = Ui.makeForm(function () {
    socket.makeNewRoom(newRoomInput.value);
    //go to room view
  });
  dom.AddClassList(newRoomForm, ["!flex-row"]);
  const newRoomInput = Ui.makeInput("نام روم");
  newRoomInput.required = true;
  const newRoomButton = Ui.makeButton("ساخت روم جدید", function () {});
  newRoomButton.type = "submit";
  dom.appendChildren(newRoomForm, [newRoomButton, newRoomInput]);

  dom.appendChild(newRoomWrapper, newRoomForm);
  dom.appendToBody(newRoomWrapper);
}
