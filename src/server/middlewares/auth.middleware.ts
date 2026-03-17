import jsonwebtoken from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

// Middleware de autenticación
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extrae el token del encabezado
    if (!token) {
        return res.status(401).json({ message: 'Acceso no autorizado' });
    }

    jsonwebtoken.verify(token, process.env.JWT_SECRET as string, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Token inválido' });
        }
        (req as any).user = user;
        next();
    });
};
