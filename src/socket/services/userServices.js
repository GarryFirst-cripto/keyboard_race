import { rooms } from './roomServices';
import { MAXIMUM_USERS_FOR_ONE_ROOM } from '../config';

export const users = new Map;

export function findUserBySocket(socket) {
  let result = null;
  users.forEach(user => {
    const logg = user.usersocket && user.usersocket.id === socket.id;
    if (logg) {
      result = user;
    }    
  })
  return result;
}

export const updateAllRooms = socket => {
  rooms.forEach(room => {
    socket.emit('roomupdate', {
      roomname: room.roomname,
      users: room.users.length,
      full: room.users.length >= MAXIMUM_USERS_FOR_ONE_ROOM,
      started: room.started
    });
  });
}

export const updateAllUsers = (socket, userId) => {
  users.forEach(user => {
    if (user.username !== userId) {
      socket.emit('userupdate', { username: user.username, userroom: user.userroom });
    }
  });
}


