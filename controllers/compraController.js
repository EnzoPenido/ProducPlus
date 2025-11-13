import Compra from "../models/compraModel.js";

export const listarCompras = async (req, res) => {
    try {
        const compras = await Compra.getAll();
        res.json(compras);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const buscarCompra = async (req, res) => {
    try {
        const compra = await Compra.getById(req.params.id);
        if (!compra) return res.status(404).json({ message: "Compra não encontrada" });
        res.json(compra);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const criarCompra = async (req, res) => {
    try {
        const id = await Compra.create(req.body);
        res.status(201).json({ message: "Compra criada", idCompra: id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const atualizarCompra = async (req, res) => {
    try {
        await Compra.update(req.params.id, req.body);
        res.json({ message: "Compra atualizada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const excluirCompra = async (req, res) => {
    try {
        await Compra.delete(req.params.id);
        res.json({ message: "Compra excluída" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};