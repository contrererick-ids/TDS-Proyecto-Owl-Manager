import { Request, Response, NextFunction } from 'express';
import User, { UserRole } from '../models/user.model';

export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        role: UserRole;
    };
}

const ROLE_HIERARCHY: Record<UserRole, number> = {
    ADMIN:     3,
    EXECUTIVE: 2,
    AGENT:     1
};

export const requireRole = (role: UserRole) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {

        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized: sin sesión activa' });
            return;
        }

        try {
            const dbUser = await User.findById(req.user.id);
            if (!dbUser) {
              res.status(401).json({ error: 'Unauthorized: usuario no encontrado' });
              return;
            }

            if (ROLE_HIERARCHY[dbUser.role] < ROLE_HIERARCHY[role]) {
              res.status(403).json({ error: `Forbidden: se requiere rol ${role} o superior` });
              return;
            }

            next();

        } catch (error) {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    };
};