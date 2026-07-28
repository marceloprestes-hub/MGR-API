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
    pattern: /^\/teste-diagnostico$/,
    handler: testeDiagnostico,
},
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
    pattern: /^\/teste-consultoria$/,
    handler: testeConsultoria,
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
  handler: listarConsultorias,
},
{
  method: "GET",
  pattern: /^\/consultorias\/(\d+)$/,
  handler: buscarConsultoria,
},
{
  method: "POST",
  pattern: /^\/consultorias$/,
  handler: createConsultoria,
},

    // DIAGNÓSTICOS
{
    method: "GET",
    pattern: /^\/diagnosticos$/,
    handler: listarDiagnosticos,
},
{
    method: "GET",
    pattern: /^\/diagnosticos\/(\d+)$/,
    handler: buscarDiagnostico,
},
{
    method: "POST",
    pattern: /^\/diagnosticos$/,
    handler: createDiagnostico,
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
                    telefone
                    FROM clientes
                ORDER BY id DESC
            `)
            .all();

        return ok(results);

    });

}
// ======================================================
// CONSULTORIAS
// ======================================================

async function createConsultoria(request, env) {

    return execute(async () => {

        const body = await readBody(request);

        const ultimo = await env.DB.prepare(`
            SELECT MAX(numero_consultoria) numero
            FROM consultorias
        `).first();

        const numeroConsultoria =
            (ultimo?.numero || 1000) + 1;

        const uuid = crypto.randomUUID();

        const result = await env.DB.prepare(`
            INSERT INTO consultorias
            (
                uuid,
                cliente_id,
                numero_consultoria,
                data_consultoria,
                tipo,
                duracao,
                consultor,
                status,
                observacoes
            )
            VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `)
        .bind(
            uuid,
            body.cliente_id,
            numeroConsultoria,
            body.data_consultoria || new Date().toISOString(),
            body.tipo || "Diagnóstico MGR",
            body.duracao || 60,
            body.consultor || "Marcelo Prestes",
            body.status || "Em andamento",
            body.observacoes || ""
        )
        .run();

        return ok(
            {
                id: result.meta.last_row_id,
                numero_consultoria: numeroConsultoria
            },
            "Consultoria cadastrada com sucesso"
        );

    });

}
async function listarConsultorias(request, env) {

    return execute(async () => {

        const { results } = await env.DB.prepare(`
            SELECT
                c.id,
                c.numero_consultoria,
                c.data_consultoria,
                c.tipo,
                c.status,
                cli.nome
            FROM consultorias c
            INNER JOIN clientes cli
                ON cli.id = c.cliente_id
            ORDER BY c.numero_consultoria DESC
        `).all();

        return ok(results);

    });

}

async function buscarConsultoria(request, env) {

    return execute(async () => {

        const id = request.params[0];

        const resultado = await env.DB.prepare(`
            SELECT *
            FROM consultorias
            WHERE id = ?
        `)
        .bind(id)
        .first();

        return ok(resultado);

    });

}
async function testeConsultoria(request, env) {

return new Response(`

<!DOCTYPE html>

<html lang="pt-BR">

<head>

<meta charset="UTF-8">

<title>Teste Consultoria</title>

<style>

body{
font-family:Arial;
max-width:700px;
margin:40px auto;
}

input,textarea{
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

<h2>Nova Consultoria</h2>

<input id="cliente_id" placeholder="ID do Cliente">

<input id="tipo" placeholder="Tipo da Consultoria">

<textarea id="observacoes" placeholder="Observações"></textarea>

<button onclick="salvar()">Salvar Consultoria</button>

<pre id="resultado"></pre>

<script>

async function salvar(){

const resposta = await fetch("/consultorias",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

cliente_id:Number(document.getElementById("cliente_id").value),

tipo:document.getElementById("tipo").value,

observacoes:document.getElementById("observacoes").value

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
// ======================================================
// DIAGNÓSTICOS
// ======================================================

async function createDiagnostico(request, env){

    return execute(async()=>{

        const body = await readBody(request);

        const uuid = crypto.randomUUID();

        const result = await env.DB.prepare(`
            INSERT INTO diagnosticos
            (
                uuid,
                cliente_id,
                consultoria_id
            )
            VALUES
            (?, ?, ?)
        `)
        .bind(
            uuid,
            body.cliente_id,
            body.consultoria_id
        )
        .run();

        return ok(
            {
                id: result.meta.last_row_id
            },
            "Diagnóstico criado com sucesso"
        );

    });

}

async function listarDiagnosticos(request, env){

    return execute(async()=>{

        const { results } = await env.DB.prepare(`

            SELECT *

            FROM diagnosticos

            ORDER BY id DESC

        `).all();

        return ok(results);

    });

}

async function buscarDiagnostico(request, env){

    return execute(async()=>{

        const id=request.params[0];

        const resultado=await env.DB.prepare(`

            SELECT *

            FROM diagnosticos

            WHERE id=?

        `)
        .bind(id)
        .first();

        return ok(resultado);

    });

}
// ======================================================
// TESTE DIAGNÓSTICO
// ENTREGA 2.3.1
// ======================================================

async function testeDiagnostico(request, env) {

    return new Response(`

<!DOCTYPE html>
<html lang="pt-BR">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Teste Diagnóstico MGR</title>

<style>

body{
    font-family:Arial,sans-serif;
    max-width:850px;
    margin:40px auto;
    padding:20px;
}

h1{
    margin-bottom:30px;
}

label{
    display:block;
    margin-top:15px;
    font-weight:bold;
}

input{
    display:block;
    width:100%;
    box-sizing:border-box;
    padding:12px;
    margin-top:6px;
    font-size:16px;
}

button{
    margin-top:20px;
    padding:14px 24px;
    font-size:16px;
    cursor:pointer;
}

pre{
    background:#eeeeee;
    padding:20px;
    margin-top:25px;
    white-space:pre-wrap;
}

</style>

</head>

<body>

<h1>Novo Diagnóstico MGR</h1>

<label>Cliente ID</label>
<input
    id="cliente_id"
    type="number"
    value="1"
>

<label>Consultoria ID</label>
<input
    id="consultoria_id"
    type="number"
    value="1"
>

<button onclick="salvar()">
    Criar Diagnóstico
</button>

<pre id="resultado">
Aguardando cadastro...
</pre>

<script>

async function salvar(){

    const resultado =
        document.getElementById("resultado");

    resultado.textContent =
        "Salvando diagnóstico...";

    try{

        const resposta = await fetch("/diagnosticos",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                cliente_id:Number(
                    document.getElementById("cliente_id").value
                ),

                consultoria_id:Number(
                    document.getElementById("consultoria_id").value
                )

            })

        });

        const json = await resposta.json();

        resultado.textContent =
            JSON.stringify(json,null,2);

    }
    catch(erro){

        resultado.textContent =
            "Erro ao cadastrar diagnóstico: "
            + erro.message;

    }

}

</script>

</body>

</html>

`,{

        headers:{
            ...CORS_HEADERS,
            "Content-Type":"text/html; charset=UTF-8"
        }

    });

}
