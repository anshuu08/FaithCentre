import express from 'express';
import cors from 'cors';
import testimonialsRouter from '../server/routes/testimonials.js';

const app = express();
app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/api/testimonials', testimonialsRouter);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', serverless: true });
});

export default app;
