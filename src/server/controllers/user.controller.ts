import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model';

export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, username, email, password, role } = req.body;

        if (!name || !username || !email || !password) {
            res.status(400).json({ message: 'name, username, email and password are required' });
            return;
        }

        // Verificar duplicados antes de intentar guardar
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            res.status(409).json({ message: 'Username o email ya están en uso' });
            return;
        }

        // Hashear contraseña antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, username, email, password: hashedPassword, role });
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);

    } catch (error: any) {
        // Duplicate key de Mongoose como red de seguridad
        if (error.code === 11000) {
            res.status(409).json({ message: 'Username o email ya están en uso' });
            return;
        }
        res.status(500).json({ message: 'Error creating user', error });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        // Si viene nueva contraseña, hashearla antes de actualizar
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { returnDocument: 'after' }
        );
        if (!updatedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user', error });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};