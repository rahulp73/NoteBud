import { createTransport } from 'nodemailer'
import path from 'path'
import { configDotenv } from 'dotenv';
configDotenv()

const transporter = createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true,
    auth: {
        user: process.env.MAIL_AUTH_USER,
        pass: process.env.MAIL_AUTH_PASS,
    }
})

export const welcomeMail = async (email, name) => {
    try {
        // Resolve the path to the image
        const imagePath = path.resolve('utils/Designer.png');

        const info = await transporter.sendMail({
            from: process.env.MAIL_FROM,
            to: email,
            subject: "Welcome to NoteBud! 📝🌟",
            html: `
                <div style="font-family:'sans-serif'">
                    <pre>Dear ${name},

Welcome to NoteBud! We’re thrilled to have you on board. 🎉

What is NoteBud? NoteBud is your friendly notes app where you can jot down ideas, reminders, and anything else that comes to mind. Whether you’re a student, professional, or just someone who loves organizing thoughts, NoteBud has got you covered.

Get Started:

Sign In: Visit our website at https://notebud.rahulp.fun and sign in using your credentials.
Explore: Take a tour of NoteBud’s intuitive interface.
Start Writing: Click the “New Note” button and let your creativity flow!
Feel free to reach out if you have any questions or need assistance. We’re here to make your note-taking experience delightful! 📝✨

Happy noting!

Best regards, The NoteBud Team
                    </pre>
                </div>
            `,
        });
    } catch (error) {
        console.error('Error sending email:', error);
    }
}
