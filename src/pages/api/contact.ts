import type { APIRoute } from 'astro';
import nodemailer from 'nodemailer';
import { addLead } from '../../lib/crm-store';

export const POST: APIRoute = async ({ request }) => {
    const data = await request.json(); // Unified to JSON for Contact Form
    const { name, email, subject, phone, company, message } = data;

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
            name: String(name ?? ""),
            email: String(email ?? ""),
            phone: String(phone ?? ""),
            company: String(company ?? ""),
            subject: String(subject ?? "Website enquiry"),
            message: String(message ?? ""),
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
