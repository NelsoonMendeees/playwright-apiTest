import { expect, test } from '../../support/fixtures'

import { getUserWithLink } from '../../support/utils/data'

test.describe('POST /api/links', () => {
  const user = getUserWithLink()

  let token

  test.beforeEach(async ({ auth }) => {
    await auth.createUser(user)
    token = await auth.getToken(user)
  })

  test('should shorten a new link', async ({ links }) => {
    const response = await links.createLink(user.link, token)
    expect(response.status()).toBe(201)

    const body = await response.json()
    expect(body.data).toHaveProperty('id')
    expect(body.data).toHaveProperty('short_code')
    expect(body.data.short_code).toMatch(/^[a-zA-Z0-9]{5}$/)
    expect(body.data).toHaveProperty('original_url', user.link.original_url)
    expect(body.data).toHaveProperty('title', user.link.title)
    expect(body).toHaveProperty('message', 'Link criado com sucesso')
  })

  test('should not shorten a link with invalid url', async ({ links }) => {
    const response = await links.createLink({ ...user.link, original_url: 'linkedin.com/in/nelsongomees' }, token)
    expect(response.status()).toBe(400)

    const body = await response.json()
    expect(body).toHaveProperty('message', "O campo 'OriginalURL' deve ser uma URL válida")
  })

  test('should not shorten a link when the URL is not provided', async ({ links }) => {
    const response = await links.createLink({ ...user.link, original_url: '' }, token)
    expect(response.status()).toBe(400)

    const body = await response.json()
    expect(body).toHaveProperty('message', "O campo 'OriginalURL' é obrigatório")
  })

  test('should not shorten a link when the Title is not provided', async ({ links }) => {
    const response = await links.createLink({ ...user.link, title: '' }, token)
    expect(response.status()).toBe(400)

    const body = await response.json()
    expect(body).toHaveProperty('message', "O campo 'Title' é obrigatório")
  })
})
