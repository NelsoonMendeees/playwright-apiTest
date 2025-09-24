import { test, expect } from '../../support/fixtures'
import { getUserWithLinks } from '../../support/utils/data'

test.describe('GET /api/links', () => {
  test('should return pre-shortened links', async ({ auth, links }) => {
    const user = getUserWithLinks()

    await auth.createUser(user)
    const token = await auth.getToken(user)

    for (const link of user.links) {
      await links.createLink(link, token)
    }

    const response = await links.getLinks(token)
    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body).toHaveProperty('count', user.links.length)
    expect(body).toHaveProperty('message', 'Links Encurtados')
    expect(Array.isArray(body.data)).toBeTruthy()

    for (const [index, links] of body.data.entries()) {
      expect(links).toHaveProperty('id')
      expect(links).toHaveProperty('original_url', user.links[index].original_url)
      expect(links).toHaveProperty('short_code')
      expect(links.short_code).toMatch(/^[a-zA-Z0-9]{5}$/)
      expect(links).toHaveProperty('title', user.links[index].title)
    }
  })

  test('should return an empty list of links', async ({ auth, links }) => {
    const user = getUserWithLinks(0)

    await auth.createUser(user)
    const token = await auth.getToken(user)

    const response = await links.getLinks(token)
    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body).toHaveProperty('message', 'Links Encurtados')
    expect(body).toHaveProperty('count', user.links.length)
  })
})
