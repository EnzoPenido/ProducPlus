import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function autenticarJWT(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "Token não enviado" });

    const parts = header.split(" ");
    if (parts.length !== 2) return res.status(401).json({ message: "Token malformado" });

    const token = parts[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) return res.status(403).json({ message: "Token inválido ou expirado" });
        req.user = payload; // ex: { tipo: "CLIENTE"/"ADMIN", cnpjCliente, nome, email } ou { tipo:"ADMIN", idAdmin, username }
        next();
    });
}