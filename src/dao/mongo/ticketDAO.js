import ticketModel from './models/ticketModel.js'

class ticketDAO {
  async getTickets() {
    try {
      const tickets = await ticketModel.find({})
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

  async createTicket(ticket) {
    try {
      const newTicket = await ticketModel.create(ticket)
      return newTicket
    } catch (error) {
      throw error
    }
  }

  async updateTicket(ticketId, ticket) {
    try {
      const updatedTicket = await ticketModel.findByIdAndUpdate(ticketId, ticket)
      return updatedTicket
    } catch (error) {
      throw error
    }
  }

  async deleteTicket(ticketId) {
    try {
      const deletedTicket = await ticketModel.findByIdAndDelete(ticketId)
      return deletedTicket
    } catch (error) {
      throw error
    }
  }
}

export default new ticketDAO();