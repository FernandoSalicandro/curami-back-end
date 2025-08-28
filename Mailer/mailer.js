import nodemailer from 'nodemailer';

const EMAIL_DISABLED = String(process.env.EMAIL_DISABLED || '').toLowerCase() === 'true';

let transporter = null;
if (!EMAIL_DISABLED) {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,          // 587 + STARTTLS
    secure: false,      // important: false con 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App Password a 16 caratteri
    },
    pool: true,
    maxConnections: 2,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  transporter.verify()
    .then(() => console.log('SMTP ready'))
    .catch(err => console.error('SMTP verify failed:', err.message));
}

export const sendNotification = async (to, subject, html) => {
  if (EMAIL_DISABLED) {
    console.log(`EMAIL_DISABLED: skip -> ${to} ${subject}`);
    return true;
  }
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER, // deve essere lo stesso account Gmail
      to, subject, html
    });
    console.log('📧 Email inviata:', info.response);
    return true;
  } catch (error) {
    console.error('❌ Errore invio email:', error);
    return false;
  }
};
