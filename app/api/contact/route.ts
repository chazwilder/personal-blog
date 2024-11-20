import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const msg = {
      to: "hello@chazwilder.io",
      from: "hello@chazwilder.io",
      replyTo: body.email,
      subject: `New Contact Form: ${body.subject}`,
      text: `
        Name: ${body.name}
        Email: ${body.email}
        Subject: ${body.subject}
        
        Message:
        ${body.message}
              `.trim(),
      html: `
                <h3>New Contact Form Submission</h3>
                <p><strong>From:</strong> ${body.name}</p>
                <p><strong>Email:</strong> ${body.email}</p>
                <p><strong>Subject:</strong> ${body.subject}</p>
                <div style="margin-top: 20px;">
                  <strong>Message:</strong><br/>
                  <p style="white-space: pre-wrap;">${body.message}</p>
                </div>
              `,
    };

    await sgMail.send(msg);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to send message";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
