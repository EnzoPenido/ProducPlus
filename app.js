import express from "express";
import dotenv from "dotenv";
dotenv.config();

import clienteRoutes from "./app/routes/clienteRoutes.js";
import fornecedorRoutes from "./app/routes/fornecedorRoutes.js";
import categoriaRoutes from "./app/routes/categoriaRoutes.js";
import produtoRoutes from "./app/routes/produtoRoutes.js";
import compraRoutes from "./app/routes/compraRoutes.js";
import itemCompraRoutes from "./app/routes/itemCompraRoutes.js";

const app = express();
app.use(express.json());

app.use("/clientes", clienteRoutes);
app.use("/fornecedores", fornecedorRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/produtos", produtoRoutes);
app.use("/compras", compraRoutes);
app.use("/itenscompra", itemCompraRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em: http://localhost:${PORT}`));