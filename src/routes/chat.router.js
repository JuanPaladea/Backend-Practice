import { Router } from "express";
import messageService from "../services/messageService.js";
import auth from "../middlewares/auth.js";
import isVerified from "../middlewares/isVerified.js";

const router = Router();

router.get("/", auth, isVerified, async (req, res) => {
  try {
    const messages = await messageService.getMessages();
    res.render(
      "chat", 
      { 
        layout: "default",
        script: "chat.js",
        title: "Backend Juan Paladea | Chat",
        messages: messages
      });
  } catch (error) {
    res.status(400).send({ status: "error", message: error.message });
  }
})

export default router;