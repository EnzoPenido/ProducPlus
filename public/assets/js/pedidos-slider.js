let pedidos = [];
let currentIndex = 0;
// Ajusta quantos cards aparecem por vez dependendo da tela
let cardsPerView = window.innerWidth > 992 ? 3 : window.innerWidth > 600 ? 2 : 1;

// --- FUNÇÕES UTILITÁRIAS ---
function parseJwt(token) {
    try { return JSON.parse(atob(token.split('.')[1])); } catch (e) { return null; }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function getStatusClass(status) {
    const map = {
        'PENDENTE': 'status-pendente',
        'AGUARDANDO': 'status-aguardando',
        'APROVADO': 'status-aprovado',
        'CONFIRMADA': 'status-confirmada',
        'ENTREGUE': 'status-entregue',
        'CANCELADO': 'status-cancelada'
    };
    return map[status] || 'status-aguardando';
}

// --- RENDERIZAR O SLIDER ---
function renderPedidos() {
    const slider = document.getElementById('pedidosSlider');
    if (!slider) return;

    if (pedidos.length === 0) {
        slider.innerHTML = '<div class="text-center w-100 p-4">Você ainda não tem pedidos.</div>';
        return;
    }

    // Calcula largura de cada card (33.33%, 50% ou 100%)
    const cardWidth = 100 / cardsPerView;
    
    // Limpa e recria
    slider.innerHTML = '';
    slider.style.display = 'flex';
    slider.style.transition = 'transform 0.5s ease-in-out';
    
    // Move o slider para mostrar os itens certos
    slider.style.transform = `translateX(-${currentIndex * cardWidth}%)`;

    pedidos.forEach(pedido => {
        const div = document.createElement('div');
        div.className = 'pedido-slide-item';
        div.style.minWidth = `${cardWidth}%`;
        div.style.padding = '10px';
        div.style.boxSizing = 'border-box';

        div.innerHTML = `
            <div class="pedido-card shadow-sm">
                <div class="pedido-header">
                    <span class="pedido-id">#${pedido.idCompra}</span>
                    <span class="pedido-data">${formatDate(pedido.dataCompra)}</span>
                </div>
                <div class="pedido-body">
                    <div class="pedido-status ${getStatusClass(pedido.statusCompra)}">
                        ${pedido.statusCompra}
                    </div>
                    <div class="pedido-valor">
                        ${formatCurrency(pedido.valorTotal)}
                    </div>
                </div>
            </div>
        `;
        slider.appendChild(div);
    });

    atualizarBotoes();
}

// --- CONTROLES DO SLIDER ---
function moveSlider(direction) {
    const maxIndex = pedidos.length - cardsPerView;
    
    if (direction === 'next') {
        if (currentIndex < maxIndex) currentIndex++;
    } else {
        if (currentIndex > 0) currentIndex--;
    }
    
    renderPedidos();
}

function atualizarBotoes() {
    const btnPrev = document.getElementById('btnPrev');
    const btnNext = document.getElementById('btnNext');
    if(!btnPrev || !btnNext) return;

    const maxIndex = pedidos.length - cardsPerView;

    btnPrev.disabled = currentIndex <= 0;
    btnNext.disabled = currentIndex >= maxIndex;
    
    btnPrev.style.opacity = currentIndex <= 0 ? '0.5' : '1';
    btnNext.style.opacity = currentIndex >= maxIndex ? '0.5' : '1';
}

// --- BUSCAR DADOS ---
async function carregarPedidos() {
    const token = localStorage.getItem('token');
    const slider = document.getElementById('pedidosSlider');
    
    if (!token) {
        if(slider) slider.innerHTML = '<p>Faça login para ver seus pedidos.</p>';
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/compras/meus-pedidos', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            const data = await response.json();
            
            pedidos = Array.isArray(data) ? data : [];
    
            pedidos.sort((a, b) => new Date(b.dataCompra) - new Date(a.dataCompra));

            renderPedidos();
        } else {
            console.error("Erro API:", response.status);
            if(slider) slider.innerHTML = '<p class="text-danger text-center">Erro ao carregar pedidos.</p>';
        }
    } catch (error) {
        console.error("Erro Fetch:", error);
        if(slider) slider.innerHTML = '<p class="text-danger text-center">Erro de conexão.</p>';
    }
}

// --- INICIALIZAÇÃO ---
window.addEventListener('load', () => {
    carregarPedidos();
    document.getElementById('btnPrev')?.addEventListener('click', () => moveSlider('prev'));
    document.getElementById('btnNext')?.addEventListener('click', () => moveSlider('next'));
});

// Responsividade: Recalcula itens por tela ao mudar tamanho da janela
window.addEventListener('resize', () => {
    const newCards = window.innerWidth > 992 ? 3 : window.innerWidth > 600 ? 2 : 1;
    if (newCards !== cardsPerView) {
        cardsPerView = newCards;
        currentIndex = 0;
        renderPedidos();
    }
});