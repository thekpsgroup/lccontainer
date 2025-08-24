import type { APIRoute } from "astro";
import { Resend } from "resend";
import { leadSchema } from "../../lib/leadSchema";

const resendKey = import.meta.env.RESEND_API_KEY;
const resend = resendKey ? new Resend(resendKey) : null;

// naive in-memory throttle (works on single serverless instance)
const recentIps = new Map<string, number>();
const THROTTLE_MS = 10_000;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  try {
    // Throttle (best-effort)
    const ip = clientAddress ?? "unknown";
    const last = recentIps.get(ip) ?? 0;
    const now = Date.now();
    if (now - last < THROTTLE_MS) {
      return new Response(JSON.stringify({ ok:false, error:"Too many requests. Try again shortly." }), { status: 429 });
    }
    recentIps.set(ip, now);
    // Remove this IP after the throttle window to avoid unbounded growth
    setTimeout(() => recentIps.delete(ip), THROTTLE_MS);

    const raw = await request.json();
    const parsed = leadSchema.safeParse(raw);
    if (!parsed.success) {
      return new Response(JSON.stringify({ ok:false, error:"Invalid input", issues: parsed.error.flatten() }), { status: 400 });
    }
    const data = parsed.data;

    // Anti-bot: honeypot + min-fill time (>= 3s)
    if (data.website && data.website.length > 0) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 }); // pretend success
    }
    const started = Number(data.startedAt ?? 0);
    if (started && Date.now() - started < 3000) {
      return new Response(JSON.stringify({ ok: true }), { status: 200 }); // pretend success
    }

    const html = `
      <h2>New LC Container Quote Request</h2>
      <p><b>Name:</b> ${escapeHtml(data.name)}</p>
      <p><b>Email:</b> ${escapeHtml(data.email)}</p>
      <p><b>Phone:</b> ${escapeHtml(data.phone)}</p>
      <p><b>Interest:</b> ${escapeHtml(data.interest)}</p>
      <p><b>Delivery ZIP:</b> ${escapeHtml(data.zip)}</p>
      ${data.notes ? `<p><b>Notes:</b> ${escapeHtml(data.notes)}</p>` : ""}
      <p style="color:#888">IP: ${ip}</p>
    `;

    if (resend) {
      await resend.emails.send({
        from: "LC Container <leads@lccontainer.com>",
        to: ["info@lccontainer.com"],
        subject: "New Quote Request",
        html
      });
    } else {
      if (import.meta.env.DEV) {
        console.log("Lead (no RESEND_API_KEY set)", { ...data, ip });
      }
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ ok:false, error: e?.message ?? "Server error" }), { status: 500 });
  }
};

// Minimal HTML escaping
function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[m]!));
}
