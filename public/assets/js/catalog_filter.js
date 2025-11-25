// Sistema de Filtro e Busca para o Catálogo ProducPlus - VERSÃO CORRIGIDA

console.log('Script carregado!');

// Configuração das categorias
const categorias = {
    'todos': {
        titulo: 'Todos os Produtos',
        palavrasChave: []
    },
    'insumos': {
        titulo: 'Insumos',
        palavrasChave: ['insumo']
    },
    'materiais': {
        titulo: 'Materiais',
        palavrasChave: ['material', 'materia']
    },
    'ferramentas': {
        titulo: 'Ferramentas',
        palavrasChave: ['ferramenta']
    },
    'eletronica': {
        titulo: 'Eletrônica',
        palavrasChave: ['eletronica', 'eletrica']
    },
    'mecanica': {
        titulo: 'Mecânica',
        palavrasChave: ['mecanica']
    },
    'embalagem': {
        titulo: 'Embalagem',
        palavrasChave: ['embalagem']
    }
};

// Função para normalizar texto
function normalizarTexto(texto) {
    if (!texto) return '';
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

// Função principal de filtro
function filtrarCategorias(termoBusca, categoriaSelect) {
    console.log('Filtrando:', { termoBusca, categoriaSelect });
    
    const catalogBlocks = document.querySelectorAll('.catalog-block');
    console.log('Blocos encontrados:', catalogBlocks.length);
    
    const termoNormalizado = normalizarTexto(termoBusca);
    let resultadosVisiveis = 0;

    catalogBlocks.forEach((block, index) => {
        const h1Element = block.querySelector('.text-button-catalog h1');
        const spanElement = block.querySelector('.text-button-catalog span');
        
        if (!h1Element) {
            console.warn('H1 não encontrado no bloco', index);
            return;
        }
        
        const titulo = h1Element.textContent.trim();
        const descricao = spanElement ? spanElement.textContent.trim() : '';
        const tituloNormalizado = normalizarTexto(titulo);
        const descricaoNormalizada = normalizarTexto(descricao);
        
        console.log(`Bloco ${index}:`, { titulo, tituloNormalizado });
        
        let mostrar = true;

        // Filtro por select (departamento)
        if (categoriaSelect && categoriaSelect !== 'todos') {
            const categoria = categorias[categoriaSelect];
            if (categoria) {
                // Compara o título normalizado com as palavras-chave
                mostrar = categoria.palavrasChave.some(palavra => {
                    const match = tituloNormalizado.includes(palavra);
                    console.log(`  Comparando "${palavra}" com "${tituloNormalizado}": ${match}`);
                    return match;
                });
            }
        }

        // Filtro por busca textual (só aplica se passou no filtro de select)
        if (mostrar && termoNormalizado) {
            const buscaTitulo = tituloNormalizado.includes(termoNormalizado);
            const buscaDescricao = descricaoNormalizada.includes(termoNormalizado);
            mostrar = buscaTitulo || buscaDescricao;
            console.log(`  Busca textual: titulo=${buscaTitulo}, descricao=${buscaDescricao}`);
        }

        // Aplicar visibilidade com animação
        if (mostrar) {
            // Remover a classe de escondido
            block.classList.remove('catalog-hidden');
            block.style.display = 'flex';
            block.style.opacity = '0';
            block.style.height = '';
            block.style.margin = '';
            block.style.padding = '';
            setTimeout(() => {
                block.style.transition = 'opacity 0.3s ease-in';
                block.style.opacity = '1';
            }, 10);
            resultadosVisiveis++;
        } else {
            // Adicionar classe de escondido
            block.classList.add('catalog-hidden');
            block.style.transition = 'all 0.2s ease-out';
            block.style.opacity = '0';
            block.style.height = '0';
            block.style.margin = '0';
            block.style.padding = '0';
            block.style.overflow = 'hidden';
            setTimeout(() => {
                block.style.display = 'none';
            }, 200);
        }
    });

    console.log('Resultados visíveis:', resultadosVisiveis);
    gerenciarMensagemSemResultados(resultadosVisiveis);
}

// Função para mensagem de "sem resultados"
function gerenciarMensagemSemResultados(quantidade) {
    let mensagem = document.getElementById('sem-resultados');
    
    if (quantidade === 0) {
        if (!mensagem) {
            mensagem = document.createElement('div');
            mensagem.id = 'sem-resultados';
            mensagem.className = 'container';
            mensagem.style.cssText = `
                width: 100%;
                text-align: center;
                padding: 60px 20px;
                font-family: Roboto, sans-serif;
                color: #1800ad;
                margin-top: 40px;
            `;
            mensagem.innerHTML = `
                <i class="fa-solid fa-magnifying-glass" style="font-size: 48px; opacity: 0.3; margin-bottom: 20px; display: block;"></i>
                <h2 style="font-size: 24px; margin-bottom: 10px; font-weight: normal;">Nenhum resultado encontrado</h2>
                <p style="font-size: 14px; opacity: 0.7; margin: 0;">Tente ajustar seus filtros ou buscar por outro termo</p>
            `;
            
            const footer = document.querySelector('footer');
            if (footer) {
                footer.parentNode.insertBefore(mensagem, footer);
            }
        }
        mensagem.style.display = 'block';
    } else {
        if (mensagem) {
            mensagem.style.display = 'none';
        }
    }
}

// Função para resetar filtros
function resetarFiltros() {
    console.log('Resetando filtros...');
    const searchBar = document.querySelector('.search-bar');
    const selectDepartamento = document.getElementById('Departamentos');
    
    if (searchBar) searchBar.value = '';
    if (selectDepartamento) selectDepartamento.value = 'todos';
    
    filtrarCategorias('', 'todos');
}

// Debounce
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Inicialização
function inicializarFiltros() {
    console.log('Inicializando filtros...');
    
    const searchBar = document.querySelector('.search-bar');
    const selectDepartamento = document.getElementById('Departamentos');

    if (!searchBar) {
        console.error('Barra de busca não encontrada!');
        return;
    }
    
    if (!selectDepartamento) {
        console.error('Select de departamentos não encontrado!');
        return;
    }

    console.log('Elementos encontrados:', { searchBar, selectDepartamento });

    // Event listener para o select
    selectDepartamento.addEventListener('change', function() {
        console.log('Select mudou para:', this.value);
        const termoBusca = searchBar.value;
        filtrarCategorias(termoBusca, this.value);
    });

    // Event listener para a barra de busca
    const buscarComDebounce = debounce(function() {
        console.log('Barra de busca mudou para:', searchBar.value);
        const categoriaSelect = selectDepartamento.value;
        filtrarCategorias(searchBar.value, categoriaSelect);
    }, 300);

    searchBar.addEventListener('input', buscarComDebounce);

    // Tecla ESC para limpar
    searchBar.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            resetarFiltros();
        }
    });

    // Adicionar botão de limpar
    const filterSearchBar = document.querySelector('.filter-search-bar');
    if (filterSearchBar && !document.getElementById('btn-limpar-filtros')) {
        const btnLimpar = document.createElement('button');
        btnLimpar.id = 'btn-limpar-filtros';
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
        
        btnLimpar.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        });
        
        btnLimpar.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });
        
        btnLimpar.addEventListener('click', function(e) {
            e.preventDefault();
            resetarFiltros();
        });
        
        filterSearchBar.appendChild(btnLimpar);
        console.log('Botão de limpar adicionado');
    }

    console.log('Sistema de filtro inicializado com sucesso!');
}

// Aguardar o DOM carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarFiltros);
} else {
    inicializarFiltros();
}

// Exportar para uso global
window.filtrarCategorias = filtrarCategorias;
window.resetarFiltros = resetarFiltros;