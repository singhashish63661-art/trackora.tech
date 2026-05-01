import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { addLead } from '../../lib/crm-store';

function isValidEmail(email: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const POST: APIRoute = async ({ request }) => {
    let data: unknown;
    try {
        data = await request.json();
    } catch {
        return new Response(JSON.stringify({ message: 'Invalid JSON body' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    const body = data as Record<string, unknown>;
    const name = String(body.name ?? '').trim();
    const email = String(body.email ?? '').trim();
    const subject = String(body.subject ?? 'Website enquiry').trim() || 'Website enquiry';
    const phone = String(body.phone ?? '').trim();
    const company = String(body.company ?? '').trim();
    const message = String(body.message ?? '').trim();

    if (!name || !email || !message) {
        return new Response(JSON.stringify({ message: 'Name, email, and message are required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (!isValidEmail(email)) {
        return new Response(JSON.stringify({ message: 'Invalid email address' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (!import.meta.env.GMAIL_USER || !import.meta.env.GMAIL_PASS) {
        return new Response(JSON.stringify({ message: 'Server configuration error' }), { status: 500 });
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: import.meta.env.GMAIL_USER,
            pass: import.meta.env.GMAIL_PASS,
        },
    });

    try {
        await addLead({
            type: "contact",
            name,
            email,
            phone,
            company,
            subject,
            message,
        });

        await transporter.sendMail({
            from: import.meta.env.GMAIL_USER,
            replyTo: email,
            to: import.meta.env.GMAIL_USER,
            subject: `New Enquiry: ${subject} from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nCompany: ${company}\n\nMessage:\n${message}`,
        });

        return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
    } catch (error) {
        console.error('Email error:', error);
        return new Response(JSON.stringify({ message: 'Error sending email' }), { status: 500 });
    }
};
