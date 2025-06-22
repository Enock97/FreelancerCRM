import dotenv from 'dotenv'
import { createServer } from './server'

dotenv.config()

const PORT = parseInt(process.env.PORT || '5000', 10)

const bootstrap = async () => {
  const app = await createServer()

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`REST Server is active and running on /api/auth/`)
    console.log(`GraphQL Server is active and running on /api/graphql`)
    console.log(`API Health is active and running on /api/health`)
  })
}

bootstrap()
