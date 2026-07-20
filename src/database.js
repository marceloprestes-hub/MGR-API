export async function listarLeads(DB) {

  const { results } = await DB.prepare(`
    SELECT
      id,
      nome,
      email,
      whatsapp,
      origem,
      status,
      created_at
    FROM leads
    ORDER BY created_at DESC
  `).all();

  return results;

}

export async function buscarLeadPorEmail(DB, email) {

  return await DB.prepare(`
    SELECT id
    FROM leads
    WHERE email = ?
  `)
  .bind(email)
  .first();

}

export async function inserirLead(DB, lead) {

  return await DB.prepare(`
    INSERT INTO leads
    (
      nome,
      email,
      whatsapp,
      origem,
      status
    )
    VALUES
    (
      ?,
      ?,
      ?,
      ?,
      'NOVO'
    )
  `)
  .bind(
    lead.nome,
    lead.email,
    lead.whatsapp,
    lead.origem
  )
  .run();

}

export async function atualizarStatus(DB, id, status) {

  return await DB.prepare(`
    UPDATE leads
    SET status = ?
    WHERE id = ?
  `)
  .bind(status, id)
  .run();

}

export async function excluirLead(DB, id) {

  return await DB.prepare(`
    DELETE FROM leads
    WHERE id = ?
  `)
  .bind(id)
  .run();

}
