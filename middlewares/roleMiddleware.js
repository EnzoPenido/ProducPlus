export function permitirRoles(...rolesPermitidos) {
    return (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(401).json({ message: "Credenciais inválidas ou token ausente" });
        }

        const userRole = user.tipo || user.role;

        if (!userRole) {
            return res.status(403).json({ message: "Acesso negado: Perfil de usuário não definido no token" });
        }

        if (!rolesPermitidos.includes(userRole)) {
            console.log(`Bloqueado! Usuário é: ${userRole}. Permitidos: ${rolesPermitidos}`);
            return res.status(403).json({ message: "Acesso negado: Permissão insuficiente" });
        }

        next();
    };
}