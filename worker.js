export default {
  async fetch(request, env, ctx) {
    return router(request, env);
  },
};

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods":
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

async function router(request, env) {
  const url = new URL(request.url);
  const method = request.method;
  const path = normalizePath(url.pathname);

  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: CORS_HEADERS,
    });
  }

  const routes = [
   {
    method: "GET",
    pattern: /^\/health$/,
    handler: health,
},
    {
    method: "GET",
    pattern: /^\/teste$/,
    handler: teste,
},

{
    method: "GET",
    pattern: /^\/db-test$/,
    handler: dbTest,
},
    {
      method: "GET",
      pattern: /^\/$/,
      handler: home,
    },
    
    // CLIENTES
   {
    method: "GET",
    pattern: /^\/clientes$/,
    handler: listarClientes,
},
    {
      method: "GET",
      pattern: /^\/clientes\/(\d+)$/,
      handler: notImplemented,
    },
    {
      method: "POST",
      pattern: /^\/clientes$/,
     handler: createCliente,
    },
    {
      method: "PUT",
      pattern: /^\/clientes\/(\d+)$/,
      handler: notImplemented,
    },
    {
      method: "DELETE",
      pattern: /^\/clientes\/(\d+)$/,
      handler: notImplemented,
    },

    // CONSULTORIAS
    {
      method: "GET",
      pattern: /^\/consultorias$/,
      handler: notImplemented,
    },
    {
      method: "POST",
      pattern: /^\/consultorias$/,
      handler: notImplemented,
    },

    // DIAGNÓSTICOS
    {
      method: "GET",
      pattern: /^\/diagnosticos$/,
      handler: notImplemented,
    },
    {
      method: "POST",
      pattern: /^\/diagnosticos$/,
      handler: notImplemented,
    },

    // RESPOSTAS
    {
      method: "POST",
      pattern: /^\/respostas$/,
      handler: notImplemented,
    },

    // AGENDA
    {
      method: "GET",
      pattern: /^\/agenda$/,
      handler: notImplemented,
    },
    {
      method: "POST",
      pattern: /^\/agenda$/,
      handler: notImplemented,
    },

    // CRM
    {
      method: "GET",
      pattern: /^\/crm\/dashboard$/,
      handler: notImplemented,
    },
  ];

  for (const route of routes) {
    if (route.method !== method) continue;

    const match = path.match(route.pattern);

    if (match) {
      request.params = match.slice(1);
      return route.handler(request, env);
    }
  }

  return new Response("Not Found", {
    status: 404,
    headers: CORS_HEADERS,
  });
}

function normalizePath(path) {
  if (path.length > 1 && path.endsWith("/")) {
    return path.slice(0, -1);
  }

  return path;
}

// ======================================================
// UTILITÁRIOS MGR API
// ======================================================

function json(data, status = 200) {
    return new Response(
        JSON.stringify(data, null, 2),
        {
            status,
            headers: {
                ...CORS_HEADERS,
                "Content-Type": "application/json"
            }
        }
    );
}

async function readBody(request) {
    try {
        return await request.json();
    } catch {
        return {};
    }
}

function ok(data = {}, message = "OK") {
    return json({
        success: true,
        message,
        data
    });
}

function error(message = "Erro", status = 400) {
    return json({
        success: false,
        message
    }, status);
}

async function execute(callback) {

    try {

        return await callback();

    } catch (err) {

        console.error(err);

        return json({
            success: false,
            message: "Erro interno.",
            error: err.message
        }, 500);

    }

}
async function home(request, env) {
  return ok({
    api: "MGR API",
    version: "2.0",
    status: "online"
  });
}

async function health(request, env) {
  return execute(async () => {
    let database = false;

    try {
      await env.DB
        .prepare("SELECT 1 AS teste")
        .first();

      database = true;
    } catch (err) {
      console.error("Falha na conexão com o D1:", err);
    }

    return ok({
      api: "MGR API",
      version: "2.0",
      status: "online",
      database
    });
  });
}

async function dbTest(request, env) {

    return execute(async () => {

        const resultado = await env.DB
            .prepare("SELECT datetime('now') AS agora")
            .first();

        return ok({
            api: "MGR API",
            database: "Cloudflare D1",
            connected: true,
            serverTime: resultado.agora
        });

    });

}
async function createCliente(request, env) {

    return execute(async () => {

        const body = await readBody(request);

       const uuid = crypto.randomUUID();

const result = await env.DB.prepare(`
    INSERT INTO clientes
    (
        uuid,
        nome,
        email,
        telefone
    )
    VALUES
    (?, ?, ?, ?)
`)
.bind(
    uuid,
    body.nome || "",
    body.email || "",
    body.telefone || ""
)
.run();

        return ok({
            id: result.meta.last_row_id
        }, "Cliente cadastrado com sucesso");

    });

}
async function teste(request, env) {

return new Response(`

<!DOCTYPE html>
<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<title>Teste API</title>

<style>

body{
font-family:Arial;
max-width:700px;
margin:40px auto;
}

input{
display:block;
width:100%;
padding:10px;
margin:10px 0;
}

button{
padding:12px 20px;
cursor:pointer;
}

pre{
background:#eee;
padding:15px;
margin-top:20px;
}

</style>

</head>

<body>

<h2>Teste Cadastro Cliente</h2>

<input id="nome" placeholder="Nome">

<input id="email" placeholder="Email">

<input id="telefone" placeholder="Telefone">

<button onclick="salvar()">Salvar</button>

<pre id="resultado"></pre>

<script>

async function salvar(){

const resposta = await fetch("/clientes",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

nome:document.getElementById("nome").value,

email:document.getElementById("email").value,

telefone:document.getElementById("telefone").value

})

});

const json = await resposta.json();

document.getElementById("resultado").textContent =
JSON.stringify(json,null,2);

}

</script>

</body>

</html>

`,{

headers:{
"Content-Type":"text/html"
}

});

}
async function notImplemented(request, env) {
    return error("Rota ainda não implementada.", 501);
}
async function listarClientes(request, env) {

    return execute(async () => {

        const { results } = await env.DB
            .prepare(`
                SELECT
                    id,
                    uuid,
                    nome,
                    email,
                    telefone,
                    criado_em
                FROM clientes
                ORDER BY id DESC
            `)
            .all();

        return ok(results);

    });

}
