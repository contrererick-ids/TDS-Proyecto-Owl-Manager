import express from 'express';
import cors from 'cors';
import routes from './routes/routes';

// import swagger
import { swaggerSpec } from '../server/config/swager.config';
import swaggerUi from 'swagger-ui-express';


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

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;