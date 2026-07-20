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
    const rota = url.pathname;
    const metodo = request.method;

    if (rota === "/saude") {
        return sucesso({
            sistema: "MGR API",
            versao: "1.0.0",
            status: "ONLINE"
        });
    }

    if (rota === "/leads" && metodo === "GET") {
        const leads = await listarLeads(env);
        return sucesso(leads);
    }

    if (rota === "/lead" && metodo === "POST") {

        const dados = await request.json();

        await cadastrarLead(dados, env);

        return sucesso({
            mensagem: "Lead cadastrado com sucesso."
        },201);

    }

    return erro("Rota não encontrada.",404);

}
