// Dados mockados do carrinho (substituir por dados reais do backend)
        let cartData = [
            { id: 1, name: "Produto 1", quantity: 1, price: 35.00 },
            { id: 2, name: "Produto 2", quantity: 2, price: 45.00 },
            { id: 3, name: "Produto 3", quantity: 1, price: 55.00 },
            { id: 4, name: "Produto 4", quantity: 1, price: 25.00 },
            { id: 5, name: "Produto 5", quantity: 1, price: 30.00 },
            { id: 6, name: "Produto 6", quantity: 1, price: 40.00 }
        ];

        let shippingCost = 0;

        // Renderizar itens do carrinho
        function renderCart() {
            const cartContainer = document.getElementById('cartItems');
            
            if (cartData.length === 0) {
                cartContainer.innerHTML = '<div class="empty-cart">Seu carrinho está vazio</div>';
                updateTotal();
                return;
            }

            cartContainer.innerHTML = cartData.map(item => `
                <div class="cart-item">
                    <div class="item-info">
                        <span class="item-name">${item.name}</span>
                        <span class="item-price">R$${item.price.toFixed(2).replace('.', ',')} cada</span>
                    </div>
                    <div class="item-controls">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)" ${item.quantity <= 1 ? 'disabled' : ''}>−</button>
                            <span class="item-quantity">${item.quantity}x</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeItem(${item.id})" title="Remover item">×</button>
                    </div>
                </div>
            `).join('');

            updateTotal();
        }

        // Atualizar quantidade
        function updateQuantity(itemId, change) {
            const item = cartData.find(i => i.id === itemId);
            if (item) {
                item.quantity += change;
                if (item.quantity < 1) {
                    item.quantity = 1;
                }
                renderCart();
            }
        }

        // Remover item
        function removeItem(itemId) {
            if (confirm('Deseja remover este item do carrinho?')) {
                cartData = cartData.filter(i => i.id !== itemId);
                renderCart();
            }
        }

        // Calcular total
        function updateTotal() {
            const subtotal = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const total = subtotal + shippingCost;
            
            // Atualizar subtotal
            document.getElementById('subtotalValue').textContent = `R$${subtotal.toFixed(2).replace('.', ',')}`;
            
            // Atualizar frete
            document.getElementById('shippingValue').textContent = shippingCost === 0 && document.getElementById('shippingOptions').style.display === 'none' 
                ? 'R$0,00' 
                : `R$${shippingCost.toFixed(2).replace('.', ',')}`;
            
            // Atualizar total
            document.getElementById('totalValue').textContent = `R$${total.toFixed(2).replace('.', ',')}`;
        }

        // Calcular frete (mockado - integrar com API real)
        function calcularFrete() {
            const cep = document.getElementById('cepInput').value.replace(/\D/g, '');
            
            if (cep.length !== 8) {
                alert('Por favor, insira um CEP válido');
                return;
            }

            // Simular chamada de API
            const shippingOptionsDiv = document.getElementById('shippingOptions');
            shippingOptionsDiv.style.display = 'flex';
            
            // Opções mockadas (substituir por dados reais da API)
            shippingOptionsDiv.innerHTML = `
                <label class="shipping-option" onclick="selectShipping(0)">
                    <input type="radio" name="shipping" value="0">
                    <div class="shipping-info">
                        <div class="shipping-name">Retirar na loja</div>
                        <div class="shipping-details">Disponível imediatamente</div>
                    </div>
                    <div class="shipping-price">Grátis</div>
                </label>
                <label class="shipping-option" onclick="selectShipping(15)">
                    <input type="radio" name="shipping" value="15">
                    <div class="shipping-info">
                        <div class="shipping-name">Entrega Econômica</div>
                        <div class="shipping-details">Até 10 dias úteis</div>
                    </div>
                    <div class="shipping-price">R$15,00</div>
                </label>
                <label class="shipping-option" onclick="selectShipping(30)">
                    <input type="radio" name="shipping" value="30">
                    <div class="shipping-info">
                        <div class="shipping-name">Entrega Expressa</div>
                        <div class="shipping-details">Até 3 dias úteis</div>
                    </div>
                    <div class="shipping-price">R$30,00</div>
                </label>
            `;
        }

        // Selecionar opção de frete
        function selectShipping(cost) {
            shippingCost = cost;
            
            // Atualizar visual da seleção
            document.querySelectorAll('.shipping-option').forEach(option => {
                option.classList.remove('selected');
            });
            event.currentTarget.classList.add('selected');
            
            updateTotal();
        }

        // Realizar pagamento
        function realizarPagamento() {
            if (cartData.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }

            if (shippingCost === null && document.getElementById('shippingOptions').style.display === 'flex') {
                alert('Por favor, selecione uma opção de frete!');
                return;
            }

            // Aqui você integraria com o sistema de pagamento
            alert('Redirecionando para pagamento...');
            // window.location.href = 'payment.html';
        }

        // Máscara para CEP
        document.getElementById('cepInput').addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.slice(0, 5) + '-' + value.slice(5, 8);
            }
            e.target.value = value;
        });

        // Inicializar
        renderCart();