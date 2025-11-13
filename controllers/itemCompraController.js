import ItemCompra from "../models/itemCompraModel.js";

export const listarItens = async (req, res) => {
    try {
        const itens = await ItemCompra.getAll();
        res.json(itens);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const listarItensPorCompra = async (req, res) => {
    try {
        const itens = await ItemCompra.getByCompra(req.params.idCompra);
        res.json(itens);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const criarItem = async (req, res) => {
    try {
        await ItemCompra.create(req.body);
        res.status(201).json({ message: "Item adicionado à compra" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const atualizarItem = async (req, res) => {
    try {
        const { idCompra, idProduto, quantidade } = req.body;
        await ItemCompra.update(idCompra, idProduto, quantidade);
        res.json({ message: "Item atualizado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const excluirItem = async (req, res) => {
    try {
        const { idCompra, idProduto } = req.params;
        await ItemCompra.delete(idCompra, idProduto);
        res.json({ message: "Item excluído" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};