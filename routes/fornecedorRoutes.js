import express from "express";
import {
    listarFornecedores,
    buscarFornecedor,
    criarFornecedor,
    atualizarFornecedor,
    excluirFornecedor
} from "../controllers/fornecedorController.js";

const router = express.Router();

router.get("/", listarFornecedores);
router.get("/:cnpj", buscarFornecedor);
router.post("/", criarFornecedor);
router.put("/:cnpj", atualizarFornecedor);
router.delete("/:cnpj", excluirFornecedor);

export default router;