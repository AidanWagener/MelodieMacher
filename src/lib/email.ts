// Email utility functions and templates
// In production, this would use Resend or another email provider

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail(options: EmailOptions) {
  // Placeholder for email sending
  // In production, integrate with Resend:
  //
  // import { Resend } from 'resend';
  // const resend = new Resend(process.env.RESEND_API_KEY);
  //
  // return await resend.emails.send({
  //   from: 'MelodieMacher <hallo@melodiemacher.de>',
  //   to: options.to,
  //   subject: options.subject,
  //   html: options.html,
  // });

  console.log('Email would be sent:', options);
  return { success: true };
}

// Email Templates

interface OrderConfirmationData {
  customerName: string;
  orderId: string;
  recipientName: string;
  packageName: string;
  deliveryTime: string;
  total: number;
}

export function orderConfirmationTemplate(data: OrderConfirmationData): string {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bestellbestaetigung - MelodieMacher</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A5F 0%, #2d4a6f 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">MelodieMacher</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <h2 style="margin: 0 0 16px; color: #1E3A5F; font-size: 24px;">Deine Bestellung ist da!</h2>

              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Hallo ${data.customerName},
              </p>

              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                WOW - du hast gerade das beste Geschenk ueberhaupt bestellt! Wir freuen uns riesig, dass du dich fuer MelodieMacher entschieden hast.
              </p>

              <!-- Order Details Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 16px; color: #1E3A5F; font-size: 16px; font-weight: 600;">Deine Bestellung</h3>

                    <table role="presentation" style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Bestellnummer:</td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right; font-family: monospace;">${data.orderId}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Paket:</td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right;">${data.packageName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Song fuer:</td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right;">${data.recipientName}</td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Lieferung bis:</td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; text-align: right;">${data.deliveryTime}</td>
                      </tr>
                      <tr>
                        <td colspan="2" style="border-top: 1px solid #d1d5db; padding-top: 12px; margin-top: 8px;"></td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">Gesamt:</td>
                        <td style="padding: 8px 0; color: #1f2937; font-size: 16px; font-weight: 600; text-align: right;">${data.total} Euro</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- What's Next -->
              <h3 style="margin: 0 0 16px; color: #1E3A5F; font-size: 18px;">Was passiert jetzt?</h3>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 0; vertical-align: top; width: 40px;">
                    <div style="width: 32px; height: 32px; background-color: #D4A843; border-radius: 50%; text-align: center; line-height: 32px; color: #1E3A5F; font-weight: bold;">1</div>
                  </td>
                  <td style="padding: 12px 0; padding-left: 16px; color: #4b5563; font-size: 14px; line-height: 1.6;">
                    <strong style="color: #1f2937;">Wir lesen deine Geschichte</strong><br>
                    Unser Team liest jetzt aufmerksam, was du uns erzaehlt hast.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; vertical-align: top;">
                    <div style="width: 32px; height: 32px; background-color: #D4A843; border-radius: 50%; text-align: center; line-height: 32px; color: #1E3A5F; font-weight: bold;">2</div>
                  </td>
                  <td style="padding: 12px 0; padding-left: 16px; color: #4b5563; font-size: 14px; line-height: 1.6;">
                    <strong style="color: #1f2937;">Wir komponieren deinen Song</strong><br>
                    Deine Geschichte wird zu einem einzigartigen Musikstueck.
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; vertical-align: top;">
                    <div style="width: 32px; height: 32px; background-color: #D4A843; border-radius: 50%; text-align: center; line-height: 32px; color: #1E3A5F; font-weight: bold;">3</div>
                  </td>
                  <td style="padding: 12px 0; padding-left: 16px; color: #4b5563; font-size: 14px; line-height: 1.6;">
                    <strong style="color: #1f2937;">Du erhaeltst deinen Song per E-Mail</strong><br>
                    Sobald er fertig ist, bekommst du den Download-Link.
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Aufgeregt? Wir auch!
              </p>

              <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Musikalische Gruesse,<br>
                <strong style="color: #1E3A5F;">Dein MelodieMacher-Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f3f4f6; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">
                Fragen? Antworte einfach auf diese E-Mail.
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                 ${new Date().getFullYear()} MelodieMacher | <a href="https://melodiemacher.de" style="color: #1E3A5F;">melodiemacher.de</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

interface SongDeliveryData {
  customerName: string;
  recipientName: string;
  songTitle: string;
  downloadUrl: string;
  orderId: string;
}

export function songDeliveryTemplate(data: SongDeliveryData): string {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dein Song ist fertig! - MelodieMacher</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A5F 0%, #2d4a6f 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">MelodieMacher</h1>
            </td>
          </tr>

          <!-- Celebration Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #D4A843 0%, #e5b954 100%); padding: 24px; text-align: center;">
              <p style="margin: 0; font-size: 32px;">🎉</p>
              <h2 style="margin: 8px 0 0; color: #1E3A5F; font-size: 24px; font-weight: bold;">DEIN SONG IST FERTIG!</h2>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Hallo ${data.customerName},
              </p>

              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Der Moment ist da - dein personalisierter Song fuer <strong style="color: #1E3A5F;">${data.recipientName}</strong> ist fertig!
              </p>

              <!-- Song Card -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #1E3A5F 0%, #2d4a6f 100%); border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 32px; text-align: center;">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #D4A843 0%, #e5b954 100%); border-radius: 16px; margin: 0 auto 16px; line-height: 80px; font-size: 36px;"></div>
                    <h3 style="margin: 0 0 8px; color: #ffffff; font-size: 20px;">${data.songTitle}</h3>
                    <p style="margin: 0; color: #94a3b8; font-size: 14px;">Fuer ${data.recipientName}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${data.downloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #D4A843 0%, #e5b954 100%); color: #1E3A5F; font-size: 16px; font-weight: bold; text-decoration: none; padding: 16px 32px; border-radius: 8px;">
                      Song anhoeren & herunterladen
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6; text-align: center;">
                Wir hoffen, er bringt genau die Gaensehaut, die du dir gewuenscht hast.
              </p>

              <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px; text-align: center;">
                Kleiner Tipp: Bereite Taschentuecher vor, wenn du ihn ${data.recipientName} vorspielst.
              </p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

              <p style="margin: 0 0 16px; color: #4b5563; font-size: 14px; line-height: 1.6;">
                <strong>Noch einen besonderen Menschen im Kopf?</strong><br>
                Mit Code <span style="background-color: #f3f4f6; padding: 2px 8px; border-radius: 4px; font-family: monospace; color: #1E3A5F; font-weight: bold;">MELODIE20</span> bekommst du 20% auf deinen naechsten Song.
              </p>

              <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Von Herzen,<br>
                <strong style="color: #1E3A5F;">Dein MelodieMacher-Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f3f4f6; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">
                Bestellnummer: ${data.orderId}
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                 ${new Date().getFullYear()} MelodieMacher | <a href="https://melodiemacher.de" style="color: #1E3A5F;">melodiemacher.de</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

interface FeedbackRequestData {
  customerName: string;
  recipientName: string;
  reviewUrl: string;
}

export function feedbackRequestTemplate(data: FeedbackRequestData): string {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wie hat es gefallen? - MelodieMacher</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A5F 0%, #2d4a6f 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">MelodieMacher</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <p style="margin: 0; font-size: 48px; text-align: center;">💬</p>

              <h2 style="margin: 16px 0 24px; color: #1E3A5F; font-size: 24px; text-align: center;">
                Wie hat es ${data.recipientName} gefallen?
              </h2>

              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Hallo ${data.customerName},
              </p>

              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Wir hoffen, der Song fuer ${data.recipientName} hat fuer einen unvergesslichen Moment gesorgt! Gab es Traenen? Gaensehaut? Wir wuerden uns so freuen, davon zu hoeren.
              </p>

              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Dein Feedback hilft anderen, die auch ein besonderes Geschenk suchen. Eine kurze Bewertung wuerde uns sehr viel bedeuten:
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${data.reviewUrl}" style="display: inline-block; background-color: #1E3A5F; color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 16px 32px; border-radius: 8px;">
                      Bewertung schreiben
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px; color: #6b7280; font-size: 14px; text-align: center;">
                Dauert nur 2 Minuten - und macht uns unglaublich gluecklich!
              </p>

              <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Danke von Herzen,<br>
                <strong style="color: #1E3A5F;">Dein MelodieMacher-Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f3f4f6; padding: 24px 32px; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                 ${new Date().getFullYear()} MelodieMacher | <a href="https://melodiemacher.de" style="color: #1E3A5F;">melodiemacher.de</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ============================================
// REFERRAL EMAIL TEMPLATE
// ============================================

interface ReferralInviteData {
  senderName: string;
  recipientName: string;
  referralCode: string;
  referralLink: string;
  discountAmount: number;
}

export function referralInviteTemplate(data: ReferralInviteData): string {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ein Geschenk von ${data.senderName} - MelodieMacher</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #D4A843 0%, #e5b954 100%); padding: 32px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 48px;">🎁</p>
              <h1 style="margin: 0; color: #1E3A5F; font-size: 24px; font-weight: bold;">${data.senderName} schenkt dir ${data.discountAmount} Euro!</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Hallo${data.recipientName ? ' ' + data.recipientName : ''},
              </p>

              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                ${data.senderName} moechte dir etwas Besonderes zeigen: <strong>MelodieMacher</strong> - personalisierte Songs fuer jeden besonderen Moment.
              </p>

              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Als kleines Willkommensgeschenk bekommst du <strong style="color: #D4A843;">${data.discountAmount} Euro Rabatt</strong> auf deinen ersten Song!
              </p>

              <!-- Code Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f3f4f6; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Dein Gutscheincode</p>
                    <p style="margin: 0; font-family: monospace; font-size: 28px; font-weight: bold; color: #1E3A5F; letter-spacing: 2px;">${data.referralCode}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${data.referralLink}" style="display: inline-block; background: linear-gradient(135deg, #1E3A5F 0%, #2d4a6f 100%); color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 16px 32px; border-radius: 8px;">
                      Jetzt Song erstellen & sparen
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 16px; color: #6b7280; font-size: 14px; text-align: center;">
                Der Rabatt wird automatisch an der Kasse abgezogen.
              </p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

              <p style="margin: 0 0 16px; color: #4b5563; font-size: 14px; line-height: 1.6;">
                <strong>Was ist MelodieMacher?</strong><br>
                Wir verwandeln deine Geschichten in einzigartige, personalisierte Songs. Das perfekte Geschenk fuer Hochzeiten, Geburtstage, Jahrestage und mehr!
              </p>

              <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Musikalische Gruesse,<br>
                <strong style="color: #1E3A5F;">Dein MelodieMacher-Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f3f4f6; padding: 24px 32px; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                 ${new Date().getFullYear()} MelodieMacher | <a href="https://melodiemacher.de" style="color: #1E3A5F;">melodiemacher.de</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ============================================
// OCCASION REMINDER EMAIL TEMPLATE
// ============================================

interface OccasionReminderData {
  customerName: string;
  recipientName: string;
  occasion: string;
  daysUntil: number;
  discountPercent: number;
  reorderLink: string;
}

export function occasionReminderTemplate(data: OccasionReminderData): string {
  const urgencyText = data.daysUntil === 1
    ? 'MORGEN'
    : data.daysUntil <= 7
      ? `in ${data.daysUntil} Tagen`
      : `in ${data.daysUntil} Tagen`;

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.recipientName}s ${data.occasion} naht! - MelodieMacher</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A5F 0%, #2d4a6f 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">MelodieMacher</h1>
            </td>
          </tr>

          <!-- Reminder Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #D4A843 0%, #e5b954 100%); padding: 24px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 32px;">📅</p>
              <h2 style="margin: 0; color: #1E3A5F; font-size: 20px; font-weight: bold;">
                ${data.recipientName}s ${data.occasion} ist ${urgencyText}!
              </h2>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Hallo ${data.customerName},
              </p>

              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Wir erinnern dich daran, dass <strong style="color: #1E3A5F;">${data.recipientName}s ${data.occasion}</strong> bald ansteht!
              </p>

              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Letztes Mal hat dein Song fuer Gaensehaut gesorgt. Wie waere es dieses Jahr mit einer neuen musikalischen Ueberraschung?
              </p>

              <!-- Discount Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px dashed #22c55e; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; color: #166534; font-size: 14px; font-weight: 600;">Exklusiv fuer Stammkunden</p>
                    <p style="margin: 0; font-size: 32px; font-weight: bold; color: #166534;">${data.discountPercent}% Rabatt</p>
                    <p style="margin: 8px 0 0; color: #15803d; font-size: 14px;">auf deinen naechsten Song</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${data.reorderLink}" style="display: inline-block; background: linear-gradient(135deg, #1E3A5F 0%, #2d4a6f 100%); color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 16px 32px; border-radius: 8px;">
                      Jetzt neuen Song bestellen
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px; color: #6b7280; font-size: 14px; text-align: center;">
                Express-Lieferung in 48 Stunden moeglich!
              </p>

              <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Musikalische Gruesse,<br>
                <strong style="color: #1E3A5F;">Dein MelodieMacher-Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f3f4f6; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 12px;">
                <a href="#" style="color: #6b7280; text-decoration: underline;">Erinnerung abbestellen</a>
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                 ${new Date().getFullYear()} MelodieMacher | <a href="https://melodiemacher.de" style="color: #1E3A5F;">melodiemacher.de</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ============================================
// LEAD MAGNET DELIVERY EMAIL TEMPLATE
// ============================================

interface LeadMagnetData {
  email: string;
  downloadLink: string;
}

export function leadMagnetDeliveryTemplate(data: LeadMagnetData): string {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Deine Song-Ideen sind da! - MelodieMacher</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A5F 0%, #2d4a6f 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">MelodieMacher</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <p style="margin: 0 0 16px; font-size: 48px; text-align: center;">✨</p>

              <h2 style="margin: 0 0 24px; color: #1E3A5F; font-size: 24px; text-align: center;">
                Deine 10 Song-Ideen sind da!
              </h2>

              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Hallo!
              </p>

              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Vielen Dank fuer dein Interesse an MelodieMacher! Hier ist dein kostenloses PDF mit <strong>10 kreativen Song-Ideen fuer besondere Anlaesse</strong>.
              </p>

              <!-- Download Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${data.downloadLink}" style="display: inline-block; background: linear-gradient(135deg, #D4A843 0%, #e5b954 100%); color: #1E3A5F; font-size: 16px; font-weight: bold; text-decoration: none; padding: 16px 32px; border-radius: 8px;">
                      PDF jetzt herunterladen
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                In diesem Guide findest du Inspiration fuer:
              </p>

              <ul style="margin: 0 0 24px; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 2;">
                <li>Romantische Hochzeits- und Verlobungssongs</li>
                <li>Emotionale Geburtstagsueber raschungen</li>
                <li>Herzliche Familien-Momente (Muttertag, Vatertag)</li>
                <li>Lustige Freundschafts-Hymnen</li>
                <li>Und vieles mehr!</li>
              </ul>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

              <p style="margin: 0 0 16px; color: #4b5563; font-size: 14px; line-height: 1.6;">
                <strong>Bereit, deinen eigenen Song zu erstellen?</strong><br>
                Mit Code <span style="background-color: #f3f4f6; padding: 2px 8px; border-radius: 4px; font-family: monospace; color: #1E3A5F; font-weight: bold;">WILLKOMMEN10</span> bekommst du 10% auf deine erste Bestellung.
              </p>

              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://melodiemacher.de/bestellen" style="display: inline-block; background-color: #1E3A5F; color: #ffffff; font-size: 14px; font-weight: bold; text-decoration: none; padding: 12px 24px; border-radius: 8px;">
                      Jetzt Song erstellen
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Viel Inspiration!<br>
                <strong style="color: #1E3A5F;">Dein MelodieMacher-Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f3f4f6; padding: 24px 32px; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                 ${new Date().getFullYear()} MelodieMacher | <a href="https://melodiemacher.de" style="color: #1E3A5F;">melodiemacher.de</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ============================================
// VIP WELCOME EMAIL TEMPLATE
// ============================================

interface VipWelcomeData {
  customerName: string;
  discountPercent: number;
}

export function vipWelcomeTemplate(data: VipWelcomeData): string {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Willkommen im VIP-Club! - MelodieMacher</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #D4A843 0%, #b8860b 100%); padding: 40px; text-align: center;">
              <p style="margin: 0 0 16px; font-size: 64px;">👑</p>
              <h1 style="margin: 0 0 8px; color: #1E3A5F; font-size: 28px; font-weight: bold;">Willkommen im VIP-Club!</h1>
              <p style="margin: 0; color: #1E3A5F; font-size: 16px; opacity: 0.8;">Du gehoerst jetzt zu unseren treuesten Kunden</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Hallo ${data.customerName},
              </p>

              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                WOW - du hast es geschafft! Als Dankeschoen fuer deine Treue bist du jetzt offiziell <strong style="color: #D4A843;">MelodieMacher VIP</strong>!
              </p>

              <!-- Benefits Box -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%); border: 2px solid #D4A843; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px;">
                    <h3 style="margin: 0 0 16px; color: #1E3A5F; font-size: 18px; font-weight: bold;">Deine VIP-Vorteile:</h3>
                    <ul style="margin: 0; padding-left: 20px; color: #4b5563; font-size: 14px; line-height: 2;">
                      <li><strong>${data.discountPercent}% Dauerrabatt</strong> auf alle Bestellungen</li>
                      <li>Exklusives VIP-Badge</li>
                      <li>Prioritaets-Support</li>
                      <li>Fruehzeitiger Zugang zu neuen Features</li>
                      <li>Exklusive Sonderaktionen nur fuer VIPs</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Dein VIP-Rabatt wird ab sofort automatisch bei jeder Bestellung abgezogen. Du musst nichts weiter tun - einfach bestellen und sparen!
              </p>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="https://melodiemacher.de/bestellen" style="display: inline-block; background: linear-gradient(135deg, #1E3A5F 0%, #2d4a6f 100%); color: #ffffff; font-size: 16px; font-weight: bold; text-decoration: none; padding: 16px 32px; border-radius: 8px;">
                      Jetzt mit VIP-Rabatt bestellen
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Danke, dass du zu unserer MelodieMacher-Familie gehoerst!<br>
                <strong style="color: #1E3A5F;">Dein MelodieMacher-Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f3f4f6; padding: 24px 32px; text-align: center;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                 ${new Date().getFullYear()} MelodieMacher | <a href="https://melodiemacher.de" style="color: #1E3A5F;">melodiemacher.de</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

// ============================================
// SONG DELIVERY WITH REFERRAL CODE
// ============================================

interface SongDeliveryWithReferralData extends SongDeliveryData {
  referralCode: string;
  referralLink: string;
  referralDiscountAmount: number;
}

export function songDeliveryWithReferralTemplate(data: SongDeliveryWithReferralData): string {
  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dein Song ist fertig! - MelodieMacher</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 100%; max-width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #1E3A5F 0%, #2d4a6f 100%); padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">MelodieMacher</h1>
            </td>
          </tr>

          <!-- Celebration Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #D4A843 0%, #e5b954 100%); padding: 24px; text-align: center;">
              <p style="margin: 0; font-size: 32px;">🎉</p>
              <h2 style="margin: 8px 0 0; color: #1E3A5F; font-size: 24px; font-weight: bold;">DEIN SONG IST FERTIG!</h2>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px 32px;">
              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Hallo ${data.customerName},
              </p>

              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Der Moment ist da - dein personalisierter Song fuer <strong style="color: #1E3A5F;">${data.recipientName}</strong> ist fertig!
              </p>

              <!-- Song Card -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #1E3A5F 0%, #2d4a6f 100%); border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 32px; text-align: center;">
                    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #D4A843 0%, #e5b954 100%); border-radius: 16px; margin: 0 auto 16px; line-height: 80px; font-size: 36px;">🎵</div>
                    <h3 style="margin: 0 0 8px; color: #ffffff; font-size: 20px;">${data.songTitle}</h3>
                    <p style="margin: 0; color: #94a3b8; font-size: 14px;">Fuer ${data.recipientName}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td align="center">
                    <a href="${data.downloadUrl}" style="display: inline-block; background: linear-gradient(135deg, #D4A843 0%, #e5b954 100%); color: #1E3A5F; font-size: 16px; font-weight: bold; text-decoration: none; padding: 16px 32px; border-radius: 8px;">
                      Song anhoeren & herunterladen
                    </a>
                  </td>
                </tr>
              </table>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;">

              <!-- Referral Section -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); border: 2px solid #22c55e; border-radius: 12px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 24px; text-align: center;">
                    <p style="margin: 0 0 8px; font-size: 24px;">🎁</p>
                    <h3 style="margin: 0 0 8px; color: #166534; font-size: 18px; font-weight: bold;">Teile die Freude!</h3>
                    <p style="margin: 0 0 16px; color: #15803d; font-size: 14px;">
                      Gib ${data.referralDiscountAmount} Euro, bekomme ${data.referralDiscountAmount} Euro
                    </p>
                    <p style="margin: 0 0 8px; color: #166534; font-size: 12px;">Dein Empfehlungscode:</p>
                    <p style="margin: 0 0 16px; font-family: monospace; font-size: 24px; font-weight: bold; color: #166534; letter-spacing: 2px;">${data.referralCode}</p>
                    <a href="${data.referralLink}" style="display: inline-block; background-color: #22c55e; color: #ffffff; font-size: 14px; font-weight: bold; text-decoration: none; padding: 10px 20px; border-radius: 6px;">
                      Link kopieren & teilen
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                Von Herzen,<br>
                <strong style="color: #1E3A5F;">Dein MelodieMacher-Team</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f3f4f6; padding: 24px 32px; text-align: center;">
              <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">
                Bestellnummer: ${data.orderId}
              </p>
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                 ${new Date().getFullYear()} MelodieMacher | <a href="https://melodiemacher.de" style="color: #1E3A5F;">melodiemacher.de</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
