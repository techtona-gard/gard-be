import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { userRouter } from './routes/user.route.js';
import { aiRouter } from './routes/ai.route.js';
import { historyRouter } from './routes/history.route.js';
import { lifestyleRouter } from './routes/lifestyle.route.js';

const app = express();

// Port configuration
const env = process.env.NODE_ENV || 'development';
const hostName = process.env.HOST_NAME || 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

// CORS Configuration
app.use(cors());

// JSON Configuration
app.use(express.json());

// API Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/histories', historyRouter);
app.use('/api/v1/lifestyles', lifestyleRouter);

app.get('/', (req, res) => {
  res.send('Welcome to Gard Backend!');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Error Handler]', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: statusCode === 500 ? 'error' : 'fail',
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

// Listening to the port
app.listen(port, hostName, () => {
  console.log(`[Server] running in ${env} mode on http://${hostName}:${port}`);
});
