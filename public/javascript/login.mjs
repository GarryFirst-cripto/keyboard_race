import { testInputValue } from "./helpers/userhelper.mjs";

const username = sessionStorage.getItem("username");
const submitButton = document.getElementById("submit-button");
const input = document.getElementById("username-input");

const onClickSubmitButton = async () => {
  const inputName = await testInputValue(input.value);
  if (!inputName) {
    return;
  }
  sessionStorage.setItem("username", inputName);
  window.location.replace("/game");
};

const onKeyUp = ev => {
  const enterKeyCode = 13;
  if (ev.keyCode === enterKeyCode) {
    submitButton.click();
  }
};

submitButton.addEventListener("click", onClickSubmitButton);
window.addEventListener("keyup", onKeyUp);

window.onload = async () => {
  if (username) {
    const inputName = await testInputValue(username);
    if (inputName === username) window.location.replace("/game");
  }
}