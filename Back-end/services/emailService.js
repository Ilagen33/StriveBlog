import mailgun from "mailgun-js";

const mg = mailgun ({
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
});

export const sendEmail = async (to, subject, htmlContent) => {
    const data = {
        from: 'striveblog <noreply@yyourdomain.com',
        to,
        subject,
        html: htmlContent
    }
    try {
        const response = await mg.messages().send(data)
        console.log('email inviata con successo', response);
        return response;

    } catch (err) {
        console.error('Errore di invio mail', err)
        throw err
    }
}