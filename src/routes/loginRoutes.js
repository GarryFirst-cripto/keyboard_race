import { Router } from 'express';
import path from 'path';
import { HTML_FILES_PATH } from '../config';
import { userNameValid } from './middlewares/users.middleware';
import { users } from '../socket/services/userServices';

const router = Router();

router
  .get("/", (req, res) => {
    const page = path.join(HTML_FILES_PATH, "login.html");
    res.sendFile(page);
  })
  .post("/", userNameValid, (req, res) => {
    if (res.data.status === 200) {
      users.set(req.body.username, { username: req.body.username, userroom: '', usersocket: null });
      const result = { status: 200, username: req.body.username };
      res.status(200).send(result);
    } else {
      res.status(res.data.status).send(res.data);
    }
  });

export default router;
