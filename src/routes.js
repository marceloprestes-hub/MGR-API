export async function processarRotas(request, env) {

    const url = new URL(request.url);

    return {
        metodo: request.method,
        rota: url.pathname,
        status: "API MGR funcionando"
    };

}
