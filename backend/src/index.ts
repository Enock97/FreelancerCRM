import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import activityRoutes from './routes/activity.routes';
import userRoutes from './routes/user.routes';
import createGraphQLMiddleware from './graphql';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const bootstrap = async () => {
  const graphqlMiddleware = await createGraphQLMiddleware();

  app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }));

  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/activities', activityRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/graphql', ...graphqlMiddleware);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL running at http://localhost:${PORT}/graphql`);
  });
};

bootstrap();
