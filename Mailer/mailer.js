import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendNotification = async (to, subject, html) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html : html
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('📧 Email inviata:', info.response);
        return true;
    } catch (error) {
        console.error('❌ Errore invio email:', error);
        return false;
    }
};