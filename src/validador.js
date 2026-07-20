export function validarLead(data) {

  if (!data.nome || data.nome.trim() === "") {
    return "Nome obrigatório";
  }

  if (!data.email || data.email.trim() === "") {
    return "E-mail obrigatório";
  }

  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(data.email)) {
    return "E-mail inválido";
  }

  if (!data.whatsapp || data.whatsapp.trim() === "") {
    return "WhatsApp obrigatório";
  }

  return null;

}
