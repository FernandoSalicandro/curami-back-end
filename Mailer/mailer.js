import nodemailer from 'nodemailer';

const EMAIL_DISABLED = String(process.env.EMAIL_DISABLED || '').toLowerCase() === 'true';

let transporter = null;
if (!EMAIL_DISABLED) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
      ciphers: 'SSLv3'
    },
    debug: true,
    logger: true,
    maxConnections: 3,
    maxMessages: 100,
    pool: true,
    secure: true,
    connectionTimeout: 60000,    // 1 minuto
    greetingTimeout: 30000,     // 30 secondi
    socketTimeout: 30000        // 30 secondi
  });

  // Funzione di verifica con retry migliorata
  const verifyConnection = async (retries = 3, delay = 5000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await transporter.verify();
        console.log('✅ SMTP connesso e pronto:', {
          attempt: i + 1,
          success: true,
          timestamp: new Date().toISOString()
        });
        return true;
      } catch (err) {
        console.warn('⚠️ Tentativo SMTP fallito:', {
          attempt: i + 1,
          total: retries,
          error: err.message,
          code: err.code,
          timestamp: new Date().toISOString()
        });

        if (i === retries - 1) {
          console.error('❌ SMTP non disponibile dopo', retries, 'tentativi', {
            lastError: err.message,
            timestamp: new Date().toISOString()
          });
          return false;
        }

        await new Promise(r => setTimeout(r, delay));
      }
    }
  };

  // Inizializzazione con gestione errori
  verifyConnection()
    .then(success => {
      if (!success) {
        console.warn('⚠️ SMTP inizializzato con errori - Il servizio email potrebbe non funzionare');
      }
    })
    .catch(err => {
      console.error('❌ Errore critico durante inizializzazione SMTP:', {
        error: err.message,
        timestamp: new Date().toISOString()
      });
    });
}

export const sendNotification = async (to, subject, html) => {
  if (EMAIL_DISABLED) {
    console.log('📧 EMAIL_DISABLED:', {
      to,
      subject,
      timestamp: new Date().toISOString()
    });
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
      priority: 'high',
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High'
      },
      disableUrlAccess: true,
      disableFileAccess: true
    });
    
    console.log('📧 Email inviata con successo:', {
      to,
      subject,
      messageId: info.messageId,
      response: info.response,
      timestamp: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('❌ Errore invio email:', {
      to,
      subject,
      error: error.message,
      code: error.code,
      command: error.command,
      timestamp: new Date().toISOString()
    });
    return false;
  }
};