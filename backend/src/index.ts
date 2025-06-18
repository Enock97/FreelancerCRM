import express, { RequestHandler, Router } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import createGraphQLMiddleware from './graphql';



dotenv.config();

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10)

const bootstrap = async () => {
  const rawGQL = await createGraphQLMiddleware();
  const graphqlMiddleware = rawGQL as unknown as RequestHandler[];

  const allowedOrigins = [
    "http://localhost:3000",
    "https://freelancercrm-deployment.vercel.app"
  ];

  app.use(
    cors({
      origin: allowedOrigins,
      credentials: true,
    })
  );

  app.use(express.json());

  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);

  const gqlRouter = Router();
  gqlRouter.use(...graphqlMiddleware);
  app.use('/api/graphql', gqlRouter);


  const healthHandler: RequestHandler = (_req, res) => {
    res.sendStatus(200);
  };
  app.get('/api/health', healthHandler);

  app.listen(PORT,'0.0.0.0', () => {
    console.log(`REST Server is active and running on /api/auth/`);
    console.log(`GraphQL Server is active and running on /api/graphql`);
    console.log(`API Health is active and running on /api/health`);
  });

};

bootstrap();
