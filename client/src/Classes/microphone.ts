export type microphone = { Id: string; Name: string };
export enum MicrophoneState {
  NotInitialized = "not initialized",
  Initializing = "initializing",
  NotSupported = "not supported",
  Granted = "granted",
  Denied = "denied",
}
export default class Microphone {
  private _format = "audio/webm";
  private _mediaDevices: MediaDevices;
  private _isMicSuportted: boolean = false;
  private _isMicAllowed: boolean = false;

  private _microphone: microphone = null;

  private _microphoneList: microphone[] = [];
  private _constraints: MediaStreamConstraints;
  private _stream: MediaStream;
  private _onMicChangesCallback: () => void;
  private _onInit: Promise<void>;
  private _microphoneState: MicrophoneState = MicrophoneState.NotInitialized;
  private _mediaRecorder: MediaRecorder;
  private _interval: NodeJS.Timeout;
  private _isRecording: boolean = false;
  onDataAvailable: (blob: Blob) => void = null;
  private _onMicrophoneStateChange: (state: MicrophoneState) => void;
  constructor(
    constrain: MediaStreamConstraints,
    onMicrophoneStateChange: (state: MicrophoneState) => void
  ) {
    this._onMicrophoneStateChange = onMicrophoneStateChange;
    this._constraints = constrain;
    const self = this;
    this._setMicrophoneState(MicrophoneState.Initializing);
    this._onInit = new Promise<void>(function (resolve, reject) {
      self._setIsMicSuportted();
      self._setIsMicAllowed().then(async function () {
        self._setOnMicChanges();
        resolve();
      });
    });
  }

  private _setIsMicSuportted(): void {
    if ("navigator" in window) {
      this._mediaDevices = navigator.mediaDevices;
      this._isMicSuportted = true;
    } else {
      console.error("microphone does not support in this browser");
      this._isMicSuportted = false;
      this._setMicrophoneState(MicrophoneState.NotSupported);
    }
  }
  private _setIsMicAllowed() {
    this._isMicAllowed = false;
    const self = this;
    return new Promise<void>(function (resolve, reject) {
      if (self._isMicSuportted === true) {
        if (!navigator.userAgent.includes("Firefox")) {
          //get the mic id and put it in _microphone
          //get the list of mic
          const mic = "microphone" as PermissionName;
          navigator.permissions
            .query({
              name: mic,
            })
            .then(function (result) {
              if (result.state === "granted") {
                self._isMicAllowed = true;
                self._mediaDevices
                  .getUserMedia({
                    video: false,
                    audio: true,
                  })
                  .then(async function (stream) {
                    await self._setMicrophoneList();
                    self._setMicrophoneState(MicrophoneState.Granted);

                    const deviceId = stream
                      .getAudioTracks()[0]
                      .getSettings().deviceId;
                    self.selectMic(deviceId);

                    resolve();
                  });

                resolve();
              } else {
                self._isMicAllowed = false;
                self._setMicrophoneState(MicrophoneState.Denied);

                resolve();
              }
            });
        } else {
          try {
            self._mediaDevices
              .getUserMedia({
                video: false,
                audio: true,
              })
              .then(async function (stream) {
                self._isMicAllowed = true;

                await self._setMicrophoneList();
                self._setMicrophoneState(MicrophoneState.Granted);
                const deviceId = stream
                  .getAudioTracks()[0]
                  .getSettings().deviceId;
                self.selectMic(deviceId);

                resolve();
              })
              .catch(function () {
                self._isMicAllowed = false;
                self._setMicrophoneState(MicrophoneState.Denied);

                resolve();
              });
          } catch (e) {
            self._isMicAllowed = false;
            self._setMicrophoneState(MicrophoneState.Denied);

            resolve();
          }
        }
      }
    });
  }
  private _setMicrophoneState(state: MicrophoneState) {
    this._microphoneState = state;
    this._onMicrophoneStateChange(state);
  }
  private async _setMicrophoneList(): Promise<void> {
    this._microphoneList = [];
    const self = this;
    if (this._isMicSuportted === true) {
      //on firefox you have to get the list inside getusermedia
      //because after changes in devices , you have get another permission
      await this._mediaDevices.getUserMedia(this._constraints);
      const devices = await this._mediaDevices.enumerateDevices();
      devices.forEach(function (device) {
        if (device.kind === "audioinput") {
          self._microphoneList.push({
            Id: device.deviceId,
            Name: device.label,
          });
        }
      });
    } else {
      this._microphoneList = [];
    }
  }
  private async _setOnMicChanges() {
    if (this._isMicSuportted) {
      const self = this;
      this._mediaDevices.addEventListener("devicechange", async function (e) {
        await self._setMicrophoneList();
        self._onMicChangesCallback();
      });
    }
  }

  setOnMicChangesCallback(callback: () => void) {
    this._onMicChangesCallback = callback;
  }

  getIsMicAllowed() {
    if (this._isMicSuportted === false) return this._isMicAllowed;

    return this._isMicAllowed;
  }
  getAudioDevices() {
    return this._microphoneList;
  }
  selectMic(Id: String) {
    let mic = this._microphoneList.find((m) => m.Id === Id);
    if (mic === undefined) {
      console.error("mic with this id: " + Id + " is not available");
      mic = this._microphoneList[0];
      console.log("selecting this mic: " + mic.Name + " instead");
      this._microphone = mic;
    } else {
      this._microphone = mic;
    }
  }
  getStream() {
    return this._stream;
  }
  startRecording() {
    const self = this;

    this._onInit.then(function () {
      if (self._microphone === null || self._microphone === undefined) {
        console.error("mic has not been selected");
        const mic = self._microphoneList[0];
        self.selectMic(mic.Id);
        console.log("this mic:" + mic.Name + " has been selected instead");
      }
      const audio = self._constraints.audio as MediaTrackConstraints;
      self._mediaDevices
        .getUserMedia({
          ...self._constraints,
          audio: { ...audio, deviceId: self._microphone.Id },
        })
        .then(function (stream) {
          self._stream = stream;
          self._mediaRecorder = new MediaRecorder(stream, {
            mimeType: self._format,
          });

          // setInterval(() => {
          //   console.log(self._mediaRecorder.requestData());
          // }, 100);
          self._mediaRecorder.ondataavailable = function (event) {
            console.log(event.data.size);
            if (event.data.size > 0)
              if (self.onDataAvailable !== null) {
                self.onDataAvailable(event.data);
              }
          };
          self._mediaRecorder.start(0);
          self._isRecording = true;
          // self._startRecording();
          // self._interval = setInterval(() => {
          //   self._mediaRecorder.start(1000);
          //   self._mediaRecorder.stop();
          // }, 1000);
        });
    });
  }
  stopRecording() {
    if (this._mediaRecorder !== null || this._mediaRecorder !== undefined) {
      this._isRecording = false;
      this._mediaRecorder.stop();
      // clearInterval(this._interval);
      // this._interval = null;
    }
  }
}

// export async function selectMicById(media: MediaDevices, micId: string) {
//   const stream = await media.getUserMedia({
//     video: false,
//     audio: { noiseSuppression: true, echoCancellation: true },
//   });
//   return stream;
// }
