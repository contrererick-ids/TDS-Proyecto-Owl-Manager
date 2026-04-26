import { Request, Response } from 'express';
import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model';

// Lógica de autenticación
export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username y password son requeridos' });
    }
    try {
        const user = await User.findOne({ username }).select('+password')
        if (!user || !user.isActive) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        const token = jsonwebtoken.sign({ id: user._id, name: user.name, role: user.role }, process.env.JWT_SECRET as string, { expiresIn: '1h' });
        const userId = user._id;
        return res.status(200).json({ token, userId });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
