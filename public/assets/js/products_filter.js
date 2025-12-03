console.log('Script de filtro de produtos carregado!');

// Função para normalizar texto (remove acentos e deixa minúsculo)
function normalizarTexto(texto) {
    if (!texto) return '';
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// Função principal de filtro - ATUALIZADA para esconder seções vazias
function filtrarProdutos(termoBusca) {
    console.log('Filtrando produtos:', { termoBusca });

    // Pega todos os cards de produtos
    const productCards = document.querySelectorAll('.container-products-item');
    console.log('Cards encontrados:', productCards.length);

    const termoNormalizado = normalizarTexto(termoBusca);
    let resultadosVisiveis = 0;

    // Objeto para rastrear quais seções têm produtos visíveis
    const secoesComProdutos = new Set();

    productCards.forEach((card, index) => {
        // Pega o nome do produto dentro do card
        const h1Element = card.querySelector('.container-products-text h1');
        const descricaoElement = card.querySelector('.container-products-text p');

        if (!h1Element) {
            console.warn('H1 não encontrado no card', index);
            return;
        }

        const nomeProduto = h1Element.textContent.trim();
        const descricaoProduto = descricaoElement ? descricaoElement.textContent.trim() : '';
        const nomeProdutoNormalizado = normalizarTexto(nomeProduto);
        const descricaoNormalizada = normalizarTexto(descricaoProduto);

        console.log(`Card ${index}:`, { nomeProduto, nomeProdutoNormalizado });

        let mostrar = true;

        // Filtro por busca textual
        if (termoNormalizado) {
            const buscaNome = nomeProdutoNormalizado.includes(termoNormalizado);
            const buscaDescricao = descricaoNormalizada.includes(termoNormalizado);
            mostrar = buscaNome || buscaDescricao;
            console.log(`  Busca textual: nome=${buscaNome}, descricao=${buscaDescricao}`);
        }

        // Pega a seção do card
        const secaoCard = card.getAttribute('data-secao');

        // Aplicar visibilidade com animação
        if (mostrar) {
            // Adiciona a seção ao conjunto de seções visíveis
            if (secaoCard) {
                secoesComProdutos.add(secaoCard);
            }

            // Remover a classe de escondido
            card.classList.remove('product-hidden');
            card.style.display = 'flex';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';

            setTimeout(() => {
                card.style.transition = 'opacity 0.3s ease-in, transform 0.3s ease-in';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            }, 10);
            resultadosVisiveis++;
        } else {
            // Adicionar classe de escondido
            card.classList.add('product-hidden');
            card.style.transition = 'all 0.2s ease-out';
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';

            setTimeout(() => {
                card.style.display = 'none';
            }, 200);
        }
    });

    console.log('Resultados visíveis:', resultadosVisiveis);
    console.log('Seções com produtos:', secoesComProdutos);

    // Gerenciar visibilidade das seções
    gerenciarVisibilidadeSecoes(secoesComProdutos, termoNormalizado);
    gerenciarMensagemSemResultados(resultadosVisiveis);
}

// NOVA FUNÇÃO: Gerenciar visibilidade das seções
function gerenciarVisibilidadeSecoes(secoesComProdutos, termoBusca) {
    // Pega todas as seções
    const secoes = document.querySelectorAll('.secao-categorias, .secao-categoria');

    secoes.forEach(secao => {
        const secaoId = secao.id; // ex: "secao-insumos", "secao-material", etc

        // Extrai o nome da seção do ID (remove "secao-")
        const nomeSecao = secaoId.replace('secao-', '');

        // Se não há busca ativa, mostra todas as seções
        if (!termoBusca) {
            secao.style.display = 'block';
            secao.style.opacity = '1';
            return;
        }

        // Se há busca, mostra apenas seções com produtos visíveis
        if (secoesComProdutos.has(nomeSecao)) {
            secao.style.display = 'block';
            secao.style.transition = 'opacity 0.3s ease-in';
            secao.style.opacity = '1';
        } else {
            secao.style.transition = 'opacity 0.2s ease-out';
            secao.style.opacity = '0';
            setTimeout(() => {
                secao.style.display = 'none';
            }, 200);
        }
    });
}

// Função para mostrar/esconder mensagem de "sem resultados"
function gerenciarMensagemSemResultados(quantidade) {
    let mensagem = document.getElementById('sem-resultados-produtos');

    if (quantidade === 0) {
        if (!mensagem) {
            mensagem = document.createElement('div');
            mensagem.id = 'sem-resultados-produtos';
            mensagem.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
                padding: 60px 20px;
                text-align: center;
                color: #999;
                margin-top: 50px;
            `;
            mensagem.innerHTML = `
                <i class="fa-solid fa-magnifying-glass" style="font-size: 48pt; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3 style="font-size: 18pt; margin-bottom: 10px; color: #666;">Nenhum produto encontrado</h3>
                <p style="font-size: 12pt; color: #999;">Tente buscar com outros termos</p>
            `;

            // Adiciona a mensagem após a última seção
            const ultimaSecao = document.querySelector('.secao-categoria:last-of-type, .secao-categorias');
            if (ultimaSecao) {
                ultimaSecao.parentNode.appendChild(mensagem);
            }
        }
        mensagem.style.display = 'flex';
    } else {
        if (mensagem) {
            mensagem.style.display = 'none';
        }
    }
}

// Função para resetar filtros
function resetarFiltrosProdutos() {
    console.log('Resetando filtros de produtos...');
    const searchBar = document.querySelector('.search-bar');

    if (searchBar) searchBar.value = '';

    filtrarProdutos('');
}

// Debounce para não sobrecarregar
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Inicialização
function inicializarFiltroProdutos() {
    console.log('Inicializando filtro de produtos...');

    const searchBar = document.querySelector('.search-bar');

    if (!searchBar) {
        console.error('Barra de busca não encontrada!');
        return;
    }

    console.log('Barra de busca encontrada:', searchBar);

    // Event listener para a barra de busca com debounce
    const buscarComDebounce = debounce(function () {
        console.log('Barra de busca mudou para:', searchBar.value);
        filtrarProdutos(searchBar.value);
    }, 300);

    searchBar.addEventListener('input', buscarComDebounce);

    // Tecla ESC para limpar
    searchBar.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            resetarFiltrosProdutos();
        }
    });

    // Adicionar botão de limpar
    const filterSearchBar = document.querySelector('.filter-search-bar');
    if (filterSearchBar && !document.getElementById('btn-limpar-filtros-produtos')) {
        const btnLimpar = document.createElement('button');
        btnLimpar.id = 'btn-limpar-filtros-produtos';
        btnLimpar.innerHTML = '<i class="fa-solid fa-rotate-right"></i>';
        btnLimpar.setAttribute('type', 'button');
        btnLimpar.style.cssText = `
            background: transparent;
            border: 1px solid white;
            color: white;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            margin-left: 10px;
            transition: all 0.3s;
            font-size: 14px;
        `;
        btnLimpar.title = 'Limpar filtros';

        btnLimpar.addEventListener('mouseenter', function () {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });

        btnLimpar.addEventListener('mouseleave', function () {
            this.style.backgroundColor = 'transparent';
        });

        btnLimpar.addEventListener('click', function (e) {
            e.preventDefault();
            resetarFiltrosProdutos();
        });

        filterSearchBar.appendChild(btnLimpar);
        console.log('Botão de limpar adicionado');
    }

    console.log('Sistema de filtro de produtos inicializado com sucesso!');
}

// Aguardar o carregamento do DOM e dos produtos
function iniciarQuandoProdutosCarregados() {
    // Verifica se já existem produtos na página
    const verificarProdutos = setInterval(() => {
        const produtos = document.querySelectorAll('.container-products-item');
        if (produtos.length > 0) {
            console.log('Produtos detectados, inicializando filtro...');
            clearInterval(verificarProdutos);
            inicializarFiltroProdutos();
        }
    }, 500);

    // Timeout de segurança (10 segundos)
    setTimeout(() => {
        clearInterval(verificarProdutos);
        console.log('Timeout: Inicializando filtro mesmo sem produtos');
        inicializarFiltroProdutos();
    }, 10000);
}

// Iniciar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarQuandoProdutosCarregados);
} else {
    iniciarQuandoProdutosCarregados();
}

// Exportar para uso global
window.filtrarProdutos = filtrarProdutos;
window.resetarFiltrosProdutos = resetarFiltrosProdutos;