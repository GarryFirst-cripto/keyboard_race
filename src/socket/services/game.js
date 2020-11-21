import { rooms, MAIN_ROOM_ID } from './roomServices';
import { SECONDS_TIMER_BEFORE_START_GAME, SECONDS_FOR_GAME, FINISH_LINE_DISTANCE } from '../config';
import { MAXIMUM_USERS_FOR_ONE_ROOM } from '../config';
import { proxyText } from '../../data';
import { users } from './userServices';

function randomIndex(max) {
  const rand = Math.random() * (max + 1);
  return Math.floor(rand);
}

class Game {

  constructor(io, roomId) {
    this.io = io;
    this.roomId = roomId;
    this.current = rooms.get(this.roomId);
    this.startTimer = this.doStartTimer.bind(this);
    this.gameTimer = this.doGameTimer.bind(this);
    this.starter = SECONDS_TIMER_BEFORE_START_GAME;
    this.gametime = SECONDS_FOR_GAME;
    this.start();
  }

  doStartTimer() {
    this.starter--;
    this.io.to(this.roomId).emit('starttimer', this.starter);
    if (this.starter === 0) {
      clearInterval(this.handle);
      this.io.to(this.roomId).emit('startgame', this.gametime);
      this.handle = setInterval(this.gameTimer, 1000);
      if (this.onStart) {
        this.onStart();
      };
    };
  }

  doGameTimer() {
    this.gametime--;
    this.io.to(this.roomId).emit('gametimer', this.gametime + ' сек.');
    if (this.gametime === 0) {
      this.io.to(this.roomId).emit('endgame');
      this.finish();
    };
  }

  control() {
    let logg = true;
    this.current.users.forEach(item => { logg = logg && item.finish });
    if (logg) {
      this.io.to(this.roomId).emit('endgame');
      this.finish();
    }
  }

  observe(raceEvents) {
    const { onStart, gamerOnLine, gamerFinish, onEnd } = raceEvents;
    this.onStart = onStart;
    this.gamerOnLine = gamerOnLine;
    this.gamerFinish = gamerFinish;
    this.onEnd = onEnd;
  };

  userpoint(userId, point) {
    this.current.users.forEach(user => {
      if (user.usernm === userId) {
        user.position = point;
        const finish = point >= this.textsize;
        if ((user.position === this.textsize - FINISH_LINE_DISTANCE) && (this.gamerOnLine)) {
          this.gamerOnLine(user);
        }
        user.finish = finish;
        if (finish) {
          user.ostatok = this.gametime;
          if (this.gamerFinish) {
            this.gamerFinish(user);
          }
        }
        const pozz = 100 * (point / this.textsize);
        this.io.to(this.roomId).emit('userpoint', { userId, point: pozz, finish });
      }
    });
    this.control();
  }

  start() {
    if (rooms.get(this.roomId)) {
      rooms.get(this.roomId).started = true;
      this.io.to(MAIN_ROOM_ID).emit('roomupdate', {
        roomname: rooms.get(this.roomId).roomname,
        users: rooms.get(this.roomId).users.length,
        full: rooms.get(this.roomId).users.length >= MAXIMUM_USERS_FOR_ONE_ROOM,
        started: rooms.get(this.roomId).started
      });
      this.current.users.forEach(user => {
        user.position = 0;
        user.ostatok = 0;
        user.finish = false;
      });
    };
    const index = randomIndex(proxyText.length - 1);
    this.textsize = proxyText[index].length;
    this.io.to(this.roomId).emit('prepare', { index });
    this.io.to(this.roomId).emit('starttimer', this.starter);
    this.handle = setInterval(this.startTimer, 1000);
  }

  finish() {
    clearTimeout(this.handle);
    let results = [];
    this.current.users.forEach(user => {
      const name = user.usernm;
      const raits = (user.position / (SECONDS_FOR_GAME - user.ostatok)).toFixed(2);
      results.push({ name, raits });
      user.ready = false;
    });
    results.sort((a, b) => (b.raits - a.raits));
    if (this.onEnd) {
      this.onEnd(results);
    }
    let text = '';
    let i = 1;
    results.forEach(item => {
      text += `${i}-е место : ${item.name} ( ${item.raits} знаков в сек.) \n`;
      users.get(item.name).raceCount++;
      if (i = 1) {
        users.get(item.name).raceWin++;
      }
      i++;
    });
    this.io.to(this.roomId).emit('resultgame', text);
    this.current.started = false;
    this.io.to(MAIN_ROOM_ID).emit('roomupdate', {
      roomname: this.current.roomname,
      users: this.current.users.length,
      full: this.current.users.length >= MAXIMUM_USERS_FOR_ONE_ROOM,
      started: this.current.started
    });
    this.current.game = null;
  }

}

export const startgame = (io, roomId) => new Game(io, roomId);