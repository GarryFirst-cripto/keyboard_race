import * as serv from './services/roomServices';
import { updateAllUsers, updateAllRooms } from './services/userServices';
import { roomCommentator } from './services/commentator';

export default io => {
  io.on("connection", socket => {
    socket.on('newroom', data => {
      const { roomname, username } = data;
      serv.rooms.set(roomname, { roomname, users: [], started: false, commentator: roomCommentator(io, roomname) });
      serv.joinToRoom(io, socket, roomname, username);
      serv.messageToRoom(io, roomname);
    })
    socket.on('enterRoom', data => {
      const { roomname, username } = data;
      serv.joinToRoom(io, socket, roomname, username);
      serv.messageToRoom(io, roomname);
      if (serv.rooms.get(roomname)) {
        serv.rooms.get(roomname).commentator.newUser(socket);
      }
    });
    socket.on('exitRoom', data => {
      const { roomname, username } = data;
      serv.joinToMainRoom(io, socket, roomname, username);
      serv.messageToRoom(io, roomname);
      updateAllUsers(socket, username);
      updateAllRooms(socket);
    });
  });
};
