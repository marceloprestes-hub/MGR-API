import { sucesso, erro } from "./retorno.js";

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

        return sucesso({

            mensagem: "Listagem de Leads"

        });

    }

    if (rota === "/leads" && metodo === "POST") {

        return sucesso({

            mensagem: "Cadastro de Lead"

        });

    }

    return erro("Rota não encontrada.",404);

}
