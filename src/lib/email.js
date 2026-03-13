import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder_for_build");
const FROM = process.env.EMAIL_FROM || "NOIR <noreply@maisonoir.com>";

/* ── Shared styles ── */
const base = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;1,400&family=Inter:wght@400;600&display=swap');
    body { background:#0A0A0A; color:#F5F5F5; font-family:'Inter',sans-serif; margin:0; padding:0; }
    .container { max-width:560px; margin:40px auto; background:#111; border:1px solid rgba(198,169,114,0.15); border-radius:16px; overflow:hidden; }
    .header { padding:32px 40px; border-bottom:1px solid rgba(255,255,255,0.05); }
    .logo { font-family:'Playfair Display',serif; font-style:italic; font-size:28px; letter-spacing:0.15em; color:#C6A972; }
    .body { padding:36px 40px; }
    h1 { font-family:'Playfair Display',serif; font-style:italic; font-size:22px; color:#fff; margin:0 0 16px; }
    p { color:rgba(255,255,255,0.6); font-size:14px; line-height:1.8; margin:0 0 12px; }
    .btn { display:inline-block; background:#C6A972; color:#0A0A0A; text-decoration:none; padding:12px 28px; border-radius:100px; font-size:12px; font-weight:700; letter-spacing:0.2em; text-transform:uppercase; margin:20px 0; }
    .divider { border:none; border-top:1px solid rgba(255,255,255,0.05); margin:24px 0; }
    .footer { padding:20px 40px; border-top:1px solid rgba(255,255,255,0.05); }
    .footer p { font-size:11px; color:rgba(255,255,255,0.2); margin:0; }
    .tag { display:inline-block; border:1px solid rgba(198,169,114,0.3); color:#C6A972; padding:3px 10px; border-radius:100px; font-size:9px; letter-spacing:0.3em; text-transform:uppercase; font-weight:700; margin-bottom:16px; }
    table.order-table { width:100%; border-collapse:collapse; margin:16px 0; }
    table.order-table td { padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.05); font-size:13px; vertical-align:top; }
    table.order-table .label { color:rgba(255,255,255,0.3); }
    table.order-table .total { color:#C6A972; font-weight:700; font-size:16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">NOIR</div>
    </div>
    <div class="body">${content}</div>
    <div class="footer">
      <p>Maison NOIR &mdash; Luxury without compromise &mdash; <a href="https://maisonoir.com" style="color:#C6A972;text-decoration:none;">maisonoir.com</a></p>
    </div>
  </div>
</body>
</html>`;

/* ══ 1. Order Confirmation ══════════════════════════════════════ */
export async function sendOrderConfirmation({ to, name, orderId, items = [], total, currencySymbol = "₹" }) {
    const itemRows = items.map(i => `
        <tr>
          <td>${i.name}</td>
          <td style="text-align:right;color:rgba(255,255,255,0.5)">&times;${i.quantity}</td>
          <td style="text-align:right">${currencySymbol}${Number(i.price || 0).toLocaleString("en-IN")}</td>
        </tr>`).join("");

    const html = base(`
        <div class="tag">Order Confirmed</div>
        <h1>Your order has been placed.</h1>
        <p>Thank you, ${name || "valued patron"}. Your selection from Maison NOIR has been received and is being processed.</p>
        <table class="order-table">
          ${itemRows}
          <tr><td class="label">Order ID</td><td colspan="2" style="text-align:right;font-family:monospace;font-size:11px">${orderId}</td></tr>
          <tr><td class="total">Total</td><td colspan="2" class="total" style="text-align:right">${currencySymbol}${Number(total).toLocaleString("en-IN")}</td></tr>
        </table>
        <a href="${process.env.NEXTAUTH_URL}/account/orders" class="btn">View Order</a>
        <hr class="divider"/>
        <p style="font-size:12px">You will receive a shipping confirmation once your order is dispatched. If you have any questions, reply to this email.</p>
    `);

    return resend.emails.send({ from: FROM, to, subject: `Order Confirmed — NOIR #${orderId.slice(-8).toUpperCase()}`, html });
}

/* ══ 2. Shipping Update ═════════════════════════════════════════ */
export async function sendShippingUpdate({ to, name, orderId, trackingId, courier }) {
    const html = base(`
        <div class="tag">Shipped</div>
        <h1>Your order is on its way.</h1>
        <p>Good news, ${name || "valued patron"} — your Maison NOIR order has been handed to ${courier || "our courier"} and is en route to you.</p>
        <table class="order-table">
          <tr><td class="label">Order ID</td><td style="text-align:right;font-family:monospace;font-size:11px">${orderId}</td></tr>
          ${trackingId ? `<tr><td class="label">Tracking ID</td><td style="text-align:right;font-family:monospace;font-size:11px">${trackingId}</td></tr>` : ""}
        </table>
        ${trackingId ? `<a href="https://www.google.com/search?q=${encodeURIComponent(trackingId)}" class="btn">Track Package</a>` : ""}
        <hr class="divider"/>
        <p style="font-size:12px">Expect delivery within 3–5 business days. Your world is about to get a little more NOIR.</p>
    `);

    return resend.emails.send({ from: FROM, to, subject: `Your NOIR Order Has Shipped`, html });
}

/* ══ 2.1 Order Delivered ════════════════════════════════════════ */
export async function sendOrderDelivered({ to, name, orderId }) {
    const html = base(`
        <div class="tag">Delivered</div>
        <h1>Arrival.</h1>
        <p>Hi ${name || "valued patron"}, we are pleased to confirm that your Maison NOIR selection has been successfully delivered.</p>
        <p>Order Reference: <span style="font-family:monospace;font-size:12px">${orderId}</span></p>
        <hr class="divider"/>
        <p style="font-size:12px">We hope these pieces meet your expectations of uncompromising luxury. If you have any feedback or require further assistance, our concierge is at your service.</p>
    `);

    return resend.emails.send({ from: FROM, to, subject: `Your NOIR Order Was Delivered`, html });
}

/* ══ 2.2 Refund Issued ══════════════════════════════════════════ */
export async function sendRefundIssued({ to, name, orderId, amount, currencySymbol = "₹" }) {
    const html = base(`
        <div class="tag">Refunded</div>
        <h1>Notification of Credit.</h1>
        <p>Hi ${name || "valued patron"}, we have processed a refund of <strong>${currencySymbol}${amount.toLocaleString()}</strong> for your order.</p>
        <p>Order Reference: <span style="font-family:monospace;font-size:12px">${orderId}</span></p>
        <hr class="divider"/>
        <p style="font-size:12px">The funds should appear in your account within 5–10 business days depending on your financial institution.</p>
    `);

    return resend.emails.send({ from: FROM, to, subject: `Credit Issued for Your NOIR Order`, html });
}

/* ══ 3. Password Reset ══════════════════════════════════════════ */
export async function sendPasswordReset({ to, name, resetUrl }) {
    const html = base(`
        <div class="tag">Account Security</div>
        <h1>Reset your password.</h1>
        <p>Hi ${name || "there"}, we received a request to reset your Maison NOIR account password.</p>
        <a href="${resetUrl}" class="btn">Reset Password</a>
        <hr class="divider"/>
        <p style="font-size:12px">This link expires in 1 hour. If you did not request a password reset, please ignore this email — your account is safe.</p>
    `);

    return resend.emails.send({ from: FROM, to, subject: `Reset Your Maison NOIR Password`, html });
}

/* ══ 4. Welcome Email ════════════════════════════════════════════ */
export async function sendWelcomeEmail({ to, name }) {
    const html = base(`
        <div class="tag">Welcome</div>
        <h1>Welcome to Maison NOIR.</h1>
        <p>You have entered a world of uncompromising luxury, ${name || ""}. Our collections are curated for those who demand the extraordinary.</p>
        <a href="${process.env.NEXTAUTH_URL}/collections" class="btn">Explore Collections</a>
        <hr class="divider"/>
        <p style="font-size:12px">As a member, you have early access to new drops, exclusive events, and our custom perfume atelier.</p>
    `);

    return resend.emails.send({ from: FROM, to, subject: `Welcome to Maison NOIR`, html });
}
/* ══ 5. Abandoned Cart ════════════════════════════════════════ */
export async function sendAbandonedCartEmail({ to, name, cartLink }) {
    const html = base(`
        <div class="tag">Selection Pending</div>
        <h1>Your curation awaits.</h1>
        <p>Hi ${name || "patron"}, we noticed you left some exquisite pieces in your collection. These items are in high demand and we cannot guarantee their availability for long.</p>
        <a href="${cartLink}" class="btn">Resume Selection</a>
        <hr class="divider"/>
        <p style="font-size:12px">Maison NOIR pieces are crafted in limited quantities. Complete your acquisition to ensure ownership of these archival designs.</p>
    `);

    return resend.emails.send({ from: FROM, to, subject: `Your Selection at Maison NOIR Awaits`, html });
}

/* ══ 6. Newsletter Welcome ══════════════════════════════════════ */
export async function sendNewsletterWelcome({ to }) {
    const html = base(`
        <div class="tag">The Inner Circle</div>
        <h1>Connectivity Established.</h1>
        <p>Welcome to the Inner Circle of Maison NOIR. You are now part of a global society with priority access to our most prestigious drops and private events.</p>
        <p>Expect intelligence on upcoming runway collections and exclusive invitations to our 3D Showroom experiences.</p>
        <hr class="divider"/>
        <p style="font-size:12px">Luxury is a dialogue. We are honored to have you with us.</p>
    `);

    return resend.emails.send({ from: FROM, to, subject: `Maison NOIR — Membership Confirmed`, html });
}

/* ══ 7. Stock Alert ═══════════════════════════════════════════ */
export async function sendStockAlert({ to, productName, productUrl }) {
    const html = base(`
        <div class="tag">Restock Alert</div>
        <h1>Artistic Return.</h1>
        <p>The <strong>${productName}</strong> has returned to the archive. As a requested alert, we are notifying you immediately before the public release.</p>
        <a href="${productUrl}" class="btn">Acquire Now</a>
        <hr class="divider"/>
        <p style="font-size:12px">High-demand pieces typically exhaust stock within hours of liberation. We advise immediate action.</p>
    `);

    return resend.emails.send({ from: FROM, to, subject: `${productName} is Back in Stock`, html });
}

/* ══ 8. Campaign Template ═══════════════════════════════════════ */
export async function sendCampaignEmail({ to, subject, title, body, ctaLabel, ctaUrl, imageUrl }) {
    const html = base(`
        <div class="tag">Campaign Notification</div>
        ${imageUrl ? `<img src="${imageUrl}" style="width:100%; border-radius:8px; margin-bottom:24px;" alt="Campaign Visual" />` : ""}
        <h1>${title}</h1>
        <p>${body}</p>
        ${ctaUrl ? `<a href="${ctaUrl}" class="btn">${ctaLabel || "Discover"}</a>` : ""}
        <hr class="divider"/>
        <p style="font-size:12px">This is an exclusive communication for Maison NOIR patrons. To update your preferences, visit your account settings.</p>
    `);

    return resend.emails.send({ from: FROM, to, subject, html });
}
