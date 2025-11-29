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

// --- FINALIZAR COMPRA ---
export const finalizarCompraCompleta = async (req, res) => {
    const itens = req.body;
    const user = req.user;

    if (!itens || itens.length === 0) {
        return res.status(400).json({ message: "Carrinho vazio." });
    }

    const cnpjCliente = user.cnpjCliente || user.id;

    if (!cnpjCliente) {
        return res.status(403).json({ message: "Usuário não identificado corretamente." });
    }

    // Calcula o valor total no backend (mais seguro)
    const valorTotal = itens.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    let connection;
    try {
        // 1. Pega uma conexão dedicada para fazer a transação
        connection = await db.getConnection();
        await connection.beginTransaction(); // Começa a transação

        // 2. Cria a Compra na tabela 'Compra'
        const [resultCompra] = await connection.query(
            "INSERT INTO Compra (cnpjCliente, valorTotal, statusCompra) VALUES (?, ?, ?)",
            [cnpjCliente, valorTotal, 'APROVADO']
        );
        const idCompra = resultCompra.insertId;

        // 3. Processa cada item do carrinho
        for (const item of itens) {
            // A. Insere na tabela 'ItensCompra'
            await connection.query(
                "INSERT INTO ItensCompra (idCompra, idProduto, quantidade, preco_momento) VALUES (?, ?, ?, ?)",
                [idCompra, item.id, item.quantity, item.price]
            );

            // B. Baixa o estoque na tabela 'Produto'
            await connection.query(
                "UPDATE Produto SET quantidadeEstoque = quantidadeEstoque - ? WHERE idProduto = ?",
                [item.quantity, item.id]
            );
        }

        // 4. Se tudo deu certo, confirma as alterações no banco
        await connection.commit();
        res.status(201).json({ message: "Compra realizada com sucesso!", idCompra: idCompra });

    } catch (error) {
        // Se deu erro, desfaz tudo (ninguém perde dinheiro nem estoque)
        if (connection) await connection.rollback();
        console.error("Erro na transação de compra:", error);
        res.status(500).json({ message: "Erro ao processar a compra." });
    } finally {
        if (connection) connection.release();
    }
};

// --- LISTAR COMPRAS (HISTÓRICO) ---
export const listarMinhasCompras = async (req, res) => {
    try {
        const idUsuario = req.user.cnpjCliente || req.user.id || req.user.cnpj;

        if (!idUsuario) {
            return res.status(400).json({ message: "Usuário não identificado no token." });
        }

        const compras = await Compra.getByCliente(idUsuario);
        res.json(compras);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Erro ao buscar histórico." });
    }
};