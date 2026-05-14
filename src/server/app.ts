import express from 'express';
import cors from 'cors';
import routes from './routes/routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// import swagger
import { swaggerSpec } from '../server/config/swager.config.js';
import swaggerUi from 'swagger-ui-express';

// socket.io configuration
import { createServer } from 'http';
import { Server } from 'socket.io';
import jsonwebtoken from 'jsonwebtoken';

const app = express();

const httpServer = createServer(app);
export const io = new Server(httpServer, {
    // allows all origins to connect to the socket.io server, later we can restrict this to specific origins for security reasons
    cors: { origin: '*' }
});

// Middleware de CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error: No token provided'));
    }
    try {
        const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET as string) as any;
        (socket as any).userId = payload.id; // Attach user info to socket object
        next();
    } catch (err) {
        return next(new Error('Authentication error: Invalid token'));
    }
});

io.on('connection', (socket) => {
    const userId = (socket as any).userId; // Get user ID from socket object
    socket.join(userId); // Join a room with the user ID as the name
    console.log(`Usuario ${userId} conectado por socket`);
    socket.on('disconnect', () => {
        console.log(`Usuario ${userId} desconectado por socket`);
    });
});

// Rutas de la API
app.use('/api', routes);
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Servir archivos estáticos (la aplicación React)
app.use(express.static(path.join(__dirname, '../../dist/client')));
app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, '../../dist/client', 'index.html'));  
});  

export default httpServer;