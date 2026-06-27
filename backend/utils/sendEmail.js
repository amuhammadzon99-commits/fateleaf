import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
  // Если настройки SMTP не заданы в .env, просто имитируем отправку письма
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log('\n================ MOCK EMAIL SENT ================');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body (HTML length): ${html.length} chars`);
    console.log('Для реальной отправки писем добавьте SMTP_HOST, SMTP_USER и SMTP_PASS в .env');
    console.log('=================================================\n');
    return { success: true, message: 'Mock email sent' };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT == 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"FateLeaf Tea Club" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  };

  return await transporter.sendMail(mailOptions);
};

export default sendEmail;
