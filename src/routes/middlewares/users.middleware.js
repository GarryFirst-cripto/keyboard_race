import { users } from '../../socket/services/userServices';

function checkString(str) {
  var valid = /^[\w\d А-я]+$/;
  return valid.test(str);
}

const errormess = 'Invalid character in line ! \n (Use only letters and numbers)';
const erroruser = 'User with such name has already been registered !';

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