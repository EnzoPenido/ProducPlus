import express from "express";
import dotenv from "dotenv";
dotenv.config();

import cors from "cors";

import authRoutes from "./routes/authRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import fornecedorRoutes from "./routes/fornecedorRoutes.js";
import categoriaRoutes from "./routes/categoriasRoutes.js";
import produtoRoutes from "./routes/produtoRoutes.js";
import compraRoutes from "./routes/compraRoutes.js";
import itemCompraRoutes from "./routes/itemCompraRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

// ROTAS
app.use("/auth", authRoutes);
app.use("/admin/auth", adminAuthRoutes);
app.use("/admin", adminRoutes);
app.use("/clientes", clienteRoutes);
app.use("/fornecedores", fornecedorRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/produtos", produtoRoutes);
app.use("/compras", compraRoutes);
app.use("/itenscompra", itemCompraRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em: http://localhost:${PORT}`));