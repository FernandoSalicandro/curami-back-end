import nodemailer from 'nodemailer';

const EMAIL_DISABLED = String(process.env.EMAIL_DISABLED || '').toLowerCase() === 'true';

let transporter = null;
if (!EMAIL_DISABLED) {
  console.log('🔧 Inizializzazione SMTP...');

  transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // STARTTLS
    requireTLS: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      ciphers: 'SSLv3',
      rejectUnauthorized: false
    },
    timeout: 10000 // 10 secondi di timeout
  });

  // Verifica immediata
  transporter.verify()
    .then(() => {
      console.log('✅ SMTP connesso con successo');
    })
    .catch((err) => {
      console.error('❌ SMTP errore:', {
        message: err.message,
        code: err.code,
        command: err.command
      });
      
      // Prova a fare un ping al server SMTP
      require('dns').lookup('smtp.gmail.com', (err, address) => {
        if (err) {
          console.error('❌ DNS lookup fallito:', err.message);
        } else {
          console.log('✅ SMTP server raggiungibile:', address);
        }
      });
    });
}

export const sendNotification = async (to, subject, html) => {
  if (!transporter) {
    console.error('❌ SMTP non inizializzato');
    return false;
  }

  console.log('📧 Tentativo invio email a:', to);
  
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
      timeout: 10000
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