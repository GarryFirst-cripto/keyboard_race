import * as serv from "./services/gameServices";

export default io => {
  io.on("connection", socket => {
    socket.on('Ready', data => {
      const { roomname, username, logg } = data;
      serv.setUserStatus(io, roomname, username, logg);
    });
    socket.on('roommessage', data => {
      const { username, roomname, message } = data;
      io.to(roomname).emit('roommessage', { username, message });
    });
    socket.on('userpoint', data => {
      const { roomname, username, point } = data;
      serv.setUserPoint(roomname, username, point);
    });
  });
};
