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

export async function enviarEmailRejeicao(destinatario, nomeUsuario) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Sistema de Monitoramento" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: "❌ Acesso Negado - Sistema de Monitoramento",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 20px;">
        <div style="background: #fff; border-radius: 10px; padding: 20px;">
          <h2 style="color: #c62828;">Solicitação Rejeitada</h2>
          <p>Olá <strong>${nomeUsuario}</strong>,</p>
          <p>Infelizmente, sua solicitação de acesso ao sistema de monitoramento foi <strong>rejeitada pelo gestor</strong>.</p>
          <p>Se você acredita que isso foi um engano ou deseja mais informações, entre em contato com a equipe responsável.</p>
          <br/>
          <p style="font-size: 14px; color: #777;">Atenciosamente,<br/>Equipe de Monitoramento</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}

export async function enviarEmailRecuperacao(destinatario, nomeUsuario, novaSenha) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Sistema de Monitoramento" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: "🔐 Recuperação de Senha - Sistema de Monitoramento",
    html: `
      <div style="font-family: Arial, sans-serif; background: #f7f7f7; padding: 20px;">
        <div style="background: #fff; border-radius: 10px; padding: 20px;">
          <h2 style="color: #1565c0;">Recuperação de Senha</h2>
          <p>Olá <strong>${nomeUsuario}</strong>,</p>
          <p>Você solicitou a recuperação de senha. Aqui está sua nova senha temporária:</p>
          <p style="font-size: 18px; font-weight: bold;">${novaSenha}</p>
          <p>⚠️ Essa senha é válida por apenas <strong>10 minutos</strong>. Após esse prazo, será necessário solicitar uma nova recuperação.</p>
          <p>Recomendamos que você altere essa senha após o login.</p>
          <br/>
          <p style="font-size: 14px; color: #777;">Atenciosamente,<br/>Equipe de Monitoramento</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}




// cadastro email



// Função de envio de e-mail de cadastro pendente
export async function enviarEmailCadastroPendente(destinatario, nomeUsuario, nomeGestor) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Sistema de Monitoramento" <${process.env.EMAIL_USER}>`,
    to: destinatario,
    subject: "Cadastro Recebido – Aguardando Aprovação do Gestor",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6f8; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 30px; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <h2 style="color: #0a3d62; margin-bottom: 20px; font-size: 24px;">Cadastro Recebido!</h2>
          <p style="font-size: 16px; color: #333333;">Olá <strong>${nomeUsuario}</strong>,</p>
          <p style="font-size: 16px; color: #333333; line-height: 1.6;">
            Seu cadastro foi efetuado com sucesso. Ele está <strong>aguardando aprovação</strong> do gestor <strong>${nomeGestor}</strong>. 
            Assim que aprovado, você poderá acessar o sistema normalmente.
          </p>
          <p style="font-size: 16px; color: #333333; line-height: 1.6;">
            Se tiver dúvidas ou precisar de suporte, entre em contato com nossa equipe.
          </p>
          <div style="margin-top: 30px; font-size: 14px; color: #888888; border-top: 1px solid #e0e0e0; padding-top: 15px;">
            Atenciosamente,<br/>
            Equipe de Monitoramento
          </div>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
}










