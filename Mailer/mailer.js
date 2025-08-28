import sgMail from '@sendgrid/mail';

const EMAIL_DISABLED = String(process.env.EMAIL_DISABLED || '').toLowerCase() === 'true';
let sendgridInitialized = false;

// Logging inizializzazione
console.log('📧 Stato EMAIL_DISABLED:', EMAIL_DISABLED);
console.log('📧 SENDGRID_API_KEY presente:', !!process.env.SENDGRID_API_KEY);

if (!EMAIL_DISABLED) {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ ERRORE CRITICO: SENDGRID_API_KEY mancante nelle variabili d\'ambiente');
  } else {
    console.log('🔧 Tentativo inizializzazione SendGrid...');
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      sendgridInitialized = true;
      console.log('✅ SendGrid inizializzato con successo');
    } catch (err) {
      console.error('❌ Errore inizializzazione SendGrid:', {
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
      });
    }
  }
}

export const sendNotification = async (to, subject, html) => {
  const startTime = Date.now();
  const logId = Math.random().toString(36).substring(7);
  
  console.log(`📧 [${logId}] Inizio tentativo invio email:`, {
    to,
    subject,
    sendgridInitialized,
    emailDisabled: EMAIL_DISABLED,
    timestamp: new Date().toISOString()
  });

  if (EMAIL_DISABLED) {
    console.log(`📧 [${logId}] Email disabilitate, skip invio`);
    return true;
  }

  if (!sendgridInitialized) {
    console.error(`❌ [${logId}] Tentativo invio con SendGrid non inizializzato`);
    return false;
  }

  try {
    const msg = {
      to,
      from: {
        email: 'itcurami@gmail.com',
        name: 'Curami.it'
      },
      subject,
      html,
      categories: ['transactional'],
      headers: {
        'List-Unsubscribe': '<mailto:itcurami@gmail.com>',
        'Priority': 'High',
        'X-SES-CONFIGURATION-SET': 'ConfigSet'
      },
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true },
        subscriptionTracking: { enable: false }
      },
      mailSettings: {
        sandboxMode: { enable: false },
        bypassListManagement: { enable: true }
      },
      asm: {
        groupId: 0
      }
    };

    console.log(`📧 [${logId}] Configurazione email:`, {
      to: msg.to,
      from: msg.from,
      subject: msg.subject,
      trackingEnabled: msg.trackingSettings.clickTracking.enable,
      sandboxMode: msg.mailSettings.sandboxMode.enable
    });

    const [response] = await sgMail.send(msg);
    
    console.log(`✅ [${logId}] Email inviata con successo:`, {
      to,
      subject,
      responseCode: response?.statusCode,
      responseHeaders: response?.headers,
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error(`❌ [${logId}] Errore invio email:`, {
      to,
      subject,
      error: {
        message: error.message,
        name: error.name,
        code: error.code,
        statusCode: error.statusCode,
        response: error.response?.body,
      },
      duration: `${Date.now() - startTime}ms`,
      timestamp: new Date().toISOString()
    });

    // Log dettagliato dell'errore
    if (error.response?.body?.errors) {
      console.error(`❌ [${logId}] Dettagli errori SendGrid:`, 
        JSON.stringify(error.response.body.errors, null, 2)
      );
    }
    
    return false;
  }
};