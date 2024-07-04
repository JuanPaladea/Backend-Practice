import { Router } from "express";

import auth from "../middlewares/auth.js";
import isVerified from "../middlewares/isVerified.js";

import { addMessage, getMessages } from "../controllers/messagesController.js";

const router = Router();

router.get("/", auth, isVerified, getMessages);
router.post("/", auth, isVerified, addMessage);

export default router;