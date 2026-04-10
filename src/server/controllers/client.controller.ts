import { Request, Response } from 'express';
import Client from '../models/client.model';
import User from '../models/user.model';

export const createClient = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, company, assignedTo } = req.body;

        if (!name || !assignedTo) {
            return res.status(400).json({ message: 'Name and assignedTo are required.' });
        }

        // Buscar al usuario por nombre y obtener su ObjectId
        const user = await User.findOne({ name: assignedTo });
        if (!user) {
            return res.status(404).json({ message: `User "${assignedTo}" not found.` });
        }

        const newClient = new Client({ name, email, phone, company, assignedTo: user._id });
        const savedClient = await newClient.save();
        res.status(201).json(savedClient);
    } catch (error) {
        res.status(500).json({ message: 'Error creating client', error });
    }
};

export const getClients = async (req: Request, res: Response) => {
    try {
        const clients = await Client.find().populate('assignedTo', 'name email');
        res.status(200).json(clients);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching clients', error });
    }
};

export const getClientById = async (req: Request, res: Response) => {
    try {
        const client = await Client.findById(req.params.id).populate('assignedTo', 'name email');
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(client);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching client', error });
    }
};

export const updateClient = async (req: Request, res: Response) => {
    try {
        const updatedClient = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(500).json({ message: 'Error updating client', error });
    }
};

export const deleteClient = async (req: Request, res: Response) => {
    try {
        const deletedClient = await Client.findByIdAndDelete(req.params.id);
        if (!deletedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json({ message: 'Client deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting client', error });
    }
};

export const assignClientToUser = async (req: Request, res: Response) => {
    try {
        const { assignedTo } = req.body;
        if (!assignedTo) {
            return res.status(400).json({ message: 'assignedTo is required.' });
        }
        // Buscar al usuario por nombre y obtener su ObjectId
        const user = await User.findOne({ name: assignedTo });
        if (!user) {
            return res.status(404).json({ message: `User "${assignedTo}" not found.` });
        }
        const updatedClient = await Client.findByIdAndUpdate(req.params.id, { assignedTo: user._id }, { new: true });
        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }
        res.status(200).json(updatedClient);
    } catch (error) {
        res.status(500).json({ message: 'Error assigning client to user', error });
    }
};
