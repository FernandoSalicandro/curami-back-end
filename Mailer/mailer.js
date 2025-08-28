import nodemailer from 'nodemailer';

const EMAIL_DISABLED = String(process.env.EMAIL_DISABLED || '').toLowerCase() === 'true';

let transporter = null;
if (!EMAIL_DISABLED) {
  transporter = nodemailer.createTransport({
    service: 'gmail',     // Usiamo service invece di host
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 2,
    connectionTimeout: 30000,    // Aumentato a 30s
    greetingTimeout: 30000,     // Aumentato a 30s
    socketTimeout: 30000,       // Aumentato a 30s
    tls: {
      rejectUnauthorized: false // Per evitare problemi SSL in produzione
    }
  });

  // Funzione di verifica con retry
  const verifyConnection = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        await transporter.verify();
        console.log('✅ SMTP connesso e pronto');
        return true;
      } catch (err) {
        console.warn(`⚠️ Tentativo SMTP ${i + 1}/${retries} fallito:`, err.message);
        if (i === retries - 1) {
          console.error('❌ SMTP non disponibile dopo', retries, 'tentativi');
          return false;
        }
        // Attendi 5s prima del prossimo tentativo
        await new Promise(r => setTimeout(r, 5000));
      }
    }
  };

  // Avvia la verifica all'inizializzazione
  verifyConnection().catch(err => {
    console.error('❌ Errore durante la verifica SMTP:', err);
  });
}

export const sendNotification = async (to, subject, html) => {
  if (EMAIL_DISABLED) {
    console.log(`📧 EMAIL_DISABLED: skip -> ${to} ${subject}`);
    return true;
  }

  if (!transporter) {
    console.error('❌ Transporter non inizializzato');
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
      priority: 'high'  // Priorità alta per le notifiche
    });
    
    console.log('📧 Email inviata:', {
      to,
      subject,
      messageId: info.messageId,
      response: info.response
    });
    
    return true;
  } catch (error) {
    console.error('❌ Errore invio email:', {
      to,
      subject,
      error: error.message
    });
    return false;
  }
};