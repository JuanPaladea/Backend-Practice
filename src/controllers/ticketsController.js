import ticketService from "../services/ticketService.js";

export const getTickets = async (req, res) => {
  try {
    const tickets = await ticketService.getTickets()
    res.status(200).send({status: 'success', message: 'tickets encontrados', tickets})
  } catch (error) {
    req.logger.error(`${req.method} ${req.path} - ${error.message}`)
    res.status(400).send({status: 'error', message: error.message})
  }
}