import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import contactRoutes from './routes/contact.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/contacts', contactRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
