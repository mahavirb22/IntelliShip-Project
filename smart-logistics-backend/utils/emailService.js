const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendShipmentCreatedEmail = async ({
  email,
  name,
  shipmentId,
  productName,
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
        <div style="margin:0;padding:18px 0;background:#f5f2e7;font-family:Arial,sans-serif;color:#283244;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:690px;margin:0 auto;background:#f8f8f8;border:1px solid #e6dcc2;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:22px 28px;background:linear-gradient(135deg,#d3b049 0%,#d8bd61 100%);">
                <h1 style="margin:0;font-size:22px;line-height:1.25;color:#0f2442;">IntelliShip Shipment Confirmation</h1>
                <p style="margin:10px 0 0;font-size:16px;line-height:1.4;color:#1b2b44;">Your order is now under intelligent monitoring.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:26px 28px 30px;">
                <p style="margin:0 0 14px;font-size:16px;line-height:1.35;color:#283244;">Hi ${name || "Customer"},</p>

                <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#283244;">
                  Thank you for choosing IntelliShip. Your shipment is now under intelligent monitoring using our IoT system.
                </p>

                <div style="margin:0 0 22px;padding:16px 18px;background:#eee8d3;border:1px solid #d4b867;border-radius:12px;">
                  <p style="margin:0 0 6px;font-size:12px;letter-spacing:1.5px;color:#876510;text-transform:uppercase;">Shipment ID</p>
                  <p style="margin:0;font-size:30px;line-height:1.25;font-weight:700;color:#7a5a09;">${shipmentId}</p>
                </div>

                <p style="margin:0 0 10px;font-size:17px;line-height:1.35;color:#505b70;">Basic shipment info:</p>
                <ul style="margin:0 0 26px;padding-left:24px;font-size:14px;line-height:1.65;color:#3f4b62;">
                  <li>Product: ${productName || "N/A"}</li>
                  <li>Status: Created and queued for transit updates</li>
                  <li>Monitoring: Real-time IoT safety tracking enabled</li>
                  <li>Tracking: Available instantly from the link below</li>
                </ul>

                <a href="${trackingUrl}"
                   style="display:inline-block;padding:12px 22px;background:#d0ac2f;color:#142946;text-decoration:none;border-radius:10px;font-size:14px;font-weight:700;">
                   Track Shipment
                </a>

                <p style="margin:24px 0 0;font-size:13px;line-height:1.7;color:#616d82;">
                  We will continuously monitor your shipment and keep the tracking timeline updated for complete visibility and product safety.
                </p>
              </td>
            </tr>
          </table>
        </div>
      `,
    });

    console.log("Email sent:", response);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email sending failed:", error.message);
  }
};

module.exports = { sendShipmentCreatedEmail };
