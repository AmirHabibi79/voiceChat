import AudioOutput from "./audio";
import DOM from "./dom";
import Microphone, { MicrophoneState } from "./microphone";
import Socket from "./socket";
// import * as RecordRTC from "recordrtc";
async function blobToBase64(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(blob);
  });
}
function Utf8ArrayToStr(array: Uint8Array) {
  var out, i, len, c;
  var char2, char3;

  out = "";
  len = array.length;
  i = 0;
  while (i < len) {
    c = array[i++];
    switch (c >> 4) {
      case 0:
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        // 0xxxxxxx
        out += String.fromCharCode(c);
        break;
      case 12:
      case 13:
        // 110x xxxx   10xx xxxx
        char2 = array[i++];
        out += String.fromCharCode(((c & 0x1f) << 6) | (char2 & 0x3f));
        break;
      case 14:
        // 1110 xxxx  10xx xxxx  10xx xxxx
        char2 = array[i++];
        char3 = array[i++];
        out += String.fromCharCode(
          ((c & 0x0f) << 12) | ((char2 & 0x3f) << 6) | ((char3 & 0x3f) << 0)
        );
        break;
    }
  }

  return out;
}
function makeSelectionForMic(
  microphone: Microphone,
  select: HTMLSelectElement
) {
  const dom = new DOM();
  select.innerText = "";

  const devices = microphone.getAudioDevices();
  devices.forEach(function (device) {
    const option = dom.makeElement("option");
    option.innerHTML = device.Name;
    option.value = device.Id;
    dom.appendChild(select, option);
  });
}
export default async function App() {
  const microphone = new Microphone(
    {
      video: false,
      audio: { noiseSuppression: true, echoCancellation: true },
    },
    onMicState
  );

  function onMicState(state: MicrophoneState) {
    console.log(state);
    if (state === MicrophoneState.Granted) {
      makeSelectionForMic(microphone, select);
    }
  }
  microphone.setOnMicChangesCallback(function () {
    makeSelectionForMic(microphone, select);
  });
  const dom = new DOM();

  const mainDiv = dom.makeElement("div");

  dom.AddClassList(mainDiv, ["p-2", "flex", "flex-col"]);

  const select = dom.makeElement("select");

  const nameWrapper = dom.makeElement("div");
  const nameInput = dom.makeElement("input");
  const enterNameBtn = dom.makeElement("button");

  dom.setPlaceholder(nameInput, "name");
  dom.setInnerHTML(enterNameBtn, "enter");

  dom.appendChild(nameWrapper, nameInput);
  dom.appendChild(nameWrapper, enterNameBtn);

  const downloadAmount = dom.makeElement("span");
  dom.appendChild(mainDiv, downloadAmount);

  dom.appendChild(mainDiv, nameWrapper);
  dom.appendChild(mainDiv, select);

  const startRecordingBtn = dom.makeElement("button");
  dom.setInnerHTML(startRecordingBtn, "start recording");
  dom.setOnClick(startRecordingBtn, function () {
    microphone.startRecording();
    dom.removeClassList(stopRecordingBtn, ["hidden"]);
    dom.AddClassList(startRecordingBtn, ["hidden"]);
  });
  dom.appendChild(mainDiv, startRecordingBtn);

  const stopRecordingBtn = dom.makeElement("button");
  dom.setInnerHTML(stopRecordingBtn, "stop recording");
  dom.AddClassList(stopRecordingBtn, ["hidden"]);
  dom.setOnClick(stopRecordingBtn, function () {
    microphone.stopRecording();
    dom.removeClassList(startRecordingBtn, ["hidden"]);
    dom.AddClassList(stopRecordingBtn, ["hidden"]);
  });
  dom.appendChild(mainDiv, stopRecordingBtn);
  dom.appendToBody(mainDiv);

  const socket = new Socket();
  setInterval(function () {
    dom.setInnerHTML(downloadAmount, socket.getSentDataAmountAsString());
  }, 1000);

  microphone.onDataAvailable = async function (blob) {
    const text = await blob.text();
    console.log(text);
    // socket.sendVoice(text);
  };

  // const audio = new AudioOutput();
  const chuncks: BlobPart[] = [];
  socket.setOnGetVoice(function (data) {
    // const blob = new Blob([data], { type: format });
    // const audio = new Audio(URL.createObjectURL(blob));
    // audio.play();
  });

  // const { audioContext } = audio.getNewContext();
  let filename = 0;
  // select.onchange = async function (e) {
  //   await microphone.selectMic(select.value);
  //   const stream = microphone.getStream();
  //   // const recorder = new RecordRTC(stream, {
  //   //   type: "audio",
  //   //   mimeType: format,
  //   //   timeSlice: 5000,
  //   //   bufferSize: 16384,

  //   //   ondataavailable: async function (blob) {
  //   //     const read = await blob.stream().getReader().read();
  //   //     const text = await blob.text();
  //   //     const uint8arr = new TextEncoder().encode(text);
  //   //     recorder.stopRecording(function () {
  //   //       const b = recorder.getBlob();
  //   //       const file = new File([b], "test");
  //   //       console.log(file);
  //   //     });
  //   // var reader = new FileReader();
  //   // reader.readAsArrayBuffer(blob);
  //   // reader.onloadend = (event) => {
  //   // const decoder = new TextDecoder("utf-8");
  //   // const str = decoder.decode(reader.result);
  //   // The contents of the BLOB are in reader.result:
  //   //   console.log(String.fromCharCode.apply(null, reader.result));
  //   // };
  //   // console.log(await blob.text());
  //   // const arraybuffer = await blob.arrayBuffer();
  //   // const buffer = await audioContext.decodeAudioData(
  //   //   arraybuffer,
  //   //   function (data) {},
  //   //   function (err) {
  //   //     console.log(err);
  //   //   }
  //   // );
  //   // const bufferSource = audioContext.createBufferSource();
  //   // bufferSource.buffer = buffer;
  //   // bufferSource.connect(audioContext.destination);
  //   // bufferSource.start();
  //   // const audio = new Audio(URL.createObjectURL(blob));
  //   // audio.play();
  //   // const text = await blob.text();
  //   // socket.sendVoice(text);
  //   // },
  //   // });

  //   // recorder.startRecording();

  //   // const mediarecorder = new MediaRecorder(stream, { mimeType: format });
  //   // mediarecorder.start(1);
  //   // setInterval(function () {
  //   //   mediarecorder.stop();
  //   //   mediarecorder.start(100);
  //   // }, 100);

  //   // mediarecorder.ondataavailable = async function (event) {
  //   //   chuncks.push(event.data);
  //   //   const blob = new Blob(chuncks, { type: format });
  //   //   const arraybuffer = await blob.arrayBuffer();
  //   //   const buffer = await audioContext.decodeAudioData(
  //   //     arraybuffer,
  //   //     function (data) {},
  //   //     function (err) {
  //   //       // console.log(err);
  //   //     }
  //   //   );
  //   //   const bufferSource = audioContext.createBufferSource();

  //   //   bufferSource.buffer = buffer;
  //   //   bufferSource.connect(audioContext.destination);
  //   //   bufferSource.start();
  //   //   const audio = new Audio(URL.createObjectURL(blob));
  //   //   audio.play();
  //   // };
  //   // mediarecorder.start(0);
  // };
  if (microphone.getIsMicAllowed()) {
    // media.getUserMedia({
    //   video: false,
    //   audio: { noiseSuppression: true, echoCancellation: true },
    // });
    // addMicsToSelect(select, microphone);
    // microphone.setOnMicChangesCallback(() =>
    //   addMicsToSelect(select, microphone)
    // );
  }
  // btn.onclick = isMicAllowed;

  // getLocalStream();
}

// function addMicsToSelect(select: HTMLSelectElement, microphone: Microphone) {
//   select.innerText = "";
//   const devices = microphone.getAudioDevices();
//   devices.forEach(function (device) {
//     const option = makeElement("option");
//     option.innerHTML = device.Name;
//     option.value = device.Id;
//     appendChild(select, option);
//   });
// }

async function getLocalStream() {
  // const audioContext = getNewAudioContext();
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
