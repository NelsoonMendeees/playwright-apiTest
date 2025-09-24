import { fakerPT_BR as faker } from '@faker-js/faker'

export function generateNewUser() {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName, provider: 'qa.dev.com' }).toLocaleLowerCase(),
    password: 'pwd1234'
  }
}

export function loginUser() {
  return {
    name: 'Nelson Mendes',
    email: 'nelson.mendes@qa.com',
    password: 'pwd123'
  }
}

export function getUserWithLink() {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName, provider: 'qa.dev.com' }).toLocaleLowerCase(),
    password: 'pwd1234',
    link: {
      original_url: faker.internet.url(),
      title: faker.music.songName()
    }
  }
}

export function getUserWithLinks(linksCount = 1) {
  const firstName = faker.person.firstName()
  const lastName = faker.person.lastName()
  return {
    name: `${firstName} ${lastName}`,
    email: faker.internet.email({ firstName, lastName, provider: 'qa.dev.com' }).toLocaleLowerCase(),
    password: 'pwd1234',
    links: faker.helpers.multiple(
      () => ({
        original_url: faker.internet.url(),
        title: faker.music.songName()
      }),
      { count: linksCount }
    )
  }
}

export function generateULID(nowMs = Date.now()) {
  const ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ' // Crockford Base32
  const TIME_MAX = (1n << 48n) - 1n // 48 bits
  let ts = BigInt(nowMs)

  if (ts < 0n) throw new Error('Timestamp inválido')
  if (ts > TIME_MAX) throw new Error('Timestamp excede o limite ULID')

  // ---- Encode timestamp em Base32 ----
  let timePart = ''
  for (let i = 0; i < 10; i++) {
    timePart = ALPHABET[Number(ts & 31n)] + timePart // ts % 32
    ts >>= 5n // ts / 32
  }

  // ---- Gerar parte aleatória ----
  const randomValues = new Uint8Array(10)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues) // navegador
  } else {
    // fallback para Math.random()
    for (let i = 0; i < randomValues.length; i++) {
      randomValues[i] = Math.floor(Math.random() * 256)
    }
  }

  // Montar bigint a partir dos 10 bytes gerados
  let rnd = 0n
  for (const byte of randomValues) {
    rnd = (rnd << 8n) | BigInt(byte)
  }

  let randomPart = ''
  for (let i = 0; i < 16; i++) {
    randomPart = ALPHABET[Number(rnd & 31n)] + randomPart
    rnd >>= 5n
  }

  return timePart + randomPart
}
