import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import userHandler from './src/socket/userEvents';
import roomHandler from './src/socket/roomEvents';
import gameHandler from './src/socket/gameEvents';
import routes from './src/routes';
import dotenv from 'dotenv';
import { STATIC_PATH } from './src/config';

const app = express();
const httpServer = http.Server(app);
const io = socketIO(httpServer);

app.use(express.json());
app.use(express.static(STATIC_PATH));
routes(app);

app.get("*", (req, res) => {
  res.redirect("/login");
});

userHandler(io);
roomHandler(io);
gameHandler(io);

dotenv.config();
const PORT = process.env.PORT;
httpServer.listen(PORT, () => {
  console.log(`Listen server on port ${PORT}`);
});
