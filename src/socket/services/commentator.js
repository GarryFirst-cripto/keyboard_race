import { rooms } from './roomServices';
import { users } from './userServices';
import { COMMENT_INTERVAL } from '../config';
import * as mess from './messages';

const startComment = 'Привет ! <br /> Мы с вами снова на центральном клавадроме страны и с вами Я - ваш любимый комментатор Клавиатурный Макс !';
const newUserComment = 'Привет ! Мы рады, что вы присоединились к нам ! <br /> Я - ваш любимый комментатор Клавиатурный Макс и я веду свой репортаж с центрального клаводрома страны !';
const nextComment = 'С вами Я - ваш комментатор Клавиатурный Макс !';
const finComment = 'С Вами был Я - Клавиатурный Макс и это были незабываемые гонки на центральном клаводроме страны ...';
const restartComment = 'А мы между тем продолжаем свою трансляцию. Готовится еще один заезд. Все ли клаво-гонщики примут в нем участи ? Следите за нашим эфиром !';

const distTextA = ['с небольшим отрывом', 'с заметным отрывом', 'с большим отрывом'];
const distTextB = ['буквально по пятам', 'немного отставая', ''];

class Commentator {

  constructor(io, roomId) {
    this.io = io;
    this.roomId = roomId;
    this.gamers = [];
    this.finished = 0;
    this.curResults = [];
    this.started = false;
    this.startWorking = this.startWorking.bind(this);
    this.restartWorking = this.restartWorking.bind(this);
    this.beforeRace = this.beforeRace.bind(this);
    this.intoRace = this.intoRace.bind(this);
    this.startRace = this.startRace.bind(this);
    this.intoRace = this.intoRace.bind(this);
    this.gamerOnFinishLine = this.gamerOnFinishLine.bind(this);
    this.gamerFinish = this.gamerFinish.bind(this);
    this.finishRace = this.finishRace.bind(this);
    setTimeout(this.startWorking, 2000);
  }

  startWorking() {
    this.current = rooms.get(this.roomId);
    if (!this.current) {
      return;
    }
    this.io.to(this.roomId).emit('comment', [startComment]);
    this.handleA = setInterval(this.beforeRace, COMMENT_INTERVAL * 1000);
    this.current.users.forEach(item => {
      this.gamers.push({ usernm: item.usernm, position: 0 });
    });
    this.index = 0;
  }

  restartWorking() {
    this.current = rooms.get(this.roomId);
    if (!this.current) {
      return;
    }
    this.gamers = [];
    this.current.users.forEach(item => {
      this.gamers.push({ usernm: item.usernm, position: 0 });
    });
    this.index = this.gamers.length;
    this.io.to(this.roomId).emit('comment', [restartComment, nextComment]);
    this.handle = setInterval(this.beforeRace, COMMENT_INTERVAL * 1000);
    this.started = false;
    this.finished = 0;
    this.curResults = [];
  }

  exitMessage(userId, index) {
    const user = users.get(userId);
    return mess.messageExit(user.username, user.auto, index + 1);
  }

  exitRaceMessage(userId, index) {
    const user = users.get(userId);
    return mess.messageExitRace(user.username, user.auto, index + 1);
  }

  infoMessage(userId, index) {
    const user = users.get(userId);
    return mess.messageInfo(user.username, user.auto, user.raceCount, user.raceWin, index + 1);
  }

  appendMessage(userId, index) {
    const user = users.get(userId);
    return mess.messageAdd(user.username, user.auto, user.raceCount, user.raceWin, index + 1);
  }

  finLineMessage(userId, finished) {
    const user = users.get(userId);
    return mess.messageFinLine(user.username, user.auto, finished);
  }

  winnerMessage(usernm) {
    return mess.messageWinner(usernm);
  }

  nowinnerMessage(usernm, finished) {
    return mess.messageNoWinner(usernm, finished);
  }

  getdistType(posA, posB) {
    if (posA - posB > 25) {
      return 2;
    };
    if (posA - posB > 10) {
      return 1;
    };
    return 0;
  }

  firstResults(current) {
    let txt = 'А вто и первые результаты гонки : <br />';
    if (current.length > 1) {
      const distType = this.getdistType(current[0].poss, current[1].poss);
      txt += `${distTextA[distType]} лидирует ${current[0].usernm} он на отметке ${current[0].poss} <br />`;
      txt += `за ним ${distTextB[distType]} следует ${current[1].usernm} <br />`;
      for (let i = 2; i < current.length; i++) {
        if (i === current.length - 1) {
          txt += `и последним сейчас идет ${current[i].usernm} на отметке ${current[i].poss}`;
        } else {
          txt += `следующим в гонке идет ${current[i].usernm} на отметке ${current[i].poss} <br />`;
        }
      };
      return txt;
    } else {
      return txt + `клавогонщик ${current[0].usernm} на ${current[0].poss}-й отметке`;
    }
  }

  nextResults(current) {
    let txt = 'Новая информация о ходе гонки : <br />';
    if (current.length > 1) {
      const distType = this.getdistType(current[0].poss, current[1].poss);
      if (current[0].finish) {
        txt += `${current[0].usernm} уверенно финишировал. Он победительгонки ! <br />`;
        txt += `На втором месте - ${current[1].usernm} он ${current[1].finish ? 'финишировал вторым' : 'он пока на отметке' + current[1].poss} <br />`;
      } else {
        if (current[0].usernm === this.curResults[0].usernm) {
          txt += `По прежнему ${distTextA[distType]} лидирует ${current[0].usernm}`;
        } else {
          txt += `Вперед вырвался ${current[0].usernm} и лидирует ${distTextA[distType]}`;
        };
        txt += ` он сейчас на отметке  ${current[0].poss} <br />`;
        txt += `за ним ${distTextB[distType]} следует ${current[1].usernm} <br />`;
      }
      for (let i = 2; i < current.length; i++) {
        if (i === current.length - 1) {
          txt += `и последним ${current[i].usernm === this.curResults[i].usernm ? 'по прежнему' : 'теперь'} идет ${current[i].usernm} на отметке ${current[i].poss}`;
        } else {
          txt += `следующим в гонке идет ${current[i].usernm} на отметке ${current[i].poss} <br />`;
        }
      };
      return txt;
    } else {
      return txt + `клавогонщик ${current[0].usernm} на ${current[0].poss}-й отметке`;
    }
  }

  finishMessage(results) {
    const dataResults = []
    results.forEach((item, index) => {
      const user = users.get(item.name);
      dataResults.push({ name: item.name, raits: item.raits, auto: user.auto, raceWin: user.raceWin + 1 });
    })
    return mess.messageFinish(dataResults);
  }

  beforeRace() {
    this.current = rooms.get(this.roomId);
    if (!this.current || this.started) {
      return;
    }
    let text = [];
    for (let i = 0; i < this.gamers.length;) {
      if ((this.current.users.length > i) && (this.current.users[i].usernm === this.gamers[i].usernm)) {
        i++;
      } else {
        if (i < this.index) {
          this.index--;
        }
        text.push(this.exitMessage(this.gamers[i].usernm, i));
        this.gamers.splice(i, 1);
      }
    };
    if (text.length < 2) {
      while (this.index < this.gamers.length) {
        text.push(this.infoMessage(this.gamers[this.index].usernm, this.index));
        this.index++;
      }
    }
    if (text.length < 2) {
      while (this.index < this.current.users.length) {
        this.gamers.push({ usernm: this.current.users[this.index].usernm, position: 0 });
        text.push(this.appendMessage(this.gamers[this.index].usernm, this.index));
        this.index++;
      }
    }
    if (text.length === 0) {
      text.push(mess.outsidMessage['mess']);
      if (this.gamers.length === 1) {
        text.push(mess.nogamersMess['mess']);
      };
      text.push(nextComment);
    }
    this.io.to(this.roomId).emit('comment', text);
  }

  newUser(socket) {
    socket.emit('comment', [newUserComment]);
  }

  startRace() {
    this.current = rooms.get(this.roomId);
    if (!this.current || this.started) {
      return;
    };
    this.gamers = [];
    this.current.users.forEach(user => {
      this.gamers.push({ usernm: user.usernm, position: 0 });
    });
    this.started = true;
    const text = [mess.startMessage[''], nextComment];
    this.io.to(this.roomId).emit('comment', text);
    clearInterval(this.handleA);
    this.handleB = setInterval(this.intoRace, COMMENT_INTERVAL * 1000);
  }

  intoRace() {
    this.current = rooms.get(this.roomId);
    if (!this.current) {
      return;
    }
    let text = [];
    for (let i = 0; i < this.gamers.length;) {
      if ((this.current.users.length > i) && (this.current.users[i].usernm === this.gamers[i].usernm)) {
        i++;
      } else {
        if (i < this.index) {
          this.index--;
        }
        text.push(this.exitRaceMessage(this.gamers[i].usernm, i));
        this.gamers.splice(i, 1);
      }
    };
    let current = [];
    this.current.users.forEach(item => {
      const { usernm, position, ostatok, finish } = item;
      current.push({ usernm, poss: position + ostatok, finish });
    });
    current.sort((a, b) => (b.poss - a.poss));
    if (this.curResults.length === 0) {
      text.push(this.firstResults(current));
    } else {
      text.push(this.nextResults(current));
    };
    this.io.to(this.roomId).emit('comment', text);
    this.curResults = [];
    current.forEach(item => this.curResults.push(item));
  }

  gamerOnFinishLine(user) {
    clearInterval(this.handleB);
    this.handleB = setInterval(this.intoRace, COMMENT_INTERVAL * 1000);
    const text = [this.finLineMessage(user.usernm, this.finished)];
    this.io.to(this.roomId).emit('comment', text);
  }

  gamerFinish(user) {
    clearInterval(this.handleB);
    this.handleB = setInterval(this.intoRace, COMMENT_INTERVAL * 1000);
    const text = [];
    if (this.finished === 0) {
      text.push(this.winnerMessage(user.usernm));
    } else {
      text.push(this.nowinnerMessage(user.usernm, this.finished));
    };
    this.finished++;
    this.io.to(this.roomId).emit('comment', text);
  }

  finishRace(results) {
    clearInterval(this.handleA);
    clearInterval(this.handleB);
    const text = [this.finishMessage(results), finComment];
    this.io.to(this.roomId).emit('comment', text);
    setTimeout(this.restartWorking, COMMENT_INTERVAL * 1000);
  }

}

export const roomCommentator = (io, roomId) => new Commentator(io, roomId);