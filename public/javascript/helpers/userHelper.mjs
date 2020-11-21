import { callWebApi } from "./apiHelper.mjs";

export const testInputValue = async (value) => {
  const response = await callWebApi({
    endpoint: '/login',
    type: 'POST',
    request: { username: value }
  });
  if (response.status === 200) {
    return response.username;
  };
  if (response.message) {
    alert(response.message);
  }
  return '';
}

export const testRoomName = async (value, user) => {
  const response = await callWebApi({
    endpoint: '/game',
    type: 'POST',
    request: { roomname: value }
  });
  if (response.status === 200) {
    return response.roomname;
  };
  if (response.message) {
    alert(response.message);
  }
  return '##';
}

export const getGameText = async value => {
  const response = await callWebApi({
    endpoint: `/game/texts/:${value}`,
    type: 'GET',
  });
  if (response.status === 200) {
    return response.text;
  };
  if (response.message) {
    alert(response.message);
  }
  return '';
}
