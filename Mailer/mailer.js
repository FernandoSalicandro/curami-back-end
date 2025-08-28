import sgMail from '@sendgrid/mail';

const EMAIL_DISABLED = String(process.env.EMAIL_DISABLED || '').toLowerCase() === 'true';

// Inizializzazione SendGrid
if (!EMAIL_DISABLED) {
  console.log('🔧 Inizializzazione SendGrid...');
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
    const msg = {
      to,
      from: 'itcurami@gmail.com', // email verificata su SendGrid
      subject,
      html,
    };

    await sgMail.send(msg);
    
    console.log('✅ Email inviata:', {
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