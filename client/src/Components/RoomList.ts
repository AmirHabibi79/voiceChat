import DOM from "../Classes/dom";
import Socket from "../Classes/socket";
import UI from "../Classes/ui";
import RoomItem from "./RoomItem";

const dom = new DOM();
const Ui = new UI();

export default function RoomList(socket: Socket) {
  const roomsWrapper = Ui.makeWrapper(false);
  dom.AddClassList(roomsWrapper, ["roomswrapper", "!items-end"]);

  const roomListHeading = Ui.makeSmallHeading("روم ها");
  dom.AddClassList(roomListHeading, ["pb-2"]);

  dom.appendChild(roomsWrapper, roomListHeading);

  const roomsListWrapper = Ui.makeWrapper(false);

  dom.AddClassList(roomsListWrapper, ["roomslistwrapper", "!items-end"]);

  dom.appendChild(roomsWrapper, roomsListWrapper);

  dom.appendToBody(roomsWrapper);
  addRoomsToRoomsList(socket);
}
export function addRoomsToRoomsList(socket: Socket) {
  const roomsListWrapper =
    dom.getElementByClass<HTMLDivElement>("roomslistwrapper");

  if (roomsListWrapper === null) {
    return;
  }
  dom.removeTextContent(roomsListWrapper);
  const rooms = socket.getRooms();
  console.log(rooms);

  rooms.forEach(function (room) {
    const roomItem = RoomItem({
      Id: room.Id,
      Roomname: room.Roomname,
      CreatedBy: room.CreatedBy,
      Users: room.Users,
    });
    dom.appendChild(roomsListWrapper, roomItem);
  });
}
