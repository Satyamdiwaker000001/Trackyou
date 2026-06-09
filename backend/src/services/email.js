const nodemailer = require('nodemailer');

// ─────────────────────────────────────────────────────────────────────────────
// TRANSPORTER
// ─────────────────────────────────────────────────────────────────────────────
let transporter;
async function createTransporter() {
  if (transporter) return transporter;
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) throw new Error('SMTP credentials are missing from .env!');
  transporter = nodemailer.createTransport({
    host,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT == 465,
    auth: { user, pass },
  });
  return transporter;
}

// ─────────────────────────────────────────────────────────────────────────────
// SVG ICON HELPERS (inline Feather / Fi icons — no emoji)
// ─────────────────────────────────────────────────────────────────────────────
const icon = {
  zap: (color = '#ffffff', size = 24) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,

  checkCircle: (color = '#10b981', size = 24) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,

  folder: (color = '#10b981', size = 24) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`,

  barChart: (color = '#f59e0b', size = 24) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,

  clock: (color = '#94a3b8', size = 20) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,

  calendar: (color = '#94a3b8', size = 20) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,

  alertTriangle: (color = '#f59e0b', size = 24) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,

  bell: (color = '#6366f1', size = 24) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,

  arrowRight: (color = '#ffffff', size = 18) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`,

  info: (color = '#6366f1', size = 18) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,

  shield: (color = '#10b981', size = 32) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,

  mail: (color = '#6366f1', size = 20) =>
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
};

// ─────────────────────────────────────────────────────────────────────────────
// SHARED WRAPPER
// ─────────────────────────────────────────────────────────────────────────────
function buildEmailWrapper(bodyHtml, accentColor = '#6366f1') {
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
  <title>TrackYourDay</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background-color: #060b14; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
    table { border-collapse: collapse; }
    img { display: block; max-width: 100%; }
    a { text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .ec { width: 100% !important; }
      .hp { padding: 36px 24px !important; }
      .bp { padding: 28px 24px !important; }
      .fc { display: block !important; width: 100% !important; margin-bottom: 12px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#060b14;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#060b14;">
  <tr>
    <td align="center" style="padding:40px 16px 48px;">

      <!-- Card -->
      <table class="ec" role="presentation" width="600" cellpadding="0" cellspacing="0"
        style="max-width:600px;background:#0f1623;border-radius:20px;overflow:hidden;border:1px solid rgba(99,102,241,0.18);box-shadow:0 32px 80px rgba(0,0,0,0.6);">

        ${bodyHtml}

        <!-- Footer -->
        <tr>
          <td style="padding:28px 48px 32px;background:#080d17;border-top:1px solid rgba(255,255,255,0.04);">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td align="center" style="padding-bottom:16px;">
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);border-radius:10px;padding:6px 14px;vertical-align:middle;">
                        <span style="display:inline-block;vertical-align:middle;margin-right:6px;">${icon.zap('#ffffff', 14)}</span>
                        <span style="font-size:13px;font-weight:800;color:#ffffff;letter-spacing:-0.02em;vertical-align:middle;">TrackYourDay</span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <tr>
                <td align="center" style="padding-bottom:6px;">
                  <p style="font-size:12px;color:#374151;line-height:1.6;">You received this email because you have an account with TrackYourDay.</p>
                </td>
              </tr>
              <tr>
                <td align="center">
                  <p style="font-size:11px;color:#1f2937;">
                    &copy; ${year} TrackYourDay &nbsp;&bull;&nbsp;
                    <a href="mailto:trackyourday.support@gmail.com" style="color:#4f46e5;">trackyourday.support@gmail.com</a>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

      </table>
      <!-- /Card -->

    </td>
  </tr>
</table>

</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. WELCOME EMAIL
// ─────────────────────────────────────────────────────────────────────────────
const sendWelcomeEmail = async (toEmail, name) => {
  const t = await createTransporter();
  const fromEmail = process.env.EMAIL_FROM || '"TrackYourDay" <trackyourday.support@gmail.com>';

  const bodyHtml = `
    <!-- HEADER -->
    <tr>
      <td class="hp" style="padding:52px 48px 44px;background:linear-gradient(160deg,#0d0f2b 0%,#12103a 40%,#0a0f1e 100%);text-align:center;border-bottom:1px solid rgba(99,102,241,0.12);">

        <!-- Brand Mark -->
        <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin-bottom:28px;">
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#7c3aed);border-radius:16px;width:60px;height:60px;text-align:center;vertical-align:middle;">
              ${icon.zap('#ffffff', 28)}
            </td>
          </tr>
        </table>

        <!-- Eyebrow label -->
        <p style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#6366f1;margin:0 0 14px 0;">Account Activated</p>

        <!-- Heading -->
        <h1 style="font-size:34px;font-weight:800;color:#f8fafc;margin:0 0 14px 0;line-height:1.15;letter-spacing:-0.04em;">
          Welcome, ${name}.
        </h1>
        <p style="font-size:16px;color:#94a3b8;margin:0;line-height:1.65;font-weight:400;max-width:380px;margin-left:auto;margin-right:auto;">
          Your TrackYourDay workspace is ready. Start building better productivity habits today.
        </p>
      </td>
    </tr>

    <!-- ACCENT LINE -->
    <tr>
      <td style="height:3px;background:linear-gradient(90deg,#4f46e5,#7c3aed,#6366f1);"></td>
    </tr>

    <!-- BODY -->
    <tr>
      <td class="bp" style="padding:40px 48px;background:#0f1623;">

        <!-- Intro text -->
        <p style="font-size:15px;color:#cbd5e1;line-height:1.85;margin:0 0 32px 0;">
          We are delighted to have you on board. TrackYourDay gives you everything you need to organise your work, meet your deadlines, and measure your progress over time.
        </p>

        <!-- Feature Cards -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:36px;">
          <tr>
            <!-- Tasks -->
            <td class="fc" width="32%" style="padding-right:8px;vertical-align:top;">
              <div style="background:#131d2e;border:1px solid rgba(99,102,241,0.18);border-top:3px solid #6366f1;border-radius:12px;padding:20px 16px 18px;">
                <div style="margin-bottom:12px;">${icon.checkCircle('#6366f1', 22)}</div>
                <p style="font-size:13px;font-weight:700;color:#e2e8f0;margin:0 0 6px 0;letter-spacing:-0.01em;">Task Management</p>
                <p style="font-size:12px;color:#64748b;margin:0;line-height:1.6;">Create, prioritise and complete tasks with deadline tracking.</p>
              </div>
            </td>
            <!-- Projects -->
            <td class="fc" width="36%" style="padding:0 4px;vertical-align:top;">
              <div style="background:#131d2e;border:1px solid rgba(16,185,129,0.18);border-top:3px solid #10b981;border-radius:12px;padding:20px 16px 18px;">
                <div style="margin-bottom:12px;">${icon.folder('#10b981', 22)}</div>
                <p style="font-size:13px;font-weight:700;color:#e2e8f0;margin:0 0 6px 0;letter-spacing:-0.01em;">Projects</p>
                <p style="font-size:12px;color:#64748b;margin:0;line-height:1.6;">Group related tasks under projects for structured delivery.</p>
              </div>
            </td>
            <!-- Analytics -->
            <td class="fc" width="32%" style="padding-left:8px;vertical-align:top;">
              <div style="background:#131d2e;border:1px solid rgba(245,158,11,0.18);border-top:3px solid #f59e0b;border-radius:12px;padding:20px 16px 18px;">
                <div style="margin-bottom:12px;">${icon.barChart('#f59e0b', 22)}</div>
                <p style="font-size:13px;font-weight:700;color:#e2e8f0;margin:0 0 6px 0;letter-spacing:-0.01em;">Analytics</p>
                <p style="font-size:12px;color:#64748b;margin:0;line-height:1.6;">Track completion velocity and spot productivity patterns.</p>
              </div>
            </td>
          </tr>
        </table>

        <!-- CTA -->
        <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin-bottom:36px;">
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#7c3aed);border-radius:12px;box-shadow:0 8px 28px rgba(99,102,241,0.3);">
              <a href="http://localhost:5173/dashboard" style="display:inline-block;padding:16px 40px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:-0.01em;">
                <span style="display:inline-block;vertical-align:middle;margin-right:8px;">Open Dashboard</span>
                <span style="display:inline-block;vertical-align:middle;">${icon.arrowRight('#ffffff', 16)}</span>
              </a>
            </td>
          </tr>
        </table>

        <!-- Info box -->
        <div style="background:#0a1220;border:1px solid rgba(99,102,241,0.15);border-left:4px solid #6366f1;border-radius:10px;padding:16px 20px;margin-bottom:32px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="24" style="vertical-align:top;padding-right:12px;padding-top:2px;">${icon.info('#6366f1', 16)}</td>
              <td style="vertical-align:top;">
                <p style="font-size:13px;font-weight:600;color:#818cf8;margin:0 0 3px 0;">Tip: Enable Email Notifications</p>
                <p style="font-size:12px;color:#64748b;margin:0;line-height:1.6;">Go to <strong style="color:#94a3b8;">Settings &rarr; Notifications</strong> to receive automated deadline reminders before tasks are due.</p>
              </td>
            </tr>
          </table>
        </div>

        <!-- Signature -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="border-top:1px solid rgba(255,255,255,0.05);padding-top:24px;">
              <p style="font-size:14px;color:#64748b;margin:0 0 4px 0;">Kind regards,</p>
              <p style="font-size:14px;font-weight:700;color:#cbd5e1;margin:0;">The TrackYourDay Team</p>
              <a href="mailto:trackyourday.support@gmail.com" style="font-size:12px;color:#4f46e5;">trackyourday.support@gmail.com</a>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  `;

  const info = await t.sendMail({
    from: fromEmail,
    to: toEmail,
    subject: `Welcome to TrackYourDay, ${name} — Your workspace is ready`,
    html: buildEmailWrapper(bodyHtml, '#6366f1'),
  });
  console.log('Welcome email sent: %s', info.messageId);
  return info;
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. DEADLINE REMINDER EMAIL
// ─────────────────────────────────────────────────────────────────────────────
const sendReminderEmail = async (toEmail, userName, task, hoursLeft, overdueMin = null) => {
  const t = await createTransporter();
  const fromEmail = process.env.EMAIL_FROM || '"TrackYourDay" <trackyourday.support@gmail.com>';

  const isOverdue  = overdueMin !== null; // called from overdue track
  const isUrgent   = !isOverdue && hoursLeft <= 4;
  const isDueSoon  = !isOverdue && hoursLeft <= 12;

  const urgencyColor = isOverdue ? '#ef4444' : isUrgent ? '#ef4444' : isDueSoon ? '#f59e0b' : '#6366f1';
  const urgencyLabel = isOverdue
    ? `OVERDUE — ${overdueMin} min${overdueMin !== 1 ? 's' : ''} ago`
    : isUrgent ? 'Urgent — Action Required' : isDueSoon ? 'Due Soon' : 'Deadline Reminder';
  const urgencyIcon  = isOverdue
    ? icon.alertTriangle('#ef4444', 20)
    : isUrgent ? icon.alertTriangle('#ef4444', 20) : isDueSoon ? icon.alertTriangle('#f59e0b', 20) : icon.bell('#6366f1', 20);

  const subjectPrefix = isOverdue ? '[OVERDUE]' : isUrgent ? '[URGENT]' : isDueSoon ? '[DUE SOON]' : '[REMINDER]';
  const heroHeading   = isOverdue ? 'This task is overdue' : 'You have a task due soon';
  const deadlineStr   = new Date(task.deadline).toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'short' });

  const descBlock = task.description
    ? `<p style="font-size:12px;font-weight:600;color:#475569;letter-spacing:0.08em;text-transform:uppercase;margin:0 0 6px 0;">Description</p>
       <p style="font-size:14px;color:#94a3b8;margin:0 0 20px 0;line-height:1.75;border-left:3px solid rgba(255,255,255,0.06);padding-left:12px;">${task.description}</p>`
    : '';

  // Left meta box changes depending on overdue vs upcoming
  const leftMetaBox = isOverdue
    ? `<div style="background:#060d18;border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:14px 16px;">
         <table role="presentation" cellpadding="0" cellspacing="0"><tr>
           <td style="padding-right:8px;vertical-align:middle;">${icon.alertTriangle('#ef4444', 18)}</td>
           <td style="vertical-align:middle;">
             <p style="font-size:10px;font-weight:700;color:#475569;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 3px 0;">Overdue By</p>
             <p style="font-size:20px;font-weight:800;color:#ef4444;margin:0;line-height:1;">${overdueMin}<span style="font-size:12px;font-weight:500;color:#64748b;margin-left:3px;">min</span></p>
           </td>
         </tr></table>
       </div>`
    : `<div style="background:#060d18;border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:14px 16px;">
         <table role="presentation" cellpadding="0" cellspacing="0"><tr>
           <td style="padding-right:8px;vertical-align:middle;">${icon.clock(urgencyColor, 18)}</td>
           <td style="vertical-align:middle;">
             <p style="font-size:10px;font-weight:700;color:#475569;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 3px 0;">Time Remaining</p>
             <p style="font-size:20px;font-weight:800;color:${urgencyColor};margin:0;line-height:1;">${hoursLeft}<span style="font-size:12px;font-weight:500;color:#64748b;margin-left:3px;">hrs</span></p>
           </td>
         </tr></table>
       </div>`;

  const disclaimerText = isOverdue
    ? `You are receiving this overdue alert every 10 minutes until the task is marked complete. Open your dashboard to resolve it.`
    : `This pre-deadline notification was sent once. Future overdue reminders will follow every 10 minutes if the task remains incomplete.`;

  const bodyHtml = `
    <!-- HEADER -->
    <tr>
      <td class="hp" style="padding:44px 48px 36px;background:linear-gradient(160deg,#100a0a 0%,#150c1c 50%,#0a0f1e 100%);text-align:center;border-bottom:1px solid rgba(255,255,255,0.04);">

        <!-- Brand Mark -->
        <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin-bottom:24px;">
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#7c3aed);border-radius:16px;width:56px;height:56px;text-align:center;vertical-align:middle;">
              ${icon.zap('#ffffff', 26)}
            </td>
          </tr>
        </table>

        <!-- Urgency pill -->
        <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin-bottom:18px;">
          <tr>
            <td style="background:${urgencyColor}1a;border:1px solid ${urgencyColor}44;border-radius:9999px;padding:6px 16px;">
              <span style="display:inline-block;vertical-align:middle;margin-right:6px;">${urgencyIcon}</span>
              <span style="font-size:12px;font-weight:800;color:${urgencyColor};letter-spacing:0.1em;text-transform:uppercase;vertical-align:middle;">${urgencyLabel}</span>
            </td>
          </tr>
        </table>

        <h1 style="font-size:28px;font-weight:800;color:#f8fafc;margin:0 0 10px 0;line-height:1.2;letter-spacing:-0.03em;">
          ${heroHeading}
        </h1>
        <p style="font-size:14px;color:#64748b;margin:0;">
          Hi ${userName} &mdash; please review the task details below.
        </p>

      </td>
    </tr>

    <!-- ACCENT LINE -->
    <tr>
      <td style="height:3px;background:linear-gradient(90deg,${urgencyColor},#7c3aed);"></td>
    </tr>

    <!-- BODY -->
    <tr>
      <td class="bp" style="padding:36px 48px 40px;background:#0f1623;">

        <!-- Task Card -->
        <div style="background:#0a1220;border:1px solid rgba(255,255,255,0.07);border-left:5px solid ${urgencyColor};border-radius:12px;padding:24px 24px 20px;margin-bottom:28px;">
          <p style="font-size:11px;font-weight:700;color:#475569;letter-spacing:0.12em;text-transform:uppercase;margin:0 0 8px 0;">Task</p>
          <h2 style="font-size:21px;font-weight:800;color:#f1f5f9;margin:0 0 18px 0;letter-spacing:-0.025em;line-height:1.3;">${task.title}</h2>
          ${descBlock}

          <!-- Meta row -->
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <!-- Left meta box (Time Remaining or Overdue By) -->
              <td width="50%" style="vertical-align:top;padding-right:8px;">
                ${leftMetaBox}
              </td>
              <!-- Deadline -->
              <td width="50%" style="vertical-align:top;padding-left:8px;">
                <div style="background:#060d18;border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:14px 16px;">
                  <table role="presentation" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding-right:8px;vertical-align:middle;">${icon.calendar('#64748b', 18)}</td>
                      <td style="vertical-align:middle;">
                        <p style="font-size:10px;font-weight:700;color:#475569;letter-spacing:0.1em;text-transform:uppercase;margin:0 0 3px 0;">Deadline</p>
                        <p style="font-size:12px;font-weight:600;color:#cbd5e1;margin:0;line-height:1.4;">${deadlineStr}</p>
                      </td>
                    </tr>
                  </table>
                </div>
              </td>
            </tr>
          </table>
        </div>

        <!-- CTA -->
        <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin-bottom:28px;">
          <tr>
            <td style="background:linear-gradient(135deg,${urgencyColor},#7c3aed);border-radius:12px;box-shadow:0 8px 24px ${urgencyColor}33;">
              <a href="http://localhost:5173/dashboard" style="display:inline-block;padding:15px 36px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:-0.01em;">
                <span style="display:inline-block;vertical-align:middle;margin-right:8px;">${icon.checkCircle('#ffffff', 17)}</span>
                <span style="display:inline-block;vertical-align:middle;">Mark as Complete</span>
              </a>
            </td>
          </tr>
        </table>

        <!-- Disclaimer -->
        <div style="background:#060d18;border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:14px 18px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="20" style="vertical-align:top;padding-right:10px;padding-top:1px;">${icon.info('#475569', 14)}</td>
              <td><p style="font-size:12px;color:#475569;margin:0;line-height:1.65;">${disclaimerText}</p></td>
            </tr>
          </table>
        </div>

        <!-- Signature -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin-top:28px;">
          <tr>
            <td style="border-top:1px solid rgba(255,255,255,0.05);padding-top:22px;">
              <p style="font-size:14px;color:#64748b;margin:0 0 3px 0;">Best regards,</p>
              <p style="font-size:14px;font-weight:700;color:#cbd5e1;margin:0;">TrackYourDay Notifications</p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  `;

  const info = await t.sendMail({
    from: fromEmail,
    to: toEmail,
    subject: isOverdue
      ? `${subjectPrefix} "${task.title}" — ${overdueMin} minute${overdueMin !== 1 ? 's' : ''} overdue!`
      : `${subjectPrefix} "${task.title}" is due in ${hoursLeft} hour${hoursLeft !== 1 ? 's' : ''}`,
    html: buildEmailWrapper(bodyHtml, urgencyColor),
    text: `Hi ${userName},\n\n${isOverdue ? `OVERDUE ALERT: Your task "${task.title}" is ${overdueMin} minutes overdue!` : `Reminder: "${task.title}" is due in ${hoursLeft} hours.`}\n\nDeadline: ${deadlineStr}\n${task.description ? 'Description: ' + task.description + '\n' : ''}\nOpen dashboard: http://localhost:5173/dashboard\n\n-- TrackYourDay Notifications`,
  });
  console.log(`Reminder email sent for task "${task.title}" to ${toEmail}: ${info.messageId}`);
  return info;
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. TEST EMAIL
// ─────────────────────────────────────────────────────────────────────────────
const sendTestEmail = async (toEmail) => {
  const t = await createTransporter();
  const fromEmail = process.env.EMAIL_FROM || '"TrackYourDay" <trackyourday.support@gmail.com>';
  const sentAt = new Date().toLocaleString('en-IN', { dateStyle: 'full', timeStyle: 'medium' });

  const bodyHtml = `
    <tr>
      <td class="hp" style="padding:48px 48px 40px;background:linear-gradient(160deg,#04110e 0%,#071a14 50%,#0a0f1e 100%);text-align:center;border-bottom:1px solid rgba(16,185,129,0.1);">
        <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin-bottom:24px;">
          <tr>
            <td style="background:linear-gradient(135deg,#059669,#10b981);border-radius:50%;width:64px;height:64px;text-align:center;vertical-align:middle;">
              ${icon.shield('#ffffff', 30)}
            </td>
          </tr>
        </table>
        <p style="font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#10b981;margin:0 0 12px 0;">SMTP Configuration</p>
        <h1 style="font-size:28px;font-weight:800;color:#f8fafc;margin:0 0 10px 0;letter-spacing:-0.03em;">Connection Verified</h1>
        <p style="font-size:14px;color:#64748b;margin:0;">Your TrackYourDay email integration is active and ready.</p>
      </td>
    </tr>
    <tr><td style="height:3px;background:linear-gradient(90deg,#059669,#6366f1,#059669);"></td></tr>
    <tr>
      <td class="bp" style="padding:36px 48px;background:#0f1623;">

        <p style="font-size:14px;color:#94a3b8;line-height:1.8;margin:0 0 24px 0;">
          This confirmation email verifies that your Nodemailer SMTP connection via <strong style="color:#cbd5e1;">Gmail</strong> is configured correctly in your
          <code style="background:#0a1220;color:#818cf8;padding:2px 8px;border-radius:6px;font-size:13px;border:1px solid rgba(99,102,241,0.2);">.env</code> file.
          All transactional emails — welcome messages and deadline reminders — will be delivered to users automatically.
        </p>

        <!-- Status box -->
        <div style="background:#060d18;border:1px solid rgba(16,185,129,0.15);border-left:4px solid #10b981;border-radius:10px;padding:18px 20px;margin-bottom:28px;">
          <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="24" style="vertical-align:top;padding-right:12px;padding-top:2px;">${icon.checkCircle('#10b981', 16)}</td>
              <td>
                <p style="font-size:13px;font-weight:600;color:#34d399;margin:0 0 8px 0;">All Systems Operational</p>
                <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="padding:4px 0;">
                      <span style="display:inline-block;vertical-align:middle;margin-right:8px;">${icon.mail('#475569', 14)}</span>
                      <span style="font-size:12px;color:#64748b;vertical-align:middle;">SMTP Host: <strong style="color:#94a3b8;">smtp.gmail.com</strong></span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;">
                      <span style="display:inline-block;vertical-align:middle;margin-right:8px;">${icon.clock('#475569', 14)}</span>
                      <span style="font-size:12px;color:#64748b;vertical-align:middle;">Verified at: <strong style="color:#94a3b8;">${sentAt}</strong></span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>

        <!-- Signature -->
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="border-top:1px solid rgba(255,255,255,0.05);padding-top:22px;">
              <p style="font-size:14px;color:#64748b;margin:0 0 3px 0;">System generated &mdash;</p>
              <p style="font-size:14px;font-weight:700;color:#cbd5e1;margin:0;">TrackYourDay Platform</p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  `;

  const info = await t.sendMail({
    from: fromEmail,
    to: toEmail,
    subject: 'TrackYourDay — SMTP Configuration Verified',
    html: buildEmailWrapper(bodyHtml, '#10b981'),
  });
  console.log('Test email sent: %s', info.messageId);
  return { success: true };
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTS
// ─────────────────────────────────────────────────────────────────────────────
module.exports = { createTransporter, sendWelcomeEmail, sendReminderEmail, sendTestEmail };
