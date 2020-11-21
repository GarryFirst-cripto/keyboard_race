import { rooms, messageToRoom } from './roomServices';


export const setUserStatus = (io, roomId, user, status) => {
  if (rooms.get(roomId)) {
    rooms.get(roomId).users.forEach(item => {
      if (item.usernm === user) {
        item.ready = status;
        messageToRoom(io, roomId);
      }
    });
  }
}

export const setUserPoint = (roomname, username, point) => {
  const logg = rooms.get(roomname) && rooms.get(roomname).game;
  if (logg) {
    rooms.get(roomname).game.userpoint(username, point);
  }
}