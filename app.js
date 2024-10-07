const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const articlesRouter = require('./routes/articles');
const cartRouter = require('./routes/cart');

const app = express();

const jwt = require('jsonwebtoken');

// Secret pour JWT
const JWT_SECRET = 'votre_secret_pour_jwt';

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://remimartorell:KO6LdpVj8TMx9wBy@cluster0.dpxtm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware personnalisé pour le logging
const requestLogger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next(); // Passer au middleware ou à la route suivante
};

// Middleware pour vérifier le token JWT et les rôles
const jwtAuthMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(401).json({ message: 'Accès non autorisé. Token manquant.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token invalide.' });
    }

    req.user = decoded; // Ajouter les informations de l'utilisateur à la requête

    // Vérifier les autorisations pour les méthodes POST et DELETE
    if ((req.method === 'POST' || req.method === 'DELETE') && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Accès interdit. Vous devez être administrateur.' });
    }

    next();
  });
};

// Importer et utiliser les middlewares
const helmet = require('helmet');
app.use(helmet());

const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limite chaque IP à 100 requêtes par fenêtre de 15 minutes
  message: 'Trop de requêtes, veuillez réessayer plus tard.'
});
app.use(limiter);

// Utiliser le middleware de journalisation pour toutes les routes
app.use(requestLogger);

// Appliquer le middleware JWT aux routes que vous souhaitez protéger
app.use('/articles', jwtAuthMiddleware);
app.use('/cart', jwtAuthMiddleware);

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);
app.use('/cart', cartRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;