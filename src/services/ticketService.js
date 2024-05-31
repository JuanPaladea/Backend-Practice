import ticketDAO from "../dao/mongo/ticketDAO";
import ticketDTO from "../dao/dto/ticketDTO";

class ticketService {
  async getTickets() {
    try {
      const tickets = await ticketDAO.getTickets();
      if (!tickets) {
        throw new Error("No tickets found");
      }
      return tickets;
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

  async updateTicket(ticketId, ticket) {
    try {
      const updatedTicket = await ticketDAO.updateTicket(ticketId, ticket);
      if (!updatedTicket) {
        throw new Error("Error updating ticket");
      }
      return new ticketDTO(updatedTicket);
    } catch (error) {
      throw error;
    }
  }

  async deleteTicket(ticketId) {
    try {
      const deletedTicket = await ticketDAO.deleteTicket(ticketId);
      if (!deletedTicket) {
        throw new Error("Error deleting ticket");
      }
      return new ticketDTO(deletedTicket);
    } catch (error) {
      throw error;
    }
  }
}

export default new ticketService();