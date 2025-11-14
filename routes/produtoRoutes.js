import express from "express";
import {
    listarProdutos,
    buscarProduto,
    criarProduto,
    atualizarProduto,
    excluirProduto
} from "../controllers/produtoController.js";

const router = express.Router();

router.get("/", listarProdutos);
router.get("/:id", buscarProduto);
router.post("/", criarProduto);
router.put("/:id", atualizarProduto);
router.delete("/:id", excluirProduto);

export default router;