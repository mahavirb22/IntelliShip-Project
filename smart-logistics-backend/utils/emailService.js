const { Resend } = require("resend");

const DEFAULT_FRONTEND_BASE_URL =
  "https://intelli-ship-project-frontend.vercel.app";
const DEFAULT_FROM_EMAIL = "IntelliShip <onboarding@resend.dev>";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const toTrackingPath = (baseUrl, shipmentId) =>
  `${String(baseUrl || DEFAULT_FRONTEND_BASE_URL).replace(/\/$/, "")}/track/${shipmentId}`;

const isValidEmail = (email) => EMAIL_REGEX.test(String(email || "").trim());

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

const buildShipmentCreatedEmailHtml = ({ name, shipmentId, trackingUrl }) => {
  const safeName = escapeHtml(name || "Customer");
  const safeShipmentId = escapeHtml(shipmentId);
  const safeTrackingUrl = escapeHtml(trackingUrl);

  return `
    <div style="margin:0;padding:24px 0;background:#f7f4ea;font-family:'Segoe UI',Arial,sans-serif;color:#1f2937;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #efe7d0;">
        <tr>
          <td style="padding:24px 28px;background:linear-gradient(135deg,#d4af37,#e6c768);color:#1f2937;">
            <h1 style="margin:0;font-size:24px;line-height:1.2;">IntelliShip Shipment Confirmation</h1>
            <p style="margin:8px 0 0;font-size:14px;opacity:0.9;">Your order is now under intelligent monitoring.</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px;">
            <p style="margin:0 0 12px;font-size:16px;">Hi ${safeName},</p>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.7;">
              Thank you for choosing IntelliShip. Your shipment is now under intelligent monitoring using our IoT system.
            </p>
            <div style="margin:0 0 20px;padding:14px 16px;background:#fff8e1;border:1px solid #f2df9e;border-radius:10px;">
              <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.8px;color:#7a5f0f;text-transform:uppercase;">Shipment ID</p>
              <p style="margin:0;font-size:20px;font-weight:700;color:#7a5f0f;">${safeShipmentId}</p>
            </div>
            <p style="margin:0 0 12px;font-size:14px;color:#4b5563;">Basic shipment info:</p>
            <ul style="margin:0 0 24px;padding-left:18px;font-size:14px;line-height:1.8;color:#374151;">
              <li>Status: Created and queued for transit updates</li>
              <li>Monitoring: Real-time IoT safety tracking enabled</li>
              <li>Tracking: Available instantly from the link below</li>
            </ul>
            <a href="${safeTrackingUrl}" style="display:inline-block;padding:12px 22px;border-radius:8px;background:#d4af37;color:#1f2937;text-decoration:none;font-weight:700;font-size:14px;">
              Track Shipment
            </a>
            <p style="margin:24px 0 0;font-size:13px;line-height:1.7;color:#6b7280;">
              We will continuously monitor your shipment and keep the tracking timeline updated for complete visibility and product safety.
            </p>
          </td>
        </tr>
      </table>
    </div>
  `;
};

const sendShipmentCreatedEmail = async ({
  email,
  name,
  shipmentId,
  trackingUrl,
}) => {
  const normalizedEmail = String(email || "")
    .trim()
    .toLowerCase();
  if (!normalizedEmail || !isValidEmail(normalizedEmail)) {
    return { sent: false, reason: "invalid-or-missing-email" };
  }

  const apiKey = String(process.env.RESEND_API_KEY || "").trim();
  if (!apiKey) {
    return { sent: false, reason: "missing-resend-api-key" };
  }

  if (!shipmentId) {
    return { sent: false, reason: "missing-shipment-id" };
  }

  const resend = new Resend(apiKey);
  const finalTrackingUrl =
    trackingUrl || toTrackingPath(process.env.FRONTEND_BASE_URL, shipmentId);

  return resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || DEFAULT_FROM_EMAIL,
    to: [normalizedEmail],
    subject: "📦 Your IntelliShip Order is Confirmed!",
    html: buildShipmentCreatedEmailHtml({
      name,
      shipmentId,
      trackingUrl: finalTrackingUrl,
    }),
  });
};

module.exports = {
  buildShipmentCreatedEmailHtml,
  isValidEmail,
  sendShipmentCreatedEmail,
};
