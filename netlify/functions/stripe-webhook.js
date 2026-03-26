const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

exports.handler = async function(event) {
  // Netlify may base64-encode the raw body — decode it for Stripe signature verification
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;

  const sig = event.headers["stripe-signature"];
  let stripeEvent;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  const updateProfile = async (userId, plan, status, subscriptionId, customerId) => {
    const { error } = await supabase.from("profiles").update({
      plan,
      subscription_status: status,
      subscription_id:    subscriptionId,
      stripe_customer_id: customerId,
    }).eq("id", userId);
    if (error) console.error("Supabase update error:", error.message);
  };

  try {
    switch (stripeEvent.type) {

      case "checkout.session.completed": {
        const session = stripeEvent.data.object;
        const userId  = session.metadata?.userId;
        const plan    = session.metadata?.plan;
        if (userId && plan) {
          await updateProfile(userId, plan, "active", session.subscription, session.customer);
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub    = stripeEvent.data.object;
        const userId = sub.metadata?.userId;
        if (!userId) break;
        const plan   = sub.metadata?.plan || "essentials";
        const status = sub.status === "active" ? "active" : "inactive";
        await updateProfile(userId, plan, status, sub.id, sub.customer);
        break;
      }

      case "customer.subscription.deleted": {
        const sub    = stripeEvent.data.object;
        const userId = sub.metadata?.userId;
        if (!userId) break;
        await updateProfile(userId, "starter", "inactive", null, sub.customer);
        break;
      }

      case "invoice.payment_failed": {
        const inv = stripeEvent.data.object;
        if (!inv.subscription) break;
        const sub    = await stripe.subscriptions.retrieve(inv.subscription);
        const userId = sub.metadata?.userId;
        if (userId) {
          await supabase.from("profiles")
            .update({ subscription_status: "past_due" })
            .eq("id", userId);
        }
        break;
      }

      default:
        break;
    }
  } catch (err) {
    console.error("Webhook handler error:", err);
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
