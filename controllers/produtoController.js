import Produto from "../models/produtoModel.js";

export const listarProdutos = async (req, res) => {
    try {
        const produtos = await Produto.getAll();
        res.json(produtos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const listarProdutosPorCategoria = async (req, res) => {
    try {
        const produtos = await Produto.getByCategoria(req.params.idCategoria);
        res.json(produtos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const listarProdutosPorSecao = async (req, res) => {
    try {
        const produtos = await Produto.getBySeccao(req.params.secao);
        res.json(produtos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const buscarProduto = async (req, res) => {
    try {
        const produto = await Produto.getById(req.params.id);
        if (!produto) return res.status(404).json({ message: "Produto não encontrado" });
        res.json(produto);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const criarProduto = async (req, res) => {
    try {
        console.log('POST /produtos body:', req.body);
        const id = await Produto.create(req.body);
        console.log('Produto criado no DB id:', id);
        res.status(201).json({ message: "Produto criado", idProduto: id });
    } catch (err) {
        console.error('Erro ao criar produto:', err);
        res.status(500).json({ error: err.message });
    }
};

export const atualizarProduto = async (req, res) => {
    try {
        await Produto.update(req.params.id, req.body);
        res.json({ message: "Produto atualizado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const excluirProduto = async (req, res) => {
    try {
        await Produto.delete(req.params.id);
        res.json({ message: "Produto excluído" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const baixarEstoque = async (req, res) => {
    const itens = req.body;

    if (!itens || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ message: "Carrinho vazio ou formato inválido." });
    }

    try {
        await Produto.baixarEstoque(itens);

        res.status(200).json({ message: "Estoque atualizado com sucesso!" });
    } catch (err) {
        console.error("Erro no servidor (baixarEstoque):", err);
        res.status(500).json({ message: "Erro ao processar compra no servidor." });
    }
};

export const ajustarEstoque = async (req, res) => {
    const { id } = req.params;
    const { tipo, quantidade } = req.body;

    if (!quantidade || quantidade <= 0) {
        return res.status(400).json({ message: "Quantidade inválida." });
    }

    try {
        // 1. Busca o produto para saber o estoque atual
        const produto = await Produto.getById(id);
        if (!produto) return res.status(404).json({ message: "Produto não encontrado." });

        let novoEstoque = produto.quantidadeEstoque;

        // 2. Calcula
        if (tipo === 'entrada') {
            novoEstoque += parseInt(quantidade);
        } else if (tipo === 'saida') {
            novoEstoque -= parseInt(quantidade);
            if (novoEstoque < 0) novoEstoque = 0;
        }

        // 3. Salva no banco usando o Model
        await Produto.atualizarEstoque(id, novoEstoque);

        // Sucesso
        res.json({ message: "Estoque atualizado com sucesso!", novoEstoque });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erro no servidor: " + err.message });
    }
};