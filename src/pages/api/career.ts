import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { addLead } from '../../lib/crm-store';

export const POST: APIRoute = async ({ request }) => {
    const data = await request.formData();
    const name = data.get('name');
    const email = data.get('email');
    const position = data.get('position');
    const file = data.get('resume') as File;

    if (!import.meta.env.GMAIL_USER || !import.meta.env.GMAIL_PASS) {
        return new Response(JSON.stringify({ message: 'Server configuration error' }), { status: 500 });
    }

    // Gmail SMTP Configuration
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: import.meta.env.GMAIL_USER,
            pass: import.meta.env.GMAIL_PASS,
        },
    });

    try {
        await addLead({
            type: "career",
            name: String(name ?? ""),
            email: String(email ?? ""),
            subject: `Application: ${String(position ?? "Unknown Position")}`,
            message: "Career application received",
            metadata: {
                position: String(position ?? ""),
                resumeFile: file?.name ?? "",
            },
        });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await transporter.sendMail({
            from: import.meta.env.GMAIL_USER, // Gmail requires 'from' to be the authenticated user
            replyTo: email as string,
            to: import.meta.env.GMAIL_USER,
            subject: `New Career Application: ${position} from ${name}`,
            text: `Applicant Name: ${name}\nEmail: ${email}\nPosition: ${position}\n\nPlease see attached resume.`,
            attachments: [{ filename: file.name, content: buffer }]
        });

        return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
    } catch (error) {
        console.error('Email error:', error);
        return new Response(JSON.stringify({ message: 'Error sending email' }), { status: 500 });
    }
};
