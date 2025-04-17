const axios = require("axios");
const dotenv = require('dotenv')
dotenv.config()

// Function to verify Khalti Payment
async function verifyKhaltiPayment(pidx) {
  const headersList = {
    "Authorization": `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const bodyContent = JSON.stringify({ pidx });

  const reqOptions = {
    url: `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/`,
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };

  try {
    const response = await axios.request(reqOptions);
    return response.data;
  } catch (error) {
    console.error("Error verifying Khalti payment:", error);
    throw error;
  }
}

// Function to initialize Khalti Payment
// async function initializeKhaltiPayment(details) {
//   const headersList = {
//     "Authorization": `Key ${process.env.KHALTI_SECRET_KEY}`,
//     "Content-Type": "application/json",
//   };

//   const bodyContent = JSON.stringify(details);

//   const reqOptions = {
//     url: `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
//     method: "POST",
//     headers: headersList,
//     data: bodyContent,
//   };

//   try {
//     const response = await axios.request(reqOptions);
//     return response.data;
//   } catch (error) {
//     console.error("Error initializing Khalti payment:", error);
//     throw error;
//   }
// }

const initializeKhaltiPayment = async (req, res) => {
  const {
    amount,
    order_id,
    purchase_order_name,
  } = req.body;
  const convertedAmount = String((amount+5) * 100);
  
  try {
    // const findPayment = await purchaseSchema.findOne({
    //   buyer_name,
    //   seller_name,
    //   room_id,
    //   purchase_type,
    // });

    const response = await fetch(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          return_url: `http://localhost:5173/ordersuccess`,
          website_url: `http://localhost:5173`,

          amount: convertedAmount,
          purchase_order_id: order_id,
          purchase_order_name: purchase_order_name,
        }),
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      return res.status(200).json({
        success: true,
        message: data.payment_url,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error,
    });
  }
};


module.exports = { verifyKhaltiPayment, initializeKhaltiPayment };