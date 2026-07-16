import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { userRouter } from './routes/user.route.js';
import { aiRouter } from './routes/ai.route.js';

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

app.get('/', (req, res) => {
  res.send('Welcome to Gard Backend!');
});

// Listening to the port
app.listen(port, hostName, () => {
  console.log(`[Server] running in ${env} mode on http://${hostName}:${port}`);
});
