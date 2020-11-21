import { getGameText } from '../helpers/userHelper.mjs';
import { socket, username } from '../game.mjs';
import { roomname } from './roomServices.mjs';
import { findGamer, caps } from './gameServices.mjs';
import { showModal } from '../modal/modal.mjs';

const gamerBox = document.getElementById('gamers');
let textBox = document.getElementById('textbox');
let text;
let point;

export async function prepareGame(data) {
  document.getElementById('exitroom').style.display = 'none';
  document.getElementById('setready').style.display = 'none';
  document.getElementById('timer').style.display = 'block';
  text = await getGameText(data.index);
  point = -1;
}

const loadText = () => {
  point++;
  textBox.innerHTML = `<span style="background-color: #3ee83f">${text.substr(0, point)}</span><span style="background-color: #eecf64">${text.substr(point, 1)}</span>${text.substr(point + 1)}`;
}

const keyEvent = event => {
  if (event.key === text.substr(point, 1)) {
    loadText();
    socket.emit('userpoint', { roomname, username, point });
  };
}

export function startGame(data) {
  document.getElementById('timer').style.display = 'none';
  window.addEventListener('keydown', keyEvent);
  loadText();
}

export function endGame() {
  window.removeEventListener('keydown', keyEvent);
}

const resetGamers = () => {
  for (let i = 0; i < gamerBox.children.length; i++) {
    gamerBox.children[i].facade({ ready: 'N', point: '0%', finish: false });
  };
}

export function resultGame(data) {
  showModal('Результаты гонки :', data);
  document.getElementById('exitroom').style.display = 'block';
  document.getElementById('setready').style.display = 'block';
  document.getElementById('setready').innerText = caps[0];
  document.getElementById('gametime').innerText = '';
  textBox.innerHTML = '';
  resetGamers();
}

export const userPoint = data => {
  const { userId, point, finish } = data;
  const gamer = findGamer(userId);
  if (gamer) {
    gamer.facade({ point: `${point}%`, finish })
  }
}
