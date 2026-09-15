function estaLogado(req, res, next) {

    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');

    if (req.isAuthenticated()) {
        return next();
    }

    req.flash('error_msg', 'Você precisa estar logado!');
    res.redirect('/usuarios/login');
}

module.exports = estaLogado;