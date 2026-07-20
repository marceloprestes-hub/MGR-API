const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS"
};

export function sucesso(dados = null, status = 200) {

    return new Response(
        JSON.stringify({
            sucesso: true,
            dados
        }),
        {
            status,
            headers
        }
    );

}

export function erro(mensagem = "Erro interno.", status = 500) {

    return new Response(
        JSON.stringify({
            sucesso: false,
            mensagem
        }),
        {
            status,
            headers
        }
    );

}

export function resposta(payload, status = 200) {

    return new Response(
        JSON.stringify(payload),
        {
            status,
            headers
        }
    );

}

export { headers };
