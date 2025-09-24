import { expect, test } from '../../support/fixtures'
import { generateNewUser } from '../../support/utils/data'

test.describe('POST /auth/register', () => {
  test('should register a new user', async ({ auth }) => {
    const user = generateNewUser()

    const response = await auth.createUser(user)

    expect(response.status()).toBe(201)
    const respBody = await response.json()

    expect(respBody).toHaveProperty('message', 'Usuário cadastrado com sucesso!')
    expect(respBody.user).toHaveProperty('id')
    expect(respBody.user).toHaveProperty('name', user.name)
    expect(respBody.user).toHaveProperty('email', user.email)
    expect(respBody.user).not.toHaveProperty('password')
  })

  test('should not register a user with existing email', async ({ auth }) => {
    const user = generateNewUser()

    const preCondition = await auth.createUser(user)
    expect(preCondition.status()).toBe(201)

    const response = await auth.createUser(user)
    expect(response.status()).toBe(400)

    const respBody = await response.json()
    expect(respBody).toHaveProperty('message', 'Este e-mail já está em uso. Por favor, tente outro.')
  })

  test('should not register a user with invalid email', async ({ auth }) => {
    const user = generateNewUser()

    const response = await auth.createUser({ ...user, email: 'invalid.email.com' })
    expect(response.status()).toBe(400)

    const respBody = await response.json()
    expect(respBody).toHaveProperty('message', "O campo 'Email' deve ser um email válido")
  })

  test('should not register a new user with the name field empty', async ({ auth }) => {
    const user = generateNewUser()

    const response = await auth.createUser({ ...user, name: '' })
    expect(response.status()).toBe(400)

    const respBody = await response.json()
    expect(respBody).toHaveProperty('message', "O campo 'Name' é obrigatório")
  })

  test('should not register a new user with the password field empty', async ({ auth }) => {
    const user = generateNewUser()

    const response = await auth.createUser({ ...user, password: '' })
    expect(response.status()).toBe(400)

    const respBody = await response.json()
    expect(respBody).toHaveProperty('message', "O campo 'Password' é obrigatório")
  })

  test('should not register a new user with the email field empty', async ({ auth }) => {
    const user = generateNewUser()

    const response = await auth.createUser({ ...user, email: '' })
    expect(response.status()).toBe(400)

    const respBody = await response.json()
    expect(respBody).toHaveProperty('message', "O campo 'Email' é obrigatório")
  })
})
