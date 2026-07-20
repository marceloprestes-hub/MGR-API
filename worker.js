import { processarRotas } from "./src/rotas.js";

export default {

  async fetch(request, env) {

    return await processarRotas(request, env);

  }

};
