import { expect, test } from '../../support/fixtures'
import { generateNewUser } from '../../support/utils/data'

test.describe('POST /auth/login', () => {
  test('should authenticate an user', async ({ auth }) => {
    const user = generateNewUser()

    const createResponse = await auth.createUser(user)
    expect(createResponse.status()).toBe(201)

    const response = await auth.login(user)
    expect(response.status()).toBe(200)

    const body = await response.json()
    expect(body).toHaveProperty('message', 'Login realizado com sucesso')
    expect(body.data).toHaveProperty('token')
    expect(body.data.user).toHaveProperty('id')
    expect(body.data.user).toHaveProperty('name', user.name)
    expect(body.data.user).toHaveProperty('email', user.email)
    expect(body.data.user).not.toHaveProperty('password')
  })

  test('should not authenticate with invalid password', async ({ auth }) => {
    const user = generateNewUser()

    const response = await auth.login({ ...user, password: 'pwd54321' })
    expect(response.status()).toBe(401)

    const body = await response.json()
    expect(body).toHaveProperty('message', 'Credenciais inválidas')
  })

  test('should not authenticate with invalid email', async ({ auth }) => {
    const user = generateNewUser()

    const response = await auth.login({ ...user, email: 'not.found@qa.com' })
    expect(response.status()).toBe(401)

    const body = await response.json()
    expect(body).toHaveProperty('message', 'Credenciais inválidas')
  })

  test('should not authenticate with blank email', async ({ auth }) => {
    const user = generateNewUser()

    const response = await auth.login({ ...user, email: '' })
    expect(response.status()).toBe(400)

    const body = await response.json()
    expect(body).toHaveProperty('message', "O campo 'Email' é obrigatório")
  })

  test('should not authenticate with blank password', async ({ auth }) => {
    const user = generateNewUser()

    const response = await auth.login({ ...user, password: '' })
    expect(response.status()).toBe(400)

    const body = await response.json()
    expect(body).toHaveProperty('message', "O campo 'Password' é obrigatório")
  })
})
