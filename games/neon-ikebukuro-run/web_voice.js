(function () {
  'use strict';
  let enabled = false;
  let muted = false;
  let volume = 0.5;
  let voices = [];
  let ready = false;
  let button = null;

  function hasSpeech() {
    return 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  }

  function refreshVoices() {
    if (!hasSpeech()) {
      voices = [];
      ready = false;
      return;
    }
    voices = speechSynthesis.getVoices().filter((voice) => {
      return /^ja(?:-|_)/i.test(voice.lang || '') && voice.localService === true;
    });
    ready = voices.length > 0;
    updateButton();
  }

  function updateButton() {
    if (!button) return;
    if (!hasSpeech() || !ready) {
      button.textContent = '字幕のみ';
      button.title = '日本語のローカル音声がありません';
    } else if (muted || !enabled) {
      button.textContent = '🔇 ボイスOFF';
      button.title = '音声はOFFです';
    } else {
      button.textContent = '🔊 ボイスON';
      button.title = '音声はONです';
    }
  }

  window.neonVoiceState = function () {
    return { enabled, muted, volume, ready, voiceCount: voices.length };
  };

  window.neonVoiceSetVolume = function (value) {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) volume = Math.max(0, Math.min(1, numeric));
  };

  window.neonVoiceSetMuted = function (value) {
    muted = Boolean(value);
    if (muted && hasSpeech()) speechSynthesis.cancel();
    updateButton();
  };

  window.neonSpeak = function (text) {
    if (!enabled || muted || !ready || !hasSpeech()) return false;
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(String(text));
    utterance.lang = 'ja-JP';
    utterance.voice = voices[0];
    utterance.rate = 1.15;
    utterance.volume = volume;
    speechSynthesis.speak(utterance);
    return true;
  };

  function install() {
    if (!hasSpeech()) return;
    refreshVoices();
    speechSynthesis.addEventListener('voiceschanged', refreshVoices);
    button = document.createElement('button');
    button.type = 'button';
    button.style.cssText = 'position:fixed;right:12px;top:72px;z-index:20;padding:8px 12px;font-size:16px;border-radius:10px;border:2px solid #fff;background:#161a35;color:#fff';
    button.addEventListener('click', function () {
      if (!ready) return;
      enabled = !enabled;
      if (!enabled) speechSynthesis.cancel();
      updateButton();
    });
    document.body.appendChild(button);
    updateButton();
  }

  window.addEventListener('load', install, { once: true });
})();
