import express from "express";
import {
    listarFornecedores,
    buscarFornecedor,
    criarFornecedor,
    atualizarFornecedor,
    excluirFornecedor
} from "../controllers/fornecedorController.js";

const router = express.Router();

router.get("/", autenticarJWT, permitirRoles("ADMIN", "CLIENTE"), listarFornecedores);
router.get("/:cnpj", autenticarJWT, permitirRoles("ADMIN", "CLIENTE"), buscarFornecedor);
router.post("/", autenticarJWT, permitirRoles("ADMIN"), criarFornecedor);
router.put("/:cnpj", autenticarJWT, permitirRoles("ADMIN"), atualizarFornecedor);
router.delete("/:cnpj", autenticarJWT, permitirRoles("ADMIN"), excluirFornecedor);

export default router;