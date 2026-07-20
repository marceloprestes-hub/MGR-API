CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    nome TEXT NOT NULL,
    empresa TEXT,
    email TEXT NOT NULL,
    telefone TEXT,
    cidade TEXT,

    origem TEXT DEFAULT 'Landing Page',

    status TEXT DEFAULT 'NOVO',

    observacoes TEXT,

    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_leads_email
ON leads(email);

CREATE INDEX idx_leads_status
ON leads(status);

CREATE INDEX idx_leads_created
ON leads(created_at);
