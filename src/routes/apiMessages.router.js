import { Router } from "express";

import messageService from "../services/messageService.js";
import auth from "../middlewares/auth.js";
import isVerified from "../middlewares/isVerified.js";

const router = Router();

router.get("/", auth, isVerified, async (req, res) => {
  try {
    const messages = await messageService.getMessages();
    res.status(200).send({ status: "success", messages });
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({ status: "error", message: error.message });
  }
});

router.post("/", auth, isVerified, async (req, res) => {
  const { message } = req.body;
  const {email, firstName} = req.session.user;

  if (!email || !firstName) {
    req.logger.warning(`${req.method} ${req.path} - Unauthorized`)
    return res.status(401).send({ status: "error", message: "Unauthorized" });
  }
 
  if (!message) {
    req.logger.warning(`${req.method} ${req.path} - Message is required`)
    return res.status(400).send({ status: "error", message: "Message is required" });
  }

  try {
    const newMessage = await messageService.addMessage({ email, firstName, message });
    res.status(201).send({ status: "success", message: newMessage });
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({ status: "error", message: error.message });
  }
});

export default router;