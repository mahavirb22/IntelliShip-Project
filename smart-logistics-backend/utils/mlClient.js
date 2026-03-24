const axios = require("axios");

const getRiskPrediction = async (payload) => {
  const mlUrl = process.env.ML_SERVICE_URL;
  if (!mlUrl) {
    return null;
  }

  try {
    const response = await axios.post(
      `${mlUrl.replace(/\/$/, "")}/predict`,
      payload,
      {
        timeout: 3000,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error) {
    return null;
  }
};

module.exports = { getRiskPrediction };
