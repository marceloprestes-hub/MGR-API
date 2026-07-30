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
    // TESTE RESPOSTAS
    {
      method: "GET",
      pattern: /^\/teste-respostas$/,
      handler: testeSalvarRespostas,
    },
    // LEADS
{
  method: "GET",
  pattern: /^\/leads$/,
  handler: listarLeads,
},
{
  method: "POST",
  pattern: /^\/leads$/,
  handler: criarLead,
},
    {
  method: "GET",
  pattern: /^\/leads\/(\d+)$/,
  handler: buscarLead,
},
    {
  method: "PUT",
  pattern: /^\/leads\/(\d+)$/,
  handler: atualizarLead,
},
{
  method: "DELETE",
  pattern: /^\/leads\/(\d+)$/,
  handler: excluirLead,
},
{
  method: "POST",
  pattern: /^\/leads\/(\d+)\/iniciar-atendimento$/,
  handler: iniciarAtendimentoLead,
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
{
  method: "POST",
  pattern: /^\/consultorias\/(\d+)\/iniciar-diagnostico$/,
  handler: iniciarDiagnosticoConsultoria,
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
    method: "GET",
    pattern: /^\/clientes\/(\d+)\/diagnosticos$/,
    handler: listarDiagnosticosCliente,
},
    {
    method: "GET",
    pattern: /^\/diagnosticos\/(\d+)\/consolidado$/,
    handler: buscarDiagnosticoConsolidado,
},
{
    method: "POST",
    pattern: /^\/diagnosticos$/,
    handler: createDiagnostico,
},
     {
    method: "PUT",
    pattern: /^\/diagnosticos\/(\d+)$/,
    handler: atualizarDiagnostico,
},
    {
    method: "GET",
    pattern: /^\/teste-diagnostico$/,
    handler: testeDiagnostico,
},
    {
    method: "GET",
    pattern: /^\/teste-resultado-diagnostico$/,
    handler: testeResultadoDiagnostico,
},
   {
    method: "POST",
    pattern: /^\/diagnosticos\/(\d+)\/resposta$/,
    handler: registrarRespostaDiagnostico,
}, 

    // RESPOSTAS
 {
    method: "POST",
    pattern: /^\/diagnosticos\/(\d+)\/respostas$/,
    handler: salvarRespostasDiagnostico,
},
{
    method: "GET",
    pattern: /^\/diagnosticos\/(\d+)\/respostas$/,
    handler: listarRespostasDiagnostico,
},
{
    method: "GET",
    pattern: /^\/teste-salvar-respostas$/,
    handler: testeSalvarRespostas,
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
// ======================================================
// ATUALIZAR DIAGNÓSTICO
// ENTREGA 2.3.2
// ======================================================

async function atualizarDiagnostico(request, env) {

    return execute(async () => {

        const id = request.params[0];
        const body = await readBody(request);

        const diagnostico = await env.DB.prepare(`
            SELECT id
            FROM diagnosticos
            WHERE id = ?
        `)
        .bind(id)
        .first();

        if (!diagnostico) {
            return error("Diagnóstico não encontrado.", 404);
        }

        await env.DB.prepare(`
            UPDATE diagnosticos
            SET
                score_geral = ?,
                score_renda = ?,
                score_reserva = ?,
                score_patrimonio = ?,
                score_familia = ?,
                score_empresa = ?,
                perfil_financeiro = ?,
                indice_equilibrio = ?,
                fortaleza = ?,
                vulnerabilidade = ?,
                grau_urgencia = ?,
                parecer = ?
            WHERE id = ?
        `)
        .bind(
            Number(body.score_geral || 0),
            Number(body.score_renda || 0),
            Number(body.score_reserva || 0),
            Number(body.score_patrimonio || 0),
            Number(body.score_familia || 0),
            Number(body.score_empresa || 0),
            body.perfil_financeiro || "",
            Number(body.indice_equilibrio || 0),
            body.fortaleza || "",
            body.vulnerabilidade || "",
            body.grau_urgencia || "",
            body.parecer || "",
            id
        )
        .run();

        const atualizado = await env.DB.prepare(`
            SELECT *
            FROM diagnosticos
            WHERE id = ?
        `)
        .bind(id)
        .first();

        return ok(
            atualizado,
            "Diagnóstico atualizado com sucesso"
        );

    });

}
// ======================================================
// TESTE RESULTADO DIAGNÓSTICO
// ENTREGA 2.3.2
// ======================================================

async function testeResultadoDiagnostico(request, env) {

    return new Response(`

<!DOCTYPE html>
<html lang="pt-BR">

<head>

<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<title>Resultado Diagnóstico MGR</title>

<style>

body{
    font-family:Arial,sans-serif;
    max-width:900px;
    margin:40px auto;
    padding:20px;
}

h1{
    margin-bottom:30px;
}

label{
    display:block;
    margin-top:14px;
    font-weight:bold;
}

input, textarea{
    width:100%;
    box-sizing:border-box;
    padding:10px;
    margin-top:5px;
    font-size:16px;
}

textarea{
    min-height:80px;
}

button{
    margin-top:25px;
    padding:14px 25px;
    font-size:16px;
    cursor:pointer;
}

pre{
    background:#eee;
    padding:20px;
    margin-top:25px;
    white-space:pre-wrap;
}

</style>

</head>

<body>

<h1>Resultado Diagnóstico MGR</h1>

<label>Diagnóstico ID</label>
<input id="id" type="number" value="1">

<label>Score Geral</label>
<input id="score_geral" type="number" value="75">

<label>Score Renda</label>
<input id="score_renda" type="number" value="80">

<label>Score Reserva</label>
<input id="score_reserva" type="number" value="60">

<label>Score Patrimônio</label>
<input id="score_patrimonio" type="number" value="70">

<label>Score Família</label>
<input id="score_familia" type="number" value="85">

<label>Score Empresa</label>
<input id="score_empresa" type="number" value="65">

<label>Perfil Financeiro</label>
<input id="perfil_financeiro" value="Em desenvolvimento">

<label>Índice de Equilíbrio</label>
<input id="indice_equilibrio" type="number" value="72">

<label>Fortaleza</label>
<textarea id="fortaleza">Boa capacidade de geração de renda.</textarea>

<label>Vulnerabilidade</label>
<textarea id="vulnerabilidade">Reserva financeira abaixo do ideal.</textarea>

<label>Grau de Urgência</label>
<input id="grau_urgencia" value="Moderado">

<label>Parecer</label>
<textarea id="parecer">Recomenda-se fortalecer a reserva e revisar a proteção financeira.</textarea>

<button onclick="salvar()">
Salvar Resultado
</button>

<pre id="resultado">Aguardando atualização...</pre>

<script>

async function salvar(){

    const id =
        document.getElementById("id").value;

    const resultado =
        document.getElementById("resultado");

    resultado.textContent =
        "Salvando resultado...";

    try{

        const resposta = await fetch(
            "/diagnosticos/" + id,
            {
                method:"PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    score_geral:
                        Number(document.getElementById("score_geral").value),

                    score_renda:
                        Number(document.getElementById("score_renda").value),

                    score_reserva:
                        Number(document.getElementById("score_reserva").value),

                    score_patrimonio:
                        Number(document.getElementById("score_patrimonio").value),

                    score_familia:
                        Number(document.getElementById("score_familia").value),

                    score_empresa:
                        Number(document.getElementById("score_empresa").value),

                    perfil_financeiro:
                        document.getElementById("perfil_financeiro").value,

                    indice_equilibrio:
                        Number(document.getElementById("indice_equilibrio").value),

                    fortaleza:
                        document.getElementById("fortaleza").value,

                    vulnerabilidade:
                        document.getElementById("vulnerabilidade").value,

                    grau_urgencia:
                        document.getElementById("grau_urgencia").value,

                    parecer:
                        document.getElementById("parecer").value

                })
            }
        );

        const json = await resposta.json();

        resultado.textContent =
            JSON.stringify(json,null,2);

    }
    catch(erro){

        resultado.textContent =
            "Erro: " + erro.message;

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

async function listarDiagnosticosCliente(request, env) {

    return execute(async () => {

        const clienteId = request.params[0];

        const { results } = await env.DB.prepare(`
            SELECT
                d.id,
                d.uuid,
                d.cliente_id,
                d.consultoria_id,
                d.score_geral,
                d.score_renda,
                d.score_reserva,
                d.score_patrimonio,
                d.score_familia,
                d.score_empresa,
                d.perfil_financeiro,
                d.indice_equilibrio,
                d.fortaleza,
                d.vulnerabilidade,
                d.grau_urgencia,
                d.parecer,
                d.created_at,
                c.nome AS cliente_nome,
                co.numero_consultoria
            FROM diagnosticos d
            INNER JOIN clientes c
                ON c.id = d.cliente_id
            INNER JOIN consultorias co
                ON co.id = d.consultoria_id
            WHERE d.cliente_id = ?
            ORDER BY d.id DESC
        `)
        .bind(clienteId)
        .all();

        return ok(results);

    });

}
async function buscarDiagnosticoConsolidado(request, env) {

    return execute(async () => {

        const diagnosticoId = request.params[0];

        const diagnostico = await env.DB.prepare(`
            SELECT
                d.id,
                d.uuid,
                d.cliente_id,
                d.consultoria_id,
                d.score_geral,
                d.score_renda,
                d.score_reserva,
                d.score_patrimonio,
                d.score_familia,
                d.score_empresa,
                d.perfil_financeiro,
                d.indice_equilibrio,
                d.fortaleza,
                d.vulnerabilidade,
                d.grau_urgencia,
                d.parecer,
                d.created_at,

                c.nome AS cliente_nome,

                co.numero_consultoria

            FROM diagnosticos d

            INNER JOIN clientes c
                ON c.id = d.cliente_id

            INNER JOIN consultorias co
                ON co.id = d.consultoria_id

            WHERE d.id = ?
        `)
        .bind(diagnosticoId)
        .first();

        if (!diagnostico) {
            return error("Diagnóstico não encontrado.", 404);
        }

        return ok(diagnostico);

    });

}
async function salvarRespostasDiagnostico(request, env) {

    return execute(async () => {

        const diagnosticoId = request.params[0];
        const body = await request.json();

        if (!Array.isArray(body.respostas) || body.respostas.length === 0) {
            return error("Nenhuma resposta informada.", 400);
        }

        const diagnostico = await env.DB.prepare(
            `SELECT id FROM diagnosticos WHERE id = ?`
        )
        .bind(diagnosticoId)
        .first();

        if (!diagnostico) {
            return error("Diagnóstico não encontrado.", 404);
        }

        await env.DB.prepare(
            `DELETE FROM diagnostico_respostas WHERE diagnostico_id = ?`
        )
        .bind(diagnosticoId)
        .run();

        for (const item of body.respostas) {

            if (
                item.pergunta_id === undefined ||
                item.resposta === undefined
            ) {
                return error("Resposta inválida.", 400);
            }

            const uuid = crypto.randomUUID();

            await env.DB.prepare(`
                INSERT INTO diagnostico_respostas
                (
                    uuid,
                    diagnostico_id,
                    pergunta_id,
                    resposta
                )
                VALUES (?, ?, ?, ?)
            `)
            .bind(
                uuid,
                diagnosticoId,
                item.pergunta_id,
                item.resposta
            )
            .run();
        }

        return ok({
            diagnostico_id: Number(diagnosticoId),
            total_respostas: body.respostas.length
        });

    });

}


async function listarRespostasDiagnostico(request, env) {

    return execute(async () => {

        const diagnosticoId = request.params[0];

        const { results } = await env.DB.prepare(`
            SELECT
                id,
                uuid,
                diagnostico_id,
                pergunta_id,
                resposta,
                created_at
            FROM diagnostico_respostas
            WHERE diagnostico_id = ?
            ORDER BY pergunta_id ASC
        `)
        .bind(diagnosticoId)
        .all();

        return ok(results);

    });

}
async function testeSalvarRespostas(request, env) {

    return execute(async () => {

        const diagnosticoId = 1;

        const respostas = [
            { pergunta_id: 4, resposta: 5 },
            { pergunta_id: 5, resposta: 4 },
            { pergunta_id: 6, resposta: 5 }
        ];

        for (const item of respostas) {

            const uuid = crypto.randomUUID();

            await env.DB.prepare(`
                INSERT INTO diagnostico_respostas
                (uuid, diagnostico_id, pergunta_id, resposta)
                VALUES (?, ?, ?, ?)
            `)
            .bind(
                uuid,
                diagnosticoId,
                item.pergunta_id,
                item.resposta
            )
            .run();
        }

        return ok({
            diagnostico_id: diagnosticoId,
            total_respostas: respostas.length
        });

    });

}
async function criarLead(request, env) {
  return execute(async () => {
    const body = await request.json();

    const nome = String(body.nome || "").trim();
    const email = String(body.email || "").trim();
    const whatsapp = String(body.whatsapp || "").trim();
    const origem = String(body.origem || "Manual").trim();
    const campanha = String(body.campanha || "").trim();
    const observacoes = String(body.observacoes || "").trim();

    if (!nome) {
      throw new Error("Nome do lead é obrigatório.");
    }

    if (!email) {
      throw new Error("E-mail do lead é obrigatório.");
    }

    const uuid = crypto.randomUUID();

    const result = await env.DB.prepare(`
      INSERT INTO leads
      (
        uuid,
        nome,
        email,
        whatsapp,
        origem,
        campanha,
        status,
        observacoes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
      .bind(
        uuid,
        nome,
        email,
        whatsapp,
        origem,
        campanha,
        "Novo",
        observacoes
      )
      .run();

    return ok({
      id: result.meta.last_row_id,
      uuid,
      nome,
      email,
      whatsapp,
      origem,
      campanha,
      status: "Novo"
    });
  });
}

async function listarLeads(request, env) {
  return execute(async () => {
    const { results } = await env.DB.prepare(`
      SELECT
        id,
        uuid,
        nome,
        email,
        whatsapp,
        origem,
        campanha,
        status,
        observacoes,
        empresa,
        cargo,
        consultor,
        created_at,
        updated_at
      FROM leads
      ORDER BY id DESC
    `).all();

    return ok(results);
  });
}
// ======================================================
// LEAD -> ATENDIMENTO -> CLIENTE -> CONSULTORIA
// ENTREGA 2.4.3
// ======================================================

async function buscarLead(request, env) {
  return execute(async () => {

    const id = Number(request.params[0]);

    if (!Number.isInteger(id) || id <= 0) {
      return error("ID do lead inválido.", 400);
    }

    const lead = await env.DB.prepare(`
      SELECT
        id,
        uuid,
        nome,
        email,
        whatsapp,
        origem,
        campanha,
        status,
        observacoes,
        empresa,
        cargo,
        consultor,
        created_at,
        updated_at
      FROM leads
      WHERE id = ?
    `)
    .bind(id)
    .first();

    if (!lead) {
      return error("Lead não encontrado.", 404);
    }

    return ok(lead);

  });
}
async function atualizarLead(request, env) {
  return execute(async () => {
    const id = Number(request.params[0]);

    if (!Number.isInteger(id) || id <= 0) {
      return error("ID do lead inválido.", 400);
    }

    const body = await request.json();

    const nome = String(body.nome || "").trim();
    const email = String(body.email || "").trim();
    const whatsapp = String(body.whatsapp || "").trim();
    const origem = String(body.origem || "").trim();
    const campanha = String(body.campanha || "").trim();
    const status = String(body.status || "Novo").trim();
    const observacoes = String(body.observacoes || "").trim();
    const empresa = String(body.empresa || "").trim();
    const cargo = String(body.cargo || "").trim();
    const consultor = String(body.consultor || "").trim();
    if (!nome) {
      return error("Nome do lead é obrigatório.", 400);
    }

    const lead = await env.DB.prepare(`
      SELECT id FROM leads WHERE id = ?
    `)
      .bind(id)
      .first();

    if (!lead) {
      return error("Lead não encontrado.", 404);
    }

    await env.DB.prepare(`
      UPDATE leads
      SET nome = ?,
          email = ?,
          whatsapp = ?,
          origem = ?,
          campanha = ?,
          status = ?,
          observacoes = ?,
          empresa = ?,
          cargo = ?,
          consultor = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
      .bind(
        nome,
        email,
        whatsapp,
        origem,
        campanha,
        status,
        observacoes,
        empresa,
        cargo,
        consultor,
        id
      )
      .run();

  return ok({
  id,
  nome,
  email,
  whatsapp,
  origem,
  campanha,
  status,
  observacoes,
  empresa,
  cargo,
  consultor
});
  });
}

async function excluirLead(request, env) {
  return execute(async () => {
    const id = Number(request.params[0]);

    if (!Number.isInteger(id) || id <= 0) {
      return error("ID do lead inválido.", 400);
    }

    const lead = await env.DB.prepare(`
      SELECT id FROM leads WHERE id = ?
    `)
      .bind(id)
      .first();

    if (!lead) {
      return error("Lead não encontrado.", 404);
    }

    await env.DB.prepare(`
      DELETE FROM leads WHERE id = ?
    `)
      .bind(id)
      .run();

    return ok({
      id,
      excluido: true
    });
  });
}

async function iniciarAtendimentoLead(request, env) {
  return execute(async () => {

    const leadId = Number(request.params[0]);

    if (!Number.isInteger(leadId) || leadId <= 0) {
      return error("ID do lead inválido.", 400);
    }

    const body = await readBody(request);

    const lead = await env.DB.prepare(`
      SELECT
        id,
        uuid,
        nome,
        email,
        whatsapp,
        origem,
        campanha,
        status,
        observacoes
      FROM leads
      WHERE id = ?
    `)
    .bind(leadId)
    .first();

    if (!lead) {
      return error("Lead não encontrado.", 404);
    }

    let cliente = null;

    if (lead.email) {

      cliente = await env.DB.prepare(`
        SELECT
          id,
          uuid,
          nome,
          email,
          telefone
        FROM clientes
        WHERE lower(email) = lower(?)
        ORDER BY id DESC
        LIMIT 1
      `)
      .bind(lead.email)
      .first();

    }

    if (!cliente) {

      const clienteUuid = crypto.randomUUID();

      const novoCliente = await env.DB.prepare(`
        INSERT INTO clientes
        (
          uuid,
          nome,
          email,
          telefone
        )
        VALUES (?, ?, ?, ?)
      `)
      .bind(
        clienteUuid,
        lead.nome || "",
        lead.email || "",
        lead.whatsapp || ""
      )
      .run();

      cliente = {
        id: novoCliente.meta.last_row_id,
        uuid: clienteUuid,
        nome: lead.nome || "",
        email: lead.email || "",
        telefone: lead.whatsapp || ""
      };

    }

    const ultimo = await env.DB.prepare(`
      SELECT MAX(numero_consultoria) AS numero
      FROM consultorias
    `)
    .first();

    const numeroConsultoria =
      (ultimo?.numero || 1000) + 1;

    const consultoriaUuid =
      crypto.randomUUID();

    const novaConsultoria = await env.DB.prepare(`
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
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
      consultoriaUuid,
      cliente.id,
      numeroConsultoria,
      body.data_consultoria || new Date().toISOString(),
      body.tipo || "Diagnóstico MGR",
      Number(body.duracao || 60),
      body.consultor || "Marcelo Prestes",
      body.status_consultoria || "Em andamento",
      body.observacoes ||
        `Atendimento iniciado a partir do lead #${lead.id}. Origem: ${lead.origem || "Não informada"}.`
    )
    .run();

    await env.DB.prepare(`
      UPDATE leads
      SET
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `)
    .bind(
      body.status_lead || "Em atendimento",
      leadId
    )
    .run();

    return ok(
      {

        lead: {
          id: lead.id,
          uuid: lead.uuid,
          nome: lead.nome,
          email: lead.email,
          whatsapp: lead.whatsapp,
          status:
            body.status_lead || "Em atendimento"
        },

        cliente: {
          id: cliente.id,
          uuid: cliente.uuid,
          nome: cliente.nome,
          email: cliente.email,
          telefone: cliente.telefone
        },

        consultoria: {
          id: novaConsultoria.meta.last_row_id,
          uuid: consultoriaUuid,
          numero_consultoria: numeroConsultoria,
          cliente_id: cliente.id,
          tipo:
            body.tipo || "Diagnóstico MGR",
          status:
            body.status_consultoria || "Em andamento"
        }

      },
      "Atendimento iniciado com sucesso"
    );

  });
}

// ======================================================
// CONSULTORIA -> DIAGNÓSTICO
// ENTREGA 2.4.4
// ======================================================

async function iniciarDiagnosticoConsultoria(request, env) {
  return execute(async () => {

    const consultoriaId = Number(request.params[0]);

    if (!Number.isInteger(consultoriaId) || consultoriaId <= 0) {
      return error("ID da consultoria inválido.", 400);
    }

    const consultoria = await env.DB.prepare(`
      SELECT
        c.id,
        c.uuid,
        c.cliente_id,
        c.numero_consultoria,
        c.tipo,
        c.status,
        cli.nome AS cliente_nome,
        cli.email AS cliente_email,
        cli.telefone AS cliente_telefone
      FROM consultorias c
      INNER JOIN clientes cli
        ON cli.id = c.cliente_id
      WHERE c.id = ?
    `)
    .bind(consultoriaId)
    .first();

    if (!consultoria) {
      return error("Consultoria não encontrada.", 404);
    }

    let diagnostico = await env.DB.prepare(`
      SELECT *
      FROM diagnosticos
      WHERE consultoria_id = ?
      ORDER BY id DESC
      LIMIT 1
    `)
    .bind(consultoriaId)
    .first();

    let criado = false;

    if (!diagnostico) {

      const diagnosticoUuid = crypto.randomUUID();

      const novoDiagnostico = await env.DB.prepare(`
        INSERT INTO diagnosticos
        (
          uuid,
          cliente_id,
          consultoria_id
        )
        VALUES (?, ?, ?)
      `)
      .bind(
        diagnosticoUuid,
        consultoria.cliente_id,
        consultoria.id
      )
      .run();

      diagnostico = await env.DB.prepare(`
        SELECT *
        FROM diagnosticos
        WHERE id = ?
      `)
      .bind(novoDiagnostico.meta.last_row_id)
      .first();

      criado = true;
    }

    return ok(
      {
        cliente: {
          id: consultoria.cliente_id,
          nome: consultoria.cliente_nome,
          email: consultoria.cliente_email,
          telefone: consultoria.cliente_telefone
        },

        consultoria: {
          id: consultoria.id,
          uuid: consultoria.uuid,
          numero_consultoria: consultoria.numero_consultoria,
          tipo: consultoria.tipo,
          status: consultoria.status
        },

        diagnostico: {
          id: diagnostico.id,
          uuid: diagnostico.uuid,
          cliente_id: diagnostico.cliente_id,
          consultoria_id: diagnostico.consultoria_id
        },

        diagnostico_criado: criado
      },

      criado
        ? "Diagnóstico iniciado com sucesso"
        : "Diagnóstico já existente para esta consultoria"
    );

  });
}
async function registrarRespostaDiagnostico(request, env) {

    const diagnosticoId = request.params[0];

    const body = await request.json();

    const {
        pergunta,
        pilar,
        resposta,
        pontuacao
    } = body;

    // Verifica se o diagnóstico existe
    const diagnostico = await env.DB.prepare(`
        SELECT id
        FROM diagnosticos
        WHERE id = ?
    `)
    .bind(diagnosticoId)
    .first();

    if (!diagnostico) {
        return json({
            success: false,
            message: "Diagnóstico não encontrado."
        }, 404);
    }

    // Grava na tabela técnica
    await env.DB.prepare(`
        INSERT INTO diagnostico_respostas
        (
            uuid,
            diagnostico_id,
            pergunta_id,
            resposta
        )
        VALUES (?, ?, ?, ?)
    `)
    .bind(
        crypto.randomUUID(),
        diagnosticoId,
        pergunta,
        resposta
    )
    .run();

    // Grava na tabela analítica
    await env.DB.prepare(`
        INSERT INTO respostas
        (
            diagnostico_id,
            pergunta,
            pilar,
            resposta,
            pontuacao
        )
        VALUES (?, ?, ?, ?, ?)
    `)
    .bind(
        diagnosticoId,
        pergunta,
        pilar,
        resposta,
        pontuacao
    )
    .run();

    return json({
        success: true,
        message: "Resposta registrada com sucesso.",
        data: {
            diagnostico_id: Number(diagnosticoId),
            pergunta,
            pilar,
            resposta,
            pontuacao
        }
    });

}
