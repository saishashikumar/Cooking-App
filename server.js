import express from 'express';
import { createServer as createViteServer } from 'vite';
import { config } from 'dotenv';
import handler from './api/generate-plan.js';

config();

const app = express();
app.use(express.json());
app.use('/api/generate-plan', handler);

const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa',
});

app.use(vite.middlewares);

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
