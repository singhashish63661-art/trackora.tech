import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { addLead } from '../../lib/crm-store';
import { getGmailConfig } from '../../lib/server-env';

export const POST: APIRoute = async ({ request }) => {
    const data = await request.formData();
    const name = data.get('name');
    const email = data.get('email');
    const position = data.get('position');
    const file = data.get('resume');

    if (!(file instanceof File) || file.size <= 0) {
        return new Response(JSON.stringify({ message: 'Resume file is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const gmail = getGmailConfig();
    if (!gmail) {
        return new Response(
            JSON.stringify({
                message:
                    'Email is not configured. Add GMAIL_USER and GMAIL_PASS in the host environment.',
            }),
            { status: 503, headers: { 'Content-Type': 'application/json' } },
        );
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmail.user,
            pass: gmail.pass,
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
                resumeFile: file.name ?? "",
            },
        });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        await transporter.sendMail({
            from: gmail.user,
            replyTo: String(email ?? ''),
            to: gmail.user,
            subject: `New Career Application: ${position} from ${name}`,
            text: `Applicant Name: ${name}\nEmail: ${email}\nPosition: ${position}\n\nPlease see attached resume.`,
            attachments: [{ filename: file.name || 'resume', content: buffer }]
        });

        return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
    } catch (error) {
        console.error('Email error:', error);
        return new Response(JSON.stringify({ message: 'Error sending email' }), { status: 500 });
    }
};
