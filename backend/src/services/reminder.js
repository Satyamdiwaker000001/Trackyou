const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Task = require('../models/Task');
const User = require('../models/User');

// Configure SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.mailtrap.io', // default fallback to mailtrap
  port: parseInt(process.env.SMTP_PORT || '2525'),
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  }
});

// Reminder checking logic
async function checkDeadlinesAndSendReminders() {
  console.log('Running task deadline notification checker...');
  try {
    const now = new Date();
    // Nearing deadlines = tasks due within the next 24 hours
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find all incomplete, un-notified tasks with deadline between now and next 24 hours
    const nearTasks = await Task.find({
      completed: false,
      emailNotified: false,
      deadline: { $gt: now, $lte: next24Hours }
    }).populate('userId');

    console.log(`Found ${nearTasks.length} tasks nearing deadlines.`);

    for (const task of nearTasks) {
      const user = task.userId;
      if (!user || !user.email) {
        console.warn(`Task ${task._id} has no valid associated user email. Skipping.`);
        continue;
      }

      // Format time remaining
      const timeLeftMs = task.deadline.getTime() - now.getTime();
      const hoursLeft = Math.round(timeLeftMs / (1000 * 60 * 60));

      const mailOptions = {
        from: process.env.EMAIL_FROM || '"TrackYourDay Notifications" <noreply@trackyourday.com>',
        to: user.email,
        subject: `⚠️ Reminder: Task "${task.title}" is due in ${hoursLeft} hours!`,
        text: `Hello,\n\nThis is a reminder that your task "${task.title}" is due soon!\n\nDeadline: ${task.deadline.toLocaleString()}\nDescription: ${task.description || 'No description provided.'}\n\nLog in to your TrackYourDay dashboard to complete this task.\n\nBest,\nTrackYourDay Team`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #ef4444;">⚠️ Task Deadline Reminder</h2>
            <p>Hello,</p>
            <p>This is a quick notification from <strong>TrackYourDay</strong> to remind you that your task is due soon.</p>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #6366f1;">
              <h3 style="margin-top: 0; color: #111827;">${task.title}</h3>
              <p style="color: #6b7280; font-size: 0.95rem;">${task.description || 'No description provided.'}</p>
              <p style="margin-bottom: 0;"><strong>Due in:</strong> ${hoursLeft} hours (${task.deadline.toLocaleString()})</p>
            </div>
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            <p style="font-size: 0.9rem; color: #9ca3af;">Please do not reply directly to this email. Mark it completed on your dashboard to silence future notifications.</p>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Notification email successfully sent for Task: ${task.title} to User: ${user.email}`);
        
        // Mark task as notified to prevent repeating emails
        task.emailNotified = true;
        await task.save();
      } catch (emailErr) {
        console.error(`Failed to send email reminder for task ${task._id}:`, emailErr);
      }
    }
  } catch (err) {
    console.error('Error in deadline check scheduler:', err);
  }
}

// Start Scheduler
function initScheduler() {
  // Verify SMTP Connection on startup
  transporter.verify((error, success) => {
    if (error) {
      console.error('SMTP Server connection verification failed:', error.message);
    } else {
      console.log('SMTP Server connection verified successfully - ready to dispatch emails');
    }
  });

  // Cron schedule: Run checker every 15 minutes
  cron.schedule('*/15 * * * *', () => {
    checkDeadlinesAndSendReminders();
  });
  console.log('Task reminder notification cron initialized (running every 15 minutes)');
  
  // Optional: Run once instantly on startup to check
  checkDeadlinesAndSendReminders();
}

module.exports = {
  initScheduler,
  checkDeadlinesAndSendReminders
};
