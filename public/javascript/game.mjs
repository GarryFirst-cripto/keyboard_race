import { userAddUpdate, userRemove } from './services/userServices.mjs';
const { userAddUpdate, userRemove } = require('./services/userServices.mjs');
import { roomAddUpdate, selectRoomPage, roomRemove, addmessage } from './services/roomServices.mjs';
const { userAddUpdate, userRemove } = require('./services/roomServices.mjs');
import { gameroomUpdate, addRoomMessage, newComment } from './services/gameServices.mjs';
const { userAddUpdate, userRemove } = require('./services/gameServices.mjs');
import { prepareGame, startGame, endGame, resultGame, userPoint } from './services/gameEvents.mjs';
const { userAddUpdate, userRemove } = require(' ./services/gameEvents.mjs ');
import { proxyAudio } from ' ./helpers/audioHelper.mjs ';
const { proxyAudio } = require(' ./helpers/audioHelper.mjs ');

export const username = sessionStorage.getItem("username");
if (!username) {
  window.location.replace("/login");
}

let msglogg = false;

const msg = 'Create a new room or join an existing one. <br />'+
            'In the room click "Ready". <br />'+
            'When the game starts, type on the keyboard <br />'+
            'the text that appears in the central window.';

export const socket = io();
socket.on('connect', () => {
  selectRoomPage(false);
  document.getElementById('roombox').innerHTML = msg;
  msglogg = true;
  document.getElementById('userbox').innerHTML = '';
  socket.emit('username', username);
});

//  User events

socket.on('userupdate', user => {
  userAddUpdate(user);
});

socket.on('userleave', user => {
  userRemove(user);
});

//  Room list events

socket.on('roomupdate', room => {
  if (msglogg) {
    document.getElementById('roombox').innerHTML = '';
    msglogg = false;
  }
  roomAddUpdate(room);
});

socket.on('usermessage', data => {
  const { username, message } = data;
  addmessage(username, message);
});

socket.on('delroom', room => {
  roomRemove(room);
});

//  Game room events

socket.on('gameroom', room => {
  gameroomUpdate(room);
});

socket.on('roommessage', data => {
  const { username, message } = data;
  addRoomMessage(username, message);
});

socket.on('comment', comment => {
  newComment(comment);
});

//  Game events

socket.on('prepare', data => {
  prepareGame(data);
});

socket.on('starttimer', data => {
  proxyAudio['start'];
  document.getElementById('timer').innerText = data;
});

socket.on('gametimer', data => {
  document.getElementById('gametime').innerText = data;
});

socket.on('startgame', data => {
  startGame(data);
});

socket.on('endgame', () => {
  proxyAudio['finish'];
  endGame();
});

socket.on('resultgame', data => {
  resultGame(data);
});

socket.on('userpoint', data => {
  userPoint(data);
});

