const localStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Model de usuário
require('../models/Usuario');
const Usuario = mongoose.model('usuarios');

module.exports = function(passport) {

    passport.use(new localStrategy({ usernameField: 'email', passwordField: 'senha' }, (email, password, done) => {
        // Verifica se o usuário existe
        Usuario.findOne({ email: email }).lean().then((usuario) => {
            if (!usuario) {
                return done(null, false, { message: 'Esta conta não existe' });
            }

            bcrypt.compare(password, usuario.senha, (erro, batem) => {
                if (batem) {
                    return done(null, usuario);
                } else {
                    return done(null, false, { message: 'Senha incorreta' });
                }
            })
        })
    }));

    passport.serializeUser((usuario, done) => {
        console.log('Serializando usuário:', usuario);
        console.log('ID do usuário:', usuario._id);
        done(null, usuario._id.toString());
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const usuario = await Usuario.findById(id);
            done(null, usuario);
        } catch (erro) {
            done(erro, null);
        }
    });
}
    