import express from 'express';
import cors from 'cors';
import routes from './routes/routes';

const app = express();

app.get('/', (req, res) => {
    res.send('Api works!');
});

// Middleware de CORS
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas de la API
app.use('/api', routes);

export default app;