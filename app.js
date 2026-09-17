// 1) Carregando Módulos

require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const admin = require('./routes/admin');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
require('./models/Postagem');
const Postagem = mongoose.model('postagens');
const Categorias = require('./models/Categoria');
const usuarios = require('./routes/usuario');
const passport = require('passport');
require('./config/auth')(passport);
const db = require('./config/db');
const {upload} = require('./config/upload');
const formatarData = require('./helpers/formatarData');

// 2) Configurações

    // Sessão
    app.use(session({
        secret: "cursodenode",
        resave: true,
        saveUninitialized: true
    }))

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(flash());

    // Middlewares
    app.use((req,res,next) => {
        res.locals.success_msg = req.flash("success_msg");
        res.locals.error_msg = req.flash("error_msg");
        res.locals.error = req.flash("error");
        res.locals.user = req.user ? req.user.toObject() : null;
        next();
    });

    // Body Parser
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Handlebars
    app.engine('handlebars', handlebars.engine({ 
        defaultLayout: 'main',
        helpers: {
            formatarData: formatarData
        }
    }));
    app.set('view engine', 'handlebars');

    // Mongoose

    // mongoose.Promise = global.Promise; -> Não é mais necessário a partir do Mongoose 6, pois ele já utiliza Promises nativamente.

    if(process.env.NODE_ENV === 'production'){
        console.log('🌍 Ambiente MongoDB Atlas: produção');
    } else {
        console.log('🌍 Ambiente MongoDB Local: desenvolvimento');
    }

    mongoose.connect(db.mongoURI).then(() => {
        if(process.env.NODE_ENV === 'production'){
            console.log('Conectado ao MongoDB Atlas com sucesso!');
        }
        else{
            console.log('Conectado ao MongoDB local com sucesso!');
        }
    }).catch((err) => {
        console.error('Erro ao conectar ao MongoDB:', err);
    });

    // Public
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/icon', express.static(path.join(__dirname, 'src/icon')));
    app.use('/img', express.static(path.join(__dirname, 'src/img')));

    // Criando um middleware para logar todas as requisições
    app.use((req, res, next) => {
        console.log('Middleware executado!');
        next();
    });

// 3) Rotas
    app.get('/', (req, res) => {
        Postagem.find().populate('categoria').lean().sort({data: 'desc'}).then((postagens) => {
            res.render('index', { postagens: postagens });
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao listar as postagens');
            res.redirect('/404');
        });
    });

    app.get('/postagem/:slug', (req, res) => {
        Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
            if(postagem){
                res.render('postagem/index', {postagem: postagem});
            } else {
                req.flash('error_msg', 'Postagem não encontrada');
                res.redirect('/');
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao buscar a postagem');
            res.redirect('/');
        });
    });

    app.get('/categorias', (req, res) => {
        Categorias.find().lean().then((categorias) => {
            res.render('categorias/index', { categorias: categorias });
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao listar as categorias');
            res.redirect('/');
        });
    });

    app.get('/categorias/:slug', (req, res) => {
        Categorias.findOne({slug: req.params.slug}).lean().then((categoria) => {
            if(categoria){
                Postagem.find({categoria: categoria._id}).populate('categoria').lean().then((postagens) => {
                    res.render('categorias/postagens', { categoria: categoria, postagens: postagens });
                }).catch((err) => {
                    req.flash('error_msg', 'Houve um erro ao listar as postagens');
                    res.redirect('/');
                });
            } else {
                req.flash('error_msg', 'Categoria não encontrada');
                res.redirect('/');
            }
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao carregar a página dessa categoria');
            res.redirect('/');
        });
    });

    app.get('/404', (req, res) => {
        res.render('404');
    });

    app.use('/admin', admin);

    app.use('/usuarios', usuarios);

// 4) Rodando o servidor

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta http://localhost:${PORT}`);
})