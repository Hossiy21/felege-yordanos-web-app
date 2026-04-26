import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const { firstName, lastName, email, subject, message } = await request.json();

        const { data, error } = await resend.emails.send({
            from: 'Felege Yordanos Contact <onboarding@resend.dev>',
            to: ['yhosaina@gmail.com'],
            subject: `Contact Form: ${subject}`,
            replyTo: email,
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
                    <h2 style="color: #003366;">New Message from Felege Yordanos Contact Form</h2>
                    <p><strong>From:</strong> ${firstName} ${lastName} (${email})</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <div style="margin-top: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #FFB800;">
                        <p style="white-space: pre-wrap;">${message}</p>
                    </div>
                    <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;" />
                    <p style="font-size: 12px; color: #888;">This message was sent via the Felege Yordanos Sunday School website.</p>
                </div>
            `,
        });

        if (error) {
            console.error('Resend error:', error);
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ success: true, data });
    } catch (error) {
        console.error('Contact API error:', error);
        return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }
}
