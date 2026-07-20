if (pathname === "/leads" && request.method === "GET") {

    const leads = await listarLeads(env);

    return sucesso(leads);

}
