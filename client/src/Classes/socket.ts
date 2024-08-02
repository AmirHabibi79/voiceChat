import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import UI from "./ui";
import { ReceivedRoom, Room } from "../types";

enum QueueCommand {
  sendUsername = "sendusername",
  getRooms = "sendrooms",
  changeUsername = "changeusername",
}
export default class Socket {
  private _connected: boolean = false;
  private _formatter: Intl.NumberFormat;
  private _connection: HubConnection;
  private _onGetVoice: (data: string) => void;
  private _sentDataAmount: number = 0;
  private _queue: { command: QueueCommand; data: string }[] = [];
  private _rooms: Room[] = [];
  onRoomsUpdate: (rooms: Room[]) => void;
  private _Ui: UI;
  constructor() {
    const self = this;
    this._Ui = new UI();
    this._formatter = new Intl.NumberFormat("en-us", {
      style: "unit",
      unit: "byte",
      notation: "compact",
      unitDisplay: "narrow",
    });
    this._connection = new HubConnectionBuilder()
      .withUrl(process.env.SERVER_URL + "/voiceChatHub", {
        withCredentials: false,
      })
      .configureLogging(LogLevel.Information)
      .build();

    this._connection.on(
      "ReceiveMessage",
      function (user: string, message: string) {
        console.log(user, message);
      }
    );
    this._connection.on("recevieNewRoom", function (room: ReceivedRoom) {
      const newRoom = self._makeNewRoom(room);
      self._rooms.push(newRoom);
      if (self.onRoomsUpdate !== null || self.onRoomsUpdate !== undefined) {
        self.onRoomsUpdate(self._rooms);
      }
    });
    this._connection.on("receiveRooms", function (rooms: ReceivedRoom[]) {
      const newRooms = rooms.map(function (room) {
        return self._makeNewRoom(room);
      });

      self._rooms = newRooms;

      if (self.onRoomsUpdate !== null || self.onRoomsUpdate !== undefined) {
        self.onRoomsUpdate(self._rooms);
      }
    });
    // this._connection.stream()
    this._connection.on("getVoice", function (data: string) {
      //   const textEncoder = new TextEncoder();
      //   const arrayBuffer = textEncoder.encode(data).buffer as ArrayBuffer;
      self._onGetVoice(data);
    });
    this._connection.on("roomExistsError", function (roomName: string) {
      self._Ui.makeErrorToast(`${roomName} already exists`);
    });

    try {
      this._connection
        .start()
        .then(function () {
          self._connected = true;
          self._callQueue();
        })
        .catch(function () {
          self._connected = false;
        });
    } catch (e) {
      this._connected = false;
    }
  }
  private _getSizeOfData(data: string) {
    return new Blob([data]).size;
  }
  private _makeNewRoom(receiveRoom: ReceivedRoom) {
    const newRoom = {} as Room;
    newRoom.Id = receiveRoom.Id;
    newRoom.Roomname = receiveRoom.Roomname;
    newRoom.CreatedBy = receiveRoom.Users[0];
    newRoom.Users = receiveRoom.Users;
    return newRoom;
  }
  private _addToSentDataAmount(data: string) {
    const size = this._getSizeOfData(data);
    this._sentDataAmount += size;
  }
  private _addToQueue(command: QueueCommand, data: string) {
    this._queue.push({ command, data });
  }
  private _callQueue() {
    const self = this;
    this._queue.forEach(function (q) {
      switch (q.command) {
        case QueueCommand.sendUsername:
          self.sendUsername(q.data);
          break;
        case QueueCommand.changeUsername:
          self.changeUserName(q.data);
          break;
        case QueueCommand.getRooms:
          self._getRooms();
          break;
      }
    });
    this._queue = [];
  }
  private _getRooms() {
    if (this._connected === false) this._addToQueue(QueueCommand.getRooms, "");
    else this._connection.send("GetRooms");
  }
  getRooms() {
    return this._rooms;
  }
  getSentDataAmountAsBytes() {
    return this._sentDataAmount;
  }
  getSentDataAmountAsString() {
    return this._formatter.format(this._sentDataAmount);
  }
  sendUsername(username: string) {
    if (this._connected) this._connection.send("SendUsername", username);
    else this._addToQueue(QueueCommand.sendUsername, username);
  }
  changeUserName(username: string) {
    if (this._connected) this._connection.send("ChangeUsername", username);
    else this._addToQueue(QueueCommand.changeUsername, username);
  }
  makeNewRoom(name: string) {
    this._connection.send("makeNewRoom", name);
  }
  setOnGetVoice(callback: (data: string) => void) {
    this._onGetVoice = callback;
  }
  getConnected() {
    return this._connected;
  }
  sendVoice(data: string) {
    const self = this;
    this._connection
      .send("SendVoice", data)
      .then(function () {
        self._addToSentDataAmount(data);
      })

      .catch(function (err) {
        console.log(err);
      });
  }
  send() {
    try {
      this._connection.send("sendMessage", "amir", "hi");
    } catch (err) {
      console.log(err);
    }
  }
}
