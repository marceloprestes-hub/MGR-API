export async function cadastrarLead(env, lead) {

    const resultado = await env.DB.prepare(`
        INSERT INTO leads (
            nome,
            empresa,
            email,
            telefone,
            cidade,
            origem,
            status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `)
    .bind(
        lead.nome,
        lead.empresa,
        lead.email,
        lead.telefone,
        lead.cidade,
        lead.origem,
        lead.status
    )
    .run();

    return {
        id: resultado.meta.last_row_id,
        mensagem: "Lead cadastrado com sucesso."
    };

}
