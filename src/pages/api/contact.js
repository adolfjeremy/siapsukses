export const prerender = false;
import nodemailer from "nodemailer";

export const POST = async ({ request }) => {
  try {
    const { name, email, whatsapp, company, pertanyaan } = await request.json();

    // 🪤 HONEYPOT CHECK
    if (company && company.length > 0) {
      // pura-pura sukses, biar bot berhenti
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    if (!name || !email || !whatsapp || !pertanyaan) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid data" }),
        { status: 400 },
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: import.meta.env.EMAIL_USER,
        pass: import.meta.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Siap Sukses" <${import.meta.env.EMAIL_USER}>`,
      to: import.meta.env.EMAIL_TO,
      replyTo: email,
      subject: "Pertanyaan Baru dari Website",
      text: `
        Nama   : ${name}
        Email  : ${email}
        Whatsapp : ${whatsapp}
        Pertanyaan: ${pertanyaan}
            `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ success: false }), { status: 500 });
  }
};
