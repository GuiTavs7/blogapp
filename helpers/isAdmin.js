// Configurando middleware para verificar se o usuário é admin!

module.exports = {
    isAdmin: function(req, res, next) {

        if(req.isAuthenticated() && req.user.isAdmin == 1){
            return next();
        }

        req.flash('error_msg', 'Você precisa ser um Admin para acessar essa página');
        res.redirect('/usuarios/login');
    }
}