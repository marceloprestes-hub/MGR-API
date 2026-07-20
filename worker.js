export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers
      });
    }

    if (url.pathname === "/health") {

      return Response.json({
        success: true,
        application: "MGR API",
        version: "1.0.0",
        status: "ONLINE"
      }, {
        headers
      });

    }

    return Response.json({
      success: false,
      message: "Endpoint não encontrado."
    }, {
      status: 404,
      headers
    });

  }
};
