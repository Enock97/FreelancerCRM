import request from 'supertest'
import { Express } from 'express'
import { describe, it, beforeAll, expect } from '@jest/globals'
import { createServer } from '../src/server'

let app: Express

beforeAll(async () => {
  app = await createServer()
})

describe('GraphQL - createContact', () => {
  it('creates a contact successfully', async () => {
    const mutation = {
      query: `
        mutation {
          createContact(
            name: "E2E User"
            email: "e2e@example.com"
            phone: "11112222"
            company: "E2E Corp"
            status: "NEW"
            note: "testing"
          ) {
            id
            name
            email
          }
        }
      `,
    }

    const response = await request(app)
      .post('/api/graphql')
      .send(mutation)
      .set('Authorization', 'Bearer test-token')

    expect(response.statusCode).toBe(200)
    expect(response.body.data.createContact.name).toBe('E2E User')
  })
})
