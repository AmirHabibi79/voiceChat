import { Room } from "../types";
import DOM from "../Classes/dom";
import UI from "../Classes/ui";

const dom = new DOM();
const Ui = new UI();

export default function RoomItem(room: Room) {
  const roomItem = Ui.makeWrapper(true);
  dom.AddClassList(roomItem, ["p-2", "rounded-sm", "bg-blue-100"]);

  const roomName = dom.makeElement("span");
  dom.setInnerHTML(roomName, room.Roomname);

  const roomCreater = dom.makeElement("span");
  dom.setInnerHTML(roomCreater, room.CreatedBy.Username);

  const roomCreaterLable = dom.makeElement("span");
  dom.setInnerHTML(roomCreaterLable, ":ساخته شده توسط");
  dom.AddClassList(roomCreaterLable, ["font-extralight"]);

  const roomParticipanceWrapper = Ui.makeWrapper(true);
  dom.AddClassList(roomParticipanceWrapper, ["!gap-0"]);

  const roomParticipanceCount = dom.makeElement("span");
  dom.setInnerHTML(roomParticipanceCount, room.Users.length.toString());

  const roomParticipanceCountLable = dom.makeElement("span");
  dom.setInnerHTML(roomParticipanceCountLable, process.env.USER_PER_ROOM + "/");

  dom.appendChildren(roomParticipanceWrapper, [
    roomParticipanceCountLable,
    roomParticipanceCount,
  ]);

  const roomJoinButton = Ui.makeButton("ورود", function () {});
  dom.AddClassList(roomJoinButton, ["mr-4"]);

  dom.appendChildren(roomItem, [
    roomJoinButton,
    roomParticipanceWrapper,
    roomCreater,
    roomCreaterLable,
    roomName,
  ]);
  return roomItem;
}
