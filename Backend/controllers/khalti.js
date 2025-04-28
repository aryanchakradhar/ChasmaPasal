const axios = require("axios");
const dotenv = require('dotenv');
dotenv.config();

const KHALTI_HEADERS = {
  "Authorization": `Key ${process.env.KHALTI_SECRET_KEY}`,
  "Content-Type": "application/json",
};

const verifyKhaltiPayment = async (pidx) => {
  try {
    const { data } = await axios.post(
      `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/`,
      { pidx },
      { headers: KHALTI_HEADERS }
    );
    return data;
  } catch (error) {
    console.error("Error verifying Khalti payment:", error);
    throw error;
  }
};

const initializeKhaltiPayment = async (req, res) => {
  const { amount, order_id, purchase_order_name } = req.body;
  const convertedAmount = String((amount + 5) * 100);

  try {
    const { data } = await axios.post(
      `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
      {
        return_url: `http://localhost:5173/ordersuccess`,
        website_url: `http://localhost:5173`,
        amount: convertedAmount,
        purchase_order_id: order_id,
        purchase_order_name,
      },
      { headers: KHALTI_HEADERS }
    );

    return res.status(200).json({ success: true, message: data.payment_url });
  } catch (error) {
    console.error("Error initializing Khalti payment:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { verifyKhaltiPayment, initializeKhaltiPayment };
