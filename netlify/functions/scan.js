exports.handler = async function(event) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };
  const apiKey = process.env.ANTHROPIC_KEY;
  if (!apiKey) return {
    statusCode: 500,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "ANTHROPIC_KEY not set" })
  };
  try {
    const body = JSON.parse(event.body);
    const request = {
      model: body.model || "claude-haiku-4-5-20251001",
      max_tokens: body.max_tokens || 1000,
      messages: body.messages,
    };
    if (body.system) request.system = body.system;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(request),
    });
    const text = await response.text();
    return { statusCode: 200, headers: { "Content-Type": "application/json" }, body: text };
  } catch (err) {
    return { statusCode: 500, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ error: err.message }) };
  }
};
