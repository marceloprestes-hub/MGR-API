# MGR API

Backend oficial da plataforma **MGR ONE**.

## Tecnologias

- Cloudflare Workers
- Cloudflare D1
- JavaScript ES Modules

---

## Estrutura

```
worker.js

src/
    banco.js
    retorno.js
    rotas.js

database.sql

package.json

wrangler.jsonc
```

---

## Endpoints

### Verificar API

GET

```
/saude
```

---

### Listar Leads

GET

```
/leads
```

---

### Buscar Lead

GET

```
/lead/{id}
```

---

### Cadastrar Lead

POST

```
/lead
```

Body

```json
{
    "nome":"Marcelo Prestes",
    "email":"marcelo@email.com",
    "telefone":"48999999999",
    "empresa":"MGR",
    "origem":"Landing Page",
    "observacoes":"Primeiro contato"
}
```

---

### Atualizar Lead

PUT

```
/lead/{id}
```

---

### Excluir Lead

DELETE

```
/lead/{id}
```

---

## Deploy

Após cada alteração:

```
git add .
git commit -m "Sprint 5"
git push
```

O Cloudflare fará o deploy automaticamente.

---

## Versão

MGR API 1.0

Projeto integrante da plataforma **MGR ONE**.
