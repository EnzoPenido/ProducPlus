// --- CARRINHO.JS (VERSÃO BLINDADA) ---

// 1. Recupera dados e Corrige preços estragados automaticamente
let cartData = JSON.parse(localStorage.getItem('carrinhoProducPlus')) || [];
let shippingCost = 0;

// Função para limpar preços (Transforma "R$ 19,90" ou "19.90" em número puro 19.90)
function limparPreco(valor) {
    if (typeof valor === 'number') return valor;
    if (!valor) return 0;
    // Remove "R$", espaços e troca vírgula por ponto
    let limpo = String(valor).replace('R$', '').replace(/\s/g, '').replace(',', '.');
    return parseFloat(limpo) || 0;
}

// 2. Renderizar itens
function renderCart() {
    console.log("Renderizando carrinho...", cartData); // Debug
    const cartContainer = document.getElementById('cartItems');

    // Atualiza leitura
    cartData = JSON.parse(localStorage.getItem('carrinhoProducPlus')) || [];

    if (cartData.length === 0) {
        cartContainer.innerHTML = '<div style="text-align: center; padding: 30px; color: #777;"><h3>Seu carrinho está vazio</h3><a href="products.html" style="color: #1800ad;">Voltar a comprar</a></div>';
        updateTotal();
        return;
    }

    cartContainer.innerHTML = cartData.map(item => {
        // Garante preço numérico para exibição
        const precoNumerico = limparPreco(item.price);

        return `
        <div class="cart-item" style="border-bottom: 1px solid #eee; padding: 15px 0; display: flex; align-items: center; justify-content: space-between;">
            <div class="item-info">
                <h4 style="margin: 0; font-size: 16px; color: #333;">${item.name}</h4>
                <span class="item-price" style="color: #666;">R$ ${precoNumerico.toFixed(2).replace('.', ',')}</span>
            </div>
            
            <div class="item-controls" style="display: flex; gap: 15px; align-items: center;">
                <div class="quantity-box" style="border: 1px solid #ddd; border-radius: 5px; display: flex; align-items: center;">
                    <button onclick="changeQuantity(${item.id}, -1)" style="border: none; background: transparent; padding: 5px 10px; cursor: pointer; font-weight: bold;">-</button>
                    <span style="padding: 0 5px; min-width: 20px; text-align: center;">${item.quantity}</span>
                    <button onclick="changeQuantity(${item.id}, 1)" style="border: none; background: transparent; padding: 5px 10px; cursor: pointer; font-weight: bold;">+</button>
                </div>

                <button onclick="removeItem(${item.id})" style="border: none; background: transparent; color: #dc3545; cursor: pointer; font-size: 18px;">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        </div>
    `}).join('');

    updateTotal();
}

// 3. ATUALIZAR TOTAIS (CORRIGIDO PARA APARECER SEMPRE)
function updateTotal() {
    let subtotal = 0;

    // Soma item a item com segurança
    cartData.forEach(item => {
        const preco = limparPreco(item.price);
        const qtd = parseInt(item.quantity) || 1;
        subtotal += preco * qtd;
    });

    const total = subtotal + shippingCost;

    console.log("Subtotal calculado:", subtotal); // Debug

    // Injeta no HTML
    const elSub = document.getElementById('subtotalPrice');
    const elShip = document.getElementById('shippingPrice');
    const elTotal = document.getElementById('totalPrice');

    if (elSub) elSub.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    if (elShip) elShip.textContent = `R$ ${shippingCost.toFixed(2).replace('.', ',')}`;
    if (elTotal) elTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

// 4. Mudar Quantidade
function changeQuantity(id, delta) {
    const index = cartData.findIndex(i => i.id === id);
    if (index > -1) {
        cartData[index].quantity += delta;
        if (cartData[index].quantity <= 0) cartData.splice(index, 1);

        localStorage.setItem('carrinhoProducPlus', JSON.stringify(cartData));
        renderCart();
    }
}

// 5. Remover
function removeItem(id) {
    if (confirm("Remover item?")) {
        cartData = cartData.filter(i => i.id !== id);
        localStorage.setItem('carrinhoProducPlus', JSON.stringify(cartData));
        renderCart();
    }
}

// 6. Calcular Frete
function calculateShipping() {
    const cepInput = document.getElementById('cepInput');
    const optionsDiv = document.getElementById('shippingOptions');

    // Remove tudo que não for número
    const cep = cepInput.value.replace(/\D/g, '');

    if (cep.length === 8) {
        optionsDiv.style.display = 'block';
        optionsDiv.innerHTML = `
            <div onclick="selectShipping(15.90, this)" style="border: 1px solid #ddd; padding: 10px; margin-bottom: 5px; cursor: pointer; border-radius: 5px; background: white;">
                <strong>Econômico</strong> (7 dias) - R$ 15,90
            </div>
            <div onclick="selectShipping(25.90, this)" style="border: 1px solid #ddd; padding: 10px; cursor: pointer; border-radius: 5px; background: white;">
                <strong>Expresso</strong> (2 dias) - R$ 25,90
            </div>
        `;
    } else {
        alert("Digite um CEP válido (8 números).");
    }
}

function selectShipping(valor, element) {
    shippingCost = valor;

    // Limpa seleção visual anterior
    const allOptions = document.getElementById('shippingOptions').children;
    for (let div of allOptions) {
        div.style.borderColor = '#ddd';
        div.style.backgroundColor = 'white';
    }

    // Marca o novo
    element.style.borderColor = '#1800ad';
    element.style.backgroundColor = '#eef0ff';

    updateTotal();
}

// 7. Finalizar (Baixa Estoque)
async function realizarPagamento() {
    if (cartData.length === 0) return alert("Seu carrinho está vazio!");

    const token = localStorage.getItem('token');
    if (!token) {
        alert("Faça login para finalizar.");
        window.location.href = 'login.html';
        return;
    }

    if (!confirm("Confirmar compra?")) return;

    try {
        const response = await fetch('http://localhost:3000/produtos/baixa-estoque', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(cartData)
        });

        if (response.ok) {
            alert("Compra realizada com sucesso!");
            localStorage.removeItem('carrinhoProducPlus');
            cartData = [];
            shippingCost = 0;
            renderCart();
        } else {
            const erro = await response.json();
            alert("Erro: " + erro.message);
        }
    } catch (error) {
        console.error(error);
        alert("Erro de conexão.");
    }
}

// Inicializa
window.addEventListener('load', renderCart);