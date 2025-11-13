import Fornecedor from "../models/fornecedorModel.js";

export const listarFornecedores = async (req, res) => {
    try {
        const fornecedores = await Fornecedor.getAll();
        res.json(fornecedores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const buscarFornecedor = async (req, res) => {
    try {
        const fornecedor = await Fornecedor.getByCnpj(req.params.cnpj);
        if (!fornecedor) return res.status(404).json({ message: "Fornecedor não encontrado" });
        res.json(fornecedor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const criarFornecedor = async (req, res) => {
    try {
        await Fornecedor.create(req.body);
        res.status(201).json({ message: "Fornecedor criado com sucesso" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const atualizarFornecedor = async (req, res) => {
    try {
        await Fornecedor.update(req.params.cnpj, req.body);
        res.json({ message: "Fornecedor atualizado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const excluirFornecedor = async (req, res) => {
    try {
        await Fornecedor.delete(req.params.cnpj);
        res.json({ message: "Fornecedor excluído" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};