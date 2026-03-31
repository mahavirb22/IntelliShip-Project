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
        <div style="margin:0;padding:18px 0;background:#f5f2e7;font-family:Arial,sans-serif;color:#283244;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:690px;margin:0 auto;background:#f8f8f8;border:1px solid #e6dcc2;border-radius:14px;overflow:hidden;">
            <tr>
              <td style="padding:24px 30px;background:linear-gradient(135deg,#d3b049 0%,#d8bd61 100%);">
                <h1 style="margin:0;font-size:40px;line-height:1.15;color:#0f2442;">IntelliShip Shipment Confirmation</h1>
                <p style="margin:12px 0 0;font-size:31px;line-height:1.2;color:#1b2b44;">Your order is now under intelligent monitoring.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:28px 30px 30px;">
                <p style="margin:0 0 18px;font-size:32px;line-height:1.35;color:#283244;">Hi ${name || "Customer"},</p>

                <p style="margin:0 0 26px;font-size:36px;line-height:1.45;color:#283244;">
                  Thank you for choosing IntelliShip. Your shipment is now under intelligent monitoring using our IoT system.
                </p>

                <div style="margin:0 0 26px;padding:18px 20px;background:#eee8d3;border:1px solid #d4b867;border-radius:12px;">
                  <p style="margin:0 0 8px;font-size:20px;letter-spacing:2px;color:#876510;text-transform:uppercase;">Shipment ID</p>
                  <p style="margin:0;font-size:44px;line-height:1.2;font-weight:700;color:#7a5a09;">${shipmentId}</p>
                </div>

                <p style="margin:0 0 12px;font-size:38px;line-height:1.35;color:#505b70;">Basic shipment info:</p>
                <ul style="margin:0 0 30px;padding-left:26px;font-size:35px;line-height:1.65;color:#3f4b62;">
                  <li>Status: Created and queued for transit updates</li>
                  <li>Monitoring: Real-time IoT safety tracking enabled</li>
                  <li>Tracking: Available instantly from the link below</li>
                </ul>

                <a href="${trackingUrl}"
                   style="display:inline-block;padding:18px 30px;background:#d0ac2f;color:#142946;text-decoration:none;border-radius:12px;font-size:35px;font-weight:700;">
                   Track Shipment
                </a>

                <p style="margin:28px 0 0;font-size:34px;line-height:1.6;color:#616d82;">
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
