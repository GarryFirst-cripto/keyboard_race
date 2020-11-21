import { Router } from "express";
import path from "path";
import { HTML_FILES_PATH } from "../config";
import { roomNameValid } from './middlewares/rooms.middleware';
import { proxyText } from '../data';

const router = Router();

router
  .get("/texts/:id", (req, res) => {
    const indd = req.params.id.substr(1);
    res.send({ status: 200, text: proxyText[indd] });
  })
  .get("/sounds/*", (req, res) => {
    const page = path.join(HTML_FILES_PATH, req.url);
    res.sendFile(page);    
  })
  .get("/", (req, res) => {
    const page = path.join(HTML_FILES_PATH, "game.html");
    res.sendFile(page);
  })
  .post("/", roomNameValid, (req, res) => {
    if (res.data.status === 200) {
      const result = { status: 200, roomname: req.body.roomname };
      res.status(200).send(result);
    } else {
      res.status(res.data.status).send(res.data);
    }
  });

export default router;
