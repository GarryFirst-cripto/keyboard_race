import { roomname } from './roomServices.mjs';
import { socket, username } from '../game.mjs';
import { elementFactory } from '../helpers/domHelper.mjs';
import { proxyAudio } from '../helpers/audioHelper.mjs';

document.getElementById('setready').addEventListener('click', userReady);
document.getElementById('sendsendmess').addEventListener('click', roomMessage);
const gamerbox = document.getElementById('gamers');
const room = document.getElementById('roomheader');
const commentator = document.getElementById('commentator');
export const caps = ['Ready', 'Not Ready'];

function roomMessage() {
  const input = document.getElementById('roomtext');
  const message = input.value;
  socket.emit('roommessage', { username, roomname, message });
  input.value = '';
}

function userReady() {
  const readyButton = document.getElementById('setready');
  const logg = (readyButton.innerText === caps[0]);
  readyButton.innerText = logg ? caps[1] : caps[0];
  socket.emit('Ready', { roomname, username, logg });
}

export function findGamer(gamerId) {
  for (let i = 0; i < gamerbox.children.length; i++) {
    const element = gamerbox.children[i];
    if (element.children[1].innerText === gamerId) {
      return gamerbox.children[i];
    }
  }
  return null;
}

function getOtmetka(value1, value2) {
  return value1 === value2 ? '(* You *)' : '';
}

function insertGamer(gamer) {
  const newGamer = elementFactory(
    {
      tagName: 'div', className: 'gamer', children: [
        { tagName: 'div', className: 'simb-ready' },
        { tagName: 'label', className: 'simb-name', text: gamer.usernm },
        {
          tagName: 'div', className: 'gamerbar', text: getOtmetka(gamer.usernm, username), children: [
            { tagName: 'div', className: 'indicator' }
          ]
        }
      ]
    }
  );
  newGamer.children[1].style.color = gamer.usernm === username ? 'red' : 'black';

  newGamer.facade = state => {
    if (state.ready) {
      newGamer.children[0].style.backgroundColor = state.ready === 'Y' ? 'green' : 'red';
    }
    if (state.point) {
      const indicator = newGamer.children[2].children[0];
      indicator.style.width = state.point;
      if (state.finish) {
        indicator.style.background = 'linear-gradient(to bottom, #92ebf3, #108aaf) #5988ac';
      } else {
        indicator.style.background = 'linear-gradient(to bottom, #92a0f3, #1038af) #596eac';
      }
    }
  }
  gamerbox.appendChild(newGamer);
  return newGamer;
}

export const gameroomUpdate = gameroom => {
  room.innerText = gameroom.roomname;
  if (gamerbox.children.length > gameroom.users.length) gamerbox.innerHTML = '';
  gameroom.users.forEach(item => {
    let element = findGamer(item.usernm);
    if (!element) {
      element = insertGamer(item);
    };
    element.facade({ ready: item.ready ? 'Y' : 'N' });
  });
}

export const newComment = comment => {
  let text = '';
  comment.forEach(item => {
    text += `${item}<br />`;
  });
  commentator.innerHTML = `<div class="comment">${text}</div>`;
  proxyAudio['news'];
}

export const addRoomMessage = (username, message) => {
  const newMess = elementFactory(
    {
      tagName: 'div', children: [
        { tagName: 'div', text: `${username} : ` },
        { tagName: 'div', text: message },
        { tagName: 'hr' }
      ]
    }
  );
  document.getElementById('roommess').appendChild(newMess);
};
