const PREFIX_KEY = "VOICE_CHAT_";
export function saveToLocalStorage(key: string, value: string) {
  window.localStorage.setItem(PREFIX_KEY + key, value);
}
export function getFromLocalStorage(key: string) {
  const value = window.localStorage.getItem(PREFIX_KEY + key);
  return value;
}
