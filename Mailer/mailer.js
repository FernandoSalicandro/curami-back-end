import nodemailer from 'nodemailer';

const EMAIL_DISABLED = String(process.env.EMAIL_DISABLED || '').toLowerCase() === 'true';

let transporter = null;
if (!EMAIL_DISABLED) {
  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,  // usa SSL
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  // Verifica semplificata
  const verifyConnection = async () => {
    try {
      await transporter.verify();
      console.log('✅ SMTP connesso');
    } catch (err) {
      console.error('❌ SMTP error:', err.message);
    }
  };

  verifyConnection();
}

export const sendNotification = async (to, subject, html) => {
  if (EMAIL_DISABLED) {
    console.log(`📧 EMAIL_DISABLED: skip -> ${to} ${subject}`);
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    console.log('📧 Email inviata:', info.response);
    return true;
  } catch (error) {
    console.error('❌ Errore invio email:', error.message);
    return false;
  }
};