import sgMail from '@sendgrid/mail';

const EMAIL_DISABLED = String(process.env.EMAIL_DISABLED || '').toLowerCase() === 'true';
let sendgridInitialized = false;

// Inizializzazione SendGrid
if (!EMAIL_DISABLED) {
  console.log('🔧 Inizializzazione SendGrid...');
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    sendgridInitialized = true;
    console.log('✅ SendGrid inizializzato');
  } catch (err) {
    console.error('❌ Errore inizializzazione SendGrid:', err.message);
  }
}

export const sendNotification = async (to, subject, html) => {
  const startTime = Date.now();
  const logId = Math.random().toString(36).substring(7);
  
  console.log(`📧 [${logId}] INIZIO INVIO EMAIL ====================`);
  console.log(`📧 [${logId}] Destinatario: ${to}`);
  console.log(`📧 [${logId}] Oggetto: ${subject}`);

  if (EMAIL_DISABLED) {
    console.log(`📧 [${logId}] Email disabilitate, skip invio`);
    return true;
  }

  if (!sendgridInitialized) {
    console.error(`❌ [${logId}] SendGrid non inizializzato`);
    return false;
  }

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
    },
    trackingSettings: {
      clickTracking: { enable: true },
      openTracking: { enable: true },
      subscriptionTracking: { enable: false }
    },
    mailSettings: {
      sandboxMode: { enable: false },
      bypassListManagement: { enable: true }
    }
  };

  try {
    console.log(`📧 [${logId}] Tentativo invio via SendGrid...`);
    
    const response = await sgMail.send(msg).catch(err => {
      throw new Error(`SendGrid error: ${err.message}`);
    });
    
    const duration = Date.now() - startTime;
    console.log(`✅ [${logId}] SUCCESS - Email inviata (${duration}ms)`);
    console.log(`✅ [${logId}] Response:`, JSON.stringify(response, null, 2));
    console.log(`📧 [${logId}] FINE INVIO EMAIL ====================\n`);
    
    return true;
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [${logId}] ERRORE INVIO EMAIL (${duration}ms):`);
    console.error(`❌ [${logId}] Message:`, error.message);
    
    if (error.response?.body) {
      console.error(`❌ [${logId}] SendGrid Response:`, 
        JSON.stringify(error.response.body, null, 2)
      );
    }
    
    console.error(`❌ [${logId}] Stack:`, error.stack);
    console.error(`📧 [${logId}] FINE INVIO EMAIL (CON ERRORE) ====\n`);
    
    return false;
  }
};