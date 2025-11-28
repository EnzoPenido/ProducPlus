import Categoria from "../models/categoriaModel.js";

export const listarCategorias = async (req, res) => {
    try {
        const cats = await Categoria.getAll();
        res.json(cats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const buscarCategoria = async (req, res) => {
    try {
        const cat = await Categoria.getById(req.params.id);
        if (!cat) return res.status(404).json({ message: "Categoria não encontrada" });
        res.json(cat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const criarCategoria = async (req, res) => {
    try {
        const id = await Categoria.create(req.body);
        res.status(201).json({ message: "Categoria criada", idCategoria: id });
    } catch (err) {   
        res.status(500).json({ error: err.message });
    }
};

export const atualizarCategoria = async (req, res) => {
    try {
        await Categoria.update(req.params.id, req.body);
        res.json({ message: "Categoria atualizada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const excluirCategoria = async (req, res) => {
    try {
        const categoriaId = req.params.id;
        
        // Verificar se existem produtos vinculados
        const [produtos] = await Categoria.getProductsByCategory(categoriaId);
        
        if (produtos.length > 0) {
            // Retornar lista de produtos vinculados
            return res.status(409).json({
                message: "Categoria possui produtos vinculados",
                hasProducts: true,
                products: produtos,
                categoryId: categoriaId
            });
        }
        
        // Se não houver produtos, deletar a categoria
        await Categoria.delete(categoriaId);
        res.json({ message: "Categoria excluída", deleted: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const excluirCategoriaComProdutos = async (req, res) => {
    try {
        const categoriaId = req.params.id;
        
        // Deletar todos os produtos vinculados
        await Categoria.deleteProductsByCategory(categoriaId);
        
        // Deletar a categoria
        await Categoria.delete(categoriaId);
        
        res.json({ message: "Categoria e produtos vinculados foram excluídos", deleted: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};