import { sucesso, erro } from "./retorno.js";

import {
    listarLeads,
    buscarLead,
    cadastrarLead,
    atualizarLead,
    excluirLead
} from "./banco.js";

export async function processarRotas(request, env) {

    const url = new URL(request.url);
    const pathname = url.pathname;

    // ==========================
    // SAÚDE DA API
    // ==========================

    if (pathname === "/saude" && request.method === "GET") {

        return sucesso({
            sistema: "MGR API",
            versao: "1.0.0",
            status: "ONLINE"
        });

    }

    // ==========================
    // LISTAR LEADS
    // ==========================

    if (pathname === "/leads" && request.method === "GET") {

        const leads = await listarLeads(env);

        return sucesso(leads);

    }

    // ==========================
    // BUSCAR LEAD
    // ==========================

    if (
        pathname.startsWith("/lead/")
        && request.method === "GET"
    ) {

        const id = Number(pathname.split("/")[2]);

        const lead = await buscarLead(env, id);

        if (!lead) {
            return erro("Lead não encontrado.", 404);
        }

        return sucesso(lead);

    }

    // ==========================
    // CADASTRAR LEAD
    // ==========================

    if (
        pathname === "/lead"
        && request.method === "POST"
    ) {

        const dados = await request.json();

        const resultado = await cadastrarLead(env, dados);

        return sucesso(resultado, 201);

    }

    // ==========================
    // ATUALIZAR LEAD
    // ==========================

    if (
        pathname.startsWith("/lead/")
        && request.method === "PUT"
    ) {

        const id = Number(pathname.split("/")[2]);

        const dados = await request.json();

        const resultado = await atualizarLead(
            env,
            id,
            dados
        );

        return sucesso(resultado);

    }

    // ==========================
    // EXCLUIR LEAD
    // ==========================

    if (
        pathname.startsWith("/lead/")
        && request.method === "DELETE"
    ) {

        const id = Number(pathname.split("/")[2]);

        const resultado = await excluirLead(env, id);

        return sucesso(resultado);

    }

    // ==========================
    // ROTA NÃO ENCONTRADA
    // ==========================

    return erro("Rota não encontrada.", 404);

}
