export type microphone = { Id: string; Name: string };
export default class Microphone {
  private _mediaDevices: MediaDevices;
  private _isMicSuportted: boolean;
  private _isMicAllowed: boolean;
  private _microphone: microphone;
  private _microphoneList: microphone[] = [];
  private _constraints: MediaStreamConstraints;
  private _stream: MediaStream;
  private _onMicChangesCallback: () => void;
  constructor(constrain: MediaStreamConstraints) {
    this._constraints = constrain;
  }

  private _setIsMicSuportted(): void {
    if ("navigator" in window) {
      this._mediaDevices = navigator.mediaDevices;
      this._isMicSuportted = true;
    } else {
      console.error("microphone does not support in this browser");
      this._isMicSuportted = false;
    }
  }
  private async _setIsMicAllowed(): Promise<void> {
    this._isMicAllowed = false;

    if (this._isMicSuportted === true) {
      if (!navigator.userAgent.includes("Firefox")) {
        const mic = "microphone" as PermissionName;
        const result = await navigator.permissions.query({
          name: mic,
        });
        if (result.state === "granted") {
          this._isMicAllowed = true;
        } else {
          this._isMicAllowed = false;
        }
      } else {
        try {
          await this._mediaDevices.getUserMedia({
            video: false,
            audio: true,
          });
          this._isMicAllowed = true;
        } catch (e) {
          this._isMicAllowed = false;
        }
      }
    }
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
  private async _onMicChanges() {
    if (this._isMicSuportted) {
      const self = this;
      this._mediaDevices.addEventListener("devicechange", async function (e) {
        await self._setMicrophoneList();
        self._onMicChangesCallback();
      });
    }
  }
  async init() {
    this._setIsMicSuportted();
    await this._setIsMicAllowed();
    await this._setMicrophoneList();
    this._onMicChanges();
  }

  setOnMicChangesCallback(callback: () => void) {
    this._onMicChangesCallback = callback;
  }

  async getIsMicAllowed(): Promise<boolean> {
    if (this._isMicSuportted === false) return this._isMicAllowed;

    return this._isMicAllowed;
  }
  getAudioDevices() {
    return this._microphoneList;
  }
  async selectMic(Id: String) {
    let stream: MediaStream;
    const mic = this._microphoneList.find((m) => m.Id === Id);
    if (mic === undefined) {
      console.error("mic with this id: " + Id + " is not available");
      stream = await this._mediaDevices.getUserMedia(this._constraints);
    } else {
      this._microphone = mic;
      const audio = this._constraints.audio as MediaTrackConstraints;
      stream = await this._mediaDevices.getUserMedia({
        ...this._constraints,
        audio: { ...audio, deviceId: mic.Id },
      });
    }
    this._stream = stream;
  }
  getStream() {
    return this._stream;
  }
}

// export async function selectMicById(media: MediaDevices, micId: string) {
//   const stream = await media.getUserMedia({
//     video: false,
//     audio: { noiseSuppression: true, echoCancellation: true },
//   });
//   return stream;
// }
