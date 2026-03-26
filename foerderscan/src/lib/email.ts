import { Resend } from "resend";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY ?? "placeholder");
}

const FROM = "FörderScan <noreply@foerderscan.de>";
const BASE_URL = process.env.NEXTAUTH_URL ?? "https://foerderscan-seven.vercel.app";

export async function sendVerificationEmail(email: string, token: string, name?: string) {
  const url = `${BASE_URL}/api/auth/verify-email?token=${token}`;

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "E-Mail-Adresse bestätigen – FörderScan",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #fff;">
        <div style="margin-bottom: 24px;">
          <span style="background: #2E86C1; color: white; font-weight: 700; font-size: 18px; padding: 6px 12px; border-radius: 8px;">FörderScan</span>
        </div>
        <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 8px;">Willkommen${name ? `, ${name}` : ""}!</h1>
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
          Bitte bestätige deine E-Mail-Adresse, um FörderScan vollständig nutzen zu können.
        </p>
        <a href="${url}" style="display: inline-block; background: #1B4F72; color: white; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 10px; text-decoration: none;">
          E-Mail bestätigen
        </a>
        <p style="color: #94a3b8; font-size: 12px; margin: 24px 0 0; line-height: 1.5;">
          Dieser Link ist 24 Stunden gültig. Falls du kein Konto erstellt hast, kannst du diese E-Mail ignorieren.
        </p>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #cbd5e1; font-size: 11px; margin: 0;">FörderScan · <a href="https://foerderscan.de/impressum" style="color: #94a3b8;">Impressum</a> · <a href="https://foerderscan.de/datenschutz" style="color: #94a3b8;">Datenschutz</a></p>
      </div>
    `,
  });
}

export async function sendContactEmail(data: {
  name: string;
  email: string;
  company?: string;
  message: string;
  type: string;
}) {
  const typeLabels: Record<string, string> = {
    demo: "Demo-Termin",
    info: "Allgemeine Informationen",
    feedback: "Feedback",
    enterprise: "Enterprise-Anfrage",
  };
  const typeLabel = typeLabels[data.type] ?? data.type;

  await getResend().emails.send({
    from: FROM,
    to: "info@foerderscan.de",
    replyTo: data.email,
    subject: `Kontaktanfrage: ${typeLabel} – ${data.name}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #fff;">
        <div style="margin-bottom: 24px;">
          <span style="background: #2E86C1; color: white; font-weight: 700; font-size: 18px; padding: 6px 12px; border-radius: 8px;">FörderScan</span>
        </div>
        <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 16px;">Neue Kontaktanfrage</h1>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr><td style="padding: 6px 0; color: #64748b; width: 120px;">Typ</td><td style="padding: 6px 0; color: #0f172a; font-weight: 600;">${typeLabel}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">Name</td><td style="padding: 6px 0; color: #0f172a;">${data.name}</td></tr>
          <tr><td style="padding: 6px 0; color: #64748b;">E-Mail</td><td style="padding: 6px 0; color: #0f172a;"><a href="mailto:${data.email}" style="color: #2E86C1;">${data.email}</a></td></tr>
          ${data.company ? `<tr><td style="padding: 6px 0; color: #64748b;">Unternehmen</td><td style="padding: 6px 0; color: #0f172a;">${data.company}</td></tr>` : ""}
        </table>
        <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 10px; border: 1px solid #e2e8f0;">
          <p style="margin: 0; font-size: 14px; color: #334155; line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #cbd5e1; font-size: 11px; margin: 0;">FörderScan · Automatische Benachrichtigung</p>
      </div>
    `,
  });
}

export async function sendProgrammAuslaufendEmail(
  to: string,
  userName: string | null,
  programmes: { name: string; gueltigBis: Date | null }[]
) {
  const listItems = programmes
    .map(
      (p) =>
        `<li style="padding: 4px 0; font-size: 14px; color: #334155;">${p.name}${p.gueltigBis ? ` <span style="color: #d97706;">(bis ${new Date(p.gueltigBis).toLocaleDateString("de-DE")})</span>` : ""}</li>`
    )
    .join("");

  await getResend().emails.send({
    from: FROM,
    to,
    subject: `${programmes.length} Förderprogramm${programmes.length > 1 ? "e laufen" : " läuft"} bald aus – FörderScan`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #fff;">
        <div style="margin-bottom: 24px;">
          <span style="background: #2E86C1; color: white; font-weight: 700; font-size: 18px; padding: 6px 12px; border-radius: 8px;">FörderScan</span>
        </div>
        <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 8px;">Förderfristen im Blick behalten</h1>
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 16px;">
          Hallo${userName ? ` ${userName}` : ""},<br/>
          folgende Förderprogramme in Ihren Projekten laufen in den nächsten 30 Tagen aus:
        </p>
        <ul style="padding: 12px 16px; background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; margin: 0 0 24px; list-style: none;">
          ${listItems}
        </ul>
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
          Stellen Sie Ihren Antrag rechtzeitig, um die Förderung nicht zu verpassen.
        </p>
        <a href="${BASE_URL}/dashboard/projekte" style="display: inline-block; background: #1B4F72; color: white; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 10px; text-decoration: none;">
          Projekte öffnen
        </a>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #cbd5e1; font-size: 11px; margin: 0;">FörderScan · <a href="https://foerderscan.de/impressum" style="color: #94a3b8;">Impressum</a> · <a href="https://foerderscan.de/datenschutz" style="color: #94a3b8;">Datenschutz</a></p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(email: string, name?: string) {
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Dein FörderScan-Konto ist aktiv",
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; background: #fff;">
        <div style="margin-bottom: 24px;">
          <span style="background: #2E86C1; color: white; font-weight: 700; font-size: 18px; padding: 6px 12px; border-radius: 8px;">FörderScan</span>
        </div>
        <h1 style="font-size: 22px; font-weight: 800; color: #0f172a; margin: 0 0 8px;">Konto bestätigt${name ? ` – ${name}` : ""}!</h1>
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
          Dein FörderScan-Konto ist jetzt vollständig eingerichtet. Du kannst alle Förderprogramme recherchieren, Projekte anlegen und Förderungen zuordnen.
        </p>
        <a href="${BASE_URL}/dashboard" style="display: inline-block; background: #1B4F72; color: white; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 10px; text-decoration: none;">
          Zum Dashboard
        </a>
        <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
        <p style="color: #cbd5e1; font-size: 11px; margin: 0;">FörderScan · <a href="https://foerderscan.de/impressum" style="color: #94a3b8;">Impressum</a> · <a href="https://foerderscan.de/datenschutz" style="color: #94a3b8;">Datenschutz</a></p>
      </div>
    `,
  });
}
