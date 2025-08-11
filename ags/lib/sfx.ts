import { dependencies } from "./utils"

const metDependencies = dependencies("paplay");
if (!metDependencies) {
  console.log("WARNING: Sound effects will be disabled because of missing dependencies.");
}

const soundEffects = {
  "audio-volume-change": "/usr/share/sounds/freedesktop/stereo/audio-volume-change.oga",
  "dialog-information": "/usr/share/sounds/freedesktop/stereo/dialog-information.oga",
  "dialog-warning": "/usr/share/sounds/freedesktop/stereo/dialog-warning.oga",
  "dialog-error": "/usr/share/sounds/freedesktop/stereo/dialog-error.oga",
  "power-plug": "/usr/share/sounds/freedesktop/stereo/power-plug.oga",
  "power-unplug": "/usr/share/sounds/freedesktop/stereo/power-unplug.oga",
  "message": "/usr/share/sounds/freedesktop/stereo/message.oga",
  "message-new-instant": "/usr/share/sounds/freedesktop/stereo/message-new-instant.oga",
  "network-connectivity-established": "/usr/share/sounds/freedesktop/stereo/network-connectivity-established.oga",
  "network-connectivity-lost": "/usr/share/sounds/freedesktop/stereo/network-connectivity-lost.oga",
  "bell": "/usr/share/sounds/freedesktop/stereo/bell.oga",
  "window-attention": "/usr/share/sounds/freedesktop/stereo/window-attention.oga",
  "window-question": "/usr/share/sounds/freedesktop/stereo/window-question.oga",
  "trash-empty": "/usr/share/sounds/freedesktop/stereo/trash-empty.oga",
  "complete": "/usr/share/sounds/freedesktop/stereo/complete.oga",
  "camera-shutter": "/usr/share/sounds/freedesktop/stereo/camera-shutter.oga",
  "screen-capture": "/usr/share/sounds/freedesktop/stereo/screen-capture.oga",
  "service-login": "/usr/share/sounds/freedesktop/stereo/service-login.oga",
  "service-logout": "/usr/share/sounds/freedesktop/stereo/service-logout.oga",
  "phone-incoming-call": "/usr/share/sounds/freedesktop/stereo/phone-incoming-call.oga",
  "phone-outgoing-busy": "/usr/share/sounds/freedesktop/stereo/phone-outgoing-busy.oga",
  "phone-outgoing-calling": "/usr/share/sounds/freedesktop/stereo/phone-outgoing-calling.oga",
  "device-added": "/usr/share/sounds/freedesktop/stereo/device-added.oga",
  "device-removed": "/usr/share/sounds/freedesktop/stereo/device-removed.oga",
} as const;

export type SoundEffect = keyof typeof soundEffects;

function effectExists(effect: SoundEffect): boolean {
  return effect in soundEffects;
}

export async function playSoundEffect(effect: SoundEffect) {
  if (!metDependencies || !effectExists(effect)) return;
  await Utils.execAsync(`paplay ${soundEffects[effect]}`);
}

export function playSoundEffectSync(effect: SoundEffect) {
  if (!metDependencies || !effectExists(effect)) return;
  Utils.exec(`paplay ${soundEffects[effect]}`);
}
