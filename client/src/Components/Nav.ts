import { getFromLocalStorage } from "../utils";
import DOM from "../Classes/dom";
import UI from "../Classes/ui";
import UserNameModal from "./UserNameModal";
import Socket from "../Classes/socket";

const dom = new DOM();
const Ui = new UI();

export default function Nav(micSelectWrapper: HTMLDivElement, socket: Socket) {
  const username = getFromLocalStorage("username");

  const navWrapper = Ui.makeWrapper(true);
  dom.AddClassList(navWrapper, ["justify-between"]);

  const appHeading = Ui.makeHeading("voice chat");

  const usernameWrapper = Ui.makeWrapper(true);

  const button = Ui.makeButton("تغییر نام کاربری", async function () {
    await UserNameModal(true);
    const username = getFromLocalStorage("username");
    socket.changeUserName(username);
    dom.setInnerHTML(usernameBadge, username);
  });

  const usernameBadge = Ui.makeBadge(username);
  dom.appendChildren(usernameWrapper, [button, usernameBadge]);
  const userAndMicWrapper = Ui.makeWrapper(true);
  dom.appendChildren(userAndMicWrapper, [micSelectWrapper, usernameWrapper]);

  dom.appendChildren(navWrapper, [appHeading, userAndMicWrapper]);
  dom.appendToBody(navWrapper);
}
