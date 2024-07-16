type audioContext = { Id: number; audioContext: AudioContext };
export default class AudioOutput {
  private _AudioContextList: audioContext[] = [];
  constructor() {}
  private _makeNewId() {
    return this._AudioContextList.length + 1;
  }
  private _createNewAudioContext() {
    const audioContext = new AudioContext();
    const newContext = { Id: this._makeNewId(), audioContext };
    this._AudioContextList.push(newContext);
    return newContext;
  }
  private _removeAudioContextById(Id: number) {
    this._AudioContextList = this._AudioContextList.filter((a) => a.Id !== Id);
  }
  startAudioFromStream(stream: MediaStream) {
    const audioContext = this._createNewAudioContext();
    const input = audioContext.audioContext.createMediaStreamSource(stream);
    input.connect(audioContext.audioContext.destination);
    return audioContext.Id;
  }
  deleteAudioById(Id: number) {
    const audioContext = this._AudioContextList.find((a) => a.Id === Id);
    if (audioContext === undefined) {
      console.error("there is no audio with this id: " + Id + " to delete");
      return;
    }
    audioContext.audioContext.close();
    this._removeAudioContextById(Id);
  }
  getNewContext() {
    return this._createNewAudioContext();
  }
  async playAudioFromArrayBuffer(data: ArrayBuffer) {
    const audioContext = this._createNewAudioContext();
    const buffer = await audioContext.audioContext.decodeAudioData(data);
    const source = audioContext.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.audioContext.destination);
    source.start();
  }
}
