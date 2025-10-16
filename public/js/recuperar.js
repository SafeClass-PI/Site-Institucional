function enviar() {
  const email = document.getElementById('ipt_email').value;

  fetch("/api/usuarios/recuperar-senha", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailServer: email }) // nome esperado no backend
  })
  .then(res => res.json())
  .then(resposta => {
    const msg = document.getElementById("mensagem-recuperacao");
    if (resposta.success) {
      msg.innerHTML = `<p style="color: green;">${resposta.message}</p>`;
    } else {
      msg.innerHTML = `<p style="color: red;">${resposta.message}</p>`;
    }
  })
  .catch(erro => {
    console.error("Erro ao recuperar senha:", erro);
    document.getElementById("mensagem-recuperacao").innerHTML = `<p style="color: red;">Erro ao enviar solicitação.</p>`;
  });
}
