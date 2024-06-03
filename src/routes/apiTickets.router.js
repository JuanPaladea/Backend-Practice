import { Router } from "express";

import auth from "../middlewares/auth.js";
import isAdmin from "../middlewares/isAdmin.js";
import ticketService from "../services/ticketService.js";
import isVerified from "../middlewares/isVerified.js";

const router = Router()

router.get('/', auth, isVerified, isAdmin, async (req, res) => {
  try {
    const tickets = await ticketService.getTickets()
    res.status(200).send({status: 'success', message: 'tickets encontrados', tickets})
  } catch (error) {
    res.status(400).send({status: 'error', message: error.message})
  }
})

export default router