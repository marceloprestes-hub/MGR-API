import { processarRotas } from "./src/rotas.js";

export default {
  async fetch(request, env, ctx) {
    try {
      return await processarRotas(request, env, ctx);
    } catch (error) {
      console.error("Erro MGR API:", error);

      return new Response(
        JSON.stringify({
          sucesso: false,
          mensagem: "Erro interno da API.",
          erro: error.message
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json;charset=UTF-8"
          }
        }
      );
    }
  }
};
