export function sucesso(dados = {}) {

    return new Response(
        JSON.stringify({
            sucesso: true,
            ...dados
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

}

export function erro(mensagem, status = 400) {

    return new Response(
        JSON.stringify({
            sucesso: false,
            erro: mensagem
        }),
        {
            status,
            headers: {
                "Content-Type": "application/json"
            }
        }
    );

}
