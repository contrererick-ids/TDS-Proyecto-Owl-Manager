import app from './app';
import dotenv from 'dotenv';
import connectToDataBase from './config/db';

// Cargar variable del Servidor
dotenv.config();
const PORT = process.env.SERVER_PORT || 3000;

// Llamar a la BD e inicializar el servidor
async function startServer() {
    try {
        await connectToDataBase();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

await startServer();