import express from "express";
import {
    listarClientes,
    buscarCliente,
    criarCliente,
    atualizarCliente,
    excluirCliente
} from "../controllers/clienteController.js";

const router = express.Router();

router.get("/",autenticarJWT, permitirRoles("ADMIN"), listarClientes);
router.get("/:cnpj", autenticarJWT, permitirRoles("ADMIN"), buscarCliente);
router.post("/", criarCliente);
router.put("/:cnpj", atualizarCliente);
router.delete("/:cnpj", excluirCliente);

export default router;