// ========================================
// VALIDAÇÕES MGR API
// ========================================

export function validarLead(dados) {

    const erros = [];

    if (!dados) {
        erros.push("Nenhum dado informado.");
        return erros;
    }

    // Nome
    if (!dados.nome || dados.nome.trim().length < 3) {
        erros.push("Nome deve possuir pelo menos 3 caracteres.");
    }

    // Email
    if (!dados.email || dados.email.trim() === "") {

        erros.push("E-mail é obrigatório.");

    } else {

        const regex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!regex.test(dados.email)) {
            erros.push("E-mail inválido.");
        }

    }

    // Telefone
    if (!dados.telefone || dados.telefone.trim() === "") {
        erros.push("Telefone é obrigatório.");
    }

    // Empresa
    if (!dados.empresa || dados.empresa.trim() === "") {
        erros.push("Empresa é obrigatória.");
    }

    return erros;

}

export function validarId(id) {

    if (id === undefined || id === null) {
        return false;
    }

    const numero = Number(id);

    if (Number.isNaN(numero)) {
        return false;
    }

    if (numero <= 0) {
        return false;
    }

    return true;

}
