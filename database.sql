-- =====================================================
-- MGR API
-- DATABASE.SQL
-- VERSÃO 1.0
-- =====================================================

DROP TABLE IF EXISTS leads;

CREATE TABLE leads (

    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nome TEXT NOT NULL,

    email TEXT NOT NULL,

    telefone TEXT,

    empresa TEXT,

    origem TEXT DEFAULT 'Site',

    observacoes TEXT,

    status TEXT DEFAULT 'Novo',

    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at TEXT

);

CREATE INDEX idx_leads_nome
ON leads(nome);

CREATE INDEX idx_leads_email
ON leads(email);

CREATE INDEX idx_leads_status
ON leads(status);

CREATE INDEX idx_leads_created_at
ON leads(created_at);

-- =====================================================
-- DADOS INICIAIS
-- =====================================================

INSERT INTO leads
(
    nome,
    email,
    telefone,
    empresa,
    origem,
    observacoes,
    status
)
VALUES
(
    'Lead Demonstração',
    'demo@metodomgr.com',
    '(00)00000-0000',
    'MGR',
    'Sistema',
    'Registro inicial do banco.',
    'Novo'
);
