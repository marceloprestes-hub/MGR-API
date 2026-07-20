# MGR API

API oficial do ecossistema Método MGR.

## Status

🟢 Sprint 1 concluído

## Tecnologias

- Cloudflare Workers
- Cloudflare D1
- JavaScript (ES Modules)

## Estrutura

```
MGR-API
│
├── worker.js
├── package.json
├── wrangler.jsonc
└── README.md
```

## Endpoint disponível

GET /health

Resposta:

```json
{
  "success": true,
  "application": "MGR API",
  "version": "1.0.0",
  "status": "ONLINE"
}
```
