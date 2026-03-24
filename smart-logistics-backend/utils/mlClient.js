const axios = require("axios");

const getRiskPrediction = async (payload) => {
  const mlUrl = process.env.ML_SERVICE_URL;

  if (!mlUrl) {
    console.warn("⚠️ ML_SERVICE_URL not set");
    return null;
  }

  const normalizedBaseUrl = String(mlUrl).trim().replace(/\/+$/, "");
  if (
    !normalizedBaseUrl.startsWith("http://") &&
    !normalizedBaseUrl.startsWith("https://")
  ) {
    console.error("❌ ML_SERVICE_URL must include http:// or https://");
    return null;
  }

  const predictUrl = `${normalizedBaseUrl}/predict`;

  try {
    const response = await axios.post(predictUrl, payload, {
      timeout: 5000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // ✅ Validate response structure
    if (
      response.data &&
      typeof response.data.risk_score === "number" &&
      typeof response.data.risk_label === "string"
    ) {
      return response.data;
    } else {
      console.warn("⚠️ Invalid ML response:", response.data);
      return null;
    }
  } catch (error) {
    // ✅ Detailed logging (VERY IMPORTANT)
    if (error.response) {
      console.error("❌ ML Service Error:", error.response.data);
    } else if (error.request) {
      console.error("❌ ML Service No Response");
    } else {
      console.error("❌ ML Request Failed:", error.message);
    }

    return null;
  }
};

module.exports = { getRiskPrediction };
