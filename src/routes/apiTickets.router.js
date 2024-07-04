import { Router } from "express";

import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";
import isVerified from "../middlewares/isVerified.js";

import { getTickets } from "../controllers/ticketsController.js";

const router = Router()

router.get('/', auth, isVerified, isAdmin, getTickets)

export default router