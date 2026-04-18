const btnMenu = document.getElementById('btn-menu');
const sidebar = document.getElementById('sidebar');

btnMenu.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

const links = document.querySelectorAll('.sidebar a');
links.forEach(link => {
    link.addEventListener('click', () => {
        sidebar.classList.remove('active');
    });
});

document.querySelector('.content').addEventListener('click', () => {
    sidebar.classList.remove('active');
});

async function carregarDenuncias(filtro = '') {
    const grid = document.querySelector('.reports-grid');
    grid.innerHTML = '<p>Carregando ocorrências...</p>';

    try {
        const apiBase = API_URL + "Buscar-Denuncias-Filtrado";
        const urlComFiltro = filtro ? `${apiBase}?tipo=${filtro}` : apiBase;
        
        const response = await fetch(urlComFiltro, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json' 
                },
            body: JSON.stringify({ QuantPorPagina: 100 }),
        })
        const denuncias = await response.json();

        if (denuncias.length === 0) {
            grid.innerHTML = '<p>Nenhuma denúncia encontrada para este filtro.</p>';
            return;
        }

        document.querySelector(".quantOcorrencia").innerHTML = denuncias.length;
        
        grid.innerHTML = denuncias.map(denuncia => criarCard(denuncia)).join('');

    } catch (error) {
        console.error("Erro ao carregar:", error);
        grid.innerHTML = '<p>Erro ao carregar os dados do servidor.</p>';
    }
}

const tipoDenuncias = ["Esgoto", "Queimada", "Poluicao de Rio", "Foco de Dengue", "Desmatamento", "Lixo e Entulho"]

function criarCard(denuncia) {
    // Formatação de data simples
    const dataFormatada = new Date(denuncia.dta_Cadastro).toLocaleDateString('pt-BR');

    return `
        <article class="report-card">
            <div class="report-image">
                <img src="${denuncia.url_Imagem}" alt="Foto da ocorrência">
                <span style='display: none' class="status-badge ${denuncia.flg_Progresso}">${denuncia.flg_Progresso}</span>
            </div>
            <div class="report-info">
                <span class="category">⚠️ ${tipoDenuncias[denuncia.tipo_Denuncia-1]}</span>
                <p class="description">${denuncia.des_Denuncia}</p>
                <div class="report-meta">
                    <span style='display:none'>📍 ${'Localização registrada'}</span>
                    <span>📅 ${dataFormatada}</span>
                </div>
                <div class="report-actions">
                    <button class="btn-view" onclick="verDetalhes('${denuncia.id}')">Ver no Mapa</button>
                    <button class="btn-resolve" onclick="alterarStatus('${denuncia.id}', 'Resolvido')">Resolver</button>
                </div>
            </div>
        </article>
    `;
}

// Inicializa a página carregando todas
document.addEventListener('DOMContentLoaded', () => carregarDenuncias());
