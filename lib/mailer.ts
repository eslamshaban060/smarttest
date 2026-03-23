import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `"Smart Academy" <${process.env.SMTP_USER}>`;
const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export async function sendVerifyEmail(to: string, token: string) {
  const link = `${SITE}/api/auth/verify-email?token=${token}`;
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "تأكيد البريد الإلكتروني — Smart Academy",
    html: emailTemplate({
      title: "مرحباً بك في Smart Academy 🎓",
      body: `<p style="color:#475569;font-size:15px;line-height:1.8;margin:0 0 20px">
        شكراً لتسجيلك! انقر الزر أدناه لتفعيل حسابك.
      </p>`,
      btnText: "تفعيل الحساب",
      btnLink: link,
    }),
  });
}

export async function sendResetPasswordEmail(to: string, token: string) {
  const link = `${SITE}/auth/reset-password?token=${token}`;
  await transporter.sendMail({
    from: FROM,
    to,
    subject: "إعادة تعيين كلمة المرور — Smart Academy",
    html: emailTemplate({
      title: "إعادة تعيين كلمة المرور",
      body: `<p style="color:#475569;font-size:15px;line-height:1.8;margin:0 0 20px">
        تلقّينا طلبًا لإعادة تعيين كلمة المرور. الرابط صالح لمدة ساعة واحدة فقط.
      </p>`,
      btnText: "إعادة تعيين كلمة المرور",
      btnLink: link,
    }),
  });
}

function emailTemplate({
  title,
  body,
  btnText,
  btnLink,
}: {
  title: string;
  body: string;
  btnText: string;
  btnLink: string;
}) {
  return `<!DOCTYPE html><html dir="rtl" lang="ar">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 16px">
<tr><td align="center">
<table width="100%" style="max-width:520px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(10,37,64,0.08)">
<tr><td style="background:#0a2540;padding:28px 40px;text-align:center">
  <span style="color:#fff;font-size:18px;font-weight:700">Smart Academy</span>
</td></tr>
<tr><td style="padding:40px">
  <h1 style="color:#0a2540;font-size:22px;font-weight:700;margin:0 0 16px">${title}</h1>
  ${body}
  <div style="text-align:center;margin-top:28px">
    <a href="${btnLink}" style="background:#00b4d8;color:#fff;text-decoration:none;font-size:15px;font-weight:600;padding:14px 36px;border-radius:12px;display:inline-block">
      ${btnText}
    </a>
  </div>
  <p style="color:#94a3b8;font-size:12px;margin-top:24px;word-break:break-all">
    إذا لم يعمل الزر: <a href="${btnLink}" style="color:#00b4d8">${btnLink}</a>
  </p>
</td></tr>
</table>
</td></tr>
</table>
</body></html>`;
}
