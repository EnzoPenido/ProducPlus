import express from "express";
import {
    listarClientes,
    buscarCliente,
    criarCliente,
    atualizarCliente,
    excluirCliente
} from "../controllers/clienteController.js";

const router = express.Router();

router.get("/", listarClientes);
router.get("/:cnpj", buscarCliente);
router.post("/", criarCliente);
router.put("/:cnpj", atualizarCliente);
router.delete("/:cnpj", excluirCliente);

export default router;