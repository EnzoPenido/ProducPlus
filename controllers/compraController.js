import db from "../config/dataBase.js";
import Compra from "../models/compraModel.js";
import ItemCompra from "../models/Item-Compra-Model.js";
import Produto from "../models/produtoModel.js";

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
        const itens = await ItemCompra.getByCompra(req.params.id);
        res.json({ compra, itens });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// payload esperado:
// {
//   cnpjCliente: "...",
//   dataCompra: "YYYY-MM-DD",
//   valorTotal: 123.45,
//   statusCompra: "PENDENTE",
//   itens: [
//     { idProduto: 1, quantidade: 2, preco_momento: 10.5 },
//     ...
//   ]
// }
export const criarCompra = async (req, res) => {
    const conn = await db.getConnection();
    try {
        await conn.beginTransaction();

        const { cnpjCliente, dataCompra, valorTotal, statusCompra, itens } = req.body;
        const [result] = await conn.query(
            `INSERT INTO Compra (cnpjCliente, dataCompra, valorTotal, statusCompra)
       VALUES (?, ?, ?, ?)`,
            [cnpjCliente, dataCompra, valorTotal, statusCompra]
        );
        const idCompra = result.insertId;

        // inserir itens e ajustar estoque
        for (const it of itens) {
            const { idProduto, quantidade, preco_momento } = it;
            await conn.query(
                `INSERT INTO ItensCompra (idCompra, idProduto, quantidade, preco_momento) VALUES (?, ?, ?, ?)`,
                [idCompra, idProduto, quantidade, preco_momento]
            );
            // diminuir estoque
            await conn.query(
                `UPDATE Produto SET quantidadeEstoque = quantidadeEstoque - ? WHERE idProduto = ?`,
                [quantidade, idProduto]
            );
        }

        await conn.commit();
        res.status(201).json({ message: "Compra criada", idCompra });
    } catch (err) {
        await conn.rollback();
        res.status(500).json({ error: err.message });
    } finally {
        conn.release();
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