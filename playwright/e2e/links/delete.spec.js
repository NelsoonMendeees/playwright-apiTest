import { test, expect } from '../../support/fixtures'
import { getUserWithLink, generateULID } from '../../support/utils/data'

test.describe('DELETE /api/links/{id}', () => {
  const user = getUserWithLink()
  let token

  test.beforeEach(async ({ auth }) => {
    await auth.createUser(user)
    token = await auth.getToken(user)
  })

  test('should delete a registered link', async ({ links }) => {
    const linkId = await links.createAndReturnLinkId(user.link, token)

    const response = await links.deleteLink(linkId, token)
    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body).toHaveProperty('message', 'Link excluído com sucesso')
  })

  test('should not delete a non-existent link', async ({ links }) => {
    const linkId = generateULID()

    const response = await links.deleteLink(linkId, token)
    expect(response.status()).toBe(404)

    const body = await response.json()
    expect(body).toHaveProperty('message', 'Link não encontrado')
  })
})
