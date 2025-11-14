import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export function autenticarJWT(req, res, next) {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "Token não enviado" });

    const token = header.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token malformado" });

    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) return res.status(403).json({ message: "Token inválido ou expirado" });
        req.user = payload; // { cnpjCliente, nome, email, role }
        next();
    });
}