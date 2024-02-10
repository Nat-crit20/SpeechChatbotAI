"use strict";

const socket = io();

const outputYou = document.querySelector(".output-you");
const outputBot = document.querySelector(".output-bot");

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.lang = "en-US";
recognition.interimResults = false;
recognition.maxAlternatives = 1;

document.querySelector("button").addEventListener("click", () => {
  recognition.start();
});

recognition.addEventListener("result", (e) => {
  let text = e.results[0][0].transcript;

  outputYou.textContent = text;
  socket.emit("chat message", text);
});
const botReply = (text) => {
  const synth = window.speechSynthesis;
  const utterance = new SpeechSynthesisUtterance();
  utterance.text = text;
  utterance.pitch = 1;
  utterance.volume = 1;
  synth.speak(utterance);
};

socket.on("bot reply", (text) => {
  console.log("Got the reply");
  outputBot.textContent = text;
  botReply(text);
});
recognition.addEventListener("speechend", () => {
  recognition.stop();
});
