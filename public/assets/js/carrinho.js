// Recupera o carrinho do navegador
let cartData = JSON.parse(localStorage.getItem('carrinhoProducPlus')) || [];
let shippingCost = 0; // Começa com frete zero

// --- 1. RENDERIZAR E CALCULAR TOTAIS ---
function renderCart() {
    const cartContainer = document.getElementById('cartItems');
    cartData = JSON.parse(localStorage.getItem('carrinhoProducPlus')) || [];

    // Se vazio
    if (cartData.length === 0) {
        cartContainer.innerHTML = '<p style="text-align:center; padding:20px;">Seu carrinho está vazio.</p>';
        updateTotal(); // Zera os valores
        return;
    }

    // Gera o HTML dos itens (simples e limpo)
    cartContainer.innerHTML = cartData.map(item => `
        <div class="cart-item" style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #eee; padding: 15px 0;">
            <div style="flex-grow: 1;">
                <h4 style="margin: 0; font-size: 16px;">${item.name}</h4>
                <p style="margin: 0; color: #666;">R$ ${item.price.toFixed(2).replace('.', ',')}</p>
            </div>
            
            <div style="display: flex; align-items: center; gap: 15px;">
                <div style="display: flex; align-items: center; border: 1px solid #ddd; border-radius: 5px;">
                    <button onclick="changeQuantity(${item.id}, -1)" style="border: none; background: transparent; padding: 5px 10px; cursor: pointer;">-</button>
                    <span style="padding: 0 5px;">${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)" style="border: none; background: transparent; padding: 5px 10px; cursor: pointer;">+</button>
                </div>
                <button onclick="removeItem(${item.id})" style="border: none; background: transparent; color: red; cursor: pointer;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    updateTotal();
}

// --- 2. ATUALIZAR VALORES (SUBTOTAL E TOTAL) ---
function updateTotal() {
    // Calcula a soma de todos os itens (Preço x Quantidade)
    const subtotal = cartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + shippingCost;

    // Atualiza o HTML
    document.getElementById('subtotalPrice').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;

    // Atualiza o Frete na tela
    const shippingEl = document.getElementById('shippingPrice');
    if (shippingEl) {
        shippingEl.textContent = shippingCost === 0 ? 'R$ 0,00' : `R$ ${shippingCost.toFixed(2).replace('.', ',')}`;
    }

    // Atualiza o Total Geral
    document.getElementById('totalPrice').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// --- 3. FUNÇÕES DE QUANTIDADE E REMOVER ---
function changeQuantity(id, delta) {
    const index = cartData.findIndex(i => i.id === id);
    if (index > -1) {
        cartData[index].quantity += delta;
        if (cartData[index].quantity <= 0) cartData.splice(index, 1); // Remove se for zero
        localStorage.setItem('carrinhoProducPlus', JSON.stringify(cartData));
        renderCart();
    }
}

function removeItem(id) {
    if (confirm("Remover item?")) {
        cartData = cartData.filter(i => i.id !== id);
        localStorage.setItem('carrinhoProducPlus', JSON.stringify(cartData));
        renderCart();
    }
}

// --- 4. CÁLCULO DE FRETE (SIMULADO) ---
function calculateShipping() {
    const cep = document.getElementById('cepInput').value;
    const optionsDiv = document.getElementById('shippingOptions');

    if (cep.length >= 8) {
        optionsDiv.style.display = 'block';
        // Gera opções clicáveis
        optionsDiv.innerHTML = `
            <div onclick="selectShipping(15.90, this)" style="padding: 10px; border: 1px solid #ddd; margin-bottom: 5px; cursor: pointer; border-radius: 5px;">
                <strong>Econômico</strong> (7 dias) - R$ 15,90
            </div>
            <div onclick="selectShipping(25.90, this)" style="padding: 10px; border: 1px solid #ddd; cursor: pointer; border-radius: 5px;">
                <strong>Expresso</strong> (2 dias) - R$ 25,90
            </div>
        `;
    } else {
        alert("Digite um CEP válido.");
    }
}

function selectShipping(value, element) {
    shippingCost = value;

    // Efeito visual de seleção
    const options = document.getElementById('shippingOptions').children;
    for (let opt of options) {
        opt.style.borderColor = '#ddd';
        opt.style.backgroundColor = 'transparent';
    }
    element.style.borderColor = '#1800ad'; // Cor azul
    element.style.backgroundColor = '#f0f4ff';

    updateTotal(); // Recalcula o total com o frete
}

// --- 5. FINALIZAR COMPRA (BAIXA NO ESTOQUE) ---
async function realizarPagamento() {
    // Validações
    if (cartData.length === 0) return alert("Seu carrinho está vazio!");

    const token = localStorage.getItem('token');
    if (!token) {
        alert("Você precisa estar logado para comprar.");
        window.location.href = 'login.html';
        return;
    }

    // Pergunta se quer confirmar
    if (!confirm(`Confirmar compra no valor de R$ ${(cartData.reduce((a, b) => a + (b.price * b.quantity), 0) + shippingCost).toFixed(2)}?`)) {
        return;
    }

    try {
        // CHAMA O BACKEND PARA DAR BAIXA NO ESTOQUE
        const response = await fetch('http://localhost:3000/produtos/baixa-estoque', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(cartData) // Envia os itens do carrinho
        });

        if (response.ok) {
            alert("Compra realizada com sucesso! O estoque foi atualizado.");

            // Limpa o carrinho
            localStorage.removeItem('carrinhoProducPlus');
            cartData = [];
            shippingCost = 0;
            renderCart();

            // Aqui você pode redirecionar para uma página de sucesso
            // window.location.href = 'sucesso.html';
        } else {
            const erro = await response.json();
            alert("Erro ao finalizar: " + erro.message);
        }

    } catch (error) {
        console.error(error);
        alert("Erro de conexão com o servidor.");
    }
}

// Inicializa ao abrir a página
window.addEventListener('load', renderCart);