import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

app.use(cors());
app.use(express.json());

// API v1 Routing
app.use('/api/v1', routes);

// Base Route status
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'PropertyHub Pakistan API',
    version: '1.0.0',
    timestamp: new Date(),
  });
});

export default app;
export { app };
