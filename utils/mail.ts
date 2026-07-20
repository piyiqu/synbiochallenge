import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.QQ_EMAIL,
    pass: process.env.QQ_EMAIL_AUTH_CODE,
  },
});

export async function sendVerificationCode(to: string, code: string) {
  await transporter.sendMail({
    from: `合成生物学创新赛 <${process.env.QQ_EMAIL}>`,
    to,
    subject: "邮箱验证码 - 合成生物学创新赛",
    html: `
      <div style="max-width:600px;margin:0 auto;padding:20px;font-family:Arial,sans-serif">
        <h2 style="color:#16a34a">合成生物学创新赛</h2>
        <p style="font-size:16px">你的验证码是：</p>
        <p style="font-size:32px;font-weight:bold;color:#16a34a;letter-spacing:4px">${code}</p>
        <p style="font-size:14px;color:#888">验证码 5 分钟内有效，请勿泄露给他人。</p>
      </div>
    `,
  });
}
