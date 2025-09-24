# 🚀 Playwright API Tests

Este repositório contém testes automatizados de **API** utilizando [Playwright](https://playwright.dev/), rodando em pipeline com **GitHub Actions** e publicado no **GitHub Pages**.

---

## ✅ Status do Workflow

[![Playwright API Tests + Report](https://github.com/NelsoonMendeees/playwright-apiTest/actions/workflows/pw-test.yml/badge.svg)](https://github.com/NelsoonMendeees/playwright-apiTest/actions/workflows/pw-test.yml)

---

## 📊 Relatórios dos Testes

O relatório mais recente está disponível em:

👉 [**Acessar relatório Playwright**](https://NelsoonMendeees.github.io/playwright-apiTest/)

---

## 📂 Estrutura

- `podman-compose.yml` → sobe os containers (Postgres, Adminer, API e Web).  
- `.github/workflows/pw-test.yml` → workflow para rodar testes e publicar relatório.  
- `tests/` → diretório onde ficam os testes do Playwright.  

---

## ▶️ Como rodar localmente

```bash
# Subir ambiente
podman-compose up -d

# Instalar dependências
npm install

# Rodar testes
npm run pw-run

# Gerar relatório
npx playwright show-report
