function carregarInfos() {
    var usuario = document.getElementById('nome-usuario-pagina');
    usuario.innerText = sessionStorage.NOME_USUARIO;

    listarQtdPaginas();
    listarAlertas();
}

document.getElementById("exportarDados").addEventListener("click", () => {
    window.location.href = "/api/alertas/exportarCSV";
});

async function listarQtdPaginas() {
    try {
        const resposta = await fetch("/api/alertas/qtdPaginas");
        const dados = await resposta.json();
        
        const totalPaginas = dados[0].paginas;

        console.log("Total de páginas:", totalPaginas);

        const divPaginacao = document.getElementById("paginasAlertas");
        divPaginacao.innerHTML = "";

        // Botão Anterior
        const btnPrev = document.createElement("button");
        btnPrev.className = "prev";
        btnPrev.textContent = "< Anterior";
        btnPrev.onclick = () => listarAlertas(paginaAtual - 1);
        divPaginacao.appendChild(btnPrev);

        for (let i = 1; i <= totalPaginas; i++) {
            const btn = document.createElement("button");
            btn.className = "pagina";
            btn.textContent = i;

            btn.onclick = () => listarAlertas(i);

            divPaginacao.appendChild(btn);
        }

        const btnNext = document.createElement("button");
        btnNext.className = "next";
        btnNext.textContent = "Próximo >";
        btnNext.onclick = () => listarAlertas(paginaAtual + 1);
        divPaginacao.appendChild(btnNext);

    } catch (erro) {
        console.error("Erro ao carregar número de páginas:", erro);
    }
}

setInterval(() => listarQtdPaginas(), 2000);


let paginaAtual = 1;
const limite = 8;

async function listarAlertas(pagina = 1) {
    try {
        paginaAtual = pagina;
        const resposta = await fetch(`/api/alertas/listarAlertas?pagina=${pagina}&limite=${limite}`, { cache: "no-store" });
        const alertas = await resposta.json();

        const tbody = document.getElementById("tbodyAlertas");
        tbody.innerHTML = "";

        alertas.forEach(a => {
            const tr = document.createElement("tr");
            const statusClass = a.nivel.toLowerCase() === "atenção" ? "status-atencao" : "status-inativo";

            tr.innerHTML = `
                        <td>
                            <p>${a.identificacao}</p>
                        </td>
                        <td>
                            <p>${a.componente}</p>
                        </td>
                        <td>
                            <p>${a.mensagem}</p>
                        </td>
                            <td><span class="${statusClass}">${a.nivel}</span></td>
                        <td>
                            <p>${a.localizacao}</p>
                        </td>
                        <td>
                            <p>${a.hora}</p>
                        </td>
                    `;

            tbody.appendChild(tr);
        });

        atualizarBotoesPaginacao();

    } catch (erro) {
        console.error("Erro ao listar usuários:", erro);
    }
}

setInterval(() => listarAlertas(paginaAtual), 2000);

function atualizarBotoesPaginacao() {
    const btnPrev = document.querySelector(".prev");
    const btnNext = document.querySelector(".next");
    const paginas = document.querySelectorAll(".pagina");

    btnPrev.disabled = paginaAtual === 1;

    const totalPaginas = paginas.length;
    btnNext.disabled = paginaAtual === totalPaginas;

    paginas.forEach((btn, index) => {
        btn.classList.toggle("ativa", index + 1 === paginaAtual);
        btn.onclick = () => listarAlertas(index + 1);
    });

    btnPrev.onclick = () => listarAlertas(paginaAtual - 1);
    btnNext.onclick = () => listarAlertas(paginaAtual + 1);
}

listarAlertas();