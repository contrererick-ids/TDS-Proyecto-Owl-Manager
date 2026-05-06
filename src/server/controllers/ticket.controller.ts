import { Request, Response } from 'express';
import Ticket from '../models/ticket.model';
import Client from '../models/client.model';
import User from '../models/user.model';

const generateTicketId = async (): Promise<string> => {
    const lastTicket = await Ticket.findOne().sort({ createdAt: -1 });
    const lastNumber = lastTicket?.ticketId ? Number.parseInt(lastTicket.ticketId) : 0;
    return String(lastNumber + 1).padStart(6, '0');
};

export const createTicket = async (req: Request, res: Response) => {    
    try {
        const { requestName, clientId, assignedTo, createdBy } = req.body;

        if (!requestName || !clientId || !createdBy) {
            return res.status(400).json({ message: 'requestName, clientName and createdBy are required.' });
        }
        // Se valida que el cliente exista
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).json({ message: `Client "${clientId}" not found.` });
        }
        // Se valida que el usuario exista
        const creator = await User.findById(createdBy.id);
        if (!creator) {
            return res.status(404).json({ message: `User "${createdBy}" not found.` });
        }
        // Un ticket se puede generar sin usuario asignado; hasta que es "reclamado" o "asignado" a un usuario
        // el campo 'assignedTo' permanece vacío. Primero entonces se valida si la petición ya viene con
        // un usuario asignado y si es así, validamos que este exista.
        // En caso de venir sin usuario asignado, el campo se envía con el valor 'undefined'.
        let assignedToId = undefined;
        if (assignedTo) {
            const assignedUser = await User.findById(assignedTo.id);
            if (!assignedUser) {
                return res.status(404).json({ message: `User "${assignedTo}" not found.` });
            }
            assignedToId = assignedUser._id;
        }
        // Se genera un Ticket Id único
        const ticketId = await generateTicketId();

        const newTicket = new Ticket({
            ticketId,
            requestName,
            clientId: client._id,
            assignedTo: assignedToId,
            createdBy: creator._id,
            lastModifiedDate: new Date()
        });

        const savedTicket = await newTicket.save();
        res.status(201).json(savedTicket);
    } catch (error) {
        res.status(500).json({ message: 'Error creating ticket', error });
    }
};

export const getTickets = async (req: any, res: Response) => {
    try {
        const { status, assignedTo, unassigned, mine } = req.query;

        let filter: any = {};

        // tickets del usuario
        if (mine === 'true') {
            filter.assignedTo = req.user.id;
        }

        // tickets pendientes
        if (status) {
            filter.status = status;
        }

        // tickets no asignados
        if (unassigned === 'true') {
            filter.assignedTo = null;
        }

        // asignado a alguien específico
        if (assignedTo) {
            filter.assignedTo = assignedTo;
        }

        let query = Ticket.find(filter)
            .populate('clientId', 'name email')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        // info parcial para no asignados (requisito)
        if (unassigned === 'true') {
            query = query.select('status comments');
        }

        const tickets = await query
            .populate('clientId', 'name email')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        res.status(200).json(tickets);

    } catch (error) {
        res.status(500).json({
            message: 'Error fetching tickets',
            error
        });
    }
};

export const getMyTickets = async (req: any, res: Response) => {
    // Validamos que la petición incluya el ID del usuario y que este exista
    try {

        const userId = req.params.userId;
        const user = await User.findById(userId);

        // Si no existe, respondemos con error 404
        if (!user) {
            return res.status(404).json({ message: `User with ID "${userId}" not found.` });
        }

        // Si el usuario existe, buscamos y respondemos con los tickets asignados a ese usuario
        const tickets = await Ticket.find({ assignedTo: userId })
            .populate('clientId', 'name email ')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');

        res.status(200).json(tickets);
    
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tickets', error });
    }
};

export const getTicketByTicketId = async (req: Request, res: Response) => {
    try {
        const ticket = await Ticket.findOne({ ticketId: req.params.ticketId })
            .populate('clientId', 'name email')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');
        if (!ticket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json(ticket);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching ticket', error });
    }
};

export const reassignTicket = async (req: Request, res: Response) => {
    try {
        const { assignedTo } = req.body;
        if (!assignedTo) {
            return res.status(400).json({ message: 'assignedTo is required.' });
        }
        const assignedUser = await User.findOne({ name: assignedTo });
        if (!assignedUser) {
            return res.status(404).json({ message: `User "${assignedTo}" not found.` });
        }
        const updatedTicket = await Ticket.findOneAndUpdate(
            { ticketId: req.params.ticketId },
            { assignedTo: assignedUser._id, lastModifiedDate: new Date() },
            { new: true }
        );
        if (!updatedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: 'Error reassigning ticket', error });
    }
};

export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { ticketId } = req.params;
    const { status, reason } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    // Validación si es cancelación
    if (status === 'Cancelado' && !reason) {
      return res.status(400).json({
        message: 'Cancel reason is required when cancelling a ticket'
      });
    }

    ticket.status = status;

    // solo guardar motivo si es cancelado
    if (status === 'Cancelado') {
      ticket.cancelReason = reason;
    }

    await ticket.save();

    return res.status(200).json({
      message: 'Status updated successfully',
      ticket
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error updating ticket status',
      error
    });
  }
};

export const deleteTicket = async (req: Request, res: Response) => {
    try {
        const deletedTicket = await Ticket.findOneAndDelete({ ticketId: req.params.ticketId });
        if (!deletedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json({ message: 'Ticket deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting ticket', error });
    }
};

export const addComment = async (req: Request, res: Response) => {
    try {
        const { authorName, text } = req.body;

        if (!authorName || !text) {
            return res.status(400).json({ message: 'authorName and text are required.' });
        }

        const author = await User.findOne({ name: authorName });
        if (!author) {
            return res.status(404).json({ message: `User "${authorName}" not found.` });
        }

        const updatedTicket = await Ticket.findOneAndUpdate(
            { ticketId: req.params.ticketId },
            {
                $push: {
                    comments: {
                        commentAuthorId: author._id,
                        text,
                        createdAt: new Date()
                    }
                },
                lastModifiedDate: new Date()
            },
            { new: true }
        );

        if (!updatedTicket) {
            return res.status(404).json({ message: 'Ticket not found' });
        }
        res.status(200).json(updatedTicket);
    } catch (error) {
        res.status(500).json({ message: 'Error adding comment', error });
    }
};
