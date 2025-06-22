import express, { RequestHandler, Router } from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes'
import userRoutes from './routes/user.routes'
import createGraphQLMiddleware from './graphql'

export const createServer = async () => {
  const app = express()

  const rawGQL = await createGraphQLMiddleware()
  const graphqlMiddleware = rawGQL as unknown as RequestHandler[]

  const allowedOrigins = [
    'http://localhost:3000',
    'https://freelancercrm-deployment.vercel.app',
  ]

  app.use(cors({ origin: allowedOrigins, credentials: true }))
  app.use(express.json())

  app.use('/api/auth', authRoutes)
  app.use('/api/users', userRoutes)

  const gqlRouter = Router()
  gqlRouter.use(...graphqlMiddleware)
  app.use('/api/graphql', gqlRouter)

  const healthHandler: RequestHandler = (_req, res) => {
    res.sendStatus(200);
  };
  app.get('/api/health', healthHandler);

  return app
}
