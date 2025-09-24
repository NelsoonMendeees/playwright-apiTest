# 🚀 Playwright API Tests

Este repositório contém testes automatizados de **API** utilizando [Playwright](https://playwright.dev/), rodando em pipeline com **GitHub Actions** e publicado no **GitHub Pages**.

---

## ✅ Status do Workflow

[![Playwright API Tests](https://github.com/NelsoonMendeees/playwright-apiTest/actions/workflows/pw-test.yml/badge.svg)](https://github.com/NelsoonMendeees/playwright-apiTest/actions/workflows/pw-test.yml)

---

## 📊 Relatórios dos Testes

O relatório mais recente está disponível em:

👉 [**Acessar relatório Playwright**](https://NelsoonMendeees.github.io/playwright-apiTest/)

---

## 📂 Estrutura

- `podman-compose.yml` → sobe os containers (Postgres, Adminer, API e Web).  
- `.github/workflows/pw-test.yml` → workflow para rodar testes e publicar relatório.  
- `playwright/e2e/` → diretório onde ficam os testes do Playwright.  

---

## ▶️ Como rodar localmente

```bash
# Subir ambiente
podman play kube shortbeyond.yaml

# Instalar dependências
npm install

# Rodar testes
npm run pw-run

# Gerar relatório
npx playwright show-report

```
---

## ⚠️ Observações / Pré-requisitos
- É necessário ter o Podman e Podman Compose instalados na máquina para subir o ambiente localmente.
