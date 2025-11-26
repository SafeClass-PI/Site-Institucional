function carregarInfos() {
    var usuario = document.getElementById('nome-usuario-pagina');
    usuario.innerText = sessionStorage.NOME_USUARIO;
    
    var imgPerfil = document.getElementById('imgPerfil');

    if (imgPerfil) {
        if (sessionStorage.IMAGEM_USUARIO && sessionStorage.IMAGEM_USUARIO.trim() !== "") {
        imgPerfil.src = `/uploads/${sessionStorage.IMAGEM_USUARIO}`;
        } else {
        imgPerfil.src = 'imgs/profile-default.webp';
        }
    }
    
    listarMaquinas();
}

document.getElementById("exportarDados").addEventListener("click", () => {
    window.location.href = "/maquinas/exportarCSV";
});

let paginaAtual = 1;
const limite = 8;
let filtroAtual = "";

async function listarMaquinas(pagina = 1, filtro = "") {
    try {
        paginaAtual = pagina;
        const url = `/maquinas/listarMaquinas?pagina=${pagina}&limite=${limite}${filtro ? `&estado=${filtro}` : ""}`;
        const resposta = await fetch(url, { cache: "no-store" });
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
                        <button onclick="editarMaquina(${m.identificacao})"><i class="fa-solid fa-pencil"></i></button>
                        <button onclick="deletarMaquina(${m.identificacao})"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
                <div class="status-maquina">
                    <div class="status" id="statusMaquina">
                        <p>Status:</p>
                        <p class="estado-maquina">${m.estado}</p>
                    </div>
                    <div class="line-status"></div>
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

            const line = card.querySelector('.line-status');
            const p = card.querySelector('.estado-maquina');

            if (p) {
                if (m.estado === "Ligada") {
                    p.style.color = "#00AB03";
                    p.style.fontWeight = "bold";
                    line.style.backgroundColor = "#00AB03";
                } else {
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

// Escuta o filtro de status
document.getElementById("filtroMaquina").addEventListener("change", function () {
    filtroAtual = this.value.split(":")[1]; // "ligado" ou "desligado"
    listarMaquinas(paginaAtual, filtroAtual);
});

// Atualização automática com filtro aplicado
setInterval(() => listarMaquinas(paginaAtual, filtroAtual), 2000);



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

let idMaquinaEmEdicao = null;

async function carregarSalasEditar(idSelecionada) {
    try {
        const res = await fetch('/api/salas/listar');
        const salas = await res.json();
        const select = document.getElementById('select_editar_sala');
        select.innerHTML = '';
        salas.forEach(s => {
            const option = document.createElement('option');
            option.value = s.idSala;
            option.textContent = s.nome;
            if (String(s.idSala) === String(idSelecionada)) option.selected = true;
            select.appendChild(option);
        });
    } catch (e) {
        console.error(e);
    }
}

async function editarMaquina(id) {
    try {
        idMaquinaEmEdicao = id;
        const res = await fetch(`/maquinas/obter/${id}`);
        const m = await res.json();
        document.getElementById('ipt_editar_identificacao').value = `Máquina ${id}`;
        document.getElementById('ipt_editar_so').value = m.sistemaOperacional || '';
        await carregarSalasEditar(m.fkSala);
        telaOverlay.style.display = 'block';
        modalEditarMaquina.style.display = 'flex';
    } catch (e) {
        console.error('Erro ao carregar máquina', e);
        alert('Erro ao carregar dados da máquina');
    }
}

function cancelarEdicaoMaquina() {
    telaOverlay.style.display = 'none';
    modalEditarMaquina.style.display = 'none';
}

async function efetuarEdicaoMaquina() {
    try {
        const fkSala = document.getElementById('select_editar_sala').value;
        const sistemaOperacional = document.getElementById('ipt_editar_so').value.trim();
        if (!fkSala || !sistemaOperacional) {
            alert('Preencha os campos de edição');
            return;
        }
        const res = await fetch(`/maquinas/atualizar/${idMaquinaEmEdicao}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fkSala, sistemaOperacional })
        });
        if (!res.ok) throw new Error('Falha ao atualizar');
        alert('Máquina atualizada com sucesso!');
        modalEditarMaquina.style.display = 'none';
        telaOverlay.style.display = 'none';
        listarMaquinas(paginaAtual, filtroAtual);
    } catch (e) {
        console.error(e);
        alert('Erro ao atualizar máquina');
    }
}

let idMaquinaParaExcluir = null;

function deletarMaquina(id) {
    idMaquinaParaExcluir = id;
    const mensagem = document.querySelector('#modalDeletarMaquina .mensagem-deletar-modal p');
    if (mensagem) mensagem.textContent = `Deletar Máquina ${id}`;
    telaOverlay.style.display = 'block';
    modalDeletarMaquina.style.display = 'flex';
}

function cancelarExclusaoMaquina() {
    telaOverlay.style.display = 'none';
    modalDeletarMaquina.style.display = 'none';
}

async function confirmarExclusaoMaquina() {
    try {
        const res = await fetch(`/maquinas/${idMaquinaParaExcluir}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Falha ao deletar');
        alert('Máquina deletada com sucesso!');
        modalDeletarMaquina.style.display = 'none';
        telaOverlay.style.display = 'none';
        listarMaquinas(paginaAtual, filtroAtual);
    } catch (e) {
        console.error(e);
        alert('Erro ao deletar máquina');
    }
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

const dropdowns = document.querySelectorAll('.dropdown-container');

dropdowns.forEach(drop => {
    const btn = drop.querySelector('.dropbtn');

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        drop.classList.toggle('active');
    });
});

window.addEventListener('click', () => {
    dropdowns.forEach(drop => drop.classList.remove('active'));
});
