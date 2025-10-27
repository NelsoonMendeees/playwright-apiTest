const { Pool } = require('pg')
const bcrypt = require('bcrypt')
const { ulid } = require('ulid')
const { fakerPT_BR: faker } = require('@faker-js/faker')
const fs = require('fs')
const path = require('path')

// Configure sua conexão aqui
const pool = new Pool({
  user: 'dba',
  host: 'localhost',
  database: 'ShortDB',
  password: 'dba',
  port: 5432
})

async function cleanupTestData() {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const query = `
      WITH usuarios_para_deletar AS (
        SELECT id FROM users WHERE email LIKE '%@qa.dev.com'
      ),
      delete_links AS (
        DELETE FROM links
        WHERE user_id IN (SELECT id FROM usuarios_para_deletar)
      )
      DELETE FROM users
      WHERE id IN (SELECT id FROM usuarios_para_deletar);
    `

    await client.query(query)
    await client.query('COMMIT')
    console.log('✅ Usuários e links de teste removidos com sucesso.')
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ Erro ao remover dados de teste:', err)
  } finally {
    client.release()
  }
}

async function insertTestUsers(batchSize = 500) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const passwordHash = await bcrypt.hash('pw1234', 10)
    const totalUsers = 4000
    const csvRows = []
    const plainPassword = 'pw1234'

    for (let i = 0; i < totalUsers; i += batchSize) {
      const users = []

      for (let j = i; j < i + batchSize && j < totalUsers; j++) {
        const id = ulid()
        const firstName = faker.person.firstName()
        const lastName = faker.person.lastName()
        const name = `${firstName} ${lastName}`

        // Garante unicidade do email
        const email = faker.internet
          .email({ firstName, lastName, provider: 'qa.dev.com' })
          .toLowerCase()
          .replace(/[^a-z0-9@.]/g, '')
          .replace('@qa.dev.com', `${j}@qa.dev.com`)

        users.push([id, name, email, passwordHash])
        csvRows.push(`${name},${email},${plainPassword}`)
      }

      const query = `
        INSERT INTO users (id, name, email, password)
        VALUES ${users
          .map((_, idx) => `($${idx * 4 + 1}, $${idx * 4 + 2}, $${idx * 4 + 3}, $${idx * 4 + 4})`)
          .join(', ')}
      `
      const values = users.flat()
      await client.query(query, values)
    }

    await client.query('COMMIT')
    console.log('✅ 2000 usuários inseridos com sucesso em batches.')

    // Gerar CSV
    const csvContent = 'name,email,password\n' + csvRows.join('\n')
    const csvPath = path.join(__dirname, 'usuarios_test.csv')
    fs.writeFileSync(csvPath, csvContent)
    console.log(`✅ CSV gerado em: ${csvPath}`)
  } catch (err) {
    await client.query('ROLLBACK')
    console.error('❌ Erro ao inserir usuários:', err)
  } finally {
    client.release()
  }
}

// Função principal
async function main() {
  await cleanupTestData()
  await insertTestUsers()
  await pool.end()
}

module.exports = { cleanupTestData, insertTestUsers, main }
