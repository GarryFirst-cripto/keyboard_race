import * as serv from "./services/userServices";
import { joinToMainRoom, messageToRoom, MAIN_ROOM_ID } from './services/roomServices'
import { proxyColors, proxyAuto, randomIndex } from './services/messages';

const gamerAuto = () => {
  return proxyColors['get']+' '+proxyAuto['get'];
}

export default io => {
  io.on("connection", socket => {
    socket.on('username', username => {
      // serv.users.set(username, { username, userroom: '', usersocket: socket, raceCount: 0, raceWin:0, auto: gamerAuto() })
      const racesRandom = randomIndex(10);
      serv.users.set(username, { username, userroom: '', usersocket: socket, raceCount: racesRandom, raceWin: randomIndex(racesRandom), auto: gamerAuto() })
      io.to(MAIN_ROOM_ID).emit('userupdate', { username, userroom: '' });
      serv.updateAllUsers(socket, username);
      serv.updateAllRooms(socket);
      socket.join(MAIN_ROOM_ID);
    });
    socket.on('usermessage', data => {
      const { username, addressee, message } = data;
      if (serv.users.get(addressee)){
        serv.users.get(addressee).usersocket.emit('usermessage', { username, message });
      }
    });
    socket.on('disconnect', () => {
      const user = serv.findUserBySocket(socket);
      if (user) {
        if (user.roomname !== '') {
          const room = user.userroom;
          joinToMainRoom(io, socket, room, user.username);
          messageToRoom(io, room);
        };
        socket.broadcast.emit('userleave', { username: user.username });
        serv.users.delete(user.username);
      }
    });
  });
};
