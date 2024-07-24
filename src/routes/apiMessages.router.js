import { Router } from "express";

import auth from "../middlewares/auth.js";

import { addMessage, getMessages } from "../controllers/messagesController.js";

const router = Router();

router.get("/", auth, getMessages);
router.post("/", auth, addMessage);

export default router;