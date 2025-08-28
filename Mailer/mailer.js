import sgMail from '@sendgrid/mail';

const EMAIL_DISABLED = String(process.env.EMAIL_DISABLED || '').toLowerCase() === 'true';

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