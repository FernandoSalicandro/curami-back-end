import sgMail from '@sendgrid/mail';

const EMAIL_DISABLED = String(process.env.EMAIL_DISABLED || '').toLowerCase() === 'true';

if (!EMAIL_DISABLED) {
  console.log('🔧 Inizializzazione SendGrid con:', process.env.EMAIL_USER);
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    console.log('✅ SendGrid inizializzato');
  } catch (err) {
    console.error('❌ Errore inizializzazione SendGrid:', err.message);
  }
}

export const sendNotification = async (to, subject, html) => {
  if (EMAIL_DISABLED) {
    console.log('📧 EMAIL_DISABLED: skip ->', { to, subject });
    return true;
  }

  try {
    console.log('🔄 Preparazione email per:', to);
    
    const msg = {
      to,
      from: {
        email: process.env.EMAIL_USER,
        name: 'Curami.it'
      },
      subject,
      html,
      trackingSettings: {
        clickTracking: { enable: false },
        openTracking: { enable: false }
      }
    };

    console.log('📨 Invio email con configurazione:', {
      to: msg.to,
      from: msg.from,
      subject: msg.subject
    });

    const [response] = await sgMail.send(msg);
    
    console.log('📬 Risposta SendGrid:', {
      statusCode: response?.statusCode,
      headers: response?.headers,
      body: response?.body
    });

    if (response?.statusCode !== 202) {
      throw new Error(`SendGrid response: ${response?.statusCode}`);
    }
    
    console.log('✅ Email inviata correttamente:', {
      to,
      subject,
      timestamp: new Date().toISOString()
    });
    
    return true;
  } catch (error) {
    console.error('❌ Errore invio email:', {
      to,
      subject,
      error: error.message,
      code: error.code,
      response: error.response?.body,
      timestamp: new Date().toISOString()
    });
    
    return false;
  }
};