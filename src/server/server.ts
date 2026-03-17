import app from './app';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.SERVER_PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});