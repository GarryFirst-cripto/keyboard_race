import { rooms } from '../../socket/services/roomServices';

const errorroom = 'Комната с таким именем уже создана !';
const errorname = 'Название комнаты не должно быть пустым !';

export const roomNameValid = (req, res, next) => {
  try {
    if (req.body.roomname) {
      if (rooms.get(req.body.roomname)) {
        res.data = { status: 403, message: errorroom };
      } else {
        res.data = { status: 200, roomname: req.body.roomname }
      }
    } else {
      res.data = { status: 403, message: errorname };
    }
    next();
  } catch (error) {
    res.data = { status: 500, message: error };
    next();
  }
}