import { createElement } from '../helpers/domHelper.mjs';

export let addressee = '';

document.getElementById('logoffButton').addEventListener('click', logOff);
const userbox = document.getElementById('userbox');

function logOff() {
  if (confirm('Do you really want to exit the game ?')) {
    sessionStorage.setItem('username', '');
    window.location.replace('/login');
  }
}

const testAddressee = addr => {
  const user = findUser(addr);
  return (user) && (user.className.indexOf('busy') === -1);
}

function selectUser(event) {
  const addr = event.target.innerText;
  if (testAddressee(addr)) {
    addressee = addr;
    document.getElementById('addressee').innerText = `Адресат : ${addressee}`;
  } else {
    alert('This addressee is now in one of the rooms  \n and not be able to read your message ...');
  }
}

function findUser(userId) {
  for (let i = 0; i < userbox.children.length; i++)
    if (userbox.children[i].innerText === userId) return userbox.children[i];
  return null;
}

function createUser(user) {
  const newUser = createElement({ tagName: 'button', className: 'user', text: user.username, onclick: selectUser });
  userbox.appendChild(newUser);
  return newUser;
}

export const userAddUpdate = (user) => {
  let element = findUser(user.username);
  if (!element) {
    element = createUser(user);
  };
  element.className = user.userroom !== '' ? 'user busy' : 'user';
}

export const userRemove = user => {
  let element = findUser(user.username);
  if (element) {
    userbox.removeChild(element);
  };
}

