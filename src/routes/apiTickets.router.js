import { Router } from "express";

import auth from "../middlewares/auth.js";

import { getTickets } from "../controllers/ticketsController.js";
import isAdmin from "../middlewares/isAdmin.js";

const router = Router()

router.get('/', auth, isAdmin, getTickets)

export default router