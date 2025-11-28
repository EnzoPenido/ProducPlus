let pedidos = [];
        let currentIndex = 0;
        const cardsPerView = window.innerWidth > 768 ? 3 : window.innerWidth > 480 ? 2 : 1;

        function parseJwt(token) {
            try {
                return JSON.parse(atob(token.split('.')[1]));
            } catch (e) {
                return null;
            }
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }

        function formatCurrency(value) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(value);
        }

        function getStatusClass(status) {
            const statusMap = {
                'PENDENTE': 'status-pendente',
                'AGUARDANDO': 'status-aguardando',
                'CONFIRMADA': 'status-confirmada',
                'ENTREGUE': 'status-entregue',
                'CANCELADA': 'status-cancelada'
            };
            return statusMap[status] || 'status-aguardando';
        }

        function renderPedidos() {
            const slider = document.getElementById('pedidosSlider');

            if (pedidos.length === 0) {
                slider.innerHTML = `
                    <div class="empty-state" style="width: 100%;">
                        <div class="empty-state-icon">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                        <div class="empty-state-text">Nenhum pedido encontrado</div>
                        <div style="font-size: 12pt; opacity: 0.7;">Você ainda não fez nenhuma compra</div>
                    </div>
                `;
                document.getElementById('sliderControls').style.display = 'none';
                return;
            }

            slider.innerHTML = pedidos.map(pedido => `
                <div class="pedido-card" onclick="abrirDetalhePedido(${pedido.idCompra})">
                    <div>
                        <div class="pedido-numero">Pedido nº</div>
                        <div class="pedido-id">#${pedido.idCompra}</div>
                    </div>

                    <div class="pedido-info">
                        <div class="info-item">
                            <span class="info-label">Data:</span>
                            <span class="info-value">${formatDate(pedido.dataCompra)}</span>
                        </div>
                        <div class="info-item">
                            <span class="info-label">Total:</span>
                            <span class="info-value">${formatCurrency(pedido.valorTotal)}</span>
                        </div>
                    </div>

                    <div class="pedido-status ${getStatusClass(pedido.statusCompra)}">
                        ${pedido.statusCompra}
                    </div>
                </div>
            `).join('');

            updateSliderPosition();
            updateControls();
            document.getElementById('sliderControls').style.display = 'flex';
        }

        function updateSliderPosition() {
            const slider = document.getElementById('pedidosSlider');
            const translateX = -currentIndex * (100 / cardsPerView);
            slider.style.transform = `translateX(${translateX}%)`;
        }

        function updateControls() {
            const totalPages = Math.ceil(pedidos.length / cardsPerView);
            document.getElementById('currentSlide').textContent = currentIndex + 1;
            document.getElementById('totalSlides').textContent = totalPages;

            document.getElementById('prevBtn').disabled = currentIndex === 0;
            document.getElementById('nextBtn').disabled = currentIndex >= totalPages - 1;
        }

        function handlePrev() {
            if (currentIndex > 0) {
                currentIndex--;
                updateSliderPosition();
                updateControls();
            }
        }

        function handleNext() {
            const totalPages = Math.ceil(pedidos.length / cardsPerView);
            if (currentIndex < totalPages - 1) {
                currentIndex++;
                updateSliderPosition();
                updateControls();
            }
        }

        function abrirDetalhePedido(idCompra) {
            console.log('Abrir detalhes do pedido:', idCompra);
            // Aqui você pode redirecionar para uma página de detalhes ou abrir um modal
            // Exemplo: window.location.href = `detalhes-pedido.html?id=${idCompra}`;
        }

        async function carregarPedidos() {
            const slider = document.getElementById('pedidosSlider');
            
            try {
                const token = localStorage.getItem('token') || sessionStorage.getItem('token');

                if (!token) {
                    slider.innerHTML = '<div class="empty-state" style="width: 100%;"><div>Você precisa estar logado</div></div>';
                    return;
                }

                const user = parseJwt(token);

                if (!user || user.tipo !== 'CLIENTE') {
                    slider.innerHTML = '<div class="empty-state" style="width: 100%;"><div>Acesso não autorizado</div></div>';
                    return;
                }

                const response = await fetch('/api/compras', { /*A informação que deve aparecer no slider de pedidos precisa estar aqui */
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`Erro ao buscar pedidos: ${response.status}`);
                }

                const data = await response.json();
                
                // Filtrar apenas as compras do cliente logado
                pedidos = (Array.isArray(data) ? data : []).filter(
                    compra => compra.cnpjCliente === user.cnpjCliente
                ).sort((a, b) => new Date(b.dataCompra) - new Date(a.dataCompra));

                currentIndex = 0;
                renderPedidos();

            } catch (error) {
                console.error('Erro ao carregar pedidos:', error);
                slider.innerHTML = `
                    <div class="empty-state" style="width: 100%;">
                        <div class="empty-state-icon">
                            <i class="fas fa-exclamation-circle"></i>
                        </div>
                        <div class="empty-state-text">Erro ao carregar pedidos</div>
                        <div style="font-size: 12pt; opacity: 0.7; margin-top: 10px;">
                            ${error.message}
                        </div>
                    </div>
                `;
            }
        }

        // Carregar pedidos ao abrir a página
        window.addEventListener('load', carregarPedidos);

        // Atualizar cardsPerView ao redimensionar
        window.addEventListener('resize', () => {
            const newCardsPerView = window.innerWidth > 768 ? 3 : window.innerWidth > 480 ? 2 : 1;
            if (newCardsPerView !== cardsPerView) {
                currentIndex = 0;
                updateSliderPosition();
                updateControls();
            }
        });