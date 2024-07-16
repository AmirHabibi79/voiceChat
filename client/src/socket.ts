import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
export default class Socket {
  private _connected: boolean = false;
  private _formatter: Intl.NumberFormat;
  private _connection: HubConnection;
  private _onGetVoice: (data: string) => void;
  private _sentDataAmount: number = 0;
  constructor() {
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
    const self = this;
    // this._connection.stream()
    this._connection.on("getVoice", function (data: string) {
      //   const textEncoder = new TextEncoder();
      //   const arrayBuffer = textEncoder.encode(data).buffer as ArrayBuffer;
      self._onGetVoice(data);
    });

    try {
      this._connection
        .start()
        .then(function () {
          self._connected = true;
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
  private _addToSentDataAmount(data: string) {
    const size = this._getSizeOfData(data);
    this._sentDataAmount += size;
  }
  getSentDataAmountAsBytes() {
    return this._sentDataAmount;
  }
  getSentDataAmountAsString() {
    return this._formatter.format(this._sentDataAmount);
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
