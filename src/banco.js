// ================================
// LISTAR LEADS
// ================================

export async function listarLeads(env) {

    const { results } = await env.DB.prepare(`
        SELECT *
        FROM leads
        ORDER BY id DESC
    `).all();

    return results;

}

// ================================
// BUSCAR LEAD
// ================================

export async function buscarLead(env, id) {

    const lead = await env.DB.prepare(`
        SELECT *
        FROM leads
        WHERE id = ?
    `)
    .bind(id)
    .first();

    return lead;

}

// ================================
// CADASTRAR LEAD
// ================================

export async function cadastrarLead(env, dados) {

    const {
        nome,
        email,
        telefone,
        empresa,
        origem,
        observacoes
    } = dados;

    const resultado = await env.DB.prepare(`
        INSERT INTO leads
        (
            nome,
            email,
            telefone,
            empresa,
            origem,
            observacoes,
            data_cadastro
        )
        VALUES
        (?, ?, ?, ?, ?, ?, datetime('now'))
    `)
    .bind(
        nome ?? "",
        email ?? "",
        telefone ?? "",
        empresa ?? "",
        origem ?? "",
        observacoes ?? ""
    )
    .run();

    return {
        id: resultado.meta.last_row_id,
        mensagem: "Lead cadastrado com sucesso."
    };

}

// ================================
// ATUALIZAR LEAD
// ================================

export async function atualizarLead(env, id, dados) {

    const {
        nome,
        email,
        telefone,
        empresa,
        origem,
        observacoes
    } = dados;

    await env.DB.prepare(`
        UPDATE leads
        SET
            nome = ?,
            email = ?,
            telefone = ?,
            empresa = ?,
            origem = ?,
            observacoes = ?
        WHERE id = ?
    `)
    .bind(
        nome ?? "",
        email ?? "",
        telefone ?? "",
        empresa ?? "",
        origem ?? "",
        observacoes ?? "",
        id
    )
    .run();

    return {
        mensagem: "Lead atualizado com sucesso."
    };

}

// ================================
// EXCLUIR LEAD
// ================================

export async function excluirLead(env, id) {

    await env.DB.prepare(`
        DELETE FROM leads
        WHERE id = ?
    `)
    .bind(id)
    .run();

    return {
        mensagem: "Lead excluído com sucesso."
    };

}
