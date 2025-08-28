import nodemailer from 'nodemailer';
import dns from 'dns/promises';

const EMAIL_DISABLED = String(process.env.EMAIL_DISABLED || '').toLowerCase() === 'true';

let transporter = null;
if (!EMAIL_DISABLED) {
  console.log('🔧 Inizializzazione SMTP...');

  // Prima verifica DNS
  try {
    const address = await dns.lookup('smtp.gmail.com');
    console.log('✅ DNS lookup riuscito:', address);
  } catch (err) {
    console.error('❌ DNS lookup fallito:', err.message);
  }

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000
  });

  try {
    await transporter.verify();
    console.log('✅ SMTP connesso con successo');
  } catch (err) {
    console.error('❌ SMTP errore:', {
      message: err.message,
      code: err.code,
      command: err.command
    });
  }
}

export const sendNotification = async (to, subject, html) => {
  if (!transporter) {
    console.error('❌ SMTP non inizializzato');
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html
    });
    console.log('✅ Email inviata:', info.messageId);
    return true;
  } catch (error) {
    console.error('❌ Errore invio:', {
      error: error.message,
      code: error.code
    });
    return false;
  }
};