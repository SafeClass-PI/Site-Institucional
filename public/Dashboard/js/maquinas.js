function carregarInfos() {
    var usuario = document.getElementById('nome-usuario-pagina');
    usuario.innerText = sessionStorage.NOME_USUARIO;

    listarMaquinas();
}

document.getElementById("exportarDados").addEventListener("click", () => {
    window.location.href = "/maquinas/exportarCSV";
});

let paginaAtual = 1;
const limite = 8;

async function listarMaquinas(pagina = 1) {
    try {
        paginaAtual = pagina;
        const resposta = await fetch(`/maquinas/listarMaquinas?pagina=${pagina}&limite=${limite}`, { cache: "no-store" });
        const maquinas = await resposta.json();

        const painel = document.getElementById("painel-maquinas");
        painel.innerHTML = "";

        maquinas.forEach(m => {
            const card = document.createElement("div");
            card.classList.add("maquina");
            card.innerHTML = `
                    <div class="titulo-maquina">
                        <p>Máquina ${m.identificacao}</p>
                        <div class="btns-acoes-maquina">
                            <button onclick="editarMaquina()"><i class="fa-solid fa-pencil"></i></button>
                            <button onclick="deletarMaquina()"><i class="fa-solid fa-trash"></i></button>
                        </div>
                    </div>
                    <div class="status-maquina">
                        <div class="status" id="statusMaquina">
                            <p>Status:</p>
                            <p class="estado-maquina">${m.estado}</p>
                        </div>
                            <div class="line-status">
                            </div>
                        </div>
                        <div class="infos-maquina">
                            <div class="dados-maquina">
                                <div class="dado-maquina">
                                    <i class="fa-solid fa-location-dot"></i>
                                    <p>${m.localizacao}</p>
                                </div>
                               <div class="dado-maquina">
                                    <i class="fa-solid fa-laptop"></i>
                                    <p>${m.so}</p>
                                </div>
                                    <div class="dado-maquina">
                                        <p>IP: ${m.ipv4}</p>
                                    </div>
                                </div>
                                <div class="capacidade-maquina">
                                    <div class="componente-maquina">
                                        <p>Disco</p>
                                        <p>${m.disco_capacidade}</p>
                                    </div>
                                    <div class="componente-maquina">
                                        <p>RAM</p>
                                        <p>${m.ram_capacidade}</p>
                                    </div>
                                    <div class="componente-maquina">
                                        <p>CPU</p>
                                        <p>${m.cpu_capacidade}</p>
                                    </div>
                                </div>
                            </div>
            `;
            if (m.estado === "Ligada") {
                const line = card.querySelector('.line-status');
                const p = card.querySelector('.estado-maquina'); // seleciona só dentro do card atual
                if (p) {
                    p.style.color = "#00AB03";
                    p.style.fontWeight = "bold";
                    line.style.backgroundColor = "#00AB03";
                }
            }
            else {
                const line = card.querySelector('.line-status');
                const p = card.querySelector('.estado-maquina'); // seleciona só dentro do card atual
                if (p) {
                    p.style.color = "#ea0303";
                    p.style.fontWeight = "bold";
                    line.style.backgroundColor = "#ea0303";
                }
            }

            painel.appendChild(card);

        });

        atualizarBotoesPaginacao();
    } catch (erro) {
        console.error("Erro ao listar máquinas:", erro);
    }
}

setInterval(() => listarMaquinas(paginaAtual), 2000);

function atualizarBotoesPaginacao() {
    const btnPrev = document.querySelector(".prev");
    const btnNext = document.querySelector(".next");
    const paginas = document.querySelectorAll(".pagina");

    btnPrev.disabled = paginaAtual === 1;

    const totalPaginas = paginas.length;
    btnNext.disabled = paginaAtual === totalPaginas;

    paginas.forEach((btn, index) => {
        btn.classList.toggle("ativa", index + 1 === paginaAtual);
        btn.onclick = () => listarMaquinas(index + 1);
    });

    btnPrev.onclick = () => listarMaquinas(paginaAtual - 1);
    btnNext.onclick = () => listarMaquinas(paginaAtual + 1);
}

listarMaquinas();


function sairDaPagina() {
    modalLogout.style.display = 'flex';
    telaOverlay.style.display = 'block';
}

function cancelarSairDaPagina() {
    modalLogout.style.display = 'none';
    telaOverlay.style.display = 'none';
}

function confirmarSairDaPagina() {
    window.location.href = '../index.html'
}


function adicionarUsuario() {
    telaOverlay.style.display = 'block'
    modalAdicionarMaquina.style.display = 'flex';
}

function cancelarAdicionarMaquina() {
    telaOverlay.style.display = 'none';
    modalAdicionarMaquina.style.display = 'none';
}

const editarStatusMaquina = document.getElementById('editarStatusMaquina');

function atualizarCorSelect() {
    const valor = editarStatusMaquina.value;

    if (valor === "user-ativo") {
        editarStatusMaquina.style.backgroundColor = " var(--cor-estavel)";
        editarStatusMaquina.style.color = "white";
    }
    else if (valor === "user-inativo") {
        editarStatusMaquina.style.backgroundColor = "var(--cor-critico)";
        editarStatusMaquina.style.color = "white";
    }
    else {
        editarStatusMaquina.style.backgroundColor = "";
        editarStatusMaquina.style.color = "";
    }
}

if (editarStatusMaquina) {
    editarStatusMaquina.addEventListener("change", atualizarCorSelect);
    atualizarCorSelect();
}

function editarMaquina() {
    telaOverlay.style.display = 'block';
    modalEditarMaquina.style.display = 'flex';
}

function cancelarEdicaoMaquina() {
    telaOverlay.style.display = 'none';
    modalEditarMaquina.style.display = 'none';
}

function efetuarEdicaoMaquina() {
    alert('Usuário editado com sucesso!');
    telaOverlay.style.display = 'none';
    modalEditarMaquina.style.display = 'none';
}

function deletarMaquina() {
    telaOverlay.style.display = 'block';
    modalDeletarMaquina.style.display = 'flex';
}

function cancelarExclusaoMaquina() {
    telaOverlay.style.display = 'none';
    modalDeletarMaquina.style.display = 'none';
}

function confirmarExclusaoMaquina() {
    alert('Máquina editada com sucesso!');
    telaOverlay.style.display = 'none';
    modalDeletarMaquina.style.display = 'none';
}

function abrirModalDesligarMaquinas() {
    telaOverlay.style.display = 'block';
    modalDesligarMaquinas.style.display = 'flex';
}

function cancelarDesligamento() {
    telaOverlay.style.display = 'none';
    modalDesligarMaquinas.style.display = 'none';
}

function efetuarDesligamento() {
    telaOverlay.style.display = 'none';
    modalDesligarMaquinas.style.display = 'none';
    alert('Máquina desligada!')

    var maquina = document.getElementById('maquina-1');
    var line = document.getElementById('line-1');

    maquina.style.color = '#ea0303';
    maquina.innerHTML = 'Desligada';
    line.style.backgroundColor = '#ea0303';
}