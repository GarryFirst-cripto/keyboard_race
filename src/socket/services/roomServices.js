import { users } from './userServices';
import { startgame } from './game';
import { MAXIMUM_USERS_FOR_ONE_ROOM } from '../config';

export const rooms = new Map;

export const MAIN_ROOM_ID = '_MAIN_ROOM_';

export const joinToRoom = (io, socket, roomId, userId) => {
  socket.leave(MAIN_ROOM_ID);
  socket.join(roomId);
  if (rooms.get(roomId)) {
    rooms.get(roomId).users.push({ usernm: userId, ready: false });
    io.to(MAIN_ROOM_ID).emit('roomupdate', {
      roomname: rooms.get(roomId).roomname,
      users: rooms.get(roomId).users.length,
      full: rooms.get(roomId).users.length >= MAXIMUM_USERS_FOR_ONE_ROOM,
      started: rooms.get(roomId).started
    });
  }
  if (users.get(userId)) {
    users.get(userId).userroom = roomId;
    io.to(MAIN_ROOM_ID).emit('userupdate', { username: userId, userroom: roomId });
  }
}

export const joinToMainRoom = (io, socket, roomId, userId) => {
  if (rooms.get(roomId)) {
    for (let i = 0; i < rooms.get(roomId).users.length; i++) {
      if (rooms.get(roomId).users[i].usernm === userId) {
        rooms.get(roomId).users.splice(i, 1);
        break;
      }
    }
    io.to(MAIN_ROOM_ID).emit('roomupdate', {
      roomname: rooms.get(roomId).roomname,
      users: rooms.get(roomId).users.length,
      full: rooms.get(roomId).users.length >= MAXIMUM_USERS_FOR_ONE_ROOM,
      started: rooms.get(roomId).started
    });
  }
  if (users.get(userId)) {
    users.get(userId).userroom = '';
    io.to(MAIN_ROOM_ID).emit('userupdate', { username: userId, userroom: '' });
  }
  socket.leave(roomId);
  socket.join(MAIN_ROOM_ID);
}

export const messageToRoom = (io, roomname) => {
  if (rooms.get(roomname)) {
    if (rooms.get(roomname).users.length === 0) {
      io.to(MAIN_ROOM_ID).emit('delroom', { roomname });
      rooms.delete(roomname);
      return;
    };
    io.to(roomname).emit('gameroom', {
      roomname: rooms.get(roomname).roomname,
      users: rooms.get(roomname).users,
      full: rooms.get(roomname).users.length >= MAXIMUM_USERS_FOR_ONE_ROOM,
      started: rooms.get(roomname).started
    });
    const logg = rooms.get(roomname).started && rooms.get(roomname).game;
    if (logg) {
      rooms.get(roomname).game.control();
    } else {
      let roomlogg = true;
      rooms.get(roomname).users.forEach(item => { roomlogg = roomlogg && item.ready });
      if (roomlogg) {
        rooms.get(roomname).game = startgame(io, roomname);
        // Pattern Observer
        // Осуществляется подписка комментатора на основные события гонки
        const commentator = rooms.get(roomname).commentator;
        const raceEvents = { 
          onStart: commentator.startRace, 
          gamerOnLine: commentator.gamerOnFinishLine, 
          gamerFinish: commentator.gamerFinish,
          onEnd: commentator.finishRace
        };
        rooms.get(roomname).game.observe(raceEvents);
      }
    };
  }
}