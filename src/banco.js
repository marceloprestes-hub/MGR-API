export async function listarLeads(env) {
    const resultado = await env.DB.prepare(
        "SELECT * FROM leads ORDER BY criado_em DESC"
    ).all();

    return resultado.results;
}

export async function buscarLead(id, env) {
    return await env.DB.prepare(
        "SELECT * FROM leads WHERE id=?"
    ).bind(id).first();
}

export async function cadastrarLead(dados, env) {
    return await env.DB.prepare(
        `INSERT INTO leads
        (nome,email,telefone,empresa,origem)
        VALUES (?,?,?,?,?)`
    ).bind(
        dados.nome,
        dados.email,
        dados.telefone,
        dados.empresa,
        dados.origem
    ).run();
}

export async function atualizarLead(id,dados,env){
    return await env.DB.prepare(
        `UPDATE leads
        SET nome=?,email=?,telefone=?,empresa=?,origem=?
        WHERE id=?`
    ).bind(
        dados.nome,
        dados.email,
        dados.telefone,
        dados.empresa,
        dados.origem,
        id
    ).run();
}

export async function excluirLead(id,env){
    return await env.DB.prepare(
        "DELETE FROM leads WHERE id=?"
    ).bind(id).run();
}
