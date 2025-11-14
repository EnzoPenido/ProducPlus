import express from "express";
import dotenv from "dotenv";
dotenv.config();

import clienteRoutes from "./routes/clienteRoutes.js";
import fornecedorRoutes from "./routes/fornecedorRoutes.js";
import categoriaRoutes from "./routes/categoriaRoutes.js";
import produtoRoutes from "./routes/produtoRoutes.js";
import compraRoutes from "./routes/compraRoutes.js";
import itemCompraRoutes from "./routes/itemCompraRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { autenticarJWT } from "../middlewares/authMiddleware.js";

const app = express();
app.use(express.json());

// rotas públicas
app.use("/auth", authRoutes);

// rotas protegidas
app.use("/clientes", autenticarJWT, clienteRoutes);
app.use("/fornecedores", autenticarJWT, fornecedorRoutes);
app.use("/categorias", autenticarJWT, categoriaRoutes);
app.use("/produtos", autenticarJWT, produtoRoutes);
app.use("/compras", autenticarJWT, compraRoutes);
app.use("/itenscompra", autenticarJWT, itemCompraRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));