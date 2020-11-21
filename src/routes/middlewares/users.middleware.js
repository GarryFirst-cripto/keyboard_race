import { users } from '../../socket/services/userServices';

function checkString(str) {
  var valid = /^[\w\d А-я]+$/;
  return valid.test(str);
}

const errormess = 'Недопустимый символ в строке ! \n (Используйте только буквы и цифры)';
const erroruser = 'Пользователь с таким имененем уже зарегистрирован !';

export const userNameValid = (req, res, next) => {
  try {
    if (checkString(req.body.username)) {
      if (users.get(req.body.username)) {
        res.data = { status: 403, message: erroruser };
      } else {
        res.data = { status: 200, username: req.body.username };
      }
    } else {
      res.data = { status: 403, message: errormess };
    }
    next();
  } catch (error) {
    res.data = { status: 500, message: error };
    next();
  }
}