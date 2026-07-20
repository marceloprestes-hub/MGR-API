export async function listarLeads(env) {

    const resultado = await env.DB.prepare(

        "SELECT * FROM leads ORDER BY criado_em DESC"

    ).all();

    return resultado.results;

}
