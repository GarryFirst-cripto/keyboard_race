import { elementFactory } from '../helpers/domHelper.mjs';
import { socket, username } from '../game.mjs';
import { testRoomName } from '../helpers/userHelper.mjs';
import { caps } from './gameServices.mjs';
import { addressee } from './userServices.mjs';
import { proxyAudio } from '../helpers/audioHelper.mjs';

document.getElementById('newroomButton').addEventListener('click', createNewRoom);
document.getElementById('sendmess').addEventListener('click', userMessage);
document.getElementById('exitroom').addEventListener('click', exitRoom);
const roombox = document.getElementById('roombox');
export let roomname = '';

export function selectRoomPage(mode) {
  document.getElementById('hall').style.display = mode ? 'none' : 'block';
  document.getElementById('room').style.display = mode ? 'block' : 'none';
  document.getElementById('exitroom').style.display = 'block';
  document.getElementById('setready').style.display = 'block';
  document.getElementById('gamers').innerHTML = '';
  document.getElementById('textbox').innerHTML = '';
  document.getElementById('commentator').innerHTML = '';
  document.getElementById('setready').innerText = caps[0];
}

function selectRoom(event) {
  roomname = event.target.parentElement.children[1].innerText;
  selectRoomPage(true);
  socket.emit('enterRoom', { roomname, username });
}

function exitRoom() {
  document.getElementById('roombox').innerHTML = '';
  document.getElementById('userbox').innerHTML = '';
  document.getElementById('commentator').innerHTML = '';
  proxyAudio['stop'];
  socket.emit('exitRoom', { roomname, username });
  roomname = '';
  selectRoomPage(false);
}

function findRoom(roomId) {
  for (let i = 0; i < roombox.children.length; i++) {
    const element = roombox.children[i];
    if (element.children[1].innerText === roomId) {
      return element;
    }
  }
  return null;
}

function createRoom(roomname) {
  const newRoom = elementFactory(
    {
      tagName: 'div', className: 'room', children: [
        { tagName: 'div', className: 'room-state' },
        { tagName: 'div', className: 'room-name' },
        { tagName: 'button', className: 'button room-button', text: 'J O I N', onclick: selectRoom }
      ]
    }
  );
  newRoom.children[1].innerText = roomname;
  //  Pattern "Facade"
  newRoom.facade = room => {
    const roomBusy = room.started || room.full;
    newRoom.children[0].innerText = room.full ? `Room FULL (${room.users} users) !` : `${room.users} user${room.users > 1 ? 's' : ''} connected`;
    newRoom.children[2].style.opacity = roomBusy ? "0.6" : "1";
    newRoom.children[2].disabled = roomBusy;
    newRoom.className = roomBusy ? 'room busy' : 'room';
  };
  roombox.appendChild(newRoom);
  return newRoom;
}

export const roomAddUpdate = (room) => {
  let element = findRoom(room.roomname);
  if (!element) {
    element = createRoom(room.roomname);
  }
  element.facade(room);
}

export const roomRemove = room => {
  const element = findRoom(room.roomname);
  if (element) {
    roombox.removeChild(element);
  }
}

async function createNewRoom() {
  const newRoom = prompt("Введите название новой комнаты :");
  const rmName = await testRoomName(newRoom, username);
  roomname = newRoom;
  if (rmName === newRoom) {
    selectRoomPage(true);
    socket.emit('newroom', { roomname, username });
  }
}

function userMessage() {
  if (addressee === '') {
    alert('Выберите адресата ...')
  } else {
    const input = document.getElementById('message');
    const message = input.value;
    socket.emit('usermessage', { username, addressee, message });
    input.value = '';
  }
}

export const addmessage = (username, message) => {
  const newMess = elementFactory(
    {
      tagName: 'div', children: [
        { tagName: 'div', text: `${username} : ` },
        { tagName: 'div', text: message },
        { tagName: 'hr' }
      ]
    }
  );
  document.getElementById('messages').appendChild(newMess);
};
