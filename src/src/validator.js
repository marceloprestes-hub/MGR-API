const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[0-9()+\-\s]{10,20}$/;

export function limparTexto(valor) {
  if (valor === null || valor === undefined) return "";
  return String(valor).trim();
}

export function limparEmail(email) {
  return limparTexto(email).toLowerCase();
}

export function limparTelefone(numero) {
  return limparTexto(numero);
}

export function validarNome(nome) {
  nome = limparTexto(nome);

  if (!nome.length)
    return { valido: false, mensagem: "Informe o nome." };

  if (nome.length < 3)
    return { valido: false, mensagem: "Nome muito curto." };

  return { valido: true };
}

export function validarEmail(email) {
  email = limparEmail(email);

  if (!EMAIL_REGEX.test(email))
    return { valido: false, mensagem: "E-mail inválido." };

  return { valido: true };
}

export function validarWhatsapp(numero) {
  numero = limparTelefone(numero);

  if (!PHONE_REGEX.test(numero))
    return { valido: false, mensagem: "WhatsApp inválido." };

  return { valido: true };
}

export function validarLead(dados) {

  const nome = validarNome(dados.nome);
  if (!nome.valido) return nome;

  const email = validarEmail(dados.email);
  if (!email.valido) return email;

  const whatsapp = validarWhatsapp(dados.whatsapp);
  if (!whatsapp.valido) return whatsapp;

  return { valido: true };
}
