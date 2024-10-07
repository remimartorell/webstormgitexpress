// routes/index.js
var express = require('express');
var router = express.Router();

// Page d'accueil
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Ma première page avec Express' });
});

// Nouveau endpoint pour afficher une page HTML
router.get('/ma-page', function (req, res, next) {
  res.send('<h1>Bienvenue sur ma page personnalisée !</h1>');
});

// Endpoint qui renvoie un objet JSON
router.get('/api/data', function (req, res, next) {
  res.json({ message: 'Voici des données JSON', status: 'success' });
});


module.exports = router;