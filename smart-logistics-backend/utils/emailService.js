const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendShipmentCreatedEmail = async ({
  email,
  name,
  shipmentId,
  trackingUrl,
}) => {
  try {
    if (!email) return;

    console.log("Sending email to:", email);

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "📦 Your IntelliShip Shipment is Confirmed!",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>📦 IntelliShip</h2>

          <p>Hello <b>${name || "Customer"}</b>,</p>

          <p>Your shipment has been successfully created.</p>

          <p><b>Shipment ID:</b> ${shipmentId}</p>

          <a href="${trackingUrl}"
             style="display:inline-block;padding:10px 20px;
             background:#d4af37;color:#fff;text-decoration:none;
             border-radius:6px;margin-top:10px;">
             Track Shipment
          </a>

          <p style="margin-top:20px;">
            Your shipment is being monitored using IoT sensors.
          </p>

          <p>Thank you for choosing IntelliShip 🚀</p>
        </div>
      `,
    });

    if (response?.error) {
      console.error("Email sending failed:", response.error.message);
      return;
    }

    console.log("Email sent:", response);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
};

module.exports = { sendShipmentCreatedEmail };
