import ticketDAO from "../dao/mongo/ticketDAO.js";
import ticketDTO from "../dao/dto/ticketDTO.js";

class ticketService {
  async getTickets() {
    try {
      const tickets = await ticketDAO.getTickets();
      if (!tickets) {
        throw new Error("No tickets found");
      }
      return tickets.map((ticket) => new ticketDTO(ticket));
    } catch (error) {
      throw error;
    }
  }

  async getTicketById(ticketId) {
    try {
      const ticket = await ticketDAO.getTicketById(ticketId);
      if (!ticket) {
        throw new Error("Ticket not found");
      }
      return new ticketDTO(ticket);
    } catch (error) {
      throw error;
    }
  }

  async getTicketsByUserId(userId) {
    try {
      const tickets = await ticketDAO.getTicketsByUserId(userId);
      if (!tickets) {
        throw new Error("No tickets found");
      }
      return new ticketDTO(tickets);
    } catch (error) {
      throw error;
    }
  }

  async createTicket(ticket) {
    try {
      const newTicket = await ticketDAO.createTicket(ticket);
      if (!newTicket) {
        throw new Error("Error creating ticket");
      }
      return new ticketDTO(newTicket);
    } catch (error) {
      throw error;
    }
  }
}

export default new ticketService();