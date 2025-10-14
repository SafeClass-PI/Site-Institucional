import nodemailer from "nodemailer";

export async function enviarEmailAprovacao(destinatario, nomeUsuario) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // definido no .env
      pass: process.env.EMAIL_PASS  // senha de app do Gmail
    }
  });

  const mailOptions = {
    from: `"Sistema de Monitoramento" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: "✅ Acesso Liberado - Sistema de Monitoramento",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 20px;">
        <div style="background: #fff; border-radius: 10px; padding: 20px;">
          <h2 style="color: #2e7d32;">Acesso Liberado!</h2>
          <p>Olá <strong>${nomeUsuario}</strong>,</p>
          <p>Seu cadastro foi <strong>aprovado pelo gestor</strong> e seu acesso ao sistema de monitoramento está liberado.</p>
          <p>Você já pode fazer login normalmente pelo site. 👨‍💻</p>
          <br/>
          <p style="font-size: 14px; color: #777;">Atenciosamente,<br/>Equipe de Monitoramento</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}
