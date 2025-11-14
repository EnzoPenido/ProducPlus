export function permitirRoles(...rolesPermitidos) {
    return (req, res, next) => {
        const user = req.user; // vem do middleware JWT

        if (!user || !user.role) {
            return res.status(401).json({ message: "Credenciais inválidas" });
        }

        if (!rolesPermitidos.includes(user.role)) {
            return res.status(403).json({ message: "Acesso negado: Permissão insuficiente" });
        }

        next();
    };
}