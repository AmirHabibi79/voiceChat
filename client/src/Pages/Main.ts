import NewRoom from "../Components/NewRoom";
import RoomList from "../Components/RoomList";
import Socket from "../Classes/socket";

export default function MainPage(socket: Socket) {
  NewRoom(socket);
  RoomList(socket);
}
