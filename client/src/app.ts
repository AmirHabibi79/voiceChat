import getNewAudioContext, { AudioOutput } from "./audio";
import { makeElement, appendChild, getBody } from "./dom";
import Microphone from "./microphone";
export default async function App() {
  const audio = new AudioOutput();
  const microphone = new Microphone({
    video: false,
    audio: { noiseSuppression: true, echoCancellation: true },
  });
  await microphone.init();
  const select = makeElement("select");
  select.onchange = async function (e) {
    await microphone.selectMic(select.value);
  };
  if (microphone.getIsMicAllowed()) {
    // media.getUserMedia({
    //   video: false,
    //   audio: { noiseSuppression: true, echoCancellation: true },
    // });
    addMicsToSelect(select, microphone);
    microphone.setOnMicChangesCallback(() =>
      addMicsToSelect(select, microphone)
    );
  }
  const body = getBody();
  const div = makeElement("div");
  const btn = makeElement("button");
  btn.innerHTML = "access mic";
  // btn.onclick = isMicAllowed;
  div.innerHTML = "hi";
  appendChild(body, div);
  appendChild(body, btn);
  appendChild(body, select);
  getLocalStream();
}

function addMicsToSelect(select: HTMLSelectElement, microphone: Microphone) {
  select.innerText = "";
  const devices = microphone.getAudioDevices();
  devices.forEach(function (device) {
    const option = makeElement("option");
    option.innerHTML = device.Name;
    option.value = device.Id;
    appendChild(select, option);
  });
}

async function getLocalStream() {
  const audioContext = getNewAudioContext();
  //   const analyser = audioContext.createAnalyser();
  //   analyser.smoothingTimeConstant = 0.2;
  //   analyser.fftSize = 1024;
  //   const array = new Uint8Array(analyser.frequencyBinCount);
  //   analyser.getByteFrequencyData(array);
  //   const length = array.length;
  //   let values = 0;
  //   let average = 0;
  //   for (var i = 0; i < length; i++) {
  //     values += array[i];
  //   }
  //   average = values / length;
  //   average = values = 0;
  //   await audioContext.audioWorklet.addModule(
  //     new URL("./audioProccess.js", import.meta.url)
  //   );
  //   const audioProccess = new AudioWorkletNode(audioContext, "audioProccess");
  //   audioProccess.connect(audioContext.destination);
  // if (await isMicAllowed()) {
  //   const media = navigator.mediaDevices;
  // media.getUserMedia({
  //   video: false,
  //   audio: { noiseSuppression: true, echoCancellation: true },
  // });
  // const audioDevices = await getAudioDevices(media);
  // }
  //   media.ondevicechange = function (e) {
  //     console.log(e.target);
  //   };
  //   media.enumerateDevices().then(function (devices) {
  //     // devices.forEach(function (device) {
  //     //   console.log(
  //     //     device.kind + ": " + device.label + " Id: " + device.deviceId
  //     //   );
  //     // });
  //     return null;
  //   });
  //   media
  //     .getUserMedia({
  //       video: false,
  //       audio: { noiseSuppression: true, echoCancellation: true },
  //     })
  //     .then((stream) => {
  //       const tracks = stream.getTracks();
  //       //   console.log(tracks);
  //       const input = audioContext.createMediaStreamSource(stream);
  //       input.connect(audioContext.destination);
  //     })
  //     .catch((err) => {
  //       console.error(`you got an error: ${err}`);
  //     });
}
