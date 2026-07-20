export function sucesso(dados, status = 200) {

    return new Response(

        JSON.stringify({
            sucesso: true,
            dados
        }),

        {

            status,

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

            mensagem

        }),

        {

            status,

            headers: {

                "Content-Type": "application/json"

            }

        }

    );

}
