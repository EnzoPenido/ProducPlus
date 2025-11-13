import Produto from "../models/produtoModel.js";

export const listarProdutos = async (req, res) => {
    try {
        const produtos = await Produto.getAll();
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
        await Produto.create(req.body);
        res.status(201).json({ message: "Produto criado com sucesso" });
    } catch (err) {
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