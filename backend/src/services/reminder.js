const cron = require('node-cron');
const Task = require('../models/Task');
const { createTransporter, sendReminderEmail } = require('./email');

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const OVERDUE_REPEAT_INTERVAL_MS = 10 * 60 * 1000; // repeat overdue mails every 10 minutes
const CRON_SCHEDULE = '*/5 * * * *';               // check every 5 minutes

// ─────────────────────────────────────────────────────────────────────────────
// MAIN CHECKER
// ─────────────────────────────────────────────────────────────────────────────
async function checkDeadlinesAndSendReminders() {
  console.log('[Reminder] Running deadline checker...');
  try {
    const now         = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // ── TRACK 1: Pre-deadline tasks (due within next 24 hrs, not yet notified) ──
    const upcomingTasks = await Task.find({
      completed:      false,
      emailNotified:  false,
      deadline:       { $gt: now, $lte: next24Hours }
    }).populate('userId');

    // ── TRACK 2: Overdue tasks (deadline passed, incomplete, repeat every 10 min) ──
    const overdueRepeatThreshold = new Date(now.getTime() - OVERDUE_REPEAT_INTERVAL_MS);
    const overdueTasks = await Task.find({
      completed: false,
      deadline:  { $lt: now },
      $or: [
        { lastOverdueNotifiedAt: null },
        { lastOverdueNotifiedAt: { $lte: overdueRepeatThreshold } }
      ]
    }).populate('userId');

    const totalTasks = [...upcomingTasks, ...overdueTasks];

    if (totalTasks.length === 0) {
      console.log('[Reminder] No tasks require notifications right now.');
      return;
    }

    console.log(`[Reminder] Found ${upcomingTasks.length} upcoming + ${overdueTasks.length} overdue task(s).`);

    // ── Process upcoming (pre-deadline) tasks ──
    for (const task of upcomingTasks) {
      const user = task.userId;
      if (!user?.email) {
        console.warn(`[Reminder] Task "${task.title}" has no user email. Skipping.`);
        continue;
      }

      const timeLeftMs = task.deadline.getTime() - now.getTime();
      const hoursLeft  = Math.round(timeLeftMs / (1000 * 60 * 60));

      console.log(`[Reminder] PRE-DEADLINE → "${task.title}" (${hoursLeft}h left) → ${user.email}`);

      try {
        await sendReminderEmail(user.email, user.name || 'there', task, hoursLeft);
        task.emailNotified = true;  // one-time flag — won't send pre-deadline again
        await task.save();
        console.log(`[Reminder]   ✓ Pre-deadline reminder sent.`);
      } catch (err) {
        console.error(`[Reminder]   ✗ Failed:`, err.message);
      }
    }

    // ── Process overdue tasks (repeat every 10 min) ──
    for (const task of overdueTasks) {
      const user = task.userId;
      if (!user?.email) {
        console.warn(`[Reminder] Overdue task "${task.title}" has no user email. Skipping.`);
        continue;
      }

      const overdueMs  = now.getTime() - task.deadline.getTime();
      const overdueMin = Math.round(overdueMs / 60000);

      console.log(`[Reminder] OVERDUE → "${task.title}" (${overdueMin} min overdue) → ${user.email}`);

      try {
        // Pass hoursLeft = 0 to signal overdue in email template
        await sendReminderEmail(user.email, user.name || 'there', task, 0, overdueMin);
        task.lastOverdueNotifiedAt = now;  // update timestamp for 10-min repeat gate
        await task.save();
        console.log(`[Reminder]   ✓ Overdue repeat reminder sent. Next in ${OVERDUE_REPEAT_INTERVAL_MS / 60000} min.`);
      } catch (err) {
        console.error(`[Reminder]   ✗ Failed:`, err.message);
      }
    }

  } catch (err) {
    console.error('[Reminder] Scheduler error:', err);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────────────────────────────────────
function initScheduler() {
  createTransporter()
    .then(t => t.verify((err) => {
      if (err) console.error('[Reminder] SMTP verification failed:', err.message);
      else     console.log('[Reminder] SMTP verified — ready to dispatch emails');
    }))
    .catch(err => console.error('[Reminder] Could not create transporter:', err));

  cron.schedule(CRON_SCHEDULE, checkDeadlinesAndSendReminders);
  console.log(`[Reminder] Cron initialized — checking ${CRON_SCHEDULE} (every 5 min)`);
  console.log(`[Reminder] Overdue repeat interval: ${OVERDUE_REPEAT_INTERVAL_MS / 60000} minutes`);

  // Run immediately on startup
  checkDeadlinesAndSendReminders();
}

module.exports = { initScheduler, checkDeadlinesAndSendReminders };
