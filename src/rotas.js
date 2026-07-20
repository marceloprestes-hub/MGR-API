if (pathname === "/lead" && request.method === "POST") {

    const dados = await request.json();

    if (!dados.nome || !dados.email) {
        return erro("Nome e e-mail são obrigatórios.", 400);
    }

    const resultado = await cadastrarLead(env, {
        nome: dados.nome,
        empresa: dados.empresa || "",
        email: dados.email,
        telefone: dados.telefone || "",
        cidade: dados.cidade || "",
        origem: dados.origem || "Landing Page",
        status: "NOVO"
    });

    return sucesso(resultado, 201);

}
