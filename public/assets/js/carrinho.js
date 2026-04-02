let cartData = JSON.parse(localStorage.getItem('carrinhoProducPlus')) || [];
let shippingCost = 0;

function limparPreco(valor) {
    if (typeof valor === 'number') return valor;
    if (!valor) return 0;
    let limpo = String(valor).replace('R$', '').replace(/\s/g, '').replace(',', '.');
    return parseFloat(limpo) || 0;
}

function renderCart() {
    console.log("Renderizando carrinho...", cartData);
    const cartContainer = document.getElementById('cartItems');

    cartData = JSON.parse(localStorage.getItem('carrinhoProducPlus')) || [];

    if (cartData.length === 0) {
        cartContainer.innerHTML = '<div style="text-align: center; padding: 30px; color: #777;"><h3>Seu carrinho está vazio</h3><a href="products.html" style="color: #1800ad;">Voltar a comprar</a></div>';
        updateTotal();
        return;
    }

    cartContainer.innerHTML = cartData.map(item => {
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

function updateTotal() {
    let subtotal = 0;

    cartData.forEach(item => {
        const preco = limparPreco(item.price);
        const qtd = parseInt(item.quantity) || 1;
        subtotal += preco * qtd;
    });

    const total = subtotal + shippingCost;
    const elSub = document.getElementById('subtotalPrice');
    const elShip = document.getElementById('shippingPrice');
    const elTotal = document.getElementById('totalPrice');

    if (elSub) elSub.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    if (elShip) elShip.textContent = `R$ ${shippingCost.toFixed(2).replace('.', ',')}`;
    if (elTotal) elTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function changeQuantity(id, delta) {
    const index = cartData.findIndex(i => i.id === id);
    if (index > -1) {
        cartData[index].quantity += delta;
        if (cartData[index].quantity <= 0) cartData.splice(index, 1);

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

function updateTotal() {
    let subtotal = 0;

    // Calcula o subtotal real baseado nos itens do localStorage
    cartData.forEach(item => {
        const preco = limparPreco(item.price);
        const qtd = parseInt(item.quantity) || 1;
        subtotal += preco * qtd;
    });

    // Descobre qual frete o usuário selecionou na tela
    const freteSelecionado = document.querySelector('input[name="shippingOption"]:checked');
    let valorFrete = 0;

    if (freteSelecionado) {
        valorFrete = Number(freteSelecionado.value);
    }

    // Calcula o Total Final
    const total = subtotal + valorFrete;

    // Atualiza os textos na tela
    const elSub = document.getElementById('subtotalPrice');
    const elShip = document.getElementById('shippingPrice');
    const elTotal = document.getElementById('totalPrice');

    if (elSub) elSub.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    if (elShip) elShip.textContent = `R$ ${valorFrete.toFixed(2).replace('.', ',')}`;
    if (elTotal) elTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

async function calculateShipping() {
    const cepInput = document.getElementById('cepInput').value;
    const cepDestino = cepInput.replace(/\D/g, '');
    const shippingOptionsDiv = document.getElementById('shippingOptions');

    if (cepDestino.length !== 8) {
        alert('Por favor, insira um CEP válido com 8 dígitos.');
        return;
    }

    shippingOptionsDiv.style.display = 'block';
    shippingOptionsDiv.innerHTML = '<div class="spinner-border spinner-border-sm text-primary" role="status"></div> Calculando Correios...';

    const cepOrigem = "09572300";
    const codigosServico = "04014,04510"; // SEDEX e PAC

    // Trocamos para HTTPS por segurança e para evitar bloqueios de navegadores modernos
    const urlCorreios = `https://ws.correios.com.br/calculador/CalcPrecoPrazo.aspx?nCdEmpresa=&sDsSenha=&sCepOrigem=${cepOrigem}&sCepDestino=${cepDestino}&nVlPeso=1&nCdFormato=1&nVlComprimento=20&nVlAltura=10&nVlLargura=15&sCdMaoPropria=n&nVlValorDeclarado=0&sCdAvisoRecebimento=n&nCdServico=${codigosServico}&nVlDiametro=0&StrRetorno=xml`;

    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(urlCorreios)}`;

    try {
        const response = await fetch(proxyUrl);
        const data = await response.json();

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(data.contents, "text/xml");
        const servicosRetorno = xmlDoc.getElementsByTagName("cServico");

        // TRAVA: Se não veio a tag cServico, a API dos Correios falhou ou retornou erro 503
        if (!servicosRetorno || servicosRetorno.length === 0) {
            throw new Error("Serviço dos Correios indisponível no momento.");
        }

        const opcoesFormatadas = [];

        for (let i = 0; i < servicosRetorno.length; i++) {
            const servico = servicosRetorno[i];

            // TRAVA: Verifica se as tags realmente existem antes de ler o texto
            const tagCodigo = servico.getElementsByTagName("Codigo")[0];
            const tagValor = servico.getElementsByTagName("Valor")[0];
            const tagPrazo = servico.getElementsByTagName("PrazoEntrega")[0];
            const tagErro = servico.getElementsByTagName("Erro")[0];

            if (!tagCodigo || !tagValor) continue;

            const codigo = tagCodigo.textContent;
            const valorTexto = tagValor.textContent;
            const prazo = tagPrazo ? tagPrazo.textContent : "-";
            const erro = tagErro ? tagErro.textContent : "";

            if (erro !== "0" && erro !== "") continue;

            const precoNumero = parseFloat(valorTexto.replace(',', '.'));
            const nomeServico = codigo === "04014" ? "SEDEX" : "PAC";

            opcoesFormatadas.push({
                name: nomeServico,
                price: precoNumero,
                custom_delivery_time: prazo
            });
        }

        renderShippingOptions(opcoesFormatadas);

    } catch (error) {
        shippingOptionsDiv.innerHTML = '<p style="color:red; font-size: 14px;">Serviço dos Correios indisponível. Tente novamente mais tarde.</p>';
        console.error("Erro na API dos Correios:", error);
    }
}

function renderShippingOptions(opcoes) {
    const shippingOptionsDiv = document.getElementById('shippingOptions');
    shippingOptionsDiv.innerHTML = '';

    if (opcoes.length === 0) {
        shippingOptionsDiv.innerHTML = '<p style="font-size: 14px;">Nenhuma opção de frete encontrada para este CEP.</p>';
        return;
    }

    opcoes.forEach((opcao, index) => {
        const div = document.createElement('div');
        div.className = 'form-check mb-2';

        const precoFormatado = Number(opcao.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        div.innerHTML = `
            <input class="form-check-input" type="radio" name="shippingOption" id="frete${index}" value="${opcao.price}" onchange="updateTotal()">
            <label class="form-check-label w-100 d-flex justify-content-between" for="frete${index}" style="font-size: 14px; cursor: pointer;">
                <span>${opcao.name} (${opcao.custom_delivery_time} dias)</span>
                <strong>${precoFormatado}</strong>
            </label>
        `;
        shippingOptionsDiv.appendChild(div);
    });
}

async function realizarPagamento() {
    if (cartData.length === 0) return alert("Seu carrinho está vazio!");

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
        alert("Faça login para finalizar.");
        window.location.href = 'login.html';
        return;
    }

    if (!confirm("Confirmar compra?")) return;

    try {
        const baseUrl = window.API_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/compras`, {
            method: 'POST',
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
            alert("Erro ao comprar: " + erro.message);
        }
    } catch (error) {
        console.error("Erro ao finalizar compra:", error);
        alert("Erro ao processar a compra.");
    }
}

window.addEventListener('load', renderCart);