require('dotenv').config();
const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.EMAIL_FROM;
const TO = "gundelwaranup119@gmail.com"; // User's email from the request

async function testEmail() {
    console.log(`--- Testing Resend Integration ---`);
    console.log(`FROM: ${FROM}`);
    console.log(`TO: ${TO}`);
    console.log(`API KEY (first 5): ${process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 5) + '...' : 'MISSING'}`);

    try {
        const { data, error } = await resend.emails.send({
            from: FROM,
            to: TO,
            subject: 'NOIR - System Integration Test',
            html: '<h1>Integration Successful</h1><p>Your Maison NOIR email configuration is working correctly.</p>'
        });

        if (error) {
            console.error('❌ Resend Error:', error);
            return;
        }

        console.log('✅ Email sent successfully!');
        console.log('Response ID:', data.id);
    } catch (err) {
        console.error('💥 Unexpected Error:', err);
    }
}

testEmail();
