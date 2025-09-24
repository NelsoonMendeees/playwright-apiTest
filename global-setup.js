const { cleanupTestData } = require('./playwright/support/database')

module.exports = async () => {
  console.log('Limpando Banco de Dados')
  await cleanupTestData()
}
