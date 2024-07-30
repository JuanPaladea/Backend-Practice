import ticketModel from './models/ticketModel.js'

class ticketDAO {
  async getTickets() {
    try {
      const tickets = await ticketModel.find().populate('purchaser').populate('products.product').lean()
      return tickets
    } catch (error) {
      throw error
    }
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await ticketModel.findById(ticketId)
      return ticket
    } catch (error) {
      throw error
    }
  }

  async getTicketsByUserId(userId) {
    try {
      const tickets = await ticketModel.find({ purchaser: userId }).populate('products.product').lean()
      return tickets
    } catch (error) {
      throw error
    }
  }

  async createTicket(ticket) {
    try {
      const newTicket = await ticketModel.create(ticket)
      return newTicket
    } catch (error) {
      throw error
    }
  }
}

export default new ticketDAO();