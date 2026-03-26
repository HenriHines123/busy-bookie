const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// Map plan id → Stripe product ID
const PRODUCTS = {
  essentials: "prod_UDYeMOGMkogl2e",
  premium:    "prod_UDYfoWnZ0fESMP",
};

exports.handler = async function(event) {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };

  try {
    const { plan, userId, email, returnUrl } = JSON.parse(event.body);

    const productId = PRODUCTS[plan];
    if (!productId) return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Invalid plan" }),
    };

    // Fetch the default price for this product
    const prices = await stripe.prices.list({ product: productId, active: true, limit: 1 });
    if (!prices.data.length) return {
      statusCode: 400,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "No active price found for this product. Please create a recurring price in Stripe dashboard." }),
    };

    const priceId = prices.data[0].id;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${returnUrl}?checkout=success&plan=${plan}`,
      cancel_url:  `${returnUrl}?checkout=cancelled`,
      metadata: { userId, plan },
      subscription_data: {
        metadata: { userId, plan },
      },
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
