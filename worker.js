import { processarRotas } from "./src/rotas.js";

export default {

    async fetch(request, env) {

        try {

            const resposta = await processarRotas(request, env);

            return new Response(
                JSON.stringify(resposta, null, 2),
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

        } catch (erro) {

            return new Response(
                JSON.stringify({
                    sucesso: false,
                    erro: erro.message
                }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

        }

    }

}
