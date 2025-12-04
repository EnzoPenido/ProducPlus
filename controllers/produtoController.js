import Produto from "../models/produtoModel.js";
import DescricaoProduto from "../models/descricaoProdutoModel.js";

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
        const descricaoTecnica = await DescricaoProduto.getByProdutoId(req.params.id);
        res.json({
            ...produto,
            descricaoTecnica: descricaoTecnica || {}
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const criarProduto = async (req, res) => {
    try {
        console.log("Recebendo dados para criar produto:", req.body); // Log para debug

        const idProduto = await Produto.create(req.body);
        console.log("Produto criado com ID:", idProduto);

        if (req.body.descricaoTecnica) {
            const dadosTecnicos = {
                ...req.body.descricaoTecnica,
                idProduto: idProduto
            };
            await DescricaoProduto.create(dadosTecnicos);
        }

        res.status(201).json({
            message: "Produto criado com sucesso",
            id: idProduto,
            idProduto: idProduto,
            produto: {
                id: idProduto,
                ...req.body
            }
        });

    } catch (err) {
        console.error("Erro ao criar produto:", err);
        res.status(500).json({ error: err.message });
    }
};

export const atualizarProduto = async (req, res) => {
    const { id } = req.params;
    try {
        // Atualiza os dados principais
        await Produto.update(id, req.body);

        // Atualiza ou cria a descrição técnica se foi enviada
        if (req.body.descricaoTecnica) {
            const existe = await DescricaoProduto.getByProdutoId(id);

            if (existe) {
                await DescricaoProduto.update(id, req.body.descricaoTecnica);
            } else {
                await DescricaoProduto.create({
                    ...req.body.descricaoTecnica,
                    idProduto: id
                });
            }
        }

        res.json({ message: "Produto atualizado com sucesso" });
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

export const buscarDescricaoProduto = async (req, res) => {
    try {
        const descricao = await DescricaoProduto.getByProdutoId(req.params.id);

        if (!descricao) {
            return res.status(404).json({ error: 'Descrição técnica não encontrada' });
        }

        res.json(descricao);
    } catch (err) {
        console.error('Erro ao buscar descrição:', err);
        res.status(500).json({ error: err.message });
    }
};

export const criarDescricaoProduto = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar se o produto existe
        const produto = await Produto.getById(id);
        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        // Verificar se já existe descrição
        const descricaoExistente = await DescricaoProduto.getByProdutoId(id);
        if (descricaoExistente) {
            return res.status(409).json({
                error: 'Descrição técnica já existe para este produto',
                message: 'Use PUT para atualizar'
            });
        }

        // Criar descrição técnica
        const descricaoData = {
            idProduto: id,
            ...req.body
        };

        await DescricaoProduto.create(descricaoData);

        res.status(201).json({
            message: 'Descrição técnica criada com sucesso',
            idProduto: id
        });
    } catch (err) {
        console.error('Erro ao criar descrição:', err);
        res.status(500).json({ error: err.message });
    }
};

export const atualizarDescricaoProduto = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar se a descrição existe
        const descricaoExistente = await DescricaoProduto.getByProdutoId(id);
        if (!descricaoExistente) {
            return res.status(404).json({ error: 'Descrição técnica não encontrada' });
        }

        // Atualizar descrição técnica
        await DescricaoProduto.update(id, req.body);

        res.json({
            message: 'Descrição técnica atualizada com sucesso',
            idProduto: id
        });
    } catch (err) {
        console.error('Erro ao atualizar descrição:', err);
        res.status(500).json({ error: err.message });
    }
};

export const excluirDescricaoProduto = async (req, res) => {
    const { id } = req.params;

    try {
        // Verificar se a descrição existe
        const descricaoExistente = await DescricaoProduto.getByProdutoId(id);
        if (!descricaoExistente) {
            return res.status(404).json({ error: 'Descrição técnica não encontrada' });
        }

        await DescricaoProduto.delete(id);

        res.json({
            message: 'Descrição técnica deletada com sucesso',
            idProduto: id
        });
    } catch (err) {
        console.error('Erro ao deletar descrição:', err);
        res.status(500).json({ error: err.message });
    }
};