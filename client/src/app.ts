import AudioOutput from "./Classes/audio";
import Nav from "./Components/Nav";
import { addRoomsToRoomsList } from "./Components/RoomList";
import UserNameModal from "./Components/UserNameModal";
import DOM from "./Classes/dom";
import Microphone, { MicrophoneState } from "./Classes/microphone";
import MainPage from "./Pages/Main";
import Socket from "./Classes/socket";
import UI from "./Classes/ui";
import { getFromLocalStorage } from "./utils";

const Ui = new UI();

const dom = new DOM();

const socket = new Socket();

socket.onRoomsUpdate = function () {
  console.log("ok2");
  addRoomsToRoomsList(socket);
};

const microphone = new Microphone(
  {
    video: false,
    audio: { noiseSuppression: true, echoCancellation: true },
  },
  onMicState
);

const { select: micSelect, wrapper: micSelectWrapper } = Ui.makeSelect(
  "میکروفن",
  [],
  function (event) {
    microphone.selectMic(micSelect.value);
  }
);

function changeOptionsForMicSelect() {
  const options = makeOptionsForMics(microphone);
  dom.removeTextContent(micSelect);
  options.forEach(function (option) {
    const newOption = Ui.makeOption(option);
    dom.appendChild(micSelect, newOption);
  });
}

function onMicState(state: MicrophoneState) {
  if (state === MicrophoneState.Granted) {
    changeOptionsForMicSelect();
  }
}

microphone.setOnMicChangesCallback(function () {
  changeOptionsForMicSelect();
});

function makeOptionsForMics(microphone: Microphone) {
  const options: { innerHTML: string; value: string }[] = [];
  const devices = microphone.getAudioDevices();
  devices.forEach(function (device) {
    options.push({ innerHTML: device.Name, value: device.Id });
  });
  return options;
}

export default async function App() {
  let username = getFromLocalStorage("username");
  if (username === null) {
    username = await UserNameModal(false);
  }
  socket.sendUsername(username);

  // makeNav();
  Nav(micSelectWrapper, socket);
  MainPage(socket);
  // const mainDiv = dom.makeElement("div");
  // const div = dom.makeElement("div");
  // dom.appendChild(Modal, div);
  // dom.appendChild(mainDiv, Modal);
  // dom.AddClassList(mainDiv, ["p-2", "flex", "flex-col"]);

  // const nameWrapper = dom.makeElement("div");
  // const nameInput = dom.makeElement("input");
  // const enterNameBtn = dom.makeElement("button");

  // dom.setPlaceholder(nameInput, "name");
  // dom.setInnerHTML(enterNameBtn, "enter");

  // dom.appendChild(nameWrapper, nameInput);
  // dom.appendChild(nameWrapper, enterNameBtn);

  // const downloadAmount = dom.makeElement("span");
  // dom.appendChild(mainDiv, downloadAmount);

  // dom.appendChild(mainDiv, nameWrapper);
  // dom.appendChild(mainDiv, micSelect);

  // const startRecordingBtn = dom.makeElement("button");
  // dom.setInnerHTML(startRecordingBtn, "start recording");
  // dom.setOnClick(startRecordingBtn, function () {
  //   microphone.startRecording();
  //   dom.removeClassList(stopRecordingBtn, ["hidden"]);
  //   dom.AddClassList(startRecordingBtn, ["hidden"]);
  // });
  // dom.appendChild(mainDiv, startRecordingBtn);

  // const stopRecordingBtn = dom.makeElement("button");
  // dom.setInnerHTML(stopRecordingBtn, "stop recording");
  // dom.AddClassList(stopRecordingBtn, ["hidden"]);
  // dom.setOnClick(stopRecordingBtn, function () {
  //   microphone.stopRecording();
  //   dom.removeClassList(startRecordingBtn, ["hidden"]);
  //   dom.AddClassList(stopRecordingBtn, ["hidden"]);
  // });
  // dom.appendChild(mainDiv, stopRecordingBtn);
  // dom.appendToBody(mainDiv);
  // const audio = dom.makeElement("audio");
  // const socket = new Socket();
  // setInterval(function () {
  //   dom.setInnerHTML(downloadAmount, socket.getSentDataAmountAsString());
  // }, 1000);

  // const context = new AudioOutput();

  // microphone.onDataAvailable = async function (blob) {};

  // socket.setOnGetVoice(function (data) {});
}
