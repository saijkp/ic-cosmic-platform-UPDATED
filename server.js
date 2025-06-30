require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
  try {
    const origin = req.headers.origin || "http://localhost:4242";
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: "IC Coin Package",
              description: "Unlock your cosmic archetype report and deeper realms!"
            },
            unit_amount: 500
          },
          quantity: 1
        }
      ],
      success_url: ${origin}/success.html,
cancel_url: ${origin}/cancel.html,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;

app.listen(PORT, "0.0.0.0", () => {
  console.log(Server running on port ${PORT});
});