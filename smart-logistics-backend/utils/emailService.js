const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Always redirect to homepage
const FRONTEND_URL = "https://intelli-ship-project-frontend.vercel.app/track";

const sendShipmentCreatedEmail = async ({ email, name, shipmentId }) => {
  try {
    if (!email) return;

    console.log("📨 Sending email to:", email);

    const response = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "📦 Your IntelliShip Shipment is Confirmed!",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background:#f8f9fb; padding:40px 0;">
          
          <table width="100%" cellspacing="0" cellpadding="0">
            <tr>
              <td align="center">

                <!-- Main Card -->
                <table width="520" style="background:#ffffff; border-radius:14px; padding:30px; box-shadow:0 10px 30px rgba(0,0,0,0.08);">

                  <!-- Header -->
                  <tr>
                    <td align="center">
                      <h2 style="margin:0; color:#d4af37;">📦 IntelliShip</h2>
                      <p style="color:#777; margin-top:5px;">Smart Shipment Monitoring</p>
                    </td>
                  </tr>

                  <!-- Greeting -->
                  <tr>
                    <td>
                      <p style="font-size:16px;">Hello <b>${name || "Customer"}</b>,</p>

                      <p style="color:#555; line-height:1.6;">
                        Your shipment has been successfully created and is now being actively monitored using IoT sensors.
                      </p>
                    </td>
                  </tr>

                  <!-- Shipment Info -->
                  <tr>
                    <td style="padding:15px 0;">
                      <div style="
                        background:#f4f6f8;
                        padding:15px;
                        border-radius:10px;
                        text-align:center;
                      ">
                        <p style="margin:0; font-size:13px; color:#777;">Shipment ID</p>
                        <p style="margin:5px 0 0; font-size:18px; font-weight:bold;">
                          ${shipmentId}
                        </p>
                      </div>
                    </td>
                  </tr>

                  <!-- Button -->
                  <tr>
                    <td align="center" style="padding:20px 0;">
                      <a href="${FRONTEND_URL}" target="_blank"
                        style="
                          display:inline-block;
                          padding:14px 26px;
                          background:linear-gradient(135deg,#d4af37,#c89b2f);
                          color:#fff;
                          text-decoration:none;
                          border-radius:10px;
                          font-weight:600;
                          font-size:15px;
                          box-shadow:0 4px 12px rgba(212,175,55,0.4);
                        ">
                        Track Shipment →
                      </a>
                    </td>
                  </tr>

                  <!-- Divider -->
                  <tr>
                    <td>
                      <hr style="border:none; border-top:1px solid #eee;">
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="text-align:center;">
                      <p style="color:#777; font-size:13px;">
                        Real-time tracking • Smart alerts • Safe delivery
                      </p>

                      <p style="margin-top:10px;">
                        Thank you for choosing <b>IntelliShip</b> 🚀
                      </p>
                    </td>
                  </tr>

                </table>

              </td>
            </tr>
          </table>
        </div>
      `,
    });

    if (response?.error) {
      console.error("❌ Email sending failed:", response.error.message);
      return;
    }

    console.log("✅ Email sent successfully:", response?.id);
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
  }
};

module.exports = { sendShipmentCreatedEmail };
