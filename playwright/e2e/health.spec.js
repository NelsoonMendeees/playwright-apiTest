// @ts-check
import { test, expect } from '@playwright/test'

test('deve verificar se a api está online', async ({ request }) => {
  const response = await request.get('http://localhost:3333/health')
  const body = await response.json()

  expect(response.status()).toBe(200)
  expect(body.service).toBe('shortbeyond-api')
  expect(body.status).toBe('healthy')
})
